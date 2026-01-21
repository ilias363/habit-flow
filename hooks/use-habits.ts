/**
 * Custom hook for managing habits with MMKV storage
 */

import {
  calculateStreak,
  createHabit as createHabitStorage,
  createLog as createLogStorage,
  deleteHabit as deleteHabitStorage,
  deleteLog as deleteLogStorage,
  getHabits,
  getLogs,
  getLogsForHabit,
  isSameDay,
  updateHabit as updateHabitStorage,
} from "@/lib/storage";
import { Habit, HabitLog, HabitWithStats } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseHabitsReturn {
  habits: HabitWithStats[];
  loading: boolean;
  error: string | null;
  refreshHabits: () => void;
  createHabit: (habit: Omit<Habit, "id" | "createdAt" | "updatedAt">) => Habit;
  updateHabit: (id: string, updates: Partial<Omit<Habit, "id" | "createdAt">>) => Habit | null;
  deleteHabit: (id: string) => boolean;
  logHabit: (habitId: string, note?: string, customTimestamp?: number) => HabitLog;
}

export function useHabits(): UseHabitsReturn {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const computeHabitStats = useCallback((habit: Habit, allLogs: HabitLog[]): HabitWithStats => {
    const habitLogs = allLogs.filter(l => l.habitId === habit.id);
    const today = Date.now();
    const todayLogs = habitLogs.filter(l => isSameDay(l.timestamp, today)).length;

    // Calculate weekly logs (last 7 days)
    const oneWeekAgo = today - 7 * 24 * 60 * 60 * 1000;
    const weeklyLogs = habitLogs.filter(l => l.timestamp >= oneWeekAgo).length;

    const sortedLogs = [...habitLogs].sort((a, b) => b.timestamp - a.timestamp);

    return {
      ...habit,
      totalLogs: habitLogs.length,
      todayLogs,
      weeklyLogs,
      currentStreak: calculateStreak(habitLogs),
      lastLogDate: sortedLogs.length > 0 ? sortedLogs[0].timestamp : null,
    };
  }, []);

  const refreshHabits = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const habitsData = getHabits();
      const logsData = getLogs();
      const habitsWithStats = habitsData.map(h => computeHabitStats(h, logsData));
      // Sort by most recently updated
      habitsWithStats.sort((a, b) => b.updatedAt - a.updatedAt);
      setHabits(habitsWithStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, [computeHabitStats]);

  useEffect(() => {
    refreshHabits();
  }, [refreshHabits]);

  const createHabit = (habit: Omit<Habit, "id" | "createdAt" | "updatedAt">): Habit => {
    const newHabit = createHabitStorage(habit);
    refreshHabits();
    return newHabit;
  };

  const updateHabit = (
    id: string,
    updates: Partial<Omit<Habit, "id" | "createdAt">>,
  ): Habit | null => {
    const updated = updateHabitStorage(id, updates);
    refreshHabits();
    return updated;
  };

  const deleteHabit = (id: string): boolean => {
    const result = deleteHabitStorage(id);
    refreshHabits();
    return result;
  };

  const logHabit = (habitId: string, note?: string, customTimestamp?: number): HabitLog => {
    const newLog = createLogStorage(habitId, note, customTimestamp);
    refreshHabits();
    return newLog;
  };

  return {
    habits,
    loading,
    error,
    refreshHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    logHabit,
  };
}

interface UseHabitLogsReturn {
  logs: HabitLog[];
  loading: boolean;
  error: string | null;
  refreshLogs: () => void;
  deleteLog: (logId: string) => boolean;
}

export function useHabitLogs(habitId: string): UseHabitLogsReturn {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshLogs = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const logsData = getLogsForHabit(habitId);
      setLogs(logsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [habitId]);

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  const deleteLog = (logId: string): boolean => {
    const result = deleteLogStorage(logId);
    refreshLogs();
    return result;
  };

  return {
    logs,
    loading,
    error,
    refreshLogs,
    deleteLog,
  };
}
