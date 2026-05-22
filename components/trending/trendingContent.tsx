import { useColors } from "@/hooks/useColors";
import { getTrendingOutfits } from "@/lib/api/outfits";
import { keys } from "@/lib/queryKeys";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import TrendingOutfitCard from "../trendingCard";

export default function TrendingContent() {
  const c = useColors();

  const { data: trendingOutfits = [], isLoading } = useQuery({
    queryKey: keys.outfits.trending,
    queryFn: () => getTrendingOutfits(20),
  });

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: c.background }]}>
        <Text style={[styles.loadingText, { color: c.textSecondary }]}>Memuat...</Text>
      </View>
    );
  }

  if (trendingOutfits.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: c.background }]}>
        <Text style={[styles.loadingText, { color: c.textSecondary }]}>Belum ada data trending</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={trendingOutfits}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={{ flex: 1, marginBottom: 8 }}>
          <TrendingOutfitCard outfit={item} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 14 },
  card: { borderRadius: 12, overflow: "hidden" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  placeholderIcon: { fontSize: 32 },
});
