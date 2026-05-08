import type { Character, Series } from "@/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

type Props = {
  character: Character & {
    series?: Series | null;
  };
};

export function CharacterCard({ character }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;

  if (!character.series) return null;

  const href = `/${character.series.slug}/${character.slug}`;

  return (
    <Pressable onPress={() => router.push(href as Href)} style={({ pressed }) => [styles.card, { width: cardWidth, height: cardWidth }, pressed && { opacity: 0.85 }]}>
      {character.photo_url ? (
        <Image source={{ uri: character.photo_url }} style={{ width: cardWidth, height: cardWidth, borderRadius: 12 }} contentFit="cover" cachePolicy="memory-disk" transition={300} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
          <Text style={styles.placeholderIcon}>👤</Text>
        </View>
      )}

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={[StyleSheet.absoluteFill, { borderRadius: 12, width: cardWidth, height: cardWidth }]} />

      <View style={styles.textContainer}>
        <Text style={styles.series} numberOfLines={1}>
          {character.series.name}
        </Text>
        <Text style={styles.character} numberOfLines={1}>
          {character.name}
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
    backgroundColor: "#2a2a2a",
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
  series: {
    fontSize: 9,
    color: "rgba(255,255,255,0.45)",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  character: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
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
