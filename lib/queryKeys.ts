export const keys = {
    series: {
        all: ['series'] as const,
        detail: (slug: string) => ['series', slug] as const,
    },
    characters: {
        all: ['characters'] as const,
        detail: (seriesSlug: string, charSlug: string) =>
            ['characters', seriesSlug, charSlug] as const,
    },
    outfits: {
        all: ['outfits'] as const,
        paginated: (limit: number, offset: number) =>
            ['outfits', 'paginated', limit, offset] as const,
        recent: (limit: number) => ['outfits', 'recent', limit] as const,
        detail: (seriesSlug: string, charSlug: string, outfitSlug: string) =>
            ['outfits', seriesSlug, charSlug, outfitSlug] as const,
        trending: ["outfits", "trending"] as const,
    },
}