// components/ui/ConfirmDeleteModal.tsx
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";

type Props = {
  visible: boolean;
  title?: string;
  itemName?: string;
  description?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDeleteModal({ visible, title = "Hapus Item?", itemName, description, loading = false, onConfirm, onCancel }: Props) {
  const c = useColors();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={[s.content, { backgroundColor: c.backgroundSecondary, borderColor: c.border }]}>
          <View style={s.header}>
            <Feather name="alert-triangle" size={24} color="#ef4444" />
            <Typography variant="h3" color={c.textPrimary} weight="bold">
              {title}
            </Typography>
          </View>

          <Typography variant="body" color={c.textSecondary} style={{ marginVertical: 12 }}>
            {description ?? (
              <>
                Apakah kamu yakin ingin menghapus{" "}
                <Typography weight="semibold" color={c.textPrimary}>
                  {itemName}
                </Typography>
                ? Tindakan ini tidak dapat dibatalkan.
              </>
            )}
          </Typography>

          <View style={s.actions}>
            <Pressable onPress={onCancel} style={[s.btn, { backgroundColor: c.background, borderColor: c.border, borderWidth: 1 }]}>
              <Typography variant="label" color={c.textPrimary} weight="semibold">
                Batal
              </Typography>
            </Pressable>

            <Pressable onPress={onConfirm} disabled={loading} style={[s.btn, { backgroundColor: "#ef4444", opacity: loading ? 0.6 : 1 }]}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Typography variant="label" color="#fff" weight="semibold">
                  Hapus
                </Typography>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
