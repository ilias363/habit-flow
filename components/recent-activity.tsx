/**
 * RecentActivity - List of recent log entries
 */

import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { HabitLog, HabitWithStats } from "@/types";

interface RecentActivityProps {
  logs: HabitLog[];
  habits: HabitWithStats[];
  limit?: number;
}

export function RecentActivity({ logs, habits, limit = 8 }: RecentActivityProps) {
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");

  const recentItems = [...logs]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .map(log => ({ ...log, habit: habits.find(h => h.id === log.habitId) }))
    .filter(item => item.habit);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  if (recentItems.length === 0) return null;

  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.title}>
        Recent Activity
      </ThemedText>
      <View style={[styles.list, { backgroundColor: cardBackground, borderColor }]}>
        {recentItems.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.item,
              index < recentItems.length - 1 && {
                borderBottomColor: borderColor,
                borderBottomWidth: 1,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: item.habit!.color }]} />
            <View style={styles.info}>
              <ThemedText style={styles.name}>
                {item.habit!.emoji} {item.habit!.name}
              </ThemedText>
              <ThemedText style={[styles.time, { color: mutedColor }]}>
                {formatTime(item.timestamp)}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 8 },
  title: { marginBottom: 12 },
  list: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  item: { flexDirection: "row", alignItems: "center", padding: 12, gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  info: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 14 },
  time: { fontSize: 12 },
});
