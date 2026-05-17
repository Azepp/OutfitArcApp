import { OutfitForm } from "@/components/admin/form/outfitForm";
import { useLocalSearchParams } from "expo-router";
export default function EditOutfitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <OutfitForm mode="edit" id={id} />;
}
