/**
 * Stats Screen - Insights dashboard with glassmorphism design
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

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
import { formatRelativeTime, getLogs } from "@/lib";
import { HabitLog, HabitWithStats } from "@/types";

export default function StatsScreen() {
  const router = useRouter();
  const { habits, refreshHabits } = useHabits();
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);

  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  useFocusEffect(
    useCallback(() => {
      refreshHabits();
      setAllLogs(getLogs());
    }, [refreshHabits]),
  );

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
        {/* Activity Heatmap */}
        <StreakHeatmap logs={allLogs} />

        {/* Charts */}
        <WeekdayChart logs={allLogs} />
        <HourlyChart logs={allLogs} />

        {/* Recent Activity */}
        <RecentActivity logs={allLogs} habits={habits} />

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

function adjustColor(color: string, amount: number): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, val));
  const hex = color.replace("#", "");
  const r = clamp(parseInt(hex.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.slice(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
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
