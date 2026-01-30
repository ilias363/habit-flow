/**
 * Stats Screen - Insights dashboard with glassmorphism design
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { HabitFilter } from "@/components/habit-filter";
import { HourlyChart } from "@/components/hourly-chart";
import { RecentActivity } from "@/components/recent-activity";
import { ScreenHeader } from "@/components/screen-header";
import { StreakHeatmap } from "@/components/streak-heatmap";
import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { WeekdayChart } from "@/components/weekday-chart";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHabits } from "@/hooks/use-habits";
import { useFilteredStats } from "@/hooks/use-filtered-stats";
import { adjustColor, formatRelativeTime, getLogs } from "@/lib";
import { HabitLog, HabitWithStats } from "@/types";

export default function StatsScreen() {
  const router = useRouter();
  const { habits, refreshHabits } = useHabits();
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);
  const [filterHabitId, setFilterHabitId] = useState<string | null>(null);

  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  useFocusEffect(
    useCallback(() => {
      refreshHabits();
      setAllLogs(getLogs());
    }, [refreshHabits]),
  );

  // Use cached stats for performance
  const { filteredLogs, heatmapData, weekdayData, hourlyData } = useFilteredStats(
    allLogs,
    filterHabitId,
  );

  // Get the selected filter habit for display
  const filterHabit = filterHabitId ? habits.find(h => h.id === filterHabitId) : null;

  const getHabitStats = (habit: HabitWithStats) => {
    const habitLogs = allLogs.filter(l => l.habitId === habit.id);
    const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyLogs = habitLogs.filter(l => l.timestamp >= weekStart).length;
    const oldestLogDate =
      habitLogs.length > 0 ? Math.min(...habitLogs.map(l => l.timestamp)) : Date.now();
    const daysSince = Math.max(1, Math.floor((Date.now() - oldestLogDate) / 86400000));
    const avgPerDay = (habit.totalLogs / daysSince).toFixed(1);
    return { weeklyLogs, avgPerDay, daysSince };
  };

  return (
    <GradientBackground style={styles.container}>
      <ScreenHeader title="Insights" subtitle="Your Progress" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Habit Filter */}
        {habits.length > 0 && (
          <HabitFilter
            habits={habits}
            selectedHabitId={filterHabitId}
            onSelect={setFilterHabitId}
          />
        )}

        {/* Activity Heatmap */}
        <StreakHeatmap
          logs={filteredLogs}
          cachedData={heatmapData}
          habitColor={filterHabit?.color}
        />

        {/* Charts */}
        <WeekdayChart
          logs={filteredLogs}
          cachedData={weekdayData}
          habitColor={filterHabit?.color}
        />
        <HourlyChart logs={filteredLogs} cachedData={hourlyData} habitColor={filterHabit?.color} />

        {/* Recent Activity */}
        <RecentActivity logs={filteredLogs} habits={habits} filterHabitId={filterHabitId} />

        {/* Habit Details */}
        {habits.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Habit Breakdown
            </ThemedText>
            {habits.map(habit => {
              const isSelected = selectedHabit?.id === habit.id;
              const stats = isSelected ? getHabitStats(habit) : null;
              return (
                <Pressable
                  key={habit.id}
                  onPress={() => setSelectedHabit(isSelected ? null : habit)}
                >
                  <GlassCard
                    key={`${habit.id}-${isSelected}`}
                    variant={isSelected ? "elevated" : "default"}
                    noPadding
                    style={[styles.habitCard, { borderLeftWidth: 3, borderLeftColor: habit.color }]}
                  >
                    <View style={styles.habitRow}>
                      <LinearGradient
                        colors={[habit.color + "30", habit.color + "15"]}
                        style={styles.habitIcon}
                      >
                        <MaterialIcons name={habit.icon} size={22} color={habit.color} />
                      </LinearGradient>
                      <View style={styles.habitInfo}>
                        <ThemedText style={[styles.habitName, { color: colors.text }]}>
                          {habit.name}
                        </ThemedText>
                        <ThemedText style={[styles.habitStats, { color: colors.muted }]}>
                          {habit.totalLogs} logs
                          {habit.currentStreak > 0 && ` • ${habit.currentStreak}🔥`}
                        </ThemedText>
                      </View>
                      <MaterialIcons
                        name={isSelected ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color={colors.muted}
                      />
                    </View>
                    {isSelected && stats && (
                      <View style={[styles.expanded, { borderTopColor: colors.glassBorder }]}>
                        <View style={styles.statsRow}>
                          <View style={styles.statBox}>
                            <ThemedText style={[styles.statValue, { color: colors.tint }]}>
                              {stats.weeklyLogs}
                            </ThemedText>
                            <ThemedText style={[styles.statLabel, { color: colors.muted }]}>
                              This Week
                            </ThemedText>
                          </View>
                          <View style={styles.statBox}>
                            <ThemedText style={[styles.statValue, { color: colors.text }]}>
                              {stats.avgPerDay}
                            </ThemedText>
                            <ThemedText style={[styles.statLabel, { color: colors.muted }]}>
                              Per Day
                            </ThemedText>
                          </View>
                          <View style={styles.statBox}>
                            <ThemedText style={[styles.statValue, { color: colors.text }]}>
                              {stats.daysSince}d
                            </ThemedText>
                            <ThemedText style={[styles.statLabel, { color: colors.muted }]}>
                              Tracking
                            </ThemedText>
                          </View>
                        </View>
                        {habit.lastLogDate && (
                          <ThemedText style={[styles.lastLog, { color: colors.muted }]}>
                            Last logged: {formatRelativeTime(habit.lastLogDate)}
                          </ThemedText>
                        )}
                        <Pressable
                          onPress={() => router.push(`/habit/${habit.id}`)}
                          style={styles.viewBtnWrapper}
                        >
                          <LinearGradient
                            colors={[habit.color, adjustColor(habit.color, -20)]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.viewBtn}
                          >
                            <ThemedText style={styles.viewBtnText}>View Details</ThemedText>
                          </LinearGradient>
                        </Pressable>
                      </View>
                    )}
                  </GlassCard>
                </Pressable>
              );
            })}
          </View>
        )}

        {habits.length === 0 && (
          <GlassCard variant="elevated" style={styles.emptyCard}>
            <ThemedText style={styles.emptyIcon}>📊</ThemedText>
            <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
              No insights yet
            </ThemedText>
            <ThemedText style={[styles.emptyText, { color: colors.muted }]}>
              Start tracking habits to see your progress
            </ThemedText>
          </GlassCard>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: GlassStyles.spacing.md,
    paddingTop: GlassStyles.spacing.sm,
    paddingBottom: 120,
  },
  section: { marginTop: GlassStyles.spacing.md },
  sectionTitle: {
    ...Typography.title3,
    marginBottom: GlassStyles.spacing.md,
    marginLeft: GlassStyles.spacing.xs,
  },
  habitCard: {
    marginBottom: GlassStyles.spacing.sm,
    borderRadius: GlassStyles.borderRadius.lg,
    overflow: "hidden",
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: GlassStyles.spacing.md,
    gap: 12,
  },
  habitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  habitInfo: { flex: 1, gap: 2 },
  habitName: { ...Typography.headline },
  habitStats: { ...Typography.footnote },
  expanded: {
    padding: GlassStyles.spacing.md,
    borderTopWidth: 1,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: GlassStyles.spacing.sm,
  },
  statBox: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { ...Typography.caption2, marginTop: 2 },
  lastLog: {
    ...Typography.footnote,
    textAlign: "center",
    marginBottom: GlassStyles.spacing.md,
  },
  viewBtnWrapper: {
    borderRadius: GlassStyles.borderRadius.md,
    overflow: "hidden",
  },
  viewBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  viewBtnText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  emptyCard: {
    alignItems: "center",
    paddingVertical: GlassStyles.spacing.xxl,
    marginTop: GlassStyles.spacing.xl,
  },
  emptyIcon: { fontSize: 48, lineHeight: 56, marginBottom: GlassStyles.spacing.md },
  emptyTitle: { ...Typography.title2, marginBottom: GlassStyles.spacing.sm },
  emptyText: { ...Typography.callout, textAlign: "center" },
});
