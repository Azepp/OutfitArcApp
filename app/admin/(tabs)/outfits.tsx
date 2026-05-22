// app/admin/(tabs)/outfits.tsx
import { OutfitRow } from "@/components/admin/adminRow";
import SearchBar from "@/components/admin/adminSearchBar";
import { FilterChips } from "@/components/admin/pickers";
import { ConfirmDeleteModal } from "@/components/ui/modalDelete";
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { getAdminCharacters, getSeriesOptions } from "@/lib/api/characters";
import { deleteOutfit, getAdminOutfits, toggleOutfitStatus } from "@/lib/api/outfits";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Outfit = {
  id: string;
  name: string;
  mood: string | null;
  gender_tag: string | null;
  status: string | null;
  outfit_url: string | null;
  character: { name: string; series: { name: string } | null } | null;
};

export default function AdminOutfitsScreen() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterSeries, setFilterSeries] = useState("");
  const [filterChar, setFilterChar] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: outfits = [], isLoading } = useQuery({
    queryKey: ["admin", "outfits"],
    queryFn: () => getAdminOutfits(),
  });

  const { data: seriesList = [] } = useQuery({
    queryKey: ["admin", "series-options"],
    queryFn: () => getSeriesOptions(),
  });

  const { data: characters = [] } = useQuery({
    queryKey: ["admin", "character-options"],
    queryFn: async () => {
      const allChars = await getAdminCharacters();
      return allChars.map((c) => ({ id: c.id, name: c.name, series_id: c.series_id }));
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (item: Outfit) => {
      await toggleOutfitStatus(item.id, item.status ?? "draft");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "outfits"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteOutfit(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "outfits"] }),
  });

  // Filter karakter berdasarkan series yang dipilih
  const filteredChars = filterSeries ? characters.filter((c) => c.series_id === filterSeries) : characters;

  // Filter outfits
  const filtered = outfits.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase());
    const matchSeries = !filterSeries || seriesList.find((s) => s.id === filterSeries)?.name === o.character?.series?.name;
    const matchChar = !filterChar || filteredChars.find((c) => c.id === filterChar)?.name === o.character?.name;
    return matchSearch && matchSeries && matchChar;
  });

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16, backgroundColor: c.backgroundSecondary, borderBottomColor: c.border }]}>
        <Typography variant="h3" color={c.textPrimary} weight="bold">
          Outfit
        </Typography>
        <Pressable onPress={() => router.push("/admin/outfits/add" as any)} style={s.addBtn}>
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
      <View style={[s.filterWrapper, { borderBottomColor: c.border }]}>
        <FilterChips
          allLabel="Anime"
          options={seriesList}
          value={filterSeries}
          onChange={(v) => {
            setFilterSeries(v);
            setFilterChar("");
          }}
          c={c}
        />
      </View>

      {/* Filter Karakter */}
      {filteredChars.length > 0 && (
        <View style={[s.filterWrapper, { borderBottomColor: c.border }]}>
          <FilterChips allLabel="Karakter" options={filteredChars} value={filterChar} onChange={setFilterChar} c={c} />
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
            {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada outfit"}
          </Typography>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => <OutfitRow item={item} onEdit={() => router.push(`/admin/outfits/${item.id}` as any)} onToggle={() => toggleMutation.mutate(item)} onDelete={() => setConfirmDelete({ id: item.id, name: item.name })} />}
        />
      )}

      <ConfirmDeleteModal
        visible={!!confirmDelete}
        title="Hapus Outfit?"
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
  thumb: {
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
  actionBtn: { padding: 6 },
});
