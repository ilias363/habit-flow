/**
 * GradientBackground - Full-screen gradient background for Glassmorphism design
 */

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, ViewProps } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface GradientBackgroundProps extends ViewProps {
  children?: React.ReactNode;
}

export function GradientBackground({ children, style, ...props }: GradientBackgroundProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, style]} {...props}>
      <LinearGradient
        colors={colors.gradientBackground}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Decorative orbs for depth */}
      <View style={[styles.orb, styles.orbPrimary, { backgroundColor: colors.tint + "15" }]} />
      <View
        style={[styles.orb, styles.orbSecondary, { backgroundColor: colors.tintSecondary + "12" }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  orb: {
    position: "absolute",
    borderRadius: 9999,
  },
  orbPrimary: {
    width: 300,
    height: 300,
    top: -50,
    right: -100,
  },
  orbSecondary: {
    width: 250,
    height: 250,
    bottom: 100,
    left: -80,
  },
});
