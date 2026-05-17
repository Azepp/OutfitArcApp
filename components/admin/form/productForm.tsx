// components/admin/ProductForm.tsx
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { linkProductToOutfits, supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Field from "../field";
import ImageUpload from "../imageUploader";
import { OptionPicker, OutfitPicker } from "../pickers";

const CATEGORIES = ["outerwear", "atasan", "bawahan", "aksesoris", "sepatu", "tas"];
const LABELS = ["budget", "premium"];

const EMPTY_FORM = {
  name: "",
  outfit_ids: [] as string[],
  category: "atasan",
  price: "",
  label: "budget",
  is_anchor: false,
  link_tokopedia: "",
  link_shopee: "",
  link_tiktok: "",
  photo_url: "",
};

type OutfitOption = {
  id: string;
  name: string;
  character: { name: string; series: { name: string } | null } | null;
};

function PlatformLinks({ form, setForm, c }: { form: typeof EMPTY_FORM; setForm: any; c: any }) {
  const platforms = [
    { key: "link_tiktok", label: "TikTok Shop", color: "#111", placeholder: "Paste link affiliate TikTok Shop..." },
    { key: "link_tokopedia", label: "Tokopedia", color: "#42b549", placeholder: "Paste link affiliate Tokopedia..." },
    { key: "link_shopee", label: "Shopee", color: "#f05024", placeholder: "Paste link affiliate Shopee..." },
  ];

  return (
    <View style={[f.platformBox, { borderColor: c.border }]}>
      {platforms.map((p, i) => (
        <View key={p.key} style={[f.platformRow, { borderBottomColor: c.border, borderBottomWidth: i < platforms.length - 1 ? 1 : 0 }]}>
          <View style={[f.platformDot, { backgroundColor: p.color }]} />
          <Typography variant="label" color={c.textSecondary} style={{ width: 80 }}>
            {p.label}
          </Typography>
          <TextInput
            value={(form as any)[p.key]}
            onChangeText={(t) => setForm((prev: any) => ({ ...prev, [p.key]: t }))}
            placeholder={p.placeholder}
            placeholderTextColor={c.textDisabled}
            style={[f.platformInput, { color: c.textPrimary, backgroundColor: c.backgroundSecondary }]}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
      ))}
    </View>
  );
}

// ─── Form ────────────────────────────────────────────────────
export function ProductForm({ mode, id }: { mode: "add" | "edit"; id?: string }) {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const { data: outfits = [] } = useQuery({
    queryKey: ["admin", "outfit-options"],
    queryFn: async () => {
      const { data } = await supabase.from("outfits").select("id, name, character:characters(name, series:series(name))").eq("status", "publik").order("created_at", { ascending: false });
      return (data ?? []) as OutfitOption[];
    },
  });

  const { isLoading } = useQuery({
    queryKey: ["admin", "product", id],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, outfit_products(outfit_id)").eq("id", id!).single();

      if (data) {
        setForm({
          name: data.name,
          outfit_ids: (data.outfit_products as any[])?.map((op) => op.outfit_id) ?? [],
          category: data.category ?? "atasan",
          price: data.price?.toString() ?? "",
          label: data.label ?? "budget",
          is_anchor: data.is_anchor ?? false,
          link_tokopedia: data.link_tokopedia ?? "",
          link_shopee: data.link_shopee ?? "",
          link_tiktok: data.link_tiktok ?? "",
          photo_url: data.photo_url ?? "",
        });
      }
      return data;
    },
    enabled: mode === "edit" && !!id,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Nama produk wajib diisi");
      if (form.outfit_ids.length === 0) throw new Error("Pilih minimal 1 outfit");
      if (!form.price || parseInt(form.price) <= 0) throw new Error("Harga wajib diisi");
      if (!form.link_tokopedia && !form.link_shopee && !form.link_tiktok) {
        throw new Error("Minimal ada satu platform link");
      }

      const payload = {
        name: form.name,
        category: form.category,
        price: form.price ? parseInt(form.price) : null,
        label: form.label,
        is_anchor: form.is_anchor,
        link_tokopedia: form.link_tokopedia || null,
        link_shopee: form.link_shopee || null,
        link_tiktok: form.link_tiktok || null,
        photo_url: form.photo_url || null,
      };

      if (mode === "add") {
        const { data, error } = await supabase.from("products").insert(payload).select().single();
        if (error) throw error;
        await linkProductToOutfits(data.id, form.outfit_ids);
      } else {
        const { error } = await supabase.from("products").update(payload).eq("id", id!);
        if (error) throw error;
        await linkProductToOutfits(id!, form.outfit_ids);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
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
          {mode === "add" ? "Tambah Produk" : "Edit Produk"}
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

        <Field label="Foto Produk">
          {mode === "edit" && isLoading ? (
            <View style={[{ width: 120, height: 120, borderRadius: 12, justifyContent: "center", alignItems: "center" }, { backgroundColor: c.backgroundSecondary }]}>
              <ActivityIndicator color={c.primary} />
            </View>
          ) : (
            <ImageUpload key={form.photo_url || "empty"} currentUrl={form.photo_url} onUpload={(url) => setForm((p) => ({ ...p, photo_url: url }))} />
          )}
        </Field>

        <Field label="Outfit (pilih 1 atau lebih)">
          <OutfitPicker value={form.outfit_ids} onChange={(ids) => setForm((p) => ({ ...p, outfit_ids: ids }))} outfits={outfits} c={c} />
        </Field>

        <Field label="Nama Produk">
          <TextInput
            value={form.name}
            onChangeText={(t) => {
              setForm((p) => ({ ...p, name: t }));
              setError("");
            }}
            placeholder="cth: Oversized Black Coach Jacket"
            placeholderTextColor={c.textDisabled}
            style={[f.input, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            autoCapitalize="words"
          />
        </Field>

        <Field label="Kategori">
          <OptionPicker options={CATEGORIES} value={form.category} onChange={(v) => setForm((p) => ({ ...p, category: v }))} c={c} />
        </Field>

        <Field label="Harga (Rp)">
          <TextInput
            value={form.price}
            onChangeText={(t) => setForm((p) => ({ ...p, price: t }))}
            placeholder="cth: 189000"
            placeholderTextColor={c.textDisabled}
            style={[f.input, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            keyboardType="numeric"
          />
        </Field>

        <Field label="Label Harga">
          <OptionPicker options={LABELS} value={form.label} onChange={(v) => setForm((p) => ({ ...p, label: v }))} c={c} />
        </Field>

        <Field label="Anchor">
          <View style={f.switchRow}>
            <Switch value={form.is_anchor} onValueChange={(v) => setForm((p) => ({ ...p, is_anchor: v }))} trackColor={{ true: c.primary }} />
            <Typography variant="label" color={c.textSecondary}>
              Tandai sebagai produk anchor
            </Typography>
          </View>
        </Field>

        <Field label="Link Affiliate Platform">
          <PlatformLinks form={form} setForm={setForm} c={c} />
          <Typography variant="label" color={c.textDisabled} style={{ marginTop: 6 }}>
            Kosongkan platform yang tidak tersedia
          </Typography>
        </Field>

        <Pressable onPress={() => mutation.mutate()} disabled={mutation.isPending} style={f.saveBtn}>
          {({ pressed }) => (
            <View style={{ opacity: pressed || mutation.isPending ? 0.7 : 1, alignItems: "center" }}>
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Typography variant="body" color="#fff" weight="semibold">
                  {mode === "add" ? "Tambah Produk" : "Simpan Perubahan"}
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  platformBox: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  platformRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  platformInput: {
    flex: 1,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
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
