import { useQuery } from "@tanstack/react-query";
import { getAllSeries, getSeriesBySlug } from "@/lib/supabase";
import { keys } from "@/lib/queryKeys";

export function useAllSeries() {
  return useQuery({
    queryKey: keys.series.all,
    queryFn: getAllSeries,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
}

export function useSeriesDetail(slug: string) {
  return useQuery({
    queryKey: keys.series.detail(slug),
    queryFn: () => getSeriesBySlug(slug),
    enabled: !!slug,
  });
}
