import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Typography } from "../ui/typography";

interface Props {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function ImageUpload({ onUpload, currentUrl }: Props) {
  const c = useColors();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Convert public URL to signed URL for mobile compatibility
    const processUrl = async () => {
      if (!currentUrl) {
        setPreview("");
        return;
      }

      // Jika URL sudah signed URL (memiliki token), gunakan langsung
      if (currentUrl.includes("token=")) {
        setPreview(currentUrl);
        return;
      }

      // Extract path dari public URL
      try {
        const urlObj = new URL(currentUrl);
        const pathParts = urlObj.pathname.split("/storage/v1/object/public/images/");
        if (pathParts.length === 2) {
          const filePath = pathParts[1];
          const { data: signedUrlData } = await supabase.storage.from("images").createSignedUrl(filePath, 60 * 60 * 24 * 365);

          if (signedUrlData?.signedUrl) {
            setPreview(signedUrlData.signedUrl);
            return;
          }
        }
      } catch (e) {
        // Jika parsing gagal, gunakan URL langsung
      }

      setPreview(currentUrl);
      setImageError(false);
    };

    processUrl();
  }, [currentUrl]);

  const handlePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Izin akses galeri diperlukan");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const context = ImageManipulator.ImageManipulator.manipulate(asset.uri);
      context.resize({ width: 800 });
      const manipulated = await context.renderAsync();
      const savedImage = await manipulated.saveAsync({
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      });

      const base64 = savedImage.base64!;
      const byteCharacters = atob(base64);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpeg`;

      const { data, error } = await supabase.storage.from("images").upload(filename, byteArray, { upsert: true, contentType: "image/jpeg" });

      if (error) {
        alert("Upload gagal: " + error.message);
        setImageError(true);
        return;
      }

      // Gunakan signed URL untuk mobile compatibility (Expo Go)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from("images").createSignedUrl(data.path, 60 * 60 * 24 * 365); // 1 tahun

      if (signedUrlError) {
        // Fallback ke public URL jika signed URL gagal
        const { data: urlData } = supabase.storage.from("images").getPublicUrl(data.path);
        setImageError(false);
        setPreview(urlData.publicUrl);
        onUpload(urlData.publicUrl);
        return;
      }

      const imageUrl = signedUrlData.signedUrl;
      setImageError(false);
      setPreview(imageUrl);
      onUpload(imageUrl);
    } catch (e) {
      alert("Terjadi kesalahan: " + e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePick}
      disabled={uploading}
      style={({ pressed }) => [
        styles.wrapper,
        {
          backgroundColor: c.backgroundSecondary,
          borderColor: c.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {uploading ? (
        <View style={styles.emptyBox}>
          <ActivityIndicator color={c.primary} />
          <Typography variant="label" color={c.textSecondary}>
            Mengupload...
          </Typography>
        </View>
      ) : preview && !imageError ? (
        <>
          <Image source={{ uri: preview }} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="disk" onError={() => setImageError(true)} />
          <View style={styles.overlay}>
            <Feather name="camera" size={20} color="#fff" />
            <Typography variant="label" color="#fff">
              Ganti foto
            </Typography>
          </View>
        </>
      ) : (
        <View style={styles.emptyBox}>
          <Feather name="image" size={28} color={c.textDisabled} />
          <Typography variant="label" color={c.textDisabled}>
            Upload foto
          </Typography>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBox: {
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
