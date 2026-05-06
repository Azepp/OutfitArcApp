import { useColors } from "@/hooks/useColors";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

export default function ScrollView({ children }: PropsWithChildren) {
  const c = useColors();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <Animated.ScrollView ref={scrollRef} style={{ flex: 1, backgroundColor: c.background }} scrollEventThrottle={16}>
      <View style={[styles.content, { backgroundColor: c.background }]}>{children}</View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 16,
  },
});
