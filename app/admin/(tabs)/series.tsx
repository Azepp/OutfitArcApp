// app/admin/(tabs)/series.tsx
import SearchBar from "@/components/admin/adminSearchBar";
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import type { Series } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Series Row ────────────────────────────────────────────
function SeriesRow({ item, onEdit, onDelete, onToggle, c }: { item: Series; onEdit: () => void; onDelete: () => void; onToggle: () => void; c: any }) {
  return (
    <View style={[s.row, { borderBottomColor: c.border, backgroundColor: c.backgroundSecondary }]}>
      {/* Cover */}
      <View style={[s.cover, { backgroundColor: c.backgroundSecondary }]}>
        {item.cover_url ? <Image source={{ uri: item.cover_url }} style={StyleSheet.absoluteFill} contentFit="cover" /> : <Feather name="image" size={16} color={c.textDisabled} />}
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 2 }}>
        <Typography variant="label" color={c.textPrimary} weight="semibold" numberOfLines={1}>
          {item.name}
        </Typography>
        <Typography variant="label" color={c.textDisabled}>
          {item.type}
        </Typography>
      </View>

      {/* Status badge */}
      <Pressable
        onPress={onToggle}
        style={[
          s.badge,
          {
            backgroundColor: item.status === "publik" ? "#f0fdf4" : c.backgroundSecondary,
            borderColor: item.status === "publik" ? "#bbf7d0" : c.border,
          },
        ]}
      >
        <Typography variant="label" color={item.status === "publik" ? "#15803d" : c.textDisabled}>
          {item.status}
        </Typography>
      </Pressable>

      {/* Actions */}
      <Pressable onPress={onEdit} style={s.actionBtn}>
        <Feather name="edit-2" size={15} color={c.textSecondary} />
      </Pressable>
      <Pressable onPress={onDelete} style={s.actionBtn}>
        <Feather name="trash-2" size={15} color="#ef4444" />
      </Pressable>
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────
export default function AdminSeriesScreen() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Series | null>(null);

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin", "series"],
    queryFn: async () => {
      const { data } = await supabase.from("series").select("*").order("created_at", { ascending: false });
      return (data ?? []) as Series[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (item: Series) => {
      const next = item.status === "publik" ? "draft" : "publik";
      await supabase.from("series").update({ status: next }).eq("id", item.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "series"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("series").delete().eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "series"] }),
  });

  const filtered = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16, backgroundColor: c.backgroundSecondary, borderBottomColor: c.border }]}>
        <Typography variant="h3" color={c.textPrimary} weight="bold">
          Series
        </Typography>
        <Pressable onPress={() => router.push("/admin/series/add" as any)} style={s.addBtn}>
          <Feather name="plus" size={16} color="#fff" />
          <Typography variant="label" color="#fff" weight="semibold">
            Tambah
          </Typography>
        </Pressable>
      </View>

      {/* Search */}
      <View style={[s.searchWrapper, { backgroundColor: c.backgroundSecondary, borderBottomColor: c.border }]}>
        <SearchBar value={search} onChange={setSearch} />
      </View>

      {/* List */}
      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={c.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.center}>
          <Typography variant="body" color={c.textDisabled}>
            {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada series"}
          </Typography>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => <SeriesRow item={item} c={c} onEdit={() => router.push(`/admin/series/${item.id}` as any)} onToggle={() => toggleMutation.mutate(item)} onDelete={() => setConfirmDelete(item)} />}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal visible={!!confirmDelete} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={[s.modalContent, { backgroundColor: c.backgroundSecondary, borderColor: c.border }]}>
            <View style={s.modalHeader}>
              <Feather name="alert-triangle" size={24} color="#ef4444" />
              <Typography variant="h3" color={c.textPrimary} weight="bold">
                Hapus Series?
              </Typography>
            </View>

            <Typography variant="body" color={c.textSecondary} style={{ marginVertical: 12 }}>
              Apakah Anda yakin ingin menghapus series{" "}
              <Typography weight="semibold" color={c.textPrimary}>
                {confirmDelete?.name}
              </Typography>
              ? Tindakan ini tidak dapat dibatalkan.
            </Typography>

            <View style={s.modalActions}>
              <Pressable onPress={() => setConfirmDelete(null)} style={[s.modalBtn, { backgroundColor: c.backgroundSecondary, borderColor: c.border, borderWidth: 1 }]}>
                <Typography variant="label" color={c.textPrimary} weight="semibold">
                  Batal
                </Typography>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (confirmDelete) {
                    deleteMutation.mutate(confirmDelete.id);
                    setConfirmDelete(null);
                  }
                }}
                disabled={deleteMutation.isPending}
                style={[s.modalBtn, { backgroundColor: "#ef4444", opacity: deleteMutation.isPending ? 0.6 : 1 }]}
              >
                {deleteMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Typography variant="label" color="#fff" weight="semibold">
                    Hapus
                  </Typography>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#111",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  searchWrapper: {
    padding: 12,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionBtn: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    width: "80%",
    maxWidth: 320,
    gap: 16,
  },
  modalHeader: {
    gap: 12,
    alignItems: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
