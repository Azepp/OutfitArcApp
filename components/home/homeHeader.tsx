import { View } from "react-native";
import { Typography } from "../ui/typography";

export default function HomeHeader() {
  return (
    <View className="h-60 w-full items-center justify-center">
      <Typography variant="h1" color="white" className="text-center">
        OutfitArc
      </Typography>
      <Typography variant="caption" color="white" className="text-center mt-2">
        Temukan outfit dari karakter anime, film, series, dan tren terbaru. Lihat itemnya dan langsung beli.
      </Typography>
    </View>
  );
}
