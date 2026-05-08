import { View } from "react-native";
import { Typography } from "../ui/typography";

export default function TrendingHeader() {
  return (
    <View className="px-2">
      <Typography variant="h2">Trending Outfits</Typography>

      <Typography variant="caption">Outfit yang lagi banyak dicari orang</Typography>
    </View>
  );
}
