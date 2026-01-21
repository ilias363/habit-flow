/**
 * ScreenHeader - Consistent header component for all screens
 */

import { Image, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, rightElement, style }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const appIcon =
    colorScheme === "dark"
      ? require("@/assets/icons/app-icon-light.png")
      : require("@/assets/icons/app-icon-dark.png");

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }, style]}>
      <View style={styles.headerLeft}>
        <Image source={appIcon} style={styles.appLogo} />
        <View>
          <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: GlassStyles.spacing.lg,
    paddingBottom: GlassStyles.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  appLogo: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  title: {
    ...Typography.title2,
    fontWeight: "700",
  },
  subtitle: {
    ...Typography.caption1,
    marginTop: 2,
  },
});
