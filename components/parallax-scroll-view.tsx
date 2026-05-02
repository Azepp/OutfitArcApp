import { useColors } from "@/hooks/useColors";
import type { PropsWithChildren } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollOffset } from "react-native-reanimated";

const HEADER_HEIGHT = 300;

type Props = PropsWithChildren<{
  headerImage: number | { uri: string };
  headerContent?: React.ReactNode;
}>;

export default function ParallaxScrollView({ children, headerImage, headerContent }: Props) {
  const c = useColors();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]),
      },
      {
        scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
      },
    ],
  }));

  return (
    <Animated.ScrollView ref={scrollRef} style={{ flex: 1, backgroundColor: c.background }} scrollEventThrottle={16}>
      {/* Hero section dengan background image */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <ImageBackground source={headerImage} style={styles.headerImage} resizeMode="cover">
          {/* Overlay gelap tipis biar teks keliatan */}
          <View style={styles.overlay} />

          {/* Konten di atas hero (saldo, tombol, dll) */}
          {headerContent && <View style={styles.headerContent}>{headerContent}</View>}
        </ImageBackground>
      </Animated.View>

      {/* Card konten overlap ke atas hero */}
      <View style={[styles.contentCard, { backgroundColor: c.background }]}>{children}</View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  headerImage: {
    flex: 1,
    justifyContent: "flex-start",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  headerContent: {
    padding: 20,
    paddingBottom: 40,
  },
  contentCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    minHeight: 600,
    padding: 20,
    gap: 16,
  },
});
