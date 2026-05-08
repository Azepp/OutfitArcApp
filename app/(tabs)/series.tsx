import ScrollView from "@/components/scroll-view";
import SearchBar from "@/components/searchBar";
import SeriesContent from "@/components/series/seriesContent";
import SeriesHeader from "@/components/series/seriesHeader";

export default function SeriesScreen() {
  return (
    <ScrollView>
      <SearchBar />
      <SeriesHeader />
      <SeriesContent />
    </ScrollView>
  );
}
