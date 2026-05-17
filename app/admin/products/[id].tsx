import { ProductForm } from "@/components/admin/form/productForm";
import { useLocalSearchParams } from "expo-router";
export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductForm mode="edit" id={id} />;
}
