/**
 * Home Screen - Displays all habits with quick log functionality
 */

import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { FloatingButton } from "@/components/floating-button";
import { HabitCard } from "@/components/habit-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHabits } from "@/hooks/use-habits";
import { useThemeColor } from "@/hooks/use-theme-color";
import { HabitWithStats } from "@/types";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits, loading, refreshHabits, logHabit } = useHabits();
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  // Refresh habits when screen comes into focus
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

  const renderHabit = ({ item }: { item: HabitWithStats }) => (
    <HabitCard
      habit={item}
      onPress={() => handleHabitPress(item)}
      onLog={() => handleLogHabit(item.id)}
    />
  );

  const getTodayStats = () => {
    const totalToday = habits.reduce((acc, h) => acc + h.todayLogs, 0);
    return totalToday;
  };

  if (loading && habits.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <ThemedText type="title">Habits</ThemedText>
        {habits.length > 0 && (
          <ThemedText style={styles.todayStats}>{getTodayStats()} logged today</ThemedText>
        )}
      </View>

      {habits.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No habits yet"
          description="Start tracking your habits by tapping the + button below"
        />
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={tintColor}
            />
          }
        />
      )}

      <FloatingButton onPress={handleAddHabit} />
    </ThemedView>
  );
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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  todayStats: {
    fontSize: 15,
    opacity: 0.7,
    marginTop: 4,
  },
  list: {
    paddingBottom: 100,
  },
});
