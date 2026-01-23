/**
 * StreakHeatmap - GitHub-style activity heatmap for habit tracking
 */

import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HabitLog } from "@/types";

interface StreakHeatmapProps {
  logs: HabitLog[];
  weeks?: number;
}

const DAYS = ["", "M", "", "W", "", "F", ""];

export function StreakHeatmap({ logs, weeks = 16 }: StreakHeatmapProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  // Calculate date range - last N weeks ending today
  const today = new Date();
  const todayDayOfWeek = today.getDay();

  // Start from N weeks ago, on Sunday
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - todayDayOfWeek - (weeks - 1) * 7);
  startDate.setHours(0, 0, 0, 0);

  // Count logs per day
  const logsByDay: Record<string, number> = {};
  logs.forEach(log => {
    const date = new Date(log.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    logsByDay[key] = (logsByDay[key] || 0) + 1;
  });

  // Find max for scaling intensity
  const maxLogs = Math.max(1, ...Object.values(logsByDay));

  // Generate grid data
  const gridData: { date: Date; count: number; isToday: boolean; isFuture: boolean }[][] = [];

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const row: { date: Date; count: number; isToday: boolean; isFuture: boolean }[] = [];
    for (let week = 0; week < weeks; week++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + dayOfWeek);

      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const count = logsByDay[key] || 0;

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const isFuture = date > today;

      row.push({ date, count, isToday, isFuture });
    }
    gridData.push(row);
  }

  // Get color intensity based on count
  const getColor = (count: number, isFuture: boolean) => {
    if (isFuture) return "transparent";
    if (count === 0) return colorScheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

    const intensity = Math.min(count / maxLogs, 1);
    if (intensity < 0.25) return colors.tint + "40";
    if (intensity < 0.5) return colors.tint + "70";
    if (intensity < 0.75) return colors.tint + "A0";
    return colors.tint;
  };

  // Calculate total activity stats
  const totalDays = Object.keys(logsByDay).length;

  // Get month labels for header
  const months: { label: string; week: number }[] = [];
  let lastMonth = -1;
  for (let week = 0; week < weeks; week++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + week * 7);
    const month = date.getMonth();
    if (month !== lastMonth) {
      months.push({
        label: date.toLocaleDateString("en-US", { month: "short" }),
        week,
      });
      lastMonth = month;
    }
  }

  return (
    <GlassCard variant="elevated" style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText style={[styles.title, { color: colors.text }]}>Activity</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
            Last {weeks} weeks
          </ThemedText>
        </View>
        <View style={styles.activeDays}>
          <ThemedText style={[styles.activeDaysValue, { color: colors.tint }]}>
            {totalDays}
          </ThemedText>
          <ThemedText style={[styles.activeDaysLabel, { color: colors.muted }]}>
            Active Days
          </ThemedText>
        </View>
      </View>

      {/* Month labels */}
      <View style={styles.monthRow}>
        <View style={styles.dayLabelsSpace} />
        <View style={styles.monthLabels}>
          {months.map((m, i) => (
            <ThemedText
              key={i}
              style={[styles.monthLabel, { color: colors.muted, left: m.week * 13 }]}
            >
              {m.label}
            </ThemedText>
          ))}
        </View>
      </View>

      {/* Heatmap grid */}
      <View style={styles.gridContainer}>
        {/* Day labels */}
        <View style={styles.dayLabels}>
          {DAYS.map((day, i) => (
            <View key={i} style={styles.dayLabelContainer}>
              <ThemedText style={[styles.dayLabel, { color: colors.muted }]}>{day}</ThemedText>
            </View>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {gridData.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <View
                  key={colIndex}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: getColor(cell.count, cell.isFuture),
                    },
                    cell.isToday && styles.todayCell,
                    cell.isToday && { borderColor: colors.tint },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <ThemedText style={[styles.legendLabel, { color: colors.muted }]}>Less</ThemedText>
        <View
          style={[
            styles.legendCell,
            {
              backgroundColor:
                colorScheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            },
          ]}
        />
        <View style={[styles.legendCell, { backgroundColor: colors.tint + "40" }]} />
        <View style={[styles.legendCell, { backgroundColor: colors.tint + "70" }]} />
        <View style={[styles.legendCell, { backgroundColor: colors.tint + "A0" }]} />
        <View style={[styles.legendCell, { backgroundColor: colors.tint }]} />
        <ThemedText style={[styles.legendLabel, { color: colors.muted }]}>More</ThemedText>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: GlassStyles.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: GlassStyles.spacing.md,
  },
  title: {
    ...Typography.headline,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption1,
  },
  activeDays: {
    alignItems: "flex-end",
  },
  activeDaysValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  activeDaysLabel: {
    ...Typography.caption2,
  },
  monthRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  dayLabelsSpace: {
    width: 18,
  },
  monthLabels: {
    flex: 1,
    height: 14,
    position: "relative",
  },
  monthLabel: {
    ...Typography.caption2,
    position: "absolute",
    fontSize: 10,
  },
  gridContainer: {
    flexDirection: "row",
  },
  dayLabels: {
    width: 18,
  },
  dayLabelContainer: {
    height: 11,
    marginBottom: 2,
    justifyContent: "center",
  },
  dayLabel: {
    fontSize: 9,
    lineHeight: 10,
  },
  grid: {},
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  cell: {
    width: 11,
    height: 11,
    borderRadius: 2,
    marginRight: 2,
  },
  todayCell: {
    borderWidth: 1.5,
    borderRadius: 3,
    transform: [{ scale: 1.1 }],
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: GlassStyles.spacing.md,
    gap: 4,
  },
  legendLabel: {
    ...Typography.caption2,
    fontSize: 10,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
