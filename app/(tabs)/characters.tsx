import CharactersContent from "@/components/characters/charactersContent";
import CharactersHeader from "@/components/characters/charactersHeader";
import ScrollView from "@/components/scroll-view";
import SearchBar from "@/components/searchBar";

export default function CharacterScreen() {
  return (
    <ScrollView>
      <SearchBar />
      <CharactersHeader />
      <CharactersContent />
    </ScrollView>
  );
}
