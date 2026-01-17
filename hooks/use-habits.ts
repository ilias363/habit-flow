/**
 * Custom hook for managing habits with local storage
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
  refreshHabits: () => Promise<void>;
  createHabit: (habit: Omit<Habit, "id" | "createdAt" | "updatedAt">) => Promise<Habit>;
  updateHabit: (
    id: string,
    updates: Partial<Omit<Habit, "id" | "createdAt">>,
  ) => Promise<Habit | null>;
  deleteHabit: (id: string) => Promise<boolean>;
  logHabit: (habitId: string, note?: string, customTimestamp?: number) => Promise<HabitLog>;
}

export function useHabits(): UseHabitsReturn {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const computeHabitStats = useCallback(
    async (habit: Habit, allLogs: HabitLog[]): Promise<HabitWithStats> => {
      const habitLogs = allLogs.filter(l => l.habitId === habit.id);
      const today = Date.now();
      const todayLogs = habitLogs.filter(l => isSameDay(l.timestamp, today)).length;
      const sortedLogs = [...habitLogs].sort((a, b) => b.timestamp - a.timestamp);

      return {
        ...habit,
        totalLogs: habitLogs.length,
        todayLogs,
        currentStreak: calculateStreak(habitLogs),
        lastLogDate: sortedLogs.length > 0 ? sortedLogs[0].timestamp : null,
      };
    },
    [],
  );

  const refreshHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [habitsData, logsData] = await Promise.all([getHabits(), getLogs()]);
      const habitsWithStats = await Promise.all(
        habitsData.map(h => computeHabitStats(h, logsData)),
      );
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

  const createHabit = useCallback(
    async (habit: Omit<Habit, "id" | "createdAt" | "updatedAt">): Promise<Habit> => {
      const newHabit = await createHabitStorage(habit);
      await refreshHabits();
      return newHabit;
    },
    [refreshHabits],
  );

  const updateHabit = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Habit, "id" | "createdAt">>,
    ): Promise<Habit | null> => {
      const updated = await updateHabitStorage(id, updates);
      await refreshHabits();
      return updated;
    },
    [refreshHabits],
  );

  const deleteHabit = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await deleteHabitStorage(id);
      await refreshHabits();
      return result;
    },
    [refreshHabits],
  );

  const logHabit = useCallback(
    async (habitId: string, note?: string, customTimestamp?: number): Promise<HabitLog> => {
      const newLog = await createLogStorage(habitId, note, customTimestamp);
      await refreshHabits();
      return newLog;
    },
    [refreshHabits],
  );

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
  refreshLogs: () => Promise<void>;
  deleteLog: (logId: string) => Promise<boolean>;
}

export function useHabitLogs(habitId: string): UseHabitLogsReturn {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const logsData = await getLogsForHabit(habitId);
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

  const deleteLog = useCallback(
    async (logId: string): Promise<boolean> => {
      const result = await deleteLogStorage(logId);
      await refreshLogs();
      return result;
    },
    [refreshLogs],
  );

  return {
    logs,
    loading,
    error,
    refreshLogs,
    deleteLog,
  };
}
