import { View } from "react-native";
import { Typography } from "../ui/typography";

export default function CharactersHeader() {
  return (
    <View className="px-2">
      <Typography variant="h2">
        Characters
      </Typography>

      <Typography variant="caption">Daftar karakter anime, manhwa, dan series paling Kalcer</Typography>
    </View>
  );
}
