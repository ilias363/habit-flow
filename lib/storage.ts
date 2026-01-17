/**
 * Storage layer for habit data persistence using AsyncStorage
 */

import { Habit, HabitLog } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HABITS_KEY = "@habit_flow:habits";
const LOGS_KEY = "@habit_flow:logs";

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ HABITS ============

export async function getHabits(): Promise<Habit[]> {
  try {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading habits:", error);
    return [];
  }
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Error saving habits:", error);
    throw error;
  }
}

export async function createHabit(
  habit: Omit<Habit, "id" | "createdAt" | "updatedAt">,
): Promise<Habit> {
  const habits = await getHabits();
  const now = Date.now();
  const newHabit: Habit = {
    ...habit,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  habits.push(newHabit);
  await saveHabits(habits);
  return newHabit;
}

export async function updateHabit(
  id: string,
  updates: Partial<Omit<Habit, "id" | "createdAt">>,
): Promise<Habit | null> {
  const habits = await getHabits();
  const index = habits.findIndex(h => h.id === id);
  if (index === -1) return null;

  habits[index] = {
    ...habits[index],
    ...updates,
    updatedAt: Date.now(),
  };
  await saveHabits(habits);
  return habits[index];
}

export async function deleteHabit(id: string): Promise<boolean> {
  const habits = await getHabits();
  const filtered = habits.filter(h => h.id !== id);
  if (filtered.length === habits.length) return false;

  await saveHabits(filtered);
  // Also delete all logs for this habit
  const logs = await getLogs();
  const filteredLogs = logs.filter(l => l.habitId !== id);
  await saveLogs(filteredLogs);
  return true;
}

// ============ LOGS ============

export async function getLogs(): Promise<HabitLog[]> {
  try {
    const data = await AsyncStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading logs:", error);
    return [];
  }
}

export async function saveLogs(logs: HabitLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving logs:", error);
    throw error;
  }
}

export async function getLogsForHabit(habitId: string): Promise<HabitLog[]> {
  const logs = await getLogs();
  return logs.filter(l => l.habitId === habitId).sort((a, b) => b.timestamp - a.timestamp); // Most recent first
}

export async function createLog(
  habitId: string,
  note?: string,
  customTimestamp?: number,
): Promise<HabitLog> {
  const logs = await getLogs();
  const newLog: HabitLog = {
    id: generateId(),
    habitId,
    timestamp: customTimestamp ?? Date.now(),
    note,
  };
  logs.push(newLog);
  await saveLogs(logs);
  return newLog;
}

export async function deleteLog(logId: string): Promise<boolean> {
  const logs = await getLogs();
  const filtered = logs.filter(l => l.id !== logId);
  if (filtered.length === logs.length) return false;

  await saveLogs(filtered);
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

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([HABITS_KEY, LOGS_KEY]);
}
