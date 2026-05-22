import { supabase } from '@/lib/supabase'
import type { Character, DraftOutfit, DraftSeries, Series } from '@/types'

// ─── User ──────────────────────────────────────────────────

export async function getAllSeries(): Promise<Series[]> {
    const { data, error } = await supabase
        .from('series')
        .select(`*, characters(id, outfits(count))`)

    if (error) throw error
    return (data ?? []) as unknown as Series[]
}

export async function getSeriesBySlug(
    slug: string
): Promise<(Series & { characters: Character[] }) | null> {
    const { data } = await supabase
        .from('series')
        .select(`*, characters(id, name, photo_url, description, slug)`)
        .eq('status' as const, 'publik')
        .eq('slug' as const, slug)
        .single()

    return data as unknown as Series & { characters: Character[] }
}

// ─── Admin ─────────────────────────────────────────────────

export async function getAdminSeries(): Promise<Series[]> {
    const { data } = await supabase
        .from('series')
        .select('*')
        .order('created_at', { ascending: false })

    return (data ?? []) as Series[]
}

export async function createSeries(payload: {
    name: string
    type: string
    description: string | null
    status: 'publik' | 'draft'
    cover_url: string | null
}) {
    const { error } = await supabase.from('series').insert(payload as any)
    if (error) throw error
}

export async function updateSeries(
    id: string,
    payload: {
        name: string
        type: string
        description: string | null
        status: 'publik' | 'draft'
        cover_url: string | null
    }
) {
    const { error } = await supabase.from('series').update(payload as any).eq('id' as const, id)
    if (error) throw error
}

export async function toggleSeriesStatus(id: string, current: string) {
    const next = current === 'publik' ? 'draft' : 'publik'
    const { error } = await supabase
        .from('series')
        .update({ status: next } as any)
        .eq('id' as const, id)
    if (error) throw error
}

export async function deleteSeries(id: string) {
    const { error } = await supabase.from('series').delete().eq('id' as const, id)
    if (error) throw error
}


export async function getDrafts(): Promise<{ series: DraftSeries[]; outfits: DraftOutfit[] }> {
    const [series, outfits] = await Promise.all([supabase.from("series").select("id, name").eq("status" as const, "draft").limit(3), supabase.from("outfits").select("id, name, character:characters(name)").eq("status" as const, "draft").limit(3)]);
    return {
        series: (series.data ?? []) as unknown as DraftSeries[],
        outfits: (outfits.data ?? []) as unknown as DraftOutfit[],
    };
}