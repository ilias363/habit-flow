/**
 * Glassmorphism Design System
 * Premium, modern visual language with frosted glass surfaces
 */

import { Platform } from "react-native";

// Primary accent colors with gradient potential
const accentPrimary = "#7C3AED"; // Vibrant purple
const accentSecondary = "#06B6D4"; // Cyan accent

export const Colors = {
  light: {
    // Base colors
    text: "#1A1A2E",
    textSecondary: "#64748B",
    background: "#F0F4FF",

    // Glass effects
    glass: "rgba(255, 255, 255, 0.82)",
    glassBorder: "rgba(255, 255, 255, 0.6)",
    glassLight: "rgba(255, 255, 255, 0.92)",

    // Accent colors
    primary: accentPrimary,
    secondary: accentSecondary,
    tint: accentPrimary,
    tintSecondary: accentSecondary,

    // UI colors
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: accentPrimary,

    // Card & Surface
    card: "rgba(255, 255, 255, 0.65)",
    cardBorder: "rgba(255, 255, 255, 0.6)",
    cardSolid: "#FFFFFF",
    surface: "rgba(255, 255, 255, 0.5)",

    // Status colors
    success: "#10B981",
    successLight: "rgba(16, 185, 129, 0.15)",
    danger: "#EF4444",
    dangerLight: "rgba(239, 68, 68, 0.15)",
    warning: "#F59E0B",
    warningLight: "rgba(245, 158, 11, 0.15)",

    // Semantic
    muted: "#94A3B8",

    // Gradients (as tuples for LinearGradient)
    gradientPrimary: ["#7C3AED", "#6366F1"] as [string, string],
    gradientSecondary: ["#06B6D4", "#3B82F6"] as [string, string],
    gradientSuccess: ["#10B981", "#34D399"] as [string, string],
    gradientBackground: ["#E0E7FF", "#F0F4FF", "#FAFBFF"] as [string, string, string],
  },
  dark: {
    // Base colors
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    background: "#0F0F1A",

    // Glass effects
    glass: "rgba(30, 30, 50, 0.78)",
    glassBorder: "rgba(255, 255, 255, 0.12)",
    glassLight: "rgba(40, 40, 65, 0.85)",

    // Accent colors
    primary: "#A78BFA",
    secondary: "#22D3EE",
    tint: "#A78BFA",
    tintSecondary: "#22D3EE",

    // UI colors
    icon: "#94A3B8",
    tabIconDefault: "#64748B",
    tabIconSelected: "#A78BFA",

    // Card & Surface
    card: "rgba(30, 30, 50, 0.6)",
    cardBorder: "rgba(255, 255, 255, 0.06)",
    cardSolid: "#1E1E32",
    surface: "rgba(25, 25, 45, 0.5)",

    // Status colors
    success: "#34D399",
    successLight: "rgba(52, 211, 153, 0.15)",
    danger: "#F87171",
    dangerLight: "rgba(248, 113, 113, 0.15)",
    warning: "#FBBF24",
    warningLight: "rgba(251, 191, 36, 0.15)",

    // Semantic
    muted: "#64748B",

    // Gradients
    gradientPrimary: ["#A78BFA", "#818CF8"] as [string, string],
    gradientSecondary: ["#22D3EE", "#60A5FA"] as [string, string],
    gradientSuccess: ["#34D399", "#6EE7B7"] as [string, string],
    gradientBackground: ["#0F0F1A", "#1A1A2E", "#0F0F1A"] as [string, string, string],
  },
};

// Glassmorphism styling constants
export const GlassStyles = {
  blur: {
    light: 20,
    medium: 40,
    heavy: 60,
  },
  borderRadius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Typography scale
export const Typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: "700" as const,
    lineHeight: 41,
    letterSpacing: 0.25,
  },
  title1: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 34,
    letterSpacing: 0.25,
  },
  title2: {
    fontSize: 22,
    fontWeight: "600" as const,
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  title3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 25,
  },
  headline: {
    fontSize: 17,
    fontWeight: "600" as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  callout: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 21,
  },
  subhead: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
  },
  caption1: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
  },
  caption2: {
    fontSize: 11,
    fontWeight: "400" as const,
    lineHeight: 13,
  },
};
