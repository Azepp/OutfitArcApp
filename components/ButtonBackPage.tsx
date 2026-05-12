import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ButtonBackPage() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => router.back()}
      style={[
        styles.button,
        {
          backgroundColor: c.background,
          top: insets.top + 8, // ← otomatis ikut notch/status bar
        },
      ]}
    >
      <Feather name="arrow-left" size={20} color={c.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute", // ← overlay di atas konten
    top: 56, // ← sesuaikan dengan status bar
    left: 16,
    width: 46,
    height: 46,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
