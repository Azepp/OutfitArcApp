import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { storage } from "@/lib/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

const ADMIN_USERNAME = process.env.EXPO_PUBLIC_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD;

export default function AdminLogin() {
  const router = useRouter();
  const c = useColors();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const scaleAnim = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleLogin = async () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      await storage.setBoolean("isAdmin", true);
      router.replace("/admin" as any);
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: c.background }]} behavior="padding" keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
      <View style={[styles.inner, { backgroundColor: c.background }]}>
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
            <Typography variant="label" color={c.error}>
              {error}
            </Typography>
          ) : null}

          <Pressable onPress={handleLogin} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Animated.View style={[styles.button, { backgroundColor: c.primary, transform: [{ scale: scaleAnim }] }]}>
              <Typography variant="body" color="white" weight="semibold" className="text-center">
                Masuk
              </Typography>
            </Animated.View>
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
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
});
