import { supabase } from '@/lib/supabase'
import type { Character, Outfit, Series } from '@/types'

type OutfitWithRelations = Outfit & {
    character: Character & { series: Series | null }
    products?: { price: number | null }[]
}

// ─── User ──────────────────────────────────────────────────

export async function getRecentOutfits(limit: number = 10): Promise<(Outfit & { character: Character & { series: Series | null }; products: { price: number | null }[] })[]> {
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

export async function getAllOutfits(limit = 20, offset = 0): Promise<OutfitWithRelations[]> {
    const { data } = await supabase
        .from('outfits')
        .select(`
      *,
      character:characters(id, name, slug, series:series(id, name, slug)),
      outfit_products(product:products(price))
    `)
        .eq('status' as const, 'publik')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    return ((data ?? []).map((o: any) => ({
        ...o,
        products: o.outfit_products?.map((op: any) => op.product) ?? [],
    }))) as OutfitWithRelations[]
}

export async function getOutfitWithProducts(
    seriesSlug: string,
    characterSlug: string,
    outfitSlug: string
): Promise<OutfitWithRelations | null> {
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

    return outfit as unknown as OutfitWithRelations
}

// ─── Admin ─────────────────────────────────────────────────

export async function getAdminOutfits() {
    const { data } = await supabase
        .from('outfits')
        .select(`*, character:characters(name, series:series(name))`)
        .order('created_at', { ascending: false })

    return data ?? []
}

export async function createOutfit(payload: {
    name: string
    character_id: string
    mood: string | null
    gender_tag: string
    reference_moment: string | null
    status: 'publik' | 'draft'
    outfit_url: string | null
}) {
    const { error } = await supabase.from('outfits').insert(payload as any)
    if (error) throw error
}

export async function updateOutfit(id: string, payload: {
    name: string
    character_id: string
    mood: string | null
    gender_tag: string
    reference_moment: string | null
    status: 'publik' | 'draft'
    outfit_url: string | null
}) {
    const { error } = await supabase.from('outfits').update(payload as any).eq('id' as const, id)
    if (error) throw error
}

export async function toggleOutfitStatus(id: string, current: string) {
    const next = current === 'publik' ? 'draft' : 'publik'
    const { error } = await supabase
        .from('outfits')
        .update({ status: next } as any)
        .eq('id' as const, id)
    if (error) throw error
}

export async function deleteOutfit(id: string) {
    const { error } = await supabase.from('outfits').delete().eq('id' as const, id)
    if (error) throw error
}

export async function getTrendingOutfits(limit = 20) {
    // Ambil top product_id berdasarkan click_logs
    const { data: clicks } = await supabase
        .from("click_logs")
        .select("product_id")
        .limit(500)

    if (!clicks) return []

    // Hitung click count per product
    const countMap: Record<string, number> = {}
    for (const row of clicks) {
        if (!(row as any).product_id) continue
        countMap[(row as any).product_id] = (countMap[(row as any).product_id] ?? 0) + 1
    }

    // Ambil top product ids
    const topProductIds = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => id)

    if (topProductIds.length === 0) return []

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
        .in("product_id", topProductIds)

    if (!data) return []

    const outfitMap = new Map<string, any>()
    for (const row of data) {
        const outfit = (row as any).outfit as any
        if (!outfit) continue
        if (outfitMap.has(outfit.id)) continue

        const outfitProductIds = outfit.outfit_products
            ?.map((op: any) => op.product?.id)
            .filter(Boolean) ?? []

        const totalClicks = outfitProductIds.reduce(
            (sum: number, pid: string) => sum + (countMap[pid] ?? 0),
            0
        )
        outfitMap.set(outfit.id, {
            ...outfit,
            products: outfit.outfit_products?.map((op: any) => op.product) ?? [],
            totalClicks,
        })
    }

    return Array.from(outfitMap.values())
        .sort((a, b) => b.totalClicks - a.totalClicks)
}