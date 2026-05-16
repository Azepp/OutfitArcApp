import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { getDrafts, getIncompleteProducts, getRecentProducts, getStats } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Components ─────────────────────────────────────────────
function StatCard({ label, value, onPress, c, wide }: { label: string; value: number; onPress: () => void; c: any; wide?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[s.statCard, { backgroundColor: c.backgroundSecondary }, wide && s.statCardWide]}>
      <Typography variant="h2" color={c.textPrimary} weight="bold">
        {value}
      </Typography>
      <Typography variant="label" color={c.textSecondary}>
        {label}
      </Typography>
    </Pressable>
  );
}

function SectionCard({ title, subtitle, children, c, onSubtitlePress }: { title: string; subtitle?: string; children: React.ReactNode; c: any; onSubtitlePress?: () => void }) {
  return (
    <View style={[s.sectionCard, { backgroundColor: c.backgroundSecondary }]}>
      <View style={[s.sectionHeader, { borderBottomColor: c.border }]}>
        <Typography variant="label" color={c.textPrimary} weight="semibold">
          {title}
        </Typography>
        {subtitle && (
          <Pressable onPress={onSubtitlePress}>
            <Typography variant="label" color={c.primary}>
              {subtitle}
            </Typography>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

function RowItem({ title, subtitle, right, c }: { title: string; subtitle?: string; right?: React.ReactNode; c: any }) {
  return (
    <View style={[s.rowItem, { borderBottomColor: c.border }]}>
      <View style={{ flex: 1 }}>
        <Typography variant="label" color={c.textPrimary} weight="semibold" numberOfLines={1}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="label" color={c.textDisabled} numberOfLines={1}>
            {subtitle}
          </Typography>
        )}
      </View>
      {right}
    </View>
  );
}

export default function AdminDashboard() {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: stats } = useQuery({ queryKey: ["admin", "stats"], queryFn: getStats });
  const { data: recent = [] } = useQuery({ queryKey: ["admin", "recent"], queryFn: getRecentProducts });
  const { data: incomplete = [] } = useQuery({ queryKey: ["admin", "incomplete"], queryFn: getIncompleteProducts });
  const { data: drafts } = useQuery({ queryKey: ["admin", "drafts"], queryFn: getDrafts });

  const hasDrafts = (drafts?.series.length ?? 0) > 0 || (drafts?.outfits.length ?? 0) > 0;

  const statItems = [
    { label: "Series", value: stats?.series ?? 0, href: "/admin/series" },
    { label: "Karakter", value: stats?.characters ?? 0, href: "/admin/characters" },
    { label: "Outfit", value: stats?.outfits ?? 0, href: "/admin/outfits" },
    { label: "Produk", value: stats?.products ?? 0, href: "/admin/products" },
    { label: "Klik 7h", value: stats?.clicks7d ?? 0, href: "/admin/analytics" },
  ];

  return (
    <ScrollView style={[s.container, { backgroundColor: c.background }]} contentContainerStyle={[s.content, { paddingBottom: 40 }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16, borderBottomColor: c.border, backgroundColor: c.backgroundSecondary }]}>
        <Typography variant="h3" color={c.textPrimary} weight="bold">
          Dashboard
        </Typography>
        <Typography variant="label" color={c.textDisabled}>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
        </Typography>
      </View>

      <View style={s.body}>
        <View style={s.statsGrid}>
          {statItems.map((item, index) => (
            <StatCard key={item.label} label={item.label} value={item.value} onPress={() => router.push(item.href as any)} c={c} wide={index === statItems.length - 1} />
          ))}
        </View>

        {/* Draft warning */}
        {hasDrafts && (
          <View style={[s.draftBanner, { backgroundColor: c.backgroundSecondary, borderColor: "#f59e0b" }]}>
            <Typography variant="label" color="#b45309" weight="semibold" style={{ marginBottom: 8 }}>
              Konten masih Draft — belum tampil di app
            </Typography>
            <View style={s.draftTags}>
              {drafts?.series.map((s) => (
                <View key={s.id} style={[s2.draftTag, { borderColor: "#fcd34d", backgroundColor: c.background }]}>
                  <Typography variant="label" color="#b45309">
                    {s.name}
                  </Typography>
                </View>
              ))}
              {drafts?.outfits.map((o) => (
                <View key={o.id} style={[s2.draftTag, { borderColor: "#fcd34d", backgroundColor: c.background }]}>
                  <Typography variant="label" color="#b45309">
                    {o.name}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Products */}
        <SectionCard title="Produk terbaru" subtitle="Lihat semua" onSubtitlePress={() => router.push("/admin/products")} c={c}>
          {recent.length === 0 ? (
            <Typography variant="label" color={c.textDisabled} style={{ padding: 16, textAlign: "center" }}>
              Belum ada produk
            </Typography>
          ) : (
            recent.map((p) => (
              <RowItem
                key={p.id}
                title={p.name}
                subtitle={(p.outfit as any)?.name}
                right={
                  <Typography variant="label" color={c.textDisabled}>
                    {new Date(p.created_at).toLocaleDateString("id-ID")}
                  </Typography>
                }
                c={c}
              />
            ))
          )}
        </SectionCard>

        {/* Incomplete Products */}
        <SectionCard title="Perlu dilengkapi" subtitle="Link platform kosong" c={c}>
          {incomplete.length === 0 ? (
            <Typography variant="label" color={c.textDisabled} style={{ padding: 16, textAlign: "center" }}>
              Semua produk sudah lengkap!
            </Typography>
          ) : (
            incomplete.map((p) => (
              <RowItem
                key={p.id}
                title={p.name}
                right={
                  <View style={s.badges}>
                    {!p.link_tokopedia && (
                      <View style={[s.badge, { backgroundColor: "#fff7ed", borderColor: "#fed7aa" }]}>
                        <Typography variant="label" color="#c2410c">
                          Toped
                        </Typography>
                      </View>
                    )}
                    {!p.link_shopee && (
                      <View style={[s.badge, { backgroundColor: "#fef2f2", borderColor: "#fecaca" }]}>
                        <Typography variant="label" color="#b91c1c">
                          Shopee
                        </Typography>
                      </View>
                    )}
                    {!p.link_tiktok && (
                      <View style={[s.badge, { backgroundColor: c.backgroundSecondary, borderColor: c.border }]}>
                        <Typography variant="label" color={c.textSecondary}>
                          TikTok
                        </Typography>
                      </View>
                    )}
                  </View>
                }
                c={c}
              />
            ))
          )}
        </SectionCard>
      </View>
    </ScrollView>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  content: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  body: { padding: 16, gap: 16 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: "48%",
    flexGrow: 1,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  statCardWide: {
    flexBasis: "100%", // full width = makan 2 kolom
  },
  sectionCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  draftBanner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  draftTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badges: {
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
});

const s2 = StyleSheet.create({
  draftTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
});
