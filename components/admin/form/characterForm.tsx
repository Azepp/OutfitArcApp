import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Field from "../field";
import ImageUpload from "../imageUploader";
import { SeriesPicker } from "../pickers";

const EMPTY_FORM = { name: "", series_id: "", description: "", photo_url: "" };

export function CharacterForm({ mode, id }: { mode: "add" | "edit"; id?: string }) {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const { data: seriesList = [] } = useQuery({
    queryKey: ["admin", "series-options"],
    queryFn: async () => {
      const { data } = await supabase.from("series").select("id, name").order("name");
      return data ?? [];
    },
  });

  const { isLoading } = useQuery({
    queryKey: ["admin", "character", id],
    queryFn: async () => {
      const { data } = await supabase.from("characters").select("*").eq("id", id!).single();
      if (data) {
        setForm({
          name: data.name,
          series_id: data.series_id ?? "",
          description: data.description ?? "",
          photo_url: data.photo_url ?? "",
        });
      }
      return data;
    },
    enabled: mode === "edit" && !!id,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Nama karakter wajib diisi");
      if (!form.series_id) throw new Error("Pilih anime/series dulu");

      const payload = {
        name: form.name,
        series_id: form.series_id,
        description: form.description || null,
        photo_url: form.photo_url || null,
      };

      if (mode === "add") {
        await supabase.from("characters").insert(payload);
      } else {
        await supabase.from("characters").update(payload).eq("id", id!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "characters"] });
      router.back();
    },
    onError: (err: any) => setError(err.message),
  });

  if (mode === "edit" && isLoading) {
    return (
      <View style={[f.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={[f.container, { backgroundColor: c.background }]} behavior="padding" enabled={Platform.OS === "ios"}>
      {/* Header */}
      <View style={[f.header, { paddingTop: insets.top + 16, backgroundColor: c.backgroundSecondary, borderBottomColor: c.border }]}>
        <Pressable onPress={() => router.back()} style={f.backBtn}>
          <Feather name="arrow-left" size={20} color={c.textPrimary} />
        </Pressable>
        <Typography variant="h3" color={c.textPrimary} weight="bold">
          {mode === "add" ? "Tambah Karakter" : "Edit Karakter"}
        </Typography>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={f.body} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={[f.errorBanner, { backgroundColor: "#fef2f2", borderColor: "#fecaca" }]}>
            <Typography variant="label" color="#b91c1c">
              {error}
            </Typography>
          </View>
        ) : null}

        <Field label="Foto Karakter">
          {mode === "edit" && isLoading ? (
            <View style={[{ width: 120, height: 120, borderRadius: 12, justifyContent: "center", alignItems: "center" }, { backgroundColor: c.backgroundSecondary }]}>
              <ActivityIndicator color={c.primary} />
            </View>
          ) : (
            <ImageUpload key={form.photo_url || "empty"} currentUrl={form.photo_url} onUpload={(url) => setForm((p) => ({ ...p, photo_url: url }))} />
          )}
        </Field>

        <Field label="Anime / Series">
          <SeriesPicker value={form.series_id} onChange={(v) => setForm((p) => ({ ...p, series_id: v }))} seriesList={seriesList} c={c} />
        </Field>

        <Field label="Nama Karakter">
          <TextInput
            value={form.name}
            onChangeText={(t) => {
              setForm((p) => ({ ...p, name: t }));
              setError("");
            }}
            placeholder="cth: Gojo Satoru"
            placeholderTextColor={c.textDisabled}
            style={[f.input, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            autoCapitalize="words"
          />
        </Field>

        <Field label="Deskripsi (opsional)">
          <TextInput
            value={form.description}
            onChangeText={(t) => setForm((p) => ({ ...p, description: t }))}
            placeholder="Deskripsi singkat karakter dan style-nya..."
            placeholderTextColor={c.textDisabled}
            style={[f.input, f.textarea, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Field>

        <Pressable onPress={() => mutation.mutate()} disabled={mutation.isPending} style={f.saveBtn}>
          {({ pressed }) => (
            <View style={{ opacity: pressed || mutation.isPending ? 0.7 : 1, alignItems: "center" }}>
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Typography variant="body" color="#fff" weight="semibold">
                  {mode === "add" ? "Tambah Karakter" : "Simpan Perubahan"}
                </Typography>
              )}
            </View>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const f = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  body: { padding: 16, gap: 20, paddingBottom: 60 },
  field: { gap: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  textarea: { height: 100 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  saveBtn: {
    backgroundColor: "#ff5a00",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
});
