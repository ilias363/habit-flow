/**
 * Stats Screen - Shows overall habit statistics
 */

import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHabits } from "@/hooks/use-habits";
import { useThemeColor } from "@/hooks/use-theme-color";
import { HabitWithStats } from "@/types";

export default function StatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits, refreshHabits } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);

  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");
  const successColor = useThemeColor({}, "success");

  useFocusEffect(
    useCallback(() => {
      refreshHabits();
    }, [refreshHabits]),
  );

  // Global statistics
  const globalStats = useMemo(() => {
    const totalHabits = habits.length;
    const totalLogs = habits.reduce((acc, h) => acc + h.totalLogs, 0);
    const todayLogs = habits.reduce((acc, h) => acc + h.todayLogs, 0);
    const bestStreak = Math.max(0, ...habits.map(h => h.currentStreak));
    const activeStreaks = habits.filter(h => h.currentStreak > 0).length;
    const avgLogsPerHabit = totalHabits > 0 ? Math.round(totalLogs / totalHabits) : 0;

    // Calculate this week's logs (past 7 days)
    const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      totalHabits,
      totalLogs,
      todayLogs,
      bestStreak,
      activeStreaks,
      avgLogsPerHabit,
    };
  }, [habits]);

  // Get habit-specific statistics
  const getHabitDetailStats = (habit: HabitWithStats) => {
    const daysSinceCreated = Math.max(
      1,
      Math.floor((Date.now() - habit.createdAt) / (24 * 60 * 60 * 1000)),
    );
    const avgPerDay = (habit.totalLogs / daysSinceCreated).toFixed(1);
    const lastLogText = habit.lastLogDate ? formatRelativeTime(habit.lastLogDate) : "Never";

    return {
      daysSinceCreated,
      avgPerDay,
      lastLogText,
    };
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const globalStatCards = [
    { label: "Total Habits", value: globalStats.totalHabits, icon: "🎯" },
    { label: "Total Logs", value: globalStats.totalLogs, icon: "📊" },
    { label: "Logged Today", value: globalStats.todayLogs, icon: "✅" },
    { label: "Best Streak", value: globalStats.bestStreak, icon: "🔥" },
    { label: "Active Streaks", value: globalStats.activeStreaks, icon: "⚡" },
    { label: "Avg per Habit", value: globalStats.avgLogsPerHabit, icon: "📈" },
  ];

  const handleHabitPress = (habit: HabitWithStats) => {
    if (selectedHabit?.id === habit.id) {
      setSelectedHabit(null);
    } else {
      setSelectedHabit(habit);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <ThemedText type="title">Statistics</ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedColor }]}>
          Your habit tracking overview
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Global Stats Section */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Global Overview
        </ThemedText>
        <View style={styles.grid}>
          {globalStatCards.map(stat => (
            <View
              key={stat.label}
              style={[styles.card, { backgroundColor: cardBackground, borderColor }]}
            >
              <ThemedText style={styles.cardIcon}>{stat.icon}</ThemedText>
              <ThemedText style={styles.cardValue}>{stat.value}</ThemedText>
              <ThemedText style={[styles.cardLabel, { color: mutedColor }]}>
                {stat.label}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Per-Habit Stats Section */}
        {habits.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Habit Details
            </ThemedText>
            <ThemedText style={[styles.sectionHint, { color: mutedColor }]}>
              Tap a habit to see detailed stats
            </ThemedText>
            {habits.map(habit => {
              const isSelected = selectedHabit?.id === habit.id;
              const detailStats = isSelected ? getHabitDetailStats(habit) : null;

              return (
                <Pressable
                  key={habit.id}
                  onPress={() => handleHabitPress(habit)}
                  style={[
                    styles.habitCard,
                    { backgroundColor: cardBackground, borderColor },
                    isSelected && { borderColor: habit.color },
                  ]}
                >
                  {/* Habit Header Row */}
                  <View style={styles.habitRow}>
                    <View style={[styles.habitEmoji, { backgroundColor: habit.color + "20" }]}>
                      <ThemedText style={styles.emoji}>{habit.emoji}</ThemedText>
                    </View>
                    <View style={styles.habitInfo}>
                      <ThemedText style={styles.habitName}>{habit.name}</ThemedText>
                      <ThemedText style={[styles.habitStats, { color: mutedColor }]}>
                        {habit.totalLogs} total • {habit.currentStreak} 🔥 streak
                      </ThemedText>
                    </View>
                    <View style={[styles.habitBadge, { backgroundColor: habit.color }]}>
                      <ThemedText style={styles.habitBadgeText}>{habit.todayLogs}</ThemedText>
                    </View>
                  </View>

                  {/* Expanded Stats */}
                  {isSelected && detailStats && (
                    <View style={[styles.expandedStats, { borderTopColor: borderColor }]}>
                      <View style={styles.statRow}>
                        <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
                          Tracking for
                        </ThemedText>
                        <ThemedText style={styles.statValue}>
                          {detailStats.daysSinceCreated} days
                        </ThemedText>
                      </View>
                      <View style={styles.statRow}>
                        <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
                          Average per day
                        </ThemedText>
                        <ThemedText style={styles.statValue}>{detailStats.avgPerDay}</ThemedText>
                      </View>
                      <View style={styles.statRow}>
                        <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
                          Current streak
                        </ThemedText>
                        <ThemedText style={[styles.statValue, { color: successColor }]}>
                          {habit.currentStreak} days
                        </ThemedText>
                      </View>
                      <View style={styles.statRow}>
                        <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
                          Last logged
                        </ThemedText>
                        <ThemedText style={styles.statValue}>{detailStats.lastLogText}</ThemedText>
                      </View>
                      <View style={styles.statRow}>
                        <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
                          Today's logs
                        </ThemedText>
                        <ThemedText style={styles.statValue}>{habit.todayLogs}</ThemedText>
                      </View>

                      <Pressable
                        onPress={() => router.push(`/habit/${habit.id}` as any)}
                        style={[styles.viewDetailsButton, { backgroundColor: habit.color }]}
                      >
                        <ThemedText style={styles.viewDetailsText}>View History</ThemedText>
                      </Pressable>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 13,
    marginBottom: 12,
    marginTop: -8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  cardIcon: {
    fontSize: 32,
    lineHeight: 40,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  cardLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    marginTop: 28,
  },
  habitCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  habitEmoji: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  habitInfo: {
    flex: 1,
    gap: 2,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
  },
  habitStats: {
    fontSize: 13,
  },
  habitBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  habitBadgeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  expandedStats: {
    padding: 14,
    paddingTop: 0,
    borderTopWidth: 1,
    marginTop: 0,
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  viewDetailsButton: {
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  viewDetailsText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
