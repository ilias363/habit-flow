/**
 * Core data models for the habit tracking app
 */

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface HabitLog {
  id: string;
  habitId: string;
  timestamp: number; // when the habit was recorded
  note?: string; // optional note for this log entry
}

export interface HabitWithStats extends Habit {
  totalLogs: number;
  todayLogs: number;
  currentStreak: number;
  lastLogDate: number | null;
}

// Predefined colors for habit cards
export const HABIT_COLORS: string[] = [
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
];

// Default emoji for habits
export const DEFAULT_HABIT_EMOJI = "⭐";

// Predefined emojis for habits
export const HABIT_EMOJIS: string[] = [
  "⭐",
  "💪",
  "🏃",
  "📚",
  "💧",
  "🧘",
  "💤",
  "🍎",
  "✍️",
  "🎯",
  "🧹",
  "💊",
  "🌿",
  "☕",
  "🎵",
  "🧠",
  "🙏",
  "🚶",
  "🏋️",
  "📝",
  "🍳",
  "🧘‍♂️",
  "😴",
  "🥗",
  "🎨",
];
