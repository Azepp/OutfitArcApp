import type { Character as CharacterType, Outfit as OutfitType, Series as SeriesType } from '@/types'
import type { Database } from '@/types/database.types'
import { createClient } from '@supabase/supabase-js'

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
            character:characters(id, name, slug, series:series(id, name, slug)),
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
        .select(`*, characters(id, name, photo_url, description)`)
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
      series(id, name),
      outfits(id, name, mood, gender_tag, status, outfit_url, created_at, 
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
    const { data: series } = await supabase
        .from('series')
        .select('id')
        .eq('slug', seriesSlug)  // ← fix
        .single()

    if (!series) return null

    const { data: character } = await supabase
        .from('characters')
        .select('id')
        .eq('series_id', series.id)
        .eq('slug', characterSlug)  // ← fix
        .single()

    if (!character) return null

    const { data, error } = await supabase
        .from('outfits')
        .select(`
      *,
      character:characters(id, name, series:series(id, name)),
      outfit_products(
        product:products(*)
      )
    `)
        .eq('character_id', character.id)
        .eq('status', 'publik')
        .eq('slug', outfitSlug)  // ← fix
        .single()

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
      character:characters(id, name, photo_url, series:series(id, name, type)),
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

// ─── Products with Outfits (for admin) ─────────────────────
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

    // Transform to include outfits array
    const products = (data ?? []).map((product: any) => ({
        ...product,
        outfits: product.outfit_products?.map((op: any) => op.outfit) ?? []
    }))

    return products
}

// Link product to multiple outfits
export async function linkProductToOutfits(productId: string, outfitIds: string[]) {
    // Get existing links
    const { data: existing } = await supabase
        .from('outfit_products')
        .select('outfit_id')
        .eq('product_id', productId)

    const existingIds = existing?.map((e: any) => e.outfit_id) ?? []

    // Remove links that are no longer needed
    const toRemove = existingIds.filter((id: string) => !outfitIds.includes(id))
    if (toRemove.length > 0) {
        await supabase
            .from('outfit_products')
            .delete()
            .eq('product_id', productId)
            .in('outfit_id', toRemove)
    }

    // Add new links
    // Add new links
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