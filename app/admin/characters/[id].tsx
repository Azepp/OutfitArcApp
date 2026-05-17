import { CharacterForm } from "@/components/admin/form/characterForm";
import { useLocalSearchParams } from "expo-router";

export default function EditCharacterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CharacterForm mode="edit" id={id} />;
}
