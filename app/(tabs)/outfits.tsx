import OutfitsContent from "@/components/outfits/outfitsContent";
import OutfitsHeader from "@/components/outfits/outfitsHeader";
import ScrollView from "@/components/scroll-view";
import SearchBar from "@/components/searchBar";

export default function OutfitScreen() {
  return (
    <ScrollView>
      <SearchBar />
      <OutfitsHeader />
      <OutfitsContent />
    </ScrollView>
  );
}
