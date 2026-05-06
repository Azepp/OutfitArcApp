import { useColors } from "@/hooks/useColors";
import type { PropsWithChildren } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollOffset } from "react-native-reanimated";
import { Image } from "expo-image";

type Props = PropsWithChildren<{
  headerImage: number | { uri: string };
  headerContent?: React.ReactNode;
}>;

export default function ParallaxScrollView({ children, headerImage, headerContent }: Props) {
  const c = useColors();
  const { width } = useWindowDimensions();
  const HEADER_HEIGHT = width * (9 / 16); // ← 16:9

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
      <Animated.View style={[{ height: HEADER_HEIGHT, overflow: "hidden" }, headerAnimatedStyle]}>
        <Image
          source={headerImage}
          style={[StyleSheet.absoluteFill, { width, height: HEADER_HEIGHT }]}
          contentFit="cover" // ← bukan resizeMode, tapi contentFit
        />
        <View style={styles.overlay} />
        {headerContent && <View style={[styles.headerContent, { height: HEADER_HEIGHT, justifyContent: "center" }]}>{headerContent}</View>}
      </Animated.View>

      <View style={[styles.contentCard, { backgroundColor: c.background }]}>{children}</View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  // header dihapus dari sini karena height-nya sudah dynamic
  headerImage: {
    flex: 1,
    width: "100%", // fallback
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.50)",
  },
  headerContent: {
    paddingHorizontal: 18,
  },
  contentCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    minHeight: 600,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 16,
  },
});
