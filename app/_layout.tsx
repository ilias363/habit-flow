import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider as AppThemeProvider } from "@/hooks/use-theme-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Custom glassmorphism theme
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      card: Colors.dark.cardSolid,
      border: Colors.dark.cardBorder,
      text: Colors.dark.text,
      primary: Colors.dark.tint,
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      card: Colors.light.cardSolid,
      border: Colors.light.cardBorder,
      text: Colors.light.text,
      primary: Colors.light.tint,
    },
  };

  // Background color for all screens
  const bgColor = isDark ? Colors.dark.background : Colors.light.background;

  return (
    <ThemeProvider value={isDark ? customDarkTheme : customLightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: bgColor },
          animation: "fade_from_bottom",
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="habit/new"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            animationDuration: 250,
          }}
        />
        <Stack.Screen
          name="habit/[id]"
          options={{
            presentation: "modal",
            animation: "slide_from_right",
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="habit/edit/[id]"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            animationDuration: 250,
          }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutContent />
    </AppThemeProvider>
  );
}
