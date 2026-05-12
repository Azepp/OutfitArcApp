import ButtonBackPage from "@/components/ButtonBackPage";
import { CharacterCard } from "@/components/characterCard";
import { useColors } from "@/hooks/useColors";
import { getSeriesBySlug } from "@/lib/supabase";
import type { Character } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SeriesScreen() {
  const { series: seriesSlug } = useLocalSearchParams<{ series: string }>();
  const c = useColors();

  const { data: series, isLoading } = useQuery({
    queryKey: ["series", seriesSlug],
    queryFn: () => getSeriesBySlug(seriesSlug),
  });

  if (isLoading)
    return (
      <View style={[s.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary }}>Memuat...</Text>
      </View>
    );
  if (!series)
    return (
      <View style={[s.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary }}>Series tidak ditemukan</Text>
      </View>
    );

  const characters = (series.characters ?? []) as Character[];

  return (
    <>
      <ScrollView style={[s.container, { backgroundColor: c.background }]} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <ButtonBackPage />
        {/* Hero */}
        <View style={s.hero}>
          {series.cover_url && <Image source={{ uri: series.cover_url }} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="memory-disk" />}
          <LinearGradient colors={["transparent", c.background]} style={StyleSheet.absoluteFill} />
          <View style={s.heroContent}>
            <Text style={[s.heroType, { color: c.textSecondary }]}>{series.type}</Text>
            <Text style={[s.heroTitle, { color: c.textPrimary }]}>{series.name}</Text>
            <Text style={[s.heroSubtitle, { color: c.textSecondary }]}>{characters.length} karakter</Text>
          </View>
        </View>

        {series.description && <Text style={[s.description, { color: c.textSecondary }]}>{series.description}</Text>}

        <Text style={[s.sectionLabel, { color: c.textDisabled }]}>Pilih karakter</Text>

        <View style={s.grid}>
          {characters.map((char) => (
            <CharacterCard key={char.id} character={{ ...char, series: { id: series.id, name: series.name, slug: series.slug } as any }} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: { width: "100%", height: 240, justifyContent: "flex-end", backgroundColor: "#1a1a1a" },
  heroContent: { padding: 16, paddingBottom: 20 },
  heroType: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  heroTitle: { fontSize: 26, fontWeight: "700", lineHeight: 32 },
  heroSubtitle: { fontSize: 13, marginTop: 4 },
  description: { fontSize: 13, lineHeight: 20, margin: 16 },
  sectionLabel: { fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginHorizontal: 16, marginBottom: 12, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 12, columnGap: 4, paddingHorizontal: 16 },
  card: { borderRadius: 12, overflow: "hidden" },
  placeholder: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  placeholderIcon: { fontSize: 32 },
  cardText: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 10 },
  cardName: { fontSize: 12, fontWeight: "600", color: "#fff" },
});
