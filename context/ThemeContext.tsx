import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [isDark, setIsDark] = useState(system === "dark");

  // Load saved preference
  useEffect(() => {
    AsyncStorage.getItem("isDark").then((val) => {
      if (val !== null) {
        // Kalau pernah disimpan, pakai yang tersimpan
        setIsDark(val === "true");
      }
      // Kalau belum pernah disimpan, tetap pakai system default
    });
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem("isDark", String(next));
      return next;
    });
  };

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
