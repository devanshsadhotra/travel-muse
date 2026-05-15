import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, darkColors, lightColors } from "../constants/theme";

type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  colors: Colors;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  preference: "system",
  setPreference: () => {},
  toggle: () => {},
});

const STORAGE_KEY = "@theme_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreferenceState(stored);
      }
    });
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const isDark = preference === "system" ? systemScheme === "dark" : preference === "dark";
  const colors = isDark ? darkColors : lightColors;

  const toggle = useCallback(() => {
    setPreference(isDark ? "light" : "dark");
  }, [isDark, setPreference]);

  return (
    <ThemeContext.Provider value={{ colors, isDark, preference, setPreference, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
