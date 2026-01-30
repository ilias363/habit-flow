/**
 * Theme Context - Manages app-wide theme preference
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { getThemePreference, saveThemePreference } from "@/lib/storage";
import { ThemePreference } from "@/types";

interface ThemeContextValue {
  theme: ThemePreference;
  colorScheme: "light" | "dark";
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme() ?? "light";
  const [theme, setThemeState] = useState<ThemePreference>("system");

  useEffect(() => {
    // Load saved theme preference on mount
    const savedTheme = getThemePreference();
    setThemeState(savedTheme);
  }, []);

  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme);
    saveThemePreference(newTheme);
  };

  const colorScheme: "light" | "dark" = theme === "system" ? systemColorScheme : theme;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function useColorScheme(): "light" | "dark" {
  const systemColorScheme = useSystemColorScheme() ?? "light";
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Fallback to system color scheme if not wrapped in provider
    return systemColorScheme;
  }
  return context.colorScheme;
}
