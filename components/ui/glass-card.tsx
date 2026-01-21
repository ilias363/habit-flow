/**
 * GlassCard - Frosted glass surface component for Glassmorphism design
 */

import { BlurView } from "expo-blur";
import { View, ViewProps, ViewStyle } from "react-native";

import { Colors, GlassStyles } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface GlassCardProps extends ViewProps {
  variant?: "default" | "elevated";
  noPadding?: boolean;
  children?: React.ReactNode;
}

export function GlassCard({
  variant = "default",
  noPadding = false,
  style,
  children,
  ...props
}: GlassCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const blurIntensity = variant === "elevated" ? GlassStyles.blur.heavy : GlassStyles.blur.medium;

  const containerStyle: ViewStyle = {
    borderRadius: GlassStyles.borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  };

  const contentStyle: ViewStyle = {
    padding: noPadding ? 0 : GlassStyles.spacing.md,
  };

  return (
    <BlurView
      intensity={blurIntensity}
      tint={colorScheme === "dark" ? "dark" : "light"}
      style={[containerStyle, style]}
      {...props}
    >
      <View style={contentStyle}>{children}</View>
    </BlurView>
  );
}
