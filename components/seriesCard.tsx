import type { Series } from "@/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

const TYPE_LABEL: Record<string, string> = {
  anime: "Anime",
  manhwa: "Manhwa",
  figur: "Figur",
  film: "Film",
  series: "Series",
};
export function SeriesCard({ series }: { series: Series }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;
  const cardHeight = cardWidth * 1.3; // sedikit portrait

  return (
    <Pressable onPress={() => router.push(`/${series.slug}` as Href)} style={({ pressed }) => [styles.card, { width: cardWidth, height: cardHeight }, pressed && { opacity: 0.85 }]}>
      {series.cover_url ? (
        <Image
          source={{ uri: series.cover_url }}
          style={{ width: cardWidth, height: cardHeight, borderRadius: 12 }} // eksplisit
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        // Placeholder dummy berwarna — warna berdasarkan huruf pertama nama
        <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
          <Text style={styles.placeholderLetter}>{series.name.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.75)"]} style={[StyleSheet.absoluteFill, { borderRadius: 12, width: cardWidth, height: cardHeight }]} />

      <View style={styles.textContainer}>
        <Text style={styles.type}>{TYPE_LABEL[series.type ?? ""] ?? series.type}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {series.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  placeholder: {
    backgroundColor: "#3a2a4a", // ungu gelap sebagai dummy
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderLetter: {
    fontSize: 48,
    fontWeight: "700",
    color: "rgba(255,255,255,0.3)",
  },
  textContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  type: {
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
});
