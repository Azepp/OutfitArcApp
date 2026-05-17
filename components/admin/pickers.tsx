import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Typography } from "../ui/typography";
import Field from "./field";
type OutfitOption = {
  id: string;
  name: string;
  character: { name: string; series: { name: string } | null } | null;
};

export function SeriesPicker({ value, onChange, seriesList, c }: { value: string; onChange: (v: string) => void; seriesList: { id: string; name: string }[]; c: any }) {
  return (
    <View style={f.optionRow}>
      {seriesList.map((s) => (
        <Pressable
          key={s.id}
          onPress={() => onChange(s.id)}
          style={[
            f.option,
            {
              backgroundColor: value === s.id ? c.primary : c.backgroundSecondary,
              borderColor: value === s.id ? c.primary : c.border,
            },
          ]}
        >
          <Typography variant="label" color={value === s.id ? "#fff" : c.textSecondary} weight={value === s.id ? "semibold" : "regular"} numberOfLines={1}>
            {s.name}
          </Typography>
        </Pressable>
      ))}
    </View>
  );
}

export function CharacterPicker({
  seriesList,
  characters,
  seriesId,
  charId,
  onSeriesChange,
  onCharChange,
  c,
}: {
  seriesList: { id: string; name: string }[];
  characters: { id: string; name: string; series_id: string }[];
  seriesId: string;
  charId: string;
  onSeriesChange: (v: string) => void;
  onCharChange: (v: string) => void;
  c: any;
}) {
  const filteredChars = seriesId ? characters.filter((ch) => ch.series_id === seriesId) : characters;

  return (
    <View style={{ gap: 12 }}>
      <Field label="Anime / Series">
        <View style={f.optionRow}>
          {seriesList.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => {
                onSeriesChange(s.id);
                onCharChange("");
              }}
              style={[f.option, { backgroundColor: seriesId === s.id ? c.primary : c.backgroundSecondary, borderColor: seriesId === s.id ? c.primary : c.border }]}
            >
              <Typography variant="label" color={seriesId === s.id ? "#fff" : c.textSecondary} weight={seriesId === s.id ? "semibold" : "regular"} numberOfLines={1}>
                {s.name}
              </Typography>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="Karakter">
        <View style={f.optionRow}>
          {filteredChars.map((ch) => (
            <Pressable key={ch.id} onPress={() => onCharChange(ch.id)} style={[f.option, { backgroundColor: charId === ch.id ? c.primary : c.backgroundSecondary, borderColor: charId === ch.id ? c.primary : c.border }]}>
              <Typography variant="label" color={charId === ch.id ? "#fff" : c.textSecondary} weight={charId === ch.id ? "semibold" : "regular"} numberOfLines={1}>
                {ch.name}
              </Typography>
            </Pressable>
          ))}
        </View>
      </Field>
    </View>
  );
}

export function OutfitPicker({ value, onChange, outfits, c }: { value: string[]; onChange: (ids: string[]) => void; outfits: OutfitOption[]; c: any }) {
  const [search, setSearch] = useState("");

  const filtered = outfits.filter((o) => {
    const q = search.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.character?.name?.toLowerCase().includes(q) || o.character?.series?.name?.toLowerCase().includes(q);
  });

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <View style={[f.outfitBox, { borderColor: c.border }]}>
      {/* Search */}
      <View style={[f.outfitSearch, { borderBottomColor: c.border, backgroundColor: c.backgroundSecondary }]}>
        <Feather name="search" size={13} color={c.textDisabled} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Cari outfit atau karakter..." placeholderTextColor={c.textDisabled} style={[f.outfitSearchInput, { color: c.textPrimary }]} autoCapitalize="none" />
      </View>

      {/* List */}
      <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
        {filtered.length === 0 ? (
          <View style={f.outfitEmpty}>
            <Typography variant="label" color={c.textDisabled}>
              Tidak ada outfit ditemukan
            </Typography>
          </View>
        ) : (
          filtered.map((o) => {
            const isSelected = value.includes(o.id);
            return (
              <Pressable key={o.id} onPress={() => toggle(o.id)} style={[f.outfitItem, { borderBottomColor: c.border, backgroundColor: isSelected ? c.primary + "10" : "transparent" }]}>
                <View style={[f.checkbox, { borderColor: isSelected ? c.primary : c.border, backgroundColor: isSelected ? c.primary : "transparent" }]}>{isSelected && <Feather name="check" size={11} color="#fff" />}</View>
                <View style={{ flex: 1 }}>
                  <Typography variant="label" color={c.textPrimary} weight={isSelected ? "semibold" : "regular"} numberOfLines={1}>
                    {o.name}
                  </Typography>
                  <Typography variant="label" color={c.textDisabled} numberOfLines={1}>
                    {o.character?.name} · {o.character?.series?.name}
                  </Typography>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

// ─── Option Picker — terima { value, label }[] atau string[] ──
type OptionItem = { value: string; label: string } | string;

function normalize(opt: OptionItem): { value: string; label: string } {
  return typeof opt === "string" ? { value: opt, label: opt } : opt;
}

export function OptionPicker({ options, value, onChange, c }: { options: OptionItem[]; value: string; onChange: (v: string) => void; c: any }) {
  return (
    <View style={f.optionRow}>
      {options.map((opt) => {
        const { value: optValue, label } = normalize(opt);
        const isSelected = value === optValue;
        return (
          <Pressable
            key={optValue}
            onPress={() => onChange(optValue)}
            style={[
              f.option,
              {
                backgroundColor: isSelected ? c.primary : c.backgroundSecondary,
                borderColor: isSelected ? c.primary : c.border,
              },
            ]}
          >
            <Typography variant="label" color={isSelected ? "#fff" : c.textSecondary} weight={isSelected ? "semibold" : "regular"}>
              {label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Filter Chips — horizontal scroll ──────────────────────
export function FilterChips({ options, value, onChange, allLabel = "Semua", c }: { options: { id: string; name: string }[]; value: string; onChange: (v: string) => void; allLabel?: string; c: any }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={f.filterRow}>
      <Pressable
        onPress={() => onChange("")}
        style={[
          f.chip,
          {
            backgroundColor: value === "" ? c.primary : c.backgroundSecondary,
            borderColor: value === "" ? c.primary : c.border,
          },
        ]}
      >
        <Typography variant="label" color={value === "" ? "#fff" : c.textSecondary} weight={value === "" ? "semibold" : "regular"}>
          {allLabel}
        </Typography>
      </Pressable>
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            style={[
              f.chip,
              {
                backgroundColor: isSelected ? c.primary : c.backgroundSecondary,
                borderColor: isSelected ? c.primary : c.border,
              },
            ]}
          >
            <Typography variant="label" color={isSelected ? "#fff" : c.textSecondary} weight={isSelected ? "semibold" : "regular"} numberOfLines={1}>
              {opt.name}
            </Typography>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── Styles ────────────────────────────────────────────────
const f = StyleSheet.create({
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  outfitBox: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  outfitSearch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  outfitSearchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  outfitEmpty: {
    padding: 16,
    alignItems: "center",
  },
  outfitItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
  },
});
