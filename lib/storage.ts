/**
 * Storage layer for habit data persistence using MMKV (30x faster than AsyncStorage)
 */

import { Habit, HabitLog, ThemePreference } from "@/types";
import { createMMKV } from "react-native-mmkv";

// Initialize MMKV storage
const storage = createMMKV({ id: "habit-flow-storage" });

const HABITS_KEY = "habits";
const LOGS_KEY = "logs";
const THEME_KEY = "theme";

// ============ THEME ============

export function getThemePreference(): ThemePreference {
  try {
    const theme = storage.getString(THEME_KEY);
    if (theme === "light" || theme === "dark" || theme === "system") {
      return theme;
    }
    return "system";
  } catch {
    return "system";
  }
}

export function saveThemePreference(theme: ThemePreference): void {
  storage.set(THEME_KEY, theme);
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ HABITS ============

export function getHabits(): Habit[] {
  try {
    const data = storage.getString(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading habits:", error);
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  storage.set(HABITS_KEY, JSON.stringify(habits));
}

export function createHabit(habit: Omit<Habit, "id" | "createdAt" | "updatedAt">): Habit {
  const habits = getHabits();
  const now = Date.now();
  const newHabit: Habit = {
    ...habit,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  habits.push(newHabit);
  saveHabits(habits);
  return newHabit;
}

export function updateHabit(
  id: string,
  updates: Partial<Omit<Habit, "id" | "createdAt">>,
): Habit | null {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === id);
  if (index === -1) return null;

  habits[index] = {
    ...habits[index],
    ...updates,
    updatedAt: Date.now(),
  };
  saveHabits(habits);
  return habits[index];
}

export function deleteHabit(id: string): boolean {
  const habits = getHabits();
  const filtered = habits.filter(h => h.id !== id);
  if (filtered.length === habits.length) return false;

  saveHabits(filtered);
  // Also delete all logs for this habit
  const logs = getLogs();
  const filteredLogs = logs.filter(l => l.habitId !== id);
  saveLogs(filteredLogs);
  return true;
}

// ============ LOGS ============

export function getLogs(): HabitLog[] {
  try {
    const data = storage.getString(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading logs:", error);
    return [];
  }
}

export function saveLogs(logs: HabitLog[]): void {
  storage.set(LOGS_KEY, JSON.stringify(logs));
}

export function getLogsForHabit(habitId: string): HabitLog[] {
  const logs = getLogs();
  return logs.filter(l => l.habitId === habitId).sort((a, b) => b.timestamp - a.timestamp);
}

export function createLog(habitId: string, note?: string, customTimestamp?: number): HabitLog {
  const logs = getLogs();
  const newLog: HabitLog = {
    id: generateId(),
    habitId,
    timestamp: customTimestamp ?? Date.now(),
    note,
  };
  logs.push(newLog);
  saveLogs(logs);
  return newLog;
}

export function deleteLog(logId: string): boolean {
  const logs = getLogs();
  const filtered = logs.filter(l => l.id !== logId);
  if (filtered.length === logs.length) return false;

  saveLogs(filtered);
  return true;
}

// ============ UTILITIES ============

export function getStartOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  return getStartOfDay(timestamp1) === getStartOfDay(timestamp2);
}

export function calculateStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
  const today = getStartOfDay(Date.now());
  const yesterday = today - 24 * 60 * 60 * 1000;

  // Get unique days with logs
  const uniqueDays = new Set<number>();
  sortedLogs.forEach(log => {
    uniqueDays.add(getStartOfDay(log.timestamp));
  });

  const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a);

  // Check if streak is active (logged today or yesterday)
  if (sortedDays[0] < yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const diff = sortedDays[i - 1] - sortedDays[i];
    if (diff === 24 * 60 * 60 * 1000) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function clearAllData(): void {
  storage.clearAll();
}
