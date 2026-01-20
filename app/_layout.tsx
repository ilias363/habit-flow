import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Custom dark theme with our colors
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      card: Colors.dark.card,
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
      card: Colors.light.card,
      border: Colors.light.cardBorder,
      text: Colors.light.text,
      primary: Colors.light.tint,
    },
  };

  // Background color for all screens
  const bgColor = colorScheme === "dark" ? Colors.dark.background : Colors.light.background;

  return (
    <ThemeProvider value={colorScheme === "dark" ? customDarkTheme : customLightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: bgColor },
          animation: "fade",
          animationDuration: 150,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="habit/new"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="habit/[id]"
          options={{
            presentation: "modal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="habit/edit/[id]"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
