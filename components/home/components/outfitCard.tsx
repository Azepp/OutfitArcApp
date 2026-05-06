import { formatPrice } from "@/lib/supabase";
import type { Character, Outfit, Series } from "@/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  outfit: Outfit & {
    character?: (Character & { series?: Series | null }) | null;
    products?: { price: number | null }[];
    slug: string;
  };
};

export function OutfitCard({ outfit }: Props) {
  const router = useRouter();

  if (!outfit.character?.series) return null;

  const totalBudget = (outfit.products ?? []).reduce((sum, p) => sum + (p.price ?? 0), 0);

  const href = `/${outfit.character.series.slug}/${outfit.character.slug}/${outfit.slug}`;

  return (
    <Pressable onPress={() => router.push(href as Href)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      {outfit.outfit_url ? (
        <Image source={{ uri: outfit.outfit_url }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" cachePolicy="memory-disk" transition={300} onError={(e) => console.log("Image error:", e)} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
      )}

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={StyleSheet.absoluteFill} />

      <View style={styles.textContainer}>
        <Text style={styles.character} numberOfLines={1} className="truncate">
          {outfit.character.name}
        </Text>
        <Text style={styles.name} className="truncate" numberOfLines={2}>
          {outfit.name}
        </Text>
        {totalBudget > 0 && <Text style={styles.price}>{formatPrice(totalBudget)}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  placeholder: {
    backgroundColor: "#2a2a2a",
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
    color: "#4ade80", // hijau
    marginTop: 4,
  },
});
