# OutfitArc

Aplikasi katalog outfit karakter dari anime, manhwa, film, dan series. Temukan inspirasi outfit dari karakter favoritmu dan beli itemnya langsung dari Tokopedia, Shopee, dan TikTok.

## Tech Stack

- **Framework:** React Native dengan Expo
- **Routing:** Expo Router (file-based routing)
- **Styling:** NativeWind (Tailwind CSS)
- **Backend:** Supabase
- **State Management:** TanStack Query
- **Storage:** MMKV & AsyncStorage
- **Animasi:** React Native Reanimated

## Fitur Utama

- **Series** — Jelajahi berbagai series anime, manhwa, film, dan series
- **Characters** — Lihat karakter dan outfit mereka
- **Outfits** — Detail outfit dengan mood, gender tag, dan referensi momen
- **Products** — Item penyusun outfit dengan link pembelian
- **Admin Panel** — CRUD untuk mengelola series, karakter, outfit, dan produk

## Cara Memulai

1. Install dependencies:

```bash
npm install
```

2. Jalankan aplikasi:

```bash
npx expo start
```

3. Buka di iOS Simulator, Android Emulator, atau Expo Go.

## Struktur Folder

- `app/` — Expo Router pages (file-based routing)
- `components/` — Komponen UI
- `lib/` — Supabase client, API functions, query keys
- `types/` — TypeScript type definitions
- `constants/` — Konstanta (warna, typografi, data home)
- `context/` — React context (theme)
- `assets/` — Gambar dan aset statis
