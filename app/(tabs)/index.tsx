import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Typography } from "@/components/ui/typography";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerImage={require("@/assets/images/hero/bg-image.png")}
      headerContent={
        <View style={{ gap: 8 }}>
          {/* Navbar */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Image source={require("@/assets/images/logo/horizontal/blueWhite.png")} className="w-20 h-4" />
            <View className="px-3 py-2 bg-secondary/35 rounded-full">
              <Typography variant="caption" color="#fff" className="flex-row items-center">
                <Ionicons name="warning" size={18} color="#FEC903" /> Maksimalkan Perlindunganmu
              </Typography>
            </View>
            <Pressable onPress={() => console.log("klik")} className="w-12 h-12 flex-row items-center justify-center bg-secondary border-2 border-[#00263b] rounded-2xl cursor-pointer">
              <Typography variant="body" color="#fff">?</Typography>
            </Pressable>{" "}
          </View>

          <Typography variant="h1" color="#fff">
            Rp 10.500
          </Typography>
          <View className="flex-row items-center">
            <Typography variant="body" color="#fff" weight="semibold">
              115{" "}
            </Typography>
            <Typography variant="body" color="#fff">
              Coins
            </Typography>
          </View>
        </View>
      }
    >
      {" "}
      <View className="" style={{ gap: 16 }}>
        <View style={styles.titleContainer}>
          <Typography variant="h1">Welcome to the </Typography>
          <HelloWave />
        </View>
        <Typography variant="body" secondary>
          This is a clone of the React Native website built with Expo and Tailwind CSS. It serves as a playground for experimenting with different design and development techniques.
        </Typography>
      </View>
    </ParallaxScrollView>
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
