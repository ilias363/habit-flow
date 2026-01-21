/**
 * Home Screen - Habit tracking with glassmorphism design
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { FloatingButton } from "@/components/floating-button";
import { HabitCard } from "@/components/habit-card";
import { ScreenHeader } from "@/components/screen-header";
import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHabits } from "@/hooks/use-habits";
import { getLogs } from "@/lib/storage";
import { HabitWithStats } from "@/types";

export default function HomeScreen() {
  const router = useRouter();
  const { habits, loading, refreshHabits, logHabit } = useHabits();
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  useFocusEffect(
    useCallback(() => {
      refreshHabits();
    }, [refreshHabits]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshHabits();
    setRefreshing(false);
  };

  const handleHabitPress = (habit: HabitWithStats) => {
    router.push(`/habit/${habit.id}`);
  };

  const handleLogHabit = async (habitId: string) => {
    await logHabit(habitId);
  };

  const handleAddHabit = () => {
    router.push("/habit/new");
  };

  // Compute weekly stats
  const getWeeklyStats = () => {
    const allLogs = getLogs();
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const weeklyLogs = allLogs.filter(log => log.timestamp >= oneWeekAgo);
    const todayLogs = habits.reduce((acc, h) => acc + h.todayLogs, 0);
    const totalAllTime = allLogs.length;
    const longestStreak = Math.max(0, ...habits.map(h => h.currentStreak));

    return {
      weeklyEntries: weeklyLogs.length,
      todayEntries: todayLogs,
      totalEntries: totalAllTime,
      bestStreak: longestStreak,
      activeHabits: habits.length,
    };
  };

  const stats = getWeeklyStats();

  const renderHeader = () => {
    if (habits.length === 0) return null;

    return (
      <View style={styles.headerContent}>
        {/* Stats Row - Horizontal scroll */}
        <View style={styles.statsRow}>
          {/* Weekly Entries */}
          <GlassCard variant="elevated" noPadding style={styles.statCard}>
            <View style={styles.statCardInner}>
              <View style={[styles.statIconCircle, { backgroundColor: colors.tint + "20" }]}>
                <MaterialIcons name="date-range" size={18} color={colors.tint} />
              </View>
              <ThemedText style={[styles.statValue, { color: colors.text }]}>
                {stats.weeklyEntries}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.muted }]}>This Week</ThemedText>
            </View>
          </GlassCard>

          {/* Today */}
          <GlassCard variant="default" noPadding style={styles.statCard}>
            <View style={styles.statCardInner}>
              <View style={[styles.statIconCircle, { backgroundColor: colors.success + "20" }]}>
                <MaterialIcons name="today" size={18} color={colors.success} />
              </View>
              <ThemedText style={[styles.statValue, { color: colors.text }]}>
                {stats.todayEntries}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.muted }]}>Today</ThemedText>
            </View>
          </GlassCard>

          {/* Streak */}
          <GlassCard variant="default" noPadding style={styles.statCard}>
            <View style={styles.statCardInner}>
              <View style={[styles.statIconCircle, { backgroundColor: colors.warning + "20" }]}>
                <ThemedText style={{ fontSize: 14 }}>🔥</ThemedText>
              </View>
              <ThemedText style={[styles.statValue, { color: colors.text }]}>
                {stats.bestStreak}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.muted }]}>Streak</ThemedText>
            </View>
          </GlassCard>

          {/* All Time */}
          <GlassCard variant="default" noPadding style={styles.statCard}>
            <View style={styles.statCardInner}>
              <View style={[styles.statIconCircle, { backgroundColor: colors.secondary + "20" }]}>
                <MaterialIcons name="history" size={18} color={colors.secondary} />
              </View>
              <ThemedText style={[styles.statValue, { color: colors.text }]}>
                {stats.totalEntries}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.muted }]}>All Time</ThemedText>
            </View>
          </GlassCard>
        </View>

        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Your Habits</ThemedText>
      </View>
    );
  };

  const renderHabit = ({ item }: { item: HabitWithStats }) => (
    <HabitCard
      habit={item}
      onPress={() => handleHabitPress(item)}
      onLog={() => handleLogHabit(item.id)}
    />
  );

  if (loading && habits.length === 0) {
    return (
      <GradientBackground style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="HabitFlow"
        subtitle={getGreeting()}
        rightElement={
          habits.length > 0 ? (
            <View style={[styles.habitCountBadge, { backgroundColor: colors.tint + "20" }]}>
              <ThemedText style={[styles.habitCountText, { color: colors.tint }]}>
                {habits.length}{" "}
                <ThemedText style={[styles.habitCountLabel, { color: colors.muted }]}>
                  habits
                </ThemedText>
              </ThemedText>
            </View>
          ) : undefined
        }
      />

      {habits.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="Start Your Journey"
          description="Create your first habit and begin tracking your progress"
        />
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.tint}
            />
          }
        />
      )}

      <FloatingButton onPress={handleAddHabit} />
    </GradientBackground>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  habitCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: GlassStyles.borderRadius.md,
  },
  habitCountText: {
    fontSize: 14,
    fontWeight: "600",
  },
  habitCountLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  headerContent: {
    paddingTop: GlassStyles.spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: GlassStyles.spacing.md,
    gap: GlassStyles.spacing.sm,
    marginBottom: GlassStyles.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: 70,
  },
  statCardInner: {
    alignItems: "center",
    gap: 4,
    paddingVertical: GlassStyles.spacing.sm,
    paddingHorizontal: GlassStyles.spacing.xs,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    ...Typography.caption2,
    textAlign: "center",
  },
  sectionTitle: {
    ...Typography.title3,
    paddingHorizontal: GlassStyles.spacing.lg,
    marginBottom: GlassStyles.spacing.sm,
  },
  list: {
    paddingBottom: 120,
  },
});
