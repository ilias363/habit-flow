/**
 * EmptyState - Glassmorphism empty state with visual appeal
 */

import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = "✨" }: EmptyStateProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <GlassCard variant="elevated" style={styles.card}>
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>{icon}</ThemedText>
        </View>
        <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
        <ThemedText style={[styles.description, { color: colors.muted }]}>{description}</ThemedText>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: GlassStyles.spacing.xl,
  },
  card: {
    alignItems: "center",
    padding: GlassStyles.spacing.xl,
    maxWidth: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: GlassStyles.spacing.md,
  },
  icon: {
    fontSize: 40,
    lineHeight: 48,
  },
  title: {
    ...Typography.title2,
    textAlign: "center",
    marginBottom: GlassStyles.spacing.sm,
  },
  description: {
    ...Typography.callout,
    textAlign: "center",
    lineHeight: 22,
  },
});
