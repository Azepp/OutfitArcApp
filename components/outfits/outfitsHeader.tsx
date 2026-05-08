import { View } from "react-native";
import { Typography } from "../ui/typography";

export default function OutfitsHeader() {
  return (
    <View className="px-2">
      <Typography variant="h2">
        Outfits
      </Typography>

      <Typography variant="caption">Outfit mereka, gaya kamu</Typography>
    </View>
  );
}
