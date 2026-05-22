import { getRecentOutfits } from "@/lib/api/outfits";
import { getAllSeries } from "@/lib/api/series";
import { keys } from "@/lib/queryKeys";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { OutfitCard } from "../outfitCard";
import SearchBar from "../searchBar";
import { SeriesCard } from "../seriesCard";
import { Typography } from "../ui/typography";

const TYPE_LABEL: Record<string, string> = {
  anime: "Anime",
  manhwa: "Manhwa",
  figur: "Figur",
  film: "Film",
  series: "Series",
};

// ─── Section Types ─────────────────────────────────────────
type SectionItem =
  | { type: "header"; id: string }
  | { type: "outfitLabel"; id: string }
  | { type: "seriesLabel"; id: string; cat: string }
  | { type: "outfit"; id: string; data: any }
  | { type: "series"; id: string; data: any }
  | { type: "searchBar"; id: string };

// ─── Section Header ────────────────────────────────────────
function SectionHeader({
  label,
  href,
  router,
  noMarginTop = false,
}: {
  label: string;
  href: Href;
  router: ReturnType<typeof useRouter>;
  noMarginTop?: boolean; // ← tambah prop ini
}) {
  return (
    <View style={[styles.sectionHeader, noMarginTop && { marginTop: 0 }]}>
      <Typography variant="body" weight="bold">
        {label}
      </Typography>
      <Pressable onPress={() => router.push(href)}>
        <Text style={styles.lihatSemua}>Lihat Semua</Text>
      </Pressable>
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────
export default function HomeContent() {
  const router = useRouter();

  const { data: recentOutfits = [], isLoading: loadingOutfits } = useQuery({
    queryKey: keys.outfits.recent(6),
    queryFn: () => getRecentOutfits(6),
  });

  const { data: seriesList = [], isLoading: loadingSeries } = useQuery({
    queryKey: keys.series.all,
    queryFn: getAllSeries,
  });

  // Group series by type, tiap kategori dibatasi 6
  const grouped = Object.entries(
    seriesList.reduce<Record<string, typeof seriesList>>((acc, s) => {
      const key = s.type ?? "lainnya";
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {}),
  ).map(([cat, list]) => [cat, list.slice(0, 6)] as [string, typeof seriesList]);

  // Flatten semua section jadi satu array
  const sections: SectionItem[] = [
    { type: "searchBar", id: "search-bar" }, // ← tambah di paling atas

    ...(recentOutfits.length > 0
      ? [
          { type: "outfitLabel" as const, id: "label-outfits" },
          ...recentOutfits.map((o) => ({
            type: "outfit" as const,
            id: o.id,
            data: o,
          })),
        ]
      : []),

    ...grouped.flatMap(([cat, list]) => [
      { type: "seriesLabel" as const, id: `label-${cat}`, cat },
      ...list.map((s) => ({
        type: "series" as const,
        id: s.id,
        data: s,
      })),
    ]),
  ];

  if (loadingOutfits || loadingSeries) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Memuat...</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={sections}
      keyExtractor={(item) => item.id}
      numColumns={2}
      getItemType={(item) => item.type}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => {
        switch (item.type) {
          case "searchBar":
            return (
              <View style={styles.searchBarWrapper}>
                <SearchBar />
              </View>
            );

          case "outfitLabel":
            return <SectionHeader label="Outfit Terbaru" href={"/(tabs)/outfits" as Href} router={router} noMarginTop />;

          case "seriesLabel":
            return <SectionHeader label={TYPE_LABEL[item.cat] ?? item.cat} href={"/(tabs)/series" as Href} router={router} />;

          case "outfit":
            return (
              <View style={styles.gridItem}>
                <OutfitCard outfit={item.data} />
              </View>
            );

          case "series":
            return (
              <View style={styles.gridItem}>
                <SeriesCard series={item.data} />
              </View>
            );

          default:
            return null;
        }
      }}
      overrideItemLayout={(layout, item) => {
        if (item.type !== "outfit" && item.type !== "series") {
          layout.span = 2;
        }
      }}
    />
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  searchBarWrapper: {
    paddingTop: 12,
    paddingBottom: 24,
    zIndex: 999,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
  lihatSemua: {
    fontSize: 12,
    color: "#ff5a00",
    textDecorationLine: "underline",
  },
  gridItem: {
    flex: 1,
    marginBottom: 8,
  },
});
