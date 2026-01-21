/**
 * HourlyChart - Glassmorphism activity chart by time of day
 */

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HabitLog } from "@/types";

interface HourlyChartProps {
  logs: HabitLog[];
}

export function HourlyChart({ logs }: HourlyChartProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const currentHour = new Date().getHours();

  // Group into 4-hour intervals
  const intervals = [
    { label: "12-4a", start: 0, end: 4, count: 0 },
    { label: "4-8a", start: 4, end: 8, count: 0 },
    { label: "8-12p", start: 8, end: 12, count: 0 },
    { label: "12-4p", start: 12, end: 16, count: 0 },
    { label: "4-8p", start: 16, end: 20, count: 0 },
    { label: "8-12a", start: 20, end: 24, count: 0 },
  ];

  logs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    const interval = intervals.find(i => hour >= i.start && hour < i.end);
    if (interval) interval.count++;
  });

  const hourlyData = intervals.map(i => ({
    ...i,
    isCurrent: currentHour >= i.start && currentHour < i.end,
  }));

  const maxCount = Math.max(1, ...hourlyData.map(d => d.count));

  return (
    <GlassCard variant="elevated" style={styles.container}>
      <ThemedText style={[styles.title, { color: colors.text }]}>Peak Activity</ThemedText>
      <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
        Your most active times
      </ThemedText>
      <View style={styles.chart}>
        {hourlyData.map((interval, i) => (
          <View key={i} style={styles.barWrapper}>
            <View style={styles.barContainer}>
              {interval.count > 0 ? (
                <LinearGradient
                  colors={
                    interval.isCurrent
                      ? colors.gradientPrimary
                      : ([colors.muted + "60", colors.muted + "40"] as [string, string])
                  }
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={[
                    styles.bar,
                    {
                      height: `${(interval.count / maxCount) * 100}%`,
                      minHeight: 8,
                    },
                  ]}
                />
              ) : (
                <View
                  style={[
                    styles.bar,
                    {
                      height: 4,
                      backgroundColor: colors.glassBorder,
                    },
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.labelContainer,
                interval.isCurrent && { backgroundColor: colors.tint + "20" },
              ]}
            >
              <ThemedText
                style={[
                  styles.label,
                  { color: interval.isCurrent ? colors.tint : colors.muted },
                  interval.isCurrent && styles.labelActive,
                ]}
                numberOfLines={1}
              >
                {interval.label}
              </ThemedText>
            </View>
            <ThemedText style={[styles.count, { color: colors.muted }]}>
              {interval.count}
            </ThemedText>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: GlassStyles.spacing.md },
  title: { ...Typography.headline, marginBottom: 4 },
  subtitle: { ...Typography.footnote, marginBottom: GlassStyles.spacing.md },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 120,
    alignItems: "flex-end",
  },
  barWrapper: { flex: 1, alignItems: "center" },
  barContainer: {
    flex: 1,
    width: 24,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  bar: { width: "100%", borderRadius: 6 },
  labelContainer: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  label: { ...Typography.caption2, textAlign: "center" },
  labelActive: { fontWeight: "700" },
  count: { ...Typography.caption2 },
});
