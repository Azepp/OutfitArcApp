import { supabase } from '@/lib/supabase';
import type { Character as CharacterType, Outfit as OutfitType, Series as SeriesType } from '@/types';

// ─── User ──────────────────────────────────────────────────

export async function getAllCharacters(): Promise<(CharacterType & { series: { id: string; name: string } | null })[]> {
    const { data, error } = await supabase
        .from('characters')
        .select('*, series:series(id, name, slug)')
        .order('name')

    if (error) throw error
    return (data ?? []) as unknown as (CharacterType & { series: { id: string; name: string; slug: string } | null })[]
}

export async function getCharacterWithOutfits(
    seriesSlug: string,
    characterSlug: string
): Promise<(CharacterType & { outfits: OutfitType[]; series: SeriesType | null }) | null> {

    const { data: series } = await supabase
        .from('series')
        .select('id')
        .eq('slug', seriesSlug)
        .maybeSingle()

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

    const transformed = data as any
    transformed.outfits = transformed.outfits?.map((outfit: any) => ({
        ...outfit,
        products: outfit.outfit_products?.map((op: any) => op.product) ?? []
    }))

    return transformed as unknown as CharacterType & { outfits: OutfitType[]; series: SeriesType | null }
}

// ─── Admin ─────────────────────────────────────────────────

export async function getAdminCharacters(): Promise<(CharacterType & { series: { id: string; name: string } | null })[]> {
    const { data } = await supabase
        .from('characters')
        .select('*, series:series(id, name)')
        .order('created_at', { ascending: false })

    return (data ?? []) as unknown as (CharacterType & { series: { id: string; name: string } | null })[]
}

export async function getSeriesOptions(): Promise<{ id: string; name: string }[]> {
    const { data } = await supabase
        .from('series')
        .select('id, name')
        .order('name')

    return (data ?? []) as unknown as { id: string; name: string }[]
}

export async function createCharacter(payload: any) {
    const { error } = await supabase.from('characters').insert(payload as any)
    if (error) throw error
}

export async function updateCharacter(id: string, payload: any) {
    const { error } = await supabase.from('characters').update(payload as any).eq('id' as const, id)
    if (error) throw error
}

export async function deleteCharacter(id: string) {
    const { error } = await supabase.from('characters').delete().eq('id' as const, id)
    if (error) throw error
}
