/**
 * Stats Screen - Shows comprehensive habit statistics
 */

import { useFocusEffect, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HourlyChart } from "@/components/hourly-chart";
import { QuickStats } from "@/components/quick-stats";
import { RecentActivity } from "@/components/recent-activity";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WeekdayChart } from "@/components/weekday-chart";
import { useHabits } from "@/hooks/use-habits";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getLogs } from "@/lib/storage";
import { HabitLog, HabitWithStats } from "@/types";

export default function StatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits, refreshHabits } = useHabits();
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);

  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");
  const tintColor = useThemeColor({}, "tint");

  useFocusEffect(() => {
    refreshHabits();
    getLogs().then(setAllLogs);
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayLogs = allLogs.filter(l => l.timestamp >= todayStart.getTime()).length;
  const bestStreak = Math.max(0, ...habits.map(h => h.currentStreak));
  const activeStreaks = habits.filter(h => h.currentStreak > 0).length;
  const globalStats = [
    { value: todayLogs, label: "Today" },
    { value: bestStreak, label: "Best Streak" },
    { value: activeStreaks, label: "Active" },
    { value: allLogs.length, label: "All Time" },
  ];

  const getHabitStats = (habit: HabitWithStats) => {
    const habitLogs = allLogs.filter(l => l.habitId === habit.id);
    const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyLogs = habitLogs.filter(l => l.timestamp >= weekStart).length;
    const daysSince = Math.max(1, Math.floor((Date.now() - habit.createdAt) / 86400000));
    const avgPerDay = (habit.totalLogs / daysSince).toFixed(1);
    return { weeklyLogs, avgPerDay, daysSince };
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <ThemedText type="title">Statistics</ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedColor }]}>
          Your habit insights
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuickStats stats={globalStats} />
        <WeekdayChart logs={allLogs} />
        <HourlyChart logs={allLogs} />
        <RecentActivity logs={allLogs} habits={habits} />

        {habits.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Habit Details
            </ThemedText>
            {habits.map(habit => {
              const isSelected = selectedHabit?.id === habit.id;
              const stats = isSelected ? getHabitStats(habit) : null;
              return (
                <Pressable
                  key={habit.id}
                  onPress={() => setSelectedHabit(isSelected ? null : habit)}
                  style={[
                    styles.habitCard,
                    { backgroundColor: cardBackground, borderColor },
                    isSelected && { borderColor: habit.color },
                  ]}
                >
                  <View style={styles.habitRow}>
                    <View style={[styles.habitEmoji, { backgroundColor: habit.color + "20" }]}>
                      <ThemedText style={styles.emoji}>{habit.emoji}</ThemedText>
                    </View>
                    <View style={styles.habitInfo}>
                      <ThemedText style={styles.habitName}>{habit.name}</ThemedText>
                      <ThemedText style={[styles.habitStats, { color: mutedColor }]}>
                        {habit.totalLogs} total • {habit.currentStreak}🔥
                      </ThemedText>
                    </View>
                    <View style={[styles.badge, { backgroundColor: habit.color }]}>
                      <ThemedText style={styles.badgeText}>{habit.todayLogs}</ThemedText>
                    </View>
                  </View>
                  {isSelected && stats && (
                    <View style={[styles.expanded, { borderTopColor: borderColor }]}>
                      <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                          <ThemedText style={[styles.statValue, { color: tintColor }]}>
                            {stats.weeklyLogs}
                          </ThemedText>
                          <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
                            This Week
                          </ThemedText>
                        </View>
                        <View style={styles.statBox}>
                          <ThemedText style={styles.statValue}>{stats.avgPerDay}</ThemedText>
                          <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
                            Per Day
                          </ThemedText>
                        </View>
                        <View style={styles.statBox}>
                          <ThemedText style={styles.statValue}>{stats.daysSince}d</ThemedText>
                          <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
                            Tracking
                          </ThemedText>
                        </View>
                      </View>
                      {habit.lastLogDate && (
                        <ThemedText style={[styles.lastLog, { color: mutedColor }]}>
                          Last: {formatTime(habit.lastLogDate)}
                        </ThemedText>
                      )}
                      <Pressable
                        onPress={() => router.push(`/habit/${habit.id}` as any)}
                        style={[styles.viewBtn, { backgroundColor: habit.color }]}
                      >
                        <ThemedText style={styles.viewBtnText}>View History</ThemedText>
                      </Pressable>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {habits.length === 0 && (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyIcon}>📊</ThemedText>
            <ThemedText style={styles.emptyTitle}>No data yet</ThemedText>
            <ThemedText style={[styles.emptyText, { color: mutedColor }]}>
              Start tracking to see stats
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  subtitle: { fontSize: 15, marginTop: 4 },
  content: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 32 },
  section: { marginTop: 8 },
  sectionTitle: { marginBottom: 12 },
  habitCard: { borderRadius: 14, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  habitRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  habitEmoji: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 24, lineHeight: 30 },
  habitInfo: { flex: 1, gap: 2 },
  habitName: { fontSize: 16, fontWeight: "600" },
  habitStats: { fontSize: 13 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  expanded: { padding: 14, borderTopWidth: 1 },
  statsRow: { flexDirection: "row", marginBottom: 10 },
  statBox: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 11, marginTop: 2 },
  lastLog: { fontSize: 12, textAlign: "center", marginBottom: 10 },
  viewBtn: { paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  viewBtnText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  emptyText: { fontSize: 14 },
});
