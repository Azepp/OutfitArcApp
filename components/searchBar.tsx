import { useColors } from "@/hooks/useColors";
import { searchAll, toSlug } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// ─── Types ─────────────────────────────────────────────────
interface SearchResult {
  series: { id: string; name: string; type: string; cover_url: string | null }[];
  characters: { id: string; name: string; photo_url: string | null; series: { name: string } | null }[];
  outfits: { id: string; name: string; outfit_url: string | null; character: { name: string; series: { name: string } | null } | null }[];
  products: { id: string; name: string; price: number | null; photo_url: string | null; outfit: { name: string; character: { name: string; series: { name: string } | null } | null } | null }[];
}

// ─── Thumb ─────────────────────────────────────────────────
function Thumb({ src, fallback }: { src: string | null; fallback: string }) {
  const c = useColors();
  return <View style={[styles.thumb, { backgroundColor: c.backgroundSecondary }]}>{src ? <Image source={{ uri: src }} style={{ width: 36, height: 36 }} contentFit="cover" /> : <Text style={styles.thumbFallback}>{fallback}</Text>}</View>;
}

// ─── Section Header ────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  const c = useColors();
  return (
    <View style={[styles.sectionHeader, { backgroundColor: c.backgroundSecondary }]}>
      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>{label}</Text>
    </View>
  );
}

function ResultRow({ thumb, fallback, title, subtitle, onPress }: { thumb: string | null; fallback: string; title: string; subtitle?: string; onPress: () => void }) {
  const c = useColors();
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      // ← Jangan pakai style sebagai function, hardcode flexDirection
      style={{
        flexDirection: "row", // ← eksplisit di sini, bukan di StyleSheet
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 10,
        backgroundColor: pressed ? c.backgroundSecondary : "transparent",
      }}
    >
      <Thumb src={thumb} fallback={fallback} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: c.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, { color: c.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

// ─── Main ──────────────────────────────────────────────────
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputY, setInputY] = useState(0);
  const inputRef = useRef<View>(null);
  const router = useRouter();
  const c = useColors();

  const lastSearched = useRef("");

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null);
      lastSearched.current = "";
      return;
    }
    // Skip kalau query sama persis
    if (q === lastSearched.current) return;
    lastSearched.current = q;

    setLoading(true);
    try {
      const data = await searchAll(q);
      setResults(data as SearchResult);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hanya watch query, bukan open
  useEffect(() => {
    const timeout = setTimeout(() => search(query), 800);
    return () => clearTimeout(timeout);
  }, [query, search]);

  const total = results ? results.series.length + results.characters.length + results.outfits.length + results.products.length : 0;

  const handleFocus = () => {
    inputRef.current?.measure((_x, _y, _w, _h, _px, py) => {
      setInputY(py + _h);
    });
    setOpen(true);
  };

  const closeDropdown = (cb?: () => void) => {
    setTimeout(() => {
      setOpen(false);
      cb?.();
    }, 150);
  };

  const showDropdown = open && (total > 0 || (query.length >= 2 && !loading));

  return (
    <View ref={inputRef} collapsable={false}>
      {/* Input */}
      <View style={[styles.inputWrapper, { backgroundColor: c.background, borderColor: c.borderSecondary }]}>
        <Feather name="search" size={14} color={c.textSecondary} style={{ marginRight: 6 }} />
        <TextInput
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            if (!open) setOpen(true);
          }}
          onFocus={handleFocus}
          onBlur={() => closeDropdown()}
          placeholder="Cari anime, karakter, outfit, produk..."
          placeholderTextColor={c.textDisabled}
          style={[styles.input, { color: c.textPrimary }]}
        />
        {loading && <ActivityIndicator size="small" color={c.textSecondary} style={{ marginRight: 10 }} />}
      </View>

      {/* Dropdown via Modal */}
      <Modal visible={showDropdown} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={[styles.dropdown, { top: inputY, backgroundColor: c.background, borderColor: c.border }]}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 320 }} contentContainerStyle={{ flexDirection: "column" }}>
              {/* Empty state */}
              {total === 0 && query.length >= 2 && !loading && (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyText, { color: c.textSecondary }]}>{`Tidak ada hasil untuk "${query}"`}</Text>
                </View>
              )}

              {results && results.series.length > 0 && (
                <>
                  <SectionHeader label="Anime & Acara" />
                  {results.series.map((s) => (
                    <ResultRow key={s.id} thumb={s.cover_url} fallback="🎬" title={s.name} subtitle={s.type} onPress={() => closeDropdown(() => router.push(`/${toSlug(s.name)}` as any))} />
                  ))}
                </>
              )}

              {results && results.characters.length > 0 && (
                <>
                  <SectionHeader label="Karakter" />
                  {results.characters.map((c) => (
                    <ResultRow key={c.id} thumb={c.photo_url} fallback="👤" title={c.name} subtitle={c.series?.name} onPress={() => closeDropdown(() => router.push(`/${toSlug(c.series?.name ?? "")}/${toSlug(c.name)}` as any))} />
                  ))}
                </>
              )}

              {results && results.outfits.length > 0 && (
                <>
                  <SectionHeader label="Outfit" />
                  {results.outfits.map((o) => (
                    <ResultRow
                      key={o.id}
                      thumb={o.outfit_url}
                      fallback="👔"
                      title={o.name}
                      subtitle={`${o.character?.name} · ${o.character?.series?.name}`}
                      onPress={() => closeDropdown(() => router.push(`/${toSlug(o.character?.series?.name ?? "")}/${toSlug(o.character?.name ?? "")}/${toSlug(o.name)}` as any))}
                    />
                  ))}
                </>
              )}

              {results && results.products.length > 0 && (
                <>
                  <SectionHeader label="Produk" />
                  {results.products.map((p) => (
                    <ResultRow
                      key={p.id}
                      thumb={p.photo_url}
                      fallback="🛍️"
                      title={p.name}
                      subtitle={`${p.outfit?.character?.name} · ${p.outfit?.name}`}
                      onPress={() => closeDropdown(() => router.push(`/${toSlug(p.outfit?.character?.series?.name ?? "")}/${toSlug(p.outfit?.character?.name ?? "")}/${toSlug(p.outfit?.name ?? "")}` as any))}
                    />
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    left: 16,
    right: 16,
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    width: 328,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbFallback: {
    fontSize: 16,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
  },
});
