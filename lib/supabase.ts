import type { Character as CharacterType, Outfit as OutfitType, Series as SeriesType } from '@/types';
import { DraftOutfit, DraftSeries, IncompleteProduct, RecentProduct } from "@/types";
import type { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
)
// ─── Series ───────────────────────────────────────────────
export async function getAllSeries(): Promise<SeriesType[]> {
    const { data, error } = await supabase
        .from('series')
        .select(`
  *,
  characters(
    id,
    outfits(count)
  )
`)
    if (error) throw error
    return (data ?? []) as unknown as SeriesType[]
}

// ─── All Characters (for browse page) ─────────────────────
export async function getAllCharacters(): Promise<(CharacterType & { series: SeriesType | null })[]> {
    const { data, error } = await supabase
        .from('characters')
        .select(`*, series(id, name, slug)`)
        .order('name')

    if (error) return []
    return data as unknown as (CharacterType & { series: SeriesType | null })[]
}

// ─── All Outfits (for browse page) ────────────────────────
export async function getAllOutfits(
    limit = 20,
    offset = 0
): Promise<(OutfitType & { character: CharacterType & { series: SeriesType | null } })[]> {
    const { data, error } = await supabase
        .from('outfits')
        .select(`
  *, 
  character:characters(id, name, slug, photo_url, series:series(id, slug, name, type)),
  outfit_products(product:products(price))
`)
        .eq('status', 'publik')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)  // ← untuk pagination

    if (error) return []

    return (data ?? []).map((outfit: any) => ({
        ...outfit,
        products: outfit.outfit_products?.map((op: any) => op.product) ?? []
    }))
}


export async function getSeriesBySlug(name?: string): Promise<(SeriesType & { characters: CharacterType[] }) | null> {
    if (!name) return null

    const { data, error } = await supabase
        .from('series')
        .select(`*, characters(id, name, slug, photo_url, description)`)
        .eq('status', 'publik')
        .eq('slug', name)  // ← fix
        .single()

    if (error) return null
    return data as unknown as SeriesType & { characters: CharacterType[] }
}

// ─── Character ────────────────────────────────────────────
export async function getCharacterWithOutfits(
    seriesSlug: string,
    characterSlug: string
): Promise<(CharacterType & { outfits: OutfitType[]; series: SeriesType | null }) | null> {

    const { data: series } = await supabase
        .from('series')
        .select('id')
        .eq('slug', seriesSlug)   // ← langsung eq, bukan ilike
        .single()

    if (!series) return null

    const { data, error } = await supabase
        .from('characters')
        .select(`
      *,
      series(id, name, slug),
      outfits(id, name, slug, mood, gender_tag, status, outfit_url, created_at, 
        outfit_products(
          product:products(id, price)
        )
      )
    `)
        .eq('series_id', series.id)
        .eq('slug', characterSlug)
        .single()

    if (error) return null

    // Transform outfit_products → products
    const transformed = data as any
    transformed.outfits = transformed.outfits?.map((outfit: any) => ({
        ...outfit,
        products: outfit.outfit_products?.map((op: any) => op.product) ?? []
    }))

    return transformed as unknown as CharacterType & { outfits: OutfitType[]; series: SeriesType | null }
}

// ─── Outfit ───────────────────────────────────────────────
export async function getOutfitWithProducts(
    seriesSlug: string,
    characterSlug: string,
    outfitSlug: string
): Promise<OutfitType | null> {
    console.log("looking for:", seriesSlug, characterSlug, outfitSlug); // ← tambah

    const { data: series } = await supabase
        .from('series')
        .select('id')
        .eq('slug', seriesSlug)
        .single()

    console.log("series found:", series); // ← tambah

    if (!series) return null

    const { data: character } = await supabase
        .from('characters')
        .select('id')
        .eq('series_id', series.id)
        .eq('slug', characterSlug)
        .single()

    console.log("character found:", character); // ← tambah

    if (!character) return null

    const { data, error } = await supabase
        .from('outfits')
        .select(`
    *,
    character:characters(id, name, series:series(id, name, slug)),
    outfit_products(
      product:products(*)
    )
  `)
        .eq('character_id', character.id)
        .eq('status', 'publik')
        .eq('slug', outfitSlug)
        .single()

    console.log("outfit found:", data, "error:", error); // ← tambah

    if (error) return null

    const outfit = data as any
    if (outfit && outfit.outfit_products) {
        outfit.products = outfit.outfit_products.map((op: any) => op.product)
        delete outfit.outfit_products
    }

    return outfit as unknown as OutfitType
}

export async function getRecentOutfits(limit: number = 10): Promise<(OutfitType & { character: CharacterType & { series: SeriesType | null }; products: { price: number | null }[] })[]> {
    const { data, error } = await supabase
        .from('outfits')
        .select(`
      *,
      character:characters(id, name, slug, photo_url, series:series(id, slug, name, type)),
      outfit_products(product:products(price))
    `)
        .eq('status', 'publik')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) return []

    const transformed = (data ?? []).map((outfit: any) => ({
        ...outfit,
        products: outfit.outfit_products?.map((op: any) => op.product) ?? []
    }))

    return transformed
}

export async function getProductsWithOutfits() {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      outfit_products(
        outfit:outfits(id, name, character:characters(name, series:series(name)))
      )
    `)
        .order('created_at', { ascending: false })

    if (error) return []
    const products = (data ?? []).map((product: any) => ({
        ...product,
        outfits: product.outfit_products?.map((op: any) => op.outfit) ?? []
    }))

    return products
}

export async function linkProductToOutfits(productId: string, outfitIds: string[]) {
    const { data: existing } = await supabase
        .from('outfit_products')
        .select('outfit_id')
        .eq('product_id', productId)

    const existingIds = existing?.map((e: any) => e.outfit_id) ?? []

    const toRemove = existingIds.filter((id: string) => !outfitIds.includes(id))
    if (toRemove.length > 0) {
        await supabase
            .from('outfit_products')
            .delete()
            .eq('product_id', productId)
            .in('outfit_id', toRemove)
    }

    const toAdd = outfitIds.filter((id: string) => !existingIds.includes(id))
    if (toAdd.length > 0) {
        const newLinks = toAdd.map((outfitId: string) => ({
            product_id: productId,
            outfit_id: outfitId
        }))
        const { error } = await supabase
            .from('outfit_products')
            .insert(newLinks)

        if (error) throw error
    }
}

export async function getTrendingOutfits(limit = 20) {
    // Ambil top product_id berdasarkan click_logs
    const { data: clicks } = await supabase
        .from("click_logs")
        .select("product_id")
        .limit(500);

    if (!clicks) return [];

    // Hitung click count per product
    const countMap: Record<string, number> = {};
    for (const row of clicks) {
        if (!row.product_id) continue;
        countMap[row.product_id] = (countMap[row.product_id] ?? 0) + 1;
    }

    // Ambil top product ids
    const topProductIds = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => id);

    if (topProductIds.length === 0) return [];

    // Ambil outfit dari products tersebut
    const { data } = await supabase
        .from("outfit_products")
        .select(`
      product_id,
      outfit:outfits(
        *,
        character:characters(id, name, slug, series:series(id, name, slug)),
        outfit_products(product:products(id, price))
      )
    `)
        .in("product_id", topProductIds);

    if (!data) return [];

    const outfitMap = new Map<string, any>();
    for (const row of data) {
        const outfit = row.outfit as any;
        if (!outfit) continue;
        if (outfitMap.has(outfit.id)) continue;

        const outfitProductIds = outfit.outfit_products
            ?.map((op: any) => op.product?.id)
            .filter(Boolean) ?? [];

        const totalClicks = outfitProductIds.reduce(
            (sum: number, pid: string) => sum + (countMap[pid] ?? 0),
            0
        );
        outfitMap.set(outfit.id, {
            ...outfit,
            products: outfit.outfit_products?.map((op: any) => op.product) ?? [],
            totalClicks,
        });
    }

    return Array.from(outfitMap.values())
        .sort((a, b) => b.totalClicks - a.totalClicks);
}

// ─── Search ───────────────────────────────────────────────
export async function searchAll(query: string) {
    const q = `%${query}%`

    const [seriesRes, charsRes, outfitsRes, productsRes] = await Promise.all([
        supabase.from('series').select('id,name,type,cover_url').ilike('name', q).eq('status', 'publik').limit(4),
        supabase.from('characters').select('id,name,photo_url,series:series(name)').ilike('name', q).limit(4),
        supabase.from('outfits').select('id,name,outfit_url,character:characters(name,series:series(name))').ilike('name', q).eq('status', 'publik').limit(4),
        supabase.from('products').select('id,name,price,label,photo_url,outfit_products(outfit:outfits(name,character:characters(name,series:series(name))))').ilike('name', q).limit(4),
    ])

    // Transform products to use first outfit for display
    const products = (productsRes.data ?? []).map((p: any) => ({
        ...p,
        outfit: p.outfit_products?.[0]?.outfit ?? null
    }))

    return {
        series: seriesRes.data ?? [],
        characters: charsRes.data ?? [],
        outfits: outfitsRes.data ?? [],
        products,
    }
}

// ─── Helpers ──────────────────────────────────────────────
export function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')  // sama dengan regexp_replace di SQL
        .replace(/^-+|-+$/g, '')       // trim leading/trailing dash
}

export function formatPrice(price: number | null) {
    if (!price) return null
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)
}

export async function getStats() {
    const [series, characters, outfits, products, clicks] = await Promise.all([
        supabase.from("series").select("id", { count: "exact", head: true }),
        supabase.from("characters").select("id", { count: "exact", head: true }),
        supabase.from("outfits").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase
            .from("click_logs")
            .select("id", { count: "exact", head: true })
            .gte("clicked_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);

    // Tambahkan ini untuk debug
    if (series.error) console.error("series error:", series.error);
    if (characters.error) console.error("characters error:", characters.error);
    if (outfits.error) console.error("outfits error:", outfits.error);
    if (products.error) console.error("products error:", products.error);
    if (clicks.error) console.error("clicks error:", clicks.error);

    return {
        series: series.count ?? 0,
        characters: characters.count ?? 0,
        outfits: outfits.count ?? 0,
        products: products.count ?? 0,
        clicks7d: clicks.count ?? 0,
    };
}

export async function getRecentProducts(): Promise<RecentProduct[]> {
    const { data } = await supabase.from("products").select("id, name, created_at, outfit:outfits(name)").order("created_at", { ascending: false }).limit(5);
    return (data ?? []) as RecentProduct[];
}

export async function getIncompleteProducts(): Promise<IncompleteProduct[]> {
    const { data } = await supabase.from("products").select("id, name, link_tokopedia, link_shopee, link_tiktok").or("link_tokopedia.is.null,link_shopee.is.null").limit(5);
    return (data ?? []) as IncompleteProduct[];
}

export async function getDrafts(): Promise<{ series: DraftSeries[]; outfits: DraftOutfit[] }> {
    const [series, outfits] = await Promise.all([supabase.from("series").select("id, name").eq("status", "draft").limit(3), supabase.from("outfits").select("id, name, character:characters(name)").eq("status", "draft").limit(3)]);
    return {
        series: (series.data ?? []) as DraftSeries[],
        outfits: (outfits.data ?? []) as DraftOutfit[],
    };
}