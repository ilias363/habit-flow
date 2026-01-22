/**
 * DataStatsCard - Minimal data overview for settings
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface DataStatsCardProps {
  habitCount: number;
  logCount: number;
}

export function DataStatsCard({ habitCount, logCount }: DataStatsCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <GlassCard variant="default" noPadding style={styles.card}>
        <View style={styles.statContent}>
          <View style={[styles.iconCircle, { backgroundColor: colors.tint + "15" }]}>
            <MaterialIcons name="auto-awesome" size={16} color={colors.tint} />
          </View>
          <ThemedText style={[styles.value, { color: colors.text }]}>{habitCount}</ThemedText>
          <ThemedText style={[styles.label, { color: colors.muted }]}>
            {habitCount <= 1 ? "habit" : "habits"}
          </ThemedText>
        </View>
      </GlassCard>

      <GlassCard variant="default" noPadding style={styles.card}>
        <View style={styles.statContent}>
          <View style={[styles.iconCircle, { backgroundColor: colors.tintSecondary + "15" }]}>
            <MaterialIcons name="history" size={16} color={colors.tintSecondary} />
          </View>
          <ThemedText style={[styles.value, { color: colors.text }]}>{logCount}</ThemedText>
          <ThemedText style={[styles.label, { color: colors.muted }]}>
            {logCount <= 1 ? "entry" : "entries"}
          </ThemedText>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: GlassStyles.spacing.sm,
    marginBottom: GlassStyles.spacing.lg,
  },
  card: {
    flex: 1,
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: GlassStyles.spacing.md,
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    ...Typography.footnote,
  },
});
