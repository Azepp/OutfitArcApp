// hooks/useOutfits.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getAllOutfits, getRecentOutfits, getOutfitWithProducts } from "@/lib/supabase";
import { keys } from "@/lib/queryKeys";

const LIMIT = 20;

// Untuk halaman outfit — infinite scroll
export function useAllOutfits() {
  return useInfiniteQuery({
    queryKey: keys.outfits.all,
    queryFn: ({ pageParam = 0 }) => getAllOutfits(LIMIT, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Kalau data yang balik kurang dari limit, berarti sudah habis
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length * LIMIT; // offset berikutnya
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Untuk home screen — recent saja
export function useRecentOutfits(limit = 10) {
  return useQuery({
    queryKey: keys.outfits.recent(limit),
    queryFn: () => getRecentOutfits(limit),
    staleTime: 1000 * 60 * 5,
  });
}

// Untuk detail outfit
export function useOutfitDetail(seriesSlug: string, charSlug: string, outfitSlug: string) {
  return useQuery({
    queryKey: keys.outfits.detail(seriesSlug, charSlug, outfitSlug),
    queryFn: () => getOutfitWithProducts(seriesSlug, charSlug, outfitSlug),
    enabled: !!seriesSlug && !!charSlug && !!outfitSlug,
  });
}
