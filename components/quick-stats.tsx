/**
 * QuickStats - Glassmorphism statistics row
 */

import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface StatItem {
  value: number | string;
  label: string;
  color?: string;
}

interface QuickStatsProps {
  stats: StatItem[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <GlassCard variant="elevated" style={styles.container}>
      {stats.map((stat, i) => (
        <View key={i} style={styles.statWrapper}>
          <View style={styles.stat}>
            <ThemedText style={[styles.value, { color: stat.color || colors.tint }]}>
              {stat.value}
            </ThemedText>
            <ThemedText style={[styles.label, { color: colors.muted }]}>{stat.label}</ThemedText>
          </View>
          {i < stats.length - 1 && (
            <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />
          )}
        </View>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: GlassStyles.spacing.md,
  },
  statWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flex: 1,
    alignItems: "center",
    paddingVertical: GlassStyles.spacing.xs,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
  },
  label: {
    ...Typography.caption1,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 36,
  },
});
