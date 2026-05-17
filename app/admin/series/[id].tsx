import { SeriesForm } from "@/components/admin/form/seriesForm";
import { useLocalSearchParams } from "expo-router";

export default function EditSeriesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SeriesForm mode="edit" id={id} />;
}
