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
import { CharacterPicker, OptionPicker } from "../pickers";

const GENDER_OPTIONS = [
  { value: "all", label: "All gender" },
  { value: "feminin", label: "Feminin" },
  { value: "maskulin", label: "Maskulin" },
];

const STATUS_OPTIONS = ["publik", "draft"];

const EMPTY_FORM = {
  name: "",
  character_id: "",
  mood: "",
  gender_tag: "all" as "all" | "feminin" | "maskulin",
  reference_moment: "",
  status: "draft" as "publik" | "draft",
  outfit_url: "",
};

export function OutfitForm({ mode, id }: { mode: "add" | "edit"; id?: string }) {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterSeries, setFilterSeries] = useState("");
  const [error, setError] = useState("");

  const { data: seriesList = [] } = useQuery({
    queryKey: ["admin", "series-options"],
    queryFn: async () => {
      const { data } = await supabase.from("series").select("id, name").order("name");
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  const { data: characters = [] } = useQuery({
    queryKey: ["admin", "character-options"],
    queryFn: async () => {
      const { data } = await supabase.from("characters").select("id, name, series_id").order("name");
      return (data ?? []) as { id: string; name: string; series_id: string }[];
    },
  });

  const { isLoading } = useQuery({
    queryKey: ["admin", "outfit", id],
    queryFn: async () => {
      const { data } = await supabase.from("outfits").select("*, character:characters(id, name, series_id)").eq("id", id!).single();
      if (data) {
        const char = data.character as any;
        setFilterSeries(char?.series_id ?? "");
        setForm({
          name: data.name,
          character_id: char?.id ?? "",
          mood: data.mood ?? "",
          gender_tag: (data.gender_tag as any) ?? "all",
          reference_moment: data.reference_moment ?? "",
          status: (data.status as any) ?? "draft",
          outfit_url: data.outfit_url ?? "",
        });
      }
      return data;
    },
    enabled: mode === "edit" && !!id,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Nama outfit wajib diisi");
      if (!form.character_id) throw new Error("Pilih karakter dulu");

      const payload = {
        name: form.name,
        character_id: form.character_id,
        mood: form.mood || null,
        gender_tag: form.gender_tag,
        reference_moment: form.reference_moment || null,
        status: form.status,
        outfit_url: form.outfit_url || null,
      };

      if (mode === "add") {
        await supabase.from("outfits").insert(payload);
      } else {
        await supabase.from("outfits").update(payload).eq("id", id!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "outfits"] });
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
      <View style={[f.header, { paddingTop: insets.top + 16, backgroundColor: c.backgroundSecondary, borderBottomColor: c.border }]}>
        <Pressable onPress={() => router.back()} style={f.backBtn}>
          <Feather name="arrow-left" size={20} color={c.textPrimary} />
        </Pressable>
        <Typography variant="h3" color={c.textPrimary} weight="bold">
          {mode === "add" ? "Tambah Outfit" : "Edit Outfit"}
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

        <Field label="Foto Outfit">
          {mode === "edit" && isLoading ? (
            <View style={[{ width: 120, height: 120, borderRadius: 12, justifyContent: "center", alignItems: "center" }, { backgroundColor: c.backgroundSecondary }]}>
              <ActivityIndicator color={c.primary} />
            </View>
          ) : (
            <ImageUpload key={form.outfit_url || "empty"} currentUrl={form.outfit_url} onUpload={(url) => setForm((p) => ({ ...p, outfit_url: url }))} />
          )}
        </Field>

        <CharacterPicker seriesList={seriesList} characters={characters} seriesId={filterSeries} charId={form.character_id} onSeriesChange={setFilterSeries} onCharChange={(v) => setForm((p) => ({ ...p, character_id: v }))} c={c} />

        <Field label="Nama Outfit">
          <TextInput
            value={form.name}
            onChangeText={(t) => {
              setForm((p) => ({ ...p, name: t }));
              setError("");
            }}
            placeholder="cth: Monochrome All-Black"
            placeholderTextColor={c.textDisabled}
            style={[f.input, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            autoCapitalize="words"
          />
        </Field>

        <Field label="Mood / Style tag">
          <TextInput
            value={form.mood}
            onChangeText={(t) => setForm((p) => ({ ...p, mood: t }))}
            placeholder="cth: dark academic"
            placeholderTextColor={c.textDisabled}
            style={[f.input, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            autoCapitalize="none"
          />
        </Field>

        <Field label="Gender Tag">
          <OptionPicker options={GENDER_OPTIONS} value={form.gender_tag} onChange={(v) => setForm((p) => ({ ...p, gender_tag: v as any }))} c={c} />
        </Field>

        <Field label="Status">
          <OptionPicker options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v as any }))} c={c} />
        </Field>

        <Field label="Referensi Momen (opsional)">
          <TextInput
            value={form.reference_moment}
            onChangeText={(t) => setForm((p) => ({ ...p, reference_moment: t }))}
            placeholder="cth: Scene episode 7 saat Gojo reveal mata birunya..."
            placeholderTextColor={c.textDisabled}
            style={[f.input, f.textarea, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            multiline
            numberOfLines={3}
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
                  {mode === "add" ? "Tambah Outfit" : "Simpan Perubahan"}
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
  textarea: { height: 80 },
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
    marginTop: 8,
  },
});
