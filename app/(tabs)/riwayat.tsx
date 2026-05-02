import { StyleSheet, View } from "react-native";
import { Typography } from "@/components/ui/typography";
import ScrollView from "@/components/scroll-view";

export default function Riwayat() {
  return (
    <ScrollView>
      {" "}
      <View className="px-4" style={{ gap: 16 }}>
        <View style={styles.titleContainer}>
          <Typography variant="h1">Riwayat</Typography>
        </View>
        <Typography variant="body" secondary>
          This is a clone of the React Native website built with Expo and Tailwind CSS. It serves as a playground for experimenting with different design and development techniques.
        </Typography>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  logo: {
    height: 100,
    width: 356,
    alignSelf: "center",
    marginTop: 20,
  },
});
