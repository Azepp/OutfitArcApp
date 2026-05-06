import type { Series } from "@/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TYPE_LABEL: Record<string, string> = {
  anime: "Anime",
  manhwa: "Manhwa",
  figur: "Figur",
  film: "Film",
  series: "Series",
};

export function SeriesCard({ series }: { series: Series }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/series/${series.slug}`)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      {/* Gambar background */}
      {series.cover_url ? (
        <Image source={{ uri: series.cover_url }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" cachePolicy="memory-disk" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
      )}

      {/* Gradient gelap dari bawah ke atas — biar teks keliatan */}
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.75)"]} style={StyleSheet.absoluteFill} />

      {/* Teks di atas gradient */}
      <View style={styles.textContainer}>
        <Text style={styles.type}>{TYPE_LABEL[series.type ?? ""] ?? series.type}</Text>
        <Text style={styles.name} className="truncate" numberOfLines={2}>
          {series.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
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
