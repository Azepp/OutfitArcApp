import { Pressable, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/context/ThemeContext";
import { Typography } from "../ui/typography";
import { LinearGradient } from "expo-linear-gradient";

export default function SwitchMode() {
  const c = useColors();
  const { isDark, toggleTheme } = useTheme();

  return (
    <View className="flex-col items-center justify-center gap-8 mb-12">
      <View>
        <Typography variant="h3" color={c.textPrimary} className="text-center mb-1">
          Mau mode terang atau gelap?
        </Typography>
        <Typography variant="label" color={c.textSecondary} className="text-center">
          Nyalain atau matiin saklar sesuai keinginan
        </Typography>
      </View>

      <Pressable onPress={toggleTheme}>
        <View
          style={{
            backgroundColor: c.backgroundSecondary,
            borderRadius: 16,
            padding: 16,
            width: 144,
            height: 144,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 50,
              height: 90,
              borderRadius: 12,
              backgroundColor: c.background,
              alignItems: "center",
              justifyContent: isDark ? "flex-start" : "flex-end",
              padding: 2,
            }}
          >
            <LinearGradient
              colors={c.backgroundGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                width: 46,
                height: 64,
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
