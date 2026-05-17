import { CharacterRow } from "@/components/admin/adminRow";
import SearchBar from "@/components/admin/adminSearchBar";
import { FilterChips } from "@/components/admin/pickers";
import { ConfirmDeleteModal } from "@/components/ui/modalDelete";
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import type { Character } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CharWithSeries = Character & { series: { id: string; name: string } | null };

export default function AdminCharactersScreen() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterSeries, setFilterSeries] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: characters = [], isLoading } = useQuery({
    queryKey: ["admin", "characters"],
    queryFn: async () => {
      const { data } = await supabase.from("characters").select("*, series:series(id, name)").order("created_at", { ascending: false });
      return (data ?? []) as CharWithSeries[];
    },
  });

  const { data: seriesList = [] } = useQuery({
    queryKey: ["admin", "series-options"],
    queryFn: async () => {
      const { data } = await supabase.from("series").select("id, name").order("name");
      return data ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("characters").delete().eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "characters"] }),
  });

  const filtered = characters.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchSeries = !filterSeries || c.series?.id === filterSeries;
    return matchSearch && matchSeries;
  });

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16, backgroundColor: c.backgroundSecondary, borderBottomColor: c.border }]}>
        <Typography variant="h3" color={c.textPrimary} weight="bold">
          Karakter
        </Typography>
        <Pressable onPress={() => router.push("/admin/characters/add" as any)} style={s.addBtn}>
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

      {/* Filter Series */}
      {seriesList.length > 0 && (
        <View style={[s.filterWrapper, { borderBottomColor: c.border }]}>
          <FilterChips options={seriesList} value={filterSeries} onChange={setFilterSeries} allLabel="Semua Anime" c={c} />
        </View>
      )}

      {/* List */}
      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={c.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.center}>
          <Typography variant="body" color={c.textDisabled}>
            {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada karakter"}
          </Typography>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => <CharacterRow item={item} onEdit={() => router.push(`/admin/characters/${item.id}` as any)} onDelete={() => setConfirmDelete({ id: item.id, name: item.name })} />}
        />
      )}

      <ConfirmDeleteModal
        visible={!!confirmDelete}
        title="Hapus Karakter?"
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
  filterWrapper: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
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
  photo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtn: { padding: 6 },
});
