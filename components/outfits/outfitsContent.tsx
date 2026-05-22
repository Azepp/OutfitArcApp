import { getAllOutfits } from "@/lib/api/outfits";
import { keys } from "@/lib/queryKeys";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { OutfitCard } from "../outfitCard";

export default function OutfitsContent() {
  const { data: allOutfits = [], isLoading: loadingOutfits } = useQuery({
    queryKey: keys.outfits.all,
    queryFn: () => getAllOutfits(1000),
  });

  const items = allOutfits.map((o) => ({ id: o.id, data: o }));

  if (loadingOutfits) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Memuat...</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={styles.gridItem}>
          <OutfitCard outfit={item.data} />
        </View>
      )}
    />
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    lineHeight: 20,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginTop: 20,
    marginBottom: 10,
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
