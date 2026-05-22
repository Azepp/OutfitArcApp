import { ProductRow } from "@/components/admin/adminRow";
import SearchBar from "@/components/admin/adminSearchBar";
import { FilterChips } from "@/components/admin/pickers";
import { ConfirmDeleteModal } from "@/components/ui/modalDelete";
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { deleteProduct, getProductsWithOutfits } from "@/lib/api/products";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number | null;
  label: string | null;
  is_anchor: boolean | null;
  photo_url: string | null;
  link_tokopedia: string | null;
  link_shopee: string | null;
  link_tiktok: string | null;
  outfits: { name: string; character: { name: string; series: { name: string } | null } | null }[];
};

const CATEGORIES = ["outerwear", "atasan", "bawahan", "aksesoris", "sepatu", "tas"];

export default function AdminProductsScreen() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => getProductsWithOutfits() as Promise<Product[]>,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setConfirmDelete(null);
    },
  });

  const categoryOptions = CATEGORIES.map((c) => ({ id: c, name: c }));

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16, backgroundColor: c.backgroundSecondary, borderBottomColor: c.border }]}>
        <Typography variant="h3" color={c.textPrimary} weight="bold">
          Produk
        </Typography>
        <Pressable onPress={() => router.push("/admin/products/add" as any)} style={s.addBtn}>
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

      {/* Filter Kategori */}
      <View style={[s.filterWrapper, { borderBottomColor: c.border }]}>
        <FilterChips options={categoryOptions} value={filterCategory} onChange={setFilterCategory} allLabel="Semua Kategori" c={c} />
      </View>

      {/* List */}
      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={c.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.center}>
          <Typography variant="body" color={c.textDisabled}>
            {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada produk"}
          </Typography>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => <ProductRow item={item} onEdit={() => router.push(`/admin/products/${item.id}` as any)} onDelete={() => setConfirmDelete({ id: item.id, name: item.name })} />}
        />
      )}

      <ConfirmDeleteModal
        visible={!!confirmDelete}
        title="Hapus Produk?"
        itemName={confirmDelete?.name}
        loading={deleteMutation.isPending}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
