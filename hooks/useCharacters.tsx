import { useQuery } from "@tanstack/react-query";
import { keys } from "@/lib/queryKeys";
import { getAllCharacters, getCharacterWithOutfits } from "@/lib/supabase";

export function useAllCharacters() {
  return useQuery({
    queryKey: keys.characters.all,
    queryFn: getAllCharacters,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
}

export function useCharacterDetail(seriesSlug: string, charSlug: string) {
  return useQuery({
    queryKey: keys.characters.detail(seriesSlug, charSlug),
    queryFn: () => getCharacterWithOutfits(seriesSlug, charSlug),
    enabled: !!seriesSlug && !!charSlug,
  });
}