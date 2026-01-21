/**
 * WeekdayChart - Glassmorphism activity chart by day of week
 */

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HabitLog } from "@/types";

interface WeekdayChartProps {
  logs: HabitLog[];
}

const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];
const FULL_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekdayChart({ logs }: WeekdayChartProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const today = new Date().getDay();

  const counts = [0, 0, 0, 0, 0, 0, 0];
  logs.forEach(log => {
    const day = new Date(log.timestamp).getDay();
    counts[day]++;
  });
  const weekdayData = FULL_DAY_NAMES.map((name, i) => ({
    name: DAY_NAMES[i],
    fullName: name,
    count: counts[i],
    isToday: i === today,
  }));

  const maxCount = Math.max(1, ...weekdayData.map(d => d.count));

  return (
    <GlassCard variant="elevated" style={styles.container}>
      <ThemedText style={[styles.title, { color: colors.text }]}>Weekly Patterns</ThemedText>
      <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
        Your most active days
      </ThemedText>
      <View style={styles.chart}>
        {weekdayData.map((day, i) => (
          <View key={i} style={styles.barWrapper}>
            <View style={styles.barContainer}>
              {day.count > 0 ? (
                <LinearGradient
                  colors={
                    day.isToday
                      ? colors.gradientPrimary
                      : ([colors.muted + "60", colors.muted + "40"] as [string, string])
                  }
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={[
                    styles.bar,
                    {
                      height: `${(day.count / maxCount) * 100}%`,
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
                day.isToday && { backgroundColor: colors.tint + "20" },
              ]}
            >
              <ThemedText
                style={[
                  styles.label,
                  { color: day.isToday ? colors.tint : colors.muted },
                  day.isToday && styles.labelActive,
                ]}
              >
                {day.name}
              </ThemedText>
            </View>
            <ThemedText style={[styles.count, { color: colors.muted }]}>{day.count}</ThemedText>
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  label: { ...Typography.caption1 },
  labelActive: { fontWeight: "700" },
  count: { ...Typography.caption2 },
});
