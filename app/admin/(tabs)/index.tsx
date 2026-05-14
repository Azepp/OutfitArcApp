import { useColors } from "@/hooks/useColors";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMMKV } from "react-native-mmkv";

export default function AdminDashboard() {
  const storage = useMMKV();
  const router = useRouter();
  const c = useColors();

  const handleLogout = () => {
    storage.set("isAdmin", false);
    router.replace("/admin/login" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.textPrimary }]}>Dashboard</Text>
      <Pressable onPress={handleLogout} style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "700" },
  logout: { marginTop: 24 },
  logoutText: { color: "#ef4444", fontSize: 14 },
});
