/**
 * WeekdayChart - Aggregated activity per day of week across all time
 */

import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { HabitLog } from "@/types";

interface WeekdayChartProps {
  logs: HabitLog[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekdayChart({ logs }: WeekdayChartProps) {
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");
  const tintColor = useThemeColor({}, "tint");

  const today = new Date().getDay();

  const counts = [0, 0, 0, 0, 0, 0, 0];
  logs.forEach(log => {
    const day = new Date(log.timestamp).getDay();
    counts[day]++;
  });
  const weekdayData = DAY_NAMES.map((name, i) => ({ name, count: counts[i], isToday: i === today }));

  const maxCount = Math.max(1, ...weekdayData.map(d => d.count));

  return (
    <View style={[styles.container, { backgroundColor: cardBackground, borderColor }]}>
      <ThemedText style={styles.title}>Activity by Day</ThemedText>
      <ThemedText style={[styles.subtitle, { color: mutedColor }]}>
        Aggregated across all time
      </ThemedText>
      <View style={styles.chart}>
        {weekdayData.map((day, i) => (
          <View key={i} style={styles.barWrapper}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(day.count / maxCount) * 100}%`,
                    backgroundColor: day.isToday ? tintColor : mutedColor,
                    minHeight: day.count > 0 ? 8 : 4,
                  },
                ]}
              />
            </View>
            <ThemedText
              style={[styles.label, day.isToday && { color: tintColor, fontWeight: "600" }]}
            >
              {day.name}
            </ThemedText>
            <ThemedText style={[styles.count, { color: mutedColor }]}>{day.count}</ThemedText>
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
  label: { fontSize: 11, marginBottom: 2 },
  count: { fontSize: 10 },
});
