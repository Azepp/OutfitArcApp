import { useMMKV } from "react-native-mmkv";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Typography } from "@/components/ui/typography";

const ADMIN_USERNAME = process.env.EXPO_PUBLIC_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD;

export default function AdminLogin() {
  const router = useRouter();
  const storage = useMMKV();
  const c = useColors();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      storage.set("isAdmin", true);
      router.replace("/admin" as any);
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: c.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.inner}>
        <Typography variant="h2" color={c.textPrimary} style={{ marginBottom: 4, textAlign: "center" }}>
          Admin
        </Typography>
        <Typography variant="body" color={c.textSecondary} style={{ marginBottom: 32, textAlign: "center" }}>
          OutfitArc Dashboard
        </Typography>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            placeholder="Username"
            placeholderTextColor={c.textDisabled}
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setError("");
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[styles.input, { backgroundColor: c.backgroundSecondary, color: c.textPrimary, borderColor: c.border }]}
            placeholder="Password"
            placeholderTextColor={c.textDisabled}
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError("");
            }}
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? (
            <Typography variant="label" color="#ef4444">
              {error}
            </Typography>
          ) : null}

          <Pressable style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]} onPress={handleLogin}>
            <Typography variant="body" color="#fff" weight="semibold">
              Masuk
            </Typography>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", padding: 24 },
  form: { gap: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
});