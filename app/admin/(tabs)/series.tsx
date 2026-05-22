// app/admin/(tabs)/series.tsx
import { SeriesRow } from "@/components/admin/adminRow";
import SearchBar from "@/components/admin/adminSearchBar";
import { ConfirmDeleteModal } from "@/components/ui/modalDelete";
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { deleteSeries, getAdminSeries, toggleSeriesStatus } from "@/lib/api/series";
import type { Series } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminSeriesScreen() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Series | null>(null);

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin", "series"],
    queryFn: () => getAdminSeries(),
  });

  const toggleMutation = useMutation({
    mutationFn: async (item: Series) => {
      await toggleSeriesStatus(item.id, item.status ?? "draft");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "series"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteSeries(id);
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
          renderItem={({ item }) => <SeriesRow item={item} onEdit={() => router.push(`/admin/series/${item.id}` as any)} onToggle={() => toggleMutation.mutate(item)} onDelete={() => setConfirmDelete(item)} />}
        />
      )}
      <ConfirmDeleteModal
        visible={!!confirmDelete}
        title="Hapus Series?"
        itemName={confirmDelete?.name}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (confirmDelete) {
            deleteMutation.mutate(confirmDelete.id);
            setConfirmDelete(null);
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
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
