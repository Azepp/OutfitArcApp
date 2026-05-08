import ScrollView from "@/components/scroll-view";
import SearchBar from "@/components/searchBar";
import TrendingHeader from "@/components/trending/trendingHeader";
import TrendingContent from "@/components/trending/trendingContent";

export default function TrendingScreen() {
  return (
    <ScrollView>
      <SearchBar />
      <TrendingHeader />
      <TrendingContent />
    </ScrollView>
  );
}
