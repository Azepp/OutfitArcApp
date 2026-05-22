import { supabase } from '@/lib/supabase'
import { IncompleteProduct, RecentProduct } from '@/types'

export async function getProductsWithOutfits() {
    const { data } = await supabase
        .from('products')
        .select(`
      *,
      outfit_products(
        outfit:outfits(id, name, character:characters(name, series:series(name)))
      )
    `)
        .order('created_at', { ascending: false })

    return (data ?? []).map((p: any) => ({
        ...p,
        outfits: p.outfit_products?.map((op: any) => op.outfit) ?? [],
    }))
}

export async function createProduct(payload: any) {
    const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function getRecentProducts(): Promise<RecentProduct[]> {
    const { data } = await supabase.from("products").select("id, name, created_at, outfit:outfits(name)").order("created_at", { ascending: false }).limit(5);
    return (data ?? []) as unknown as RecentProduct[];
}

export async function getIncompleteProducts(): Promise<IncompleteProduct[]> {
    const { data } = await supabase.from("products").select("id, name, link_tokopedia, link_shopee, link_tiktok").or("link_tokopedia.is.null,link_shopee.is.null").limit(5);
    return (data ?? []) as IncompleteProduct[];
}

export async function updateProduct(id: string, payload: any) {
    const { error } = await supabase.from('products').update(payload).eq('id' as const, id)
    if (error) throw error
}

export async function deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id' as const, id)
    if (error) throw error
}

export async function linkProductToOutfits(productId: string, outfitIds: string[]) {
    const { data: existing } = await supabase
        .from('outfit_products')
        .select('outfit_id')
        .eq('product_id' as const, productId)

    const existingIds = existing?.map((e: any) => e.outfit_id) ?? []
    const toRemove = existingIds.filter((id: string) => !outfitIds.includes(id))
    const toAdd = outfitIds.filter((id: string) => !existingIds.includes(id))

    if (toRemove.length > 0) {
        await supabase
            .from('outfit_products')
            .delete()
            .eq('product_id' as const, productId)
            .in('outfit_id', toRemove)
    }

    if (toAdd.length > 0) {
        const { error } = await supabase
            .from('outfit_products')
            .insert(toAdd.map((outfitId: string) => ({ product_id: productId, outfit_id: outfitId })) as any)
        if (error) throw error
    }
}