export type SeriesType = 'anime' | 'manhwa' | 'figur' | 'film' | 'series'
export type GenderTag = 'all' | 'feminin' | 'maskulin'
export type ProductLabel = 'budget' | 'premium'
export type ProductCategory = 'outerwear' | 'atasan' | 'bawahan' | 'aksesoris' | 'sepatu' | 'tas'
export type Platform = 'tokopedia' | 'shopee' | 'tiktok'

export interface Series {
    id: string
    name: string
    type: SeriesType
    cover_url: string | null
    description: string | null
    status: 'draft' | 'publik'
    created_at: string
    slug: string
    characters?: Character[]
    _count?: { outfits: number; characters: number }
}

export interface Character {
    id: string
    series_id: string
    name: string
    photo_url: string | null
    description: string | null
    created_at: string
    series?: Series
    slug: string
    outfits?: Outfit[]
    _count?: { outfits: number }
}

export interface Outfit {
    id: string
    character_id: string
    name: string
    mood: string | null
    gender_tag: GenderTag
    reference_moment: string | null
    status: 'draft' | 'publik'
    created_at: string
    character?: Character
    slug: string
    outfit_url?: string | null
    products?: Product[]
    _count?: { products: number }
}

export interface Product {
    id: string
    name: string
    category: ProductCategory
    price: number | null
    label: ProductLabel | null
    is_anchor: boolean
    photo_url: string | null
    link_tokopedia: string | null
    link_shopee: string | null
    link_tiktok: string | null
    created_at: string
    outfits?: Outfit[]
    // Legacy: keeping outfit_id for backward compatibility during migration
    outfit_id?: string
}

export interface ClickLog {
    id: string
    product_id: string
    platform: Platform
    clicked_at: string
}