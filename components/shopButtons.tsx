import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

type Platform = "tokopedia" | "shopee" | "tiktok";

type Product = {
  id: string;
  link_tokopedia?: string | null;
  link_shopee?: string | null;
  link_tiktok?: string | null;
};

const PLATFORMS: { key: Platform; label: string; color: string }[] = [
  { key: "tokopedia", label: "Tokopedia", color: "#42b549" },
  { key: "shopee", label: "Shopee", color: "#f05024" },
  { key: "tiktok", label: "TikTok Shop", color: "#1a1a1a" },
];

// ─── Single Button ─────────────────────────────────────────
function ShopButton({ platform, onPress }: { platform: (typeof PLATFORMS)[0]; onPress: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        display: "flex",
        justifyContent: "center",
        width: 148,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: platform.color,
        opacity: pressed ? 0.8 : 1,
      }}
    >
      <Text style={styles.btnText}>{platform.label}</Text>
      <Feather name="external-link" size={12} color="#fff" />
    </Pressable>
  );
}

// ─── Main ──────────────────────────────────────────────────
export function ShopButtons({ product }: { product: Product }) {
  const available = PLATFORMS.filter((p) => {
    const key = `link_${p.key}` as keyof Product;
    return !!product[key];
  });

  if (available.length === 0) return null;

  const handlePress = async (platform: Platform) => {
    const apiUrl = `https://outfit-arc.vercel.app/api/go/${product.id}?platform=${platform}`;
    await Linking.openURL(apiUrl);
  };

  return (
    <View style={styles.container}>
      {available.map((p) => (
        <ShopButton key={p.key} platform={p} onPress={() => handlePress(p.key)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  btnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  arrow: {
    fontSize: 10,
    color: "#fff",
  },
});
