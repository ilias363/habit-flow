/**
 * RecentActivity - Glassmorphism recent activity feed
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatRelativeTime } from "@/lib";
import { HabitLog, HabitWithStats } from "@/types";

interface RecentActivityProps {
  logs: HabitLog[];
  habits: HabitWithStats[];
  limit?: number;
  filterHabitId?: string | null;
}

export function RecentActivity({ logs, habits, limit = 6, filterHabitId }: RecentActivityProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const recentItems = [...logs]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .map(log => ({ ...log, habit: habits.find(h => h.id === log.habitId) }))
    .filter(item => item.habit);

  // Get title based on filter
  const title = filterHabitId
    ? (habits.find(h => h.id === filterHabitId)?.name ?? "Recent") + " Activity"
    : "Recent Activity";

  if (recentItems.length === 0) return null;

  return (
    <View style={styles.section}>
      <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
      <GlassCard variant="default" noPadding style={styles.list}>
        {recentItems.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.item,
              index < recentItems.length - 1 && {
                borderBottomColor: colors.glassBorder,
                borderBottomWidth: 1,
              },
            ]}
          >
            <View style={[styles.iconBg, { backgroundColor: item.habit!.color + "20" }]}>
              <MaterialIcons name={item.habit!.icon} size={18} color={item.habit!.color} />
            </View>
            <View style={styles.info}>
              <ThemedText style={[styles.name, { color: colors.text }]}>
                {item.habit!.name}
              </ThemedText>
              <ThemedText style={[styles.time, { color: colors.muted }]}>
                {formatRelativeTime(item.timestamp)}
              </ThemedText>
            </View>
            <View style={[styles.indicator, { backgroundColor: item.habit!.color }]} />
          </View>
        ))}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: GlassStyles.spacing.sm },
  title: {
    ...Typography.title3,
    marginBottom: GlassStyles.spacing.md,
    marginLeft: GlassStyles.spacing.xs,
  },
  list: {
    borderRadius: GlassStyles.borderRadius.lg,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: GlassStyles.spacing.md,
    gap: 12,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: { ...Typography.subhead },
  time: { ...Typography.caption1, marginTop: 2 },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
