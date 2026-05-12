import ButtonBackPage from "@/components/ButtonBackPage";
import { OutfitCard } from "@/components/outfitCard";
import { useColors } from "@/hooks/useColors";
import { getCharacterWithOutfits } from "@/lib/supabase";
import type { Outfit } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CharacterScreen() {
  const { series: seriesSlug, character: characterSlug } = useLocalSearchParams<{ series: string; character: string }>();
  const c = useColors();

  const { data: character, isLoading } = useQuery({
    queryKey: ["character", seriesSlug, characterSlug],
    queryFn: () => getCharacterWithOutfits(seriesSlug, characterSlug),
  });

  if (isLoading)
    return (
      <View style={[s.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary }}>Memuat...</Text>
      </View>
    );
  if (!character)
    return (
      <View style={[s.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary }}>Karakter tidak ditemukan</Text>
      </View>
    );

  const outfits = (character.outfits ?? []) as (Outfit & { products?: { price: number | null }[] })[];

  return (
    <>
      <ScrollView style={[s.container, { backgroundColor: c.background }]} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <ButtonBackPage />
        {/* Hero */}
        <View style={s.hero}>
          {character.photo_url && <Image source={{ uri: character.photo_url }} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="memory-disk" />}
          <LinearGradient colors={["transparent", c.background]} style={StyleSheet.absoluteFill} />
          <View style={s.heroContent}>
            <Text style={[s.heroSeries, { color: c.textSecondary }]}>{character.series?.name}</Text>
            <Text style={[s.heroTitle, { color: c.textPrimary }]}>{character.name}</Text>
            <Text style={[s.heroSubtitle, { color: c.textSecondary }]}>{outfits.length} outfit</Text>
          </View>
        </View>

        {character.description && <Text style={[s.description, { color: c.textSecondary }]}>{character.description}</Text>}

        <Text style={[s.sectionLabel, { color: c.textDisabled }]}>Pilih outfit</Text>

        <View style={s.grid}>
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={
                {
                  ...outfit,
                  slug: outfit.slug,
                  character: {
                    ...character,
                    series: character.series,
                  },
                } as any
              }
            />
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
  hero: { width: "100%", height: 280, justifyContent: "flex-end", backgroundColor: "#1a1a1a" },
  heroContent: { padding: 16, paddingBottom: 20 },
  heroSeries: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  heroTitle: { fontSize: 26, fontWeight: "700", lineHeight: 32 },
  heroSubtitle: { fontSize: 13, marginTop: 4 },
  description: { fontSize: 13, lineHeight: 20, margin: 16 },
  sectionLabel: { fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginHorizontal: 16, marginBottom: 12, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 12, columnGap: 4, paddingHorizontal: 16 },
});
