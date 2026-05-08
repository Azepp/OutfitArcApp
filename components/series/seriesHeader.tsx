import { View } from "react-native";
import { Typography } from "../ui/typography";

export default function SeriesHeader() {
  return (
    <View className="px-2">
      <Typography variant="h2">
        Series
      </Typography>

      <Typography variant="caption">Daftar anime, manhwa, dan series</Typography>
    </View>
  );
}
