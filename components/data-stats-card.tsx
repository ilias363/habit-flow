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
    <GlassCard variant="elevated" style={styles.card}>
      <View style={styles.row}>
        <View style={styles.item}>
          <View style={[styles.iconCircle, { backgroundColor: colors.tint + "20" }]}>
            <MaterialIcons name="auto-awesome" size={18} color={colors.tint} />
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={[styles.value, { color: colors.text }]}>{habitCount}</ThemedText>
            <ThemedText style={[styles.label, { color: colors.muted }]}>Habits</ThemedText>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />
        <View style={styles.item}>
          <View style={[styles.iconCircle, { backgroundColor: colors.tintSecondary + "20" }]}>
            <MaterialIcons name="history" size={18} color={colors.tintSecondary} />
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={[styles.value, { color: colors.text }]}>{logCount}</ThemedText>
            <ThemedText style={[styles.label, { color: colors.muted }]}>Entries</ThemedText>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: GlassStyles.spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    gap: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
  },
  label: {
    ...Typography.caption1,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: GlassStyles.spacing.md,
  },
});
