import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/supabase";
import { Image } from "expo-image";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ShopButtons } from "./shopButtons";

type Product = {
  id: string;
  name: string;
  price: number | null;
  label?: string | null;
  photo_url?: string | null;
  url?: string | null;
};

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;
  const c = useColors();

  return (
    <View style={[styles.card, { width: cardWidth, backgroundColor: c.backgroundSecondary }]}>
      {/* Gambar */}
      <View style={[styles.imageWrapper, { width: cardWidth, height: cardWidth, backgroundColor: c.backgroundSecondary }]}>
        {product.photo_url ? (
          <Image source={{ uri: product.photo_url }} style={{ width: cardWidth, height: cardWidth, borderRadius: 12 }} contentFit="cover" cachePolicy="memory-disk" transition={300} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
            <Text style={styles.placeholderIcon}>🛍️</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        {product.label && (
          <Text style={[styles.label, { color: c.textDisabled }]} numberOfLines={1}>
            {product.label}
          </Text>
        )}
        <Text style={[styles.name, { color: c.textPrimary }]} numberOfLines={2}>
          {product.name}
        </Text>
        {product.price && <Text style={styles.price}>{formatPrice(product.price)}</Text>}

        <ShopButtons product={product} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 32,
  },
  info: {
    padding: 10,
    gap: 4,
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4ade80",
  },
  shopBtn: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  shopBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
});
