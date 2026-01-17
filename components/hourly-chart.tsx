/**
 * HourlyChart - Aggregated activity per hour of day across all time
 */

import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { HabitLog } from "@/types";

interface HourlyChartProps {
  logs: HabitLog[];
}

export function HourlyChart({ logs }: HourlyChartProps) {
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");
  const tintColor = useThemeColor({}, "tint");

  const currentHour = new Date().getHours();

  // Group into 4-hour intervals: 0-3, 4-7, 8-11, 12-15, 16-19, 20-23
  const hourlyData = useMemo(() => {
    const intervals = [
      { label: "12-4am", start: 0, end: 4, count: 0 },
      { label: "4-8am", start: 4, end: 8, count: 0 },
      { label: "8-12pm", start: 8, end: 12, count: 0 },
      { label: "12-4pm", start: 12, end: 16, count: 0 },
      { label: "4-8pm", start: 16, end: 20, count: 0 },
      { label: "8-12am", start: 20, end: 24, count: 0 },
    ];

    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      const interval = intervals.find(i => hour >= i.start && hour < i.end);
      if (interval) interval.count++;
    });

    return intervals.map(i => ({
      ...i,
      isCurrent: currentHour >= i.start && currentHour < i.end,
    }));
  }, [logs, currentHour]);

  const maxCount = Math.max(1, ...hourlyData.map(d => d.count));

  return (
    <View style={[styles.container, { backgroundColor: cardBackground, borderColor }]}>
      <ThemedText style={styles.title}>Activity by Time</ThemedText>
      <ThemedText style={[styles.subtitle, { color: mutedColor }]}>
        When you log habits most
      </ThemedText>
      <View style={styles.chart}>
        {hourlyData.map((interval, i) => (
          <View key={i} style={styles.barWrapper}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(interval.count / maxCount) * 100}%`,
                    backgroundColor: interval.isCurrent ? tintColor : mutedColor,
                    minHeight: interval.count > 0 ? 8 : 4,
                  },
                ]}
              />
            </View>
            <ThemedText
              style={[styles.label, interval.isCurrent && { color: tintColor, fontWeight: "600" }]}
              numberOfLines={1}
            >
              {interval.label}
            </ThemedText>
            <ThemedText style={[styles.count, { color: mutedColor }]}>{interval.count}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  title: { fontSize: 17, fontWeight: "600", marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 16 },
  chart: { flexDirection: "row", justifyContent: "space-between", height: 100 },
  barWrapper: { flex: 1, alignItems: "center" },
  barContainer: { flex: 1, width: 20, justifyContent: "flex-end", marginBottom: 8 },
  bar: { width: "100%", borderRadius: 4, minHeight: 4 },
  label: { fontSize: 9, marginBottom: 2, textAlign: "center" },
  count: { fontSize: 10 },
});
