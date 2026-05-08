import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/supabase";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function TrendingOutfitCard({ outfit }: { outfit: any }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;
  const c = useColors();

  if (!outfit.character?.series) return null;

  const href = `/${outfit.character.series.slug}/${outfit.character.slug}/${outfit.slug}`;

  const totalBudget = (outfit.products ?? []).reduce((sum: number, p: any) => sum + (p.price ?? 0), 0);

  return (
    <Pressable onPress={() => router.push(href as Href)} style={({ pressed }) => [styles.card, { width: cardWidth, height: cardWidth, backgroundColor: c.backgroundSecondary }, pressed && { opacity: 0.85 }]}>
      {outfit.outfit_url ? (
        <Image source={{ uri: outfit.outfit_url }} style={{ width: cardWidth, height: cardWidth, borderRadius: 12 }} contentFit="cover" cachePolicy="memory-disk" transition={300} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.placeholder, { backgroundColor: c.backgroundSecondary }]}>
          <Text style={styles.placeholderIcon}>👔</Text>
        </View>
      )}

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.85)"]} style={[StyleSheet.absoluteFill, { borderRadius: 12, width: cardWidth, height: cardWidth }]} />

      {/* Badge klik */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>🔥 {outfit.totalClicks}</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.character} numberOfLines={1}>
          {outfit.character.name}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {outfit.name}
        </Text>

        {totalBudget > 0 && <Text style={styles.price}>{formatPrice(totalBudget)}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 14 },
  card: { borderRadius: 12, overflow: "hidden" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  placeholderIcon: { fontSize: 32 },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  textContainer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 10 },
  character: { fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 2 },
  name: { fontSize: 13, fontWeight: "600", color: "#fff", lineHeight: 18 },
  price: {
    fontSize: 11,
    color: "#4ade80",
    marginTop: 4,
  },
});
