import { supabase } from '@/lib/supabase';

export async function logProductClick(productId: string, platform: string) {
    await supabase.from('click_logs').insert({
        product_id: productId,
        platform,
        clicked_at: new Date().toISOString(),
    } as any)
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

export async function getClickStats() {
    const [total, week] = await Promise.all([
        supabase.from('click_logs').select('id', { count: 'exact', head: true }),
        supabase
            .from('click_logs')
            .select('id', { count: 'exact', head: true })
            .gte('clicked_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    ])

    return {
        total: total.count ?? 0,
        last7days: week.count ?? 0,
    }
}

export async function getTopProducts(limit = 10) {
    const { data } = await supabase
        .from('click_logs')
        .select('product_id, products(name, photo_url)')
        .order('clicked_at', { ascending: false })
        .limit(limit * 10)

    // Hitung per product
    const counts: Record<string, { name: string; photo_url: string | null; count: number }> = {}
    for (const log of data ?? []) {
        const id = (log as any).product_id ?? ''
        if (!counts[id]) {
            counts[id] = {
                name: ((log as any).products as any)?.name ?? '',
                photo_url: ((log as any).products as any)?.photo_url ?? null,
                count: 0,
            }
        }
        counts[id].count++
    }

    return Object.entries(counts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, limit)
        .map(([id, data]) => ({ id, ...data }))
}