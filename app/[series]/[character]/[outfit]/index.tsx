import ButtonBackPage from "@/components/ButtonBackPage";
import { ProductCard } from "@/components/productCard";
import { useColors } from "@/hooks/useColors";
import { getOutfitWithProducts } from "@/lib/api/outfits";
import { formatPrice } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function OutfitScreen() {
  const {
    series: seriesSlug,
    character: characterSlug,
    outfit: outfitSlug,
  } = useLocalSearchParams<{
    series: string;
    character: string;
    outfit: string;
  }>();
  const c = useColors();

  const { data: outfit, isLoading } = useQuery({
    queryKey: ["outfit", seriesSlug, characterSlug, outfitSlug],
    queryFn: () => getOutfitWithProducts(seriesSlug, characterSlug, outfitSlug),
  });

  if (isLoading)
    return (
      <View style={[s.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary }}>Memuat...</Text>
      </View>
    );
  if (!outfit)
    return (
      <View style={[s.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary }}>Outfit tidak ditemukan</Text>
      </View>
    );

  const products = (outfit as any).products ?? [];
  const totalBudget = products.reduce((sum: number, p: any) => sum + (p.price ?? 0), 0);

  return (
    <>
      <ScrollView style={[s.container, { backgroundColor: c.background }]} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <ButtonBackPage />
        {/* Hero */}
        <View style={s.hero}>
          {outfit.outfit_url ? (
            <Image source={{ uri: outfit.outfit_url }} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="memory-disk" />
          ) : (
            <View style={[StyleSheet.absoluteFill, s.placeholder, { backgroundColor: c.backgroundSecondary }]}>
              <Text style={s.placeholderIcon}>👔</Text>
            </View>
          )}
          <LinearGradient colors={["transparent", c.background]} style={StyleSheet.absoluteFill} />
          <View style={s.heroContent}>
            <Text style={[s.heroCharacter, { color: c.textSecondary }]}>{(outfit as any).character?.name}</Text>
            <Text style={[s.heroTitle, { color: c.textPrimary }]}>{outfit.name}</Text>
            {outfit.mood && <Text style={[s.heroMood, { color: c.textSecondary }]}>{outfit.mood}</Text>}
            {totalBudget > 0 && <Text style={s.heroPrice}>{formatPrice(totalBudget)}</Text>}
          </View>
        </View>

        {/* Products */}
        <Text style={[s.sectionLabel, { color: c.textDisabled }]}>Item produk ({products.length})</Text>

        {products.length === 0 && <Text style={[s.empty, { color: c.textDisabled }]}>Belum ada produk ditambahkan</Text>}

        <View style={s.grid}>
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: { width: "100%", height: 400, justifyContent: "flex-end", backgroundColor: "#1a1a1a" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  placeholderIcon: { fontSize: 64 },
  heroContent: { padding: 16, paddingBottom: 20 },
  heroCharacter: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  heroTitle: { fontSize: 24, fontWeight: "700", lineHeight: 30 },
  heroMood: { fontSize: 12, marginTop: 4 },
  heroPrice: { fontSize: 16, fontWeight: "700", color: "#4ade80", marginTop: 8 },
  sectionLabel: { fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  empty: { fontSize: 13, textAlign: "center", paddingVertical: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 8, columnGap: 4, paddingHorizontal: 16 },
});
