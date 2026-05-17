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
import { OptionPicker } from "../pickers";

const TYPE_OPTIONS = ["anime", "manhwa", "figur", "film", "series"];
const STATUS_OPTIONS = ["publik", "draft"];
const EMPTY_FORM = { name: "", type: "anime", description: "", status: "draft" as "publik" | "draft", cover_url: "" };

export function SeriesForm({ mode, id }: { mode: "add" | "edit"; id?: string }) {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const { isLoading } = useQuery({
    queryKey: ["admin", "series", id],
    queryFn: async () => {
      const { data } = await supabase.from("series").select("*").eq("id", id!).single();
      if (data) {
        setForm({
          name: data.name,
          type: data.type ?? "anime",
          description: data.description ?? "",
          status: data.status as "publik" | "draft",
          cover_url: data.cover_url ?? "",
        });
      }
      return data;
    },
    enabled: mode === "edit" && !!id,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Nama wajib diisi");
      if (form.name.includes("-")) throw new Error("Nama tidak boleh mengandung strip (-)");

      const payload = {
        name: form.name,
        type: form.type,
        description: form.description || null,
        status: form.status,
        cover_url: form.cover_url || null,
      };

      if (mode === "add") {
        await supabase.from("series").insert(payload);
      } else {
        await supabase.from("series").update(payload).eq("id", id!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "series"] });
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
          {mode === "add" ? "Tambah Series" : "Edit Series"}
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

        <Field label="Nama">
          <TextInput
            value={form.name}
            onChangeText={(t) => {
              setForm((p) => ({ ...p, name: t }));
              setError("");
            }}
            placeholder="cth: Jujutsu Kaisen"
            placeholderTextColor={c.textDisabled}
            style={[f.input, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            autoCapitalize="words"
          />
        </Field>

        <Field label="Tipe">
          <OptionPicker options={TYPE_OPTIONS} value={form.type} onChange={(v) => setForm((p) => ({ ...p, type: v }))} c={c} />
        </Field>

        <Field label="Status">
          <OptionPicker options={STATUS_OPTIONS} value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v as any }))} c={c} />
        </Field>

        <Field label="Deskripsi (opsional)">
          <TextInput
            value={form.description}
            onChangeText={(t) => setForm((p) => ({ ...p, description: t }))}
            placeholder="Deskripsi singkat..."
            placeholderTextColor={c.textDisabled}
            style={[f.input, f.textarea, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Field>

        <Field label="Cover">
          {mode === "edit" && isLoading ? (
            <View style={[{ width: 120, height: 120, borderRadius: 12, justifyContent: "center", alignItems: "center" }, { backgroundColor: c.backgroundSecondary }]}>
              <ActivityIndicator color={c.primary} />
            </View>
          ) : (
            <ImageUpload currentUrl={form.cover_url} onUpload={(url) => setForm((p) => ({ ...p, cover_url: url }))} />
          )}
        </Field>

        <Pressable
          onPress={() => mutation.mutate()}
          disabled={mutation.isPending}
          style={f.saveBtn} // ← style statis langsung, bukan function
        >
          {({ pressed }) => (
            <View style={{ opacity: pressed || mutation.isPending ? 0.7 : 1, flex: 1, alignItems: "center" }}>
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Typography variant="body" color="#fff" weight="semibold">
                  {mode === "add" ? "Tambah Series" : "Simpan Perubahan"}
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
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  textarea: { height: 100 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  saveBtn: {
    backgroundColor: "#ff5a00",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
});
