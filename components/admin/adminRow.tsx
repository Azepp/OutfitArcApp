import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "../ui/typography";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number | null;
  label: string | null;
  is_anchor: boolean | null;
  photo_url: string | null;
  link_tokopedia: string | null;
  link_shopee: string | null;
  link_tiktok: string | null;
  outfits: { name: string; character: { name: string; series: { name: string } | null } | null }[];
};

export function StatusBadge({ status, onToggle }: { status: string | null; onToggle?: () => void }) {
  const c = useColors();
  const isPublik = status === "publik";

  return (
    <Pressable
      onPress={onToggle}
      disabled={!onToggle}
      style={[
        styles.badge,
        {
          backgroundColor: isPublik ? "#f0fdf4" : c.backgroundSecondary,
          borderColor: isPublik ? "#bbf7d0" : c.border,
        },
      ]}
    >
      <Typography variant="label" color={isPublik ? "#15803d" : c.textDisabled}>
        {status ?? "draft"}
      </Typography>
    </Pressable>
  );
}

// ─── Row Thumbnail ──────────────────────────────────────────
export function RowThumb({ uri, fallbackIcon = "image" }: { uri?: string | null; fallbackIcon?: keyof typeof Feather.glyphMap }) {
  const c = useColors();
  return (
    <View style={[styles.thumb, { backgroundColor: c.backgroundSecondary }]}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="memory-disk" /> : <Feather name={fallbackIcon} size={16} color={c.textDisabled} />}
    </View>
  );
}

// ─── Row Actions ────────────────────────────────────────────
export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const c = useColors();
  return (
    <>
      <Pressable onPress={onEdit} style={styles.actionBtn}>
        <Feather name="edit-2" size={15} color={c.textSecondary} />
      </Pressable>
      <Pressable onPress={onDelete} style={styles.actionBtn}>
        <Feather name="trash-2" size={15} color="#ef4444" />
      </Pressable>
    </>
  );
}

// ─── Base Row ───────────────────────────────────────────────
export function AdminRow({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <View style={[styles.row, { borderBottomColor: c.border }]}>{children}</View>;
}

// ─── Series Row ─────────────────────────────────────────────
export function SeriesRow({ item, onEdit, onDelete, onToggle }: { item: { id: string; name: string; type: string | null; cover_url: string | null; status: string | null }; onEdit: () => void; onDelete: () => void; onToggle: () => void }) {
  const c = useColors();
  return (
    <AdminRow>
      <RowThumb uri={item.cover_url} fallbackIcon="image" />
      <View style={styles.info}>
        <Typography variant="label" color={c.textPrimary} weight="semibold" numberOfLines={1}>
          {item.name}
        </Typography>
        <Typography variant="label" color={c.textDisabled}>
          {item.type ?? "—"}
        </Typography>
      </View>
      <StatusBadge status={item.status} onToggle={onToggle} />
      <RowActions onEdit={onEdit} onDelete={onDelete} />
    </AdminRow>
  );
}

// ─── Character Row ──────────────────────────────────────────
export function CharacterRow({ item, onEdit, onDelete }: { item: { id: string; name: string; photo_url: string | null; series: { name: string } | null }; onEdit: () => void; onDelete: () => void }) {
  const c = useColors();
  return (
    <AdminRow>
      <RowThumb uri={item.photo_url} fallbackIcon="user" />
      <View style={styles.info}>
        <Typography variant="label" color={c.textPrimary} weight="semibold" numberOfLines={1}>
          {item.name}
        </Typography>
        <Typography variant="label" color={c.textDisabled} numberOfLines={1}>
          {item.series?.name ?? "—"}
        </Typography>
      </View>
      <RowActions onEdit={onEdit} onDelete={onDelete} />
    </AdminRow>
  );
}

// ─── Outfit Row ─────────────────────────────────────────────
export function OutfitRow({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: {
    id: string;
    name: string;
    outfit_url: string | null;
    mood: string | null;
    status: string | null;
    character: { name: string; series: { name: string } | null } | null;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const c = useColors();
  return (
    <AdminRow>
      <RowThumb uri={item.outfit_url} fallbackIcon="image" />
      <View style={styles.info}>
        <Typography variant="label" color={c.textPrimary} weight="semibold" numberOfLines={1}>
          {item.name}
        </Typography>
        <Typography variant="label" color={c.textDisabled} numberOfLines={1}>
          {item.character?.name ?? "—"} · {item.character?.series?.name ?? "—"}
        </Typography>
        {item.mood && (
          <Typography variant="label" color={c.textDisabled} numberOfLines={1}>
            {item.mood}
          </Typography>
        )}
      </View>
      <StatusBadge status={item.status} onToggle={onToggle} />
      <RowActions onEdit={onEdit} onDelete={onDelete} />
    </AdminRow>
  );
}

function PlatformDots({ tokopedia, shopee, tiktok, c }: { tokopedia: string | null; shopee: string | null; tiktok: string | null; c: any }) {
  return (
    <View style={styles.dots}>
      {[
        { active: !!tokopedia, color: "#42b549", label: "T" },
        { active: !!shopee, color: "#f05024", label: "S" },
        { active: !!tiktok, color: "#111", label: "TT" },
      ].map((p) => (
        <View key={p.label} style={[styles.dot, { backgroundColor: p.active ? p.color : c.backgroundSecondary }]}>
          <Typography variant="label" color={p.active ? "#fff" : c.textDisabled}>
            {p.label}
          </Typography>
        </View>
      ))}
    </View>
  );
}

export function ProductRow({ item, onEdit, onDelete }: { item: Product; onEdit: () => void; onDelete: () => void }) {
  const c = useColors();
  return (
    <AdminRow>
      <RowThumb uri={item.photo_url} fallbackIcon="shopping-bag" />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          {item.is_anchor && (
            <View style={[styles.anchorBadge, { backgroundColor: "#fffbeb", borderColor: "#fcd34d" }]}>
              <Typography variant="label" color="#b45309">
                anchor
              </Typography>
            </View>
          )}
          <Typography variant="label" color={c.textPrimary} weight="semibold" numberOfLines={1}>
            {item.name}
          </Typography>
        </View>
        <Typography variant="label" color={c.textDisabled} numberOfLines={1}>
          {item.category} · {formatPrice(item.price) ?? "—"}
        </Typography>
        {item.outfits?.length > 0 && (
          <Typography variant="label" color={c.textDisabled} numberOfLines={1}>
            {item.outfits.map((o) => o.name).join(", ")}
          </Typography>
        )}
      </View>
      <PlatformDots tokopedia={item.link_tokopedia} shopee={item.link_shopee} tiktok={item.link_tiktok} c={c} />
      <RowActions onEdit={onEdit} onDelete={onDelete} />
    </AdminRow>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionBtn: {
    padding: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  anchorBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  dots: {
    flexDirection: "row",
    gap: 3,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
