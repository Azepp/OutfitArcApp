import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function ButtonBackPage() {
  const c = useColors();
  const router = useRouter();

  return (
    <Stack.Screen
      options={{
        title: "",
        headerTransparent: true,
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 46,
              height: 46,
              borderRadius: 100,
              backgroundColor: c.background,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="arrow-left" size={20} color={c.textPrimary} />
          </Pressable>
        ),
      }}
    />
  );
}
