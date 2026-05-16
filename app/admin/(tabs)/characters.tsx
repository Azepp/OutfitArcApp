import SearchBar from "@/components/admin/adminSearchBar";
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import type { Character } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CharWithSeries = Character & { series: { id: string; name: string } | null };

function SeriesFilter({ value, onChange, seriesList, c }: { value: string; onChange: (v: string) => void; seriesList: { id: string; name: string }[]; c: any }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
      <Pressable onPress={() => onChange("")} style={[s.filterChip, { backgroundColor: value === "" ? c.primary : c.backgroundSecondary, borderColor: value === "" ? c.primary : c.border }]}>
        <Typography variant="label" color={value === "" ? "#fff" : c.textSecondary} weight={value === "" ? "semibold" : "regular"}>
          Semua
        </Typography>
      </Pressable>
      {seriesList.map((series) => (
        <Pressable key={series.id} onPress={() => onChange(series.id)} style={[s.filterChip, { backgroundColor: value === series.id ? c.primary : c.backgroundSecondary, borderColor: value === series.id ? c.primary : c.border }]}>
          <Typography variant="label" color={value === series.id ? "#fff" : c.textSecondary} weight={value === series.id ? "semibold" : "regular"} numberOfLines={1}>
            {series.name}
          </Typography>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ─── Character Row ─────────────────────────────────────────
function CharacterRow({ item, onEdit, onDelete, c }: { item: CharWithSeries; onEdit: () => void; onDelete: () => void; c: any }) {
  return (
    <View style={[s.row, { borderBottomColor: c.border }]}>
      {/* Photo */}
      <View style={[s.photo, { backgroundColor: c.backgroundSecondary }]}>
        {item.photo_url ? <Image source={{ uri: item.photo_url }} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="memory-disk" /> : <Feather name="user" size={16} color={c.textDisabled} />}
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 2 }}>
        <Typography variant="label" color={c.textPrimary} weight="semibold" numberOfLines={1}>
          {item.name}
        </Typography>
        <Typography variant="label" color={c.textDisabled} numberOfLines={1}>
          {item.series?.name ?? "—"}
        </Typography>
      </View>

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
export default function AdminCharactersScreen() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterSeries, setFilterSeries] = useState("");

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
          <SeriesFilter value={filterSeries} onChange={setFilterSeries} seriesList={seriesList} c={c} />
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
          renderItem={({ item }) => <CharacterRow item={item} c={c} onEdit={() => router.push(`/admin/characters/${item.id}` as any)} onDelete={() => deleteMutation.mutate(item.id)} />}
        />
      )}
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
