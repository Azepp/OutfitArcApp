import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/supabase";
import type { Character, Outfit, Series } from "@/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

type Props = {
  outfit: Outfit & {
    character?: (Character & { series?: Series | null }) | null;
    products?: { price: number | null }[];
    slug: string;
  };
};

export function OutfitCard({ outfit }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;
  const c = useColors();

  if (!outfit.character?.series) return null;

  const totalBudget = (outfit.products ?? []).reduce((sum, p) => sum + (p.price ?? 0), 0);
  const href = `/${outfit.character.series.slug}/${outfit.character.slug}/${outfit.slug}`;

  return (
    <Pressable onPress={() => router.push(href as Href)} style={({ pressed }) => [styles.card, { width: cardWidth, height: cardWidth, backgroundColor: c.backgroundSecondary }, pressed && { opacity: 0.85 }]}>
      {outfit.outfit_url ? (
        <Image source={{ uri: outfit.outfit_url }} style={{ width: cardWidth, height: cardWidth, borderRadius: 12 }} contentFit="cover" cachePolicy="memory-disk" transition={300} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.placeholder, { backgroundColor: c.backgroundSecondary }]}>
          <Text style={styles.placeholderIcon}>👔</Text>
        </View>
      )}

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={[StyleSheet.absoluteFill, { borderRadius: 12, width: cardWidth, height: cardWidth }]} />

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
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 32,
  },
  textContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  character: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: 18,
  },
  price: {
    fontSize: 11,
    color: "#4ade80",
    marginTop: 4,
  },
});
