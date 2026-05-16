import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { Pressable, TextInput, View, StyleSheet } from "react-native";

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const c = useColors();
  return (
    <View style={[s.searchBar, { backgroundColor: c.backgroundSecondary, borderColor: c.border }]}>
      <Feather name="search" size={14} color={c.textDisabled} />
      <TextInput value={value} onChangeText={onChange} placeholder="Cari series..." placeholderTextColor={c.textDisabled} style={[s.searchInput, { color: c.textPrimary }]} autoCapitalize="none" autoCorrect={false} />
      {value.length > 0 && (
        <Pressable onPress={() => onChange("")}>
          <Feather name="x" size={14} color={c.textDisabled} />
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  searchWrapper: {
    padding: 12,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});
