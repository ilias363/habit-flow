/**
 * Core data models for the habit tracking app
 */

import type { MaterialIcons } from "@expo/vector-icons";

export type IconName = keyof typeof MaterialIcons.glyphMap;

export interface Habit {
  id: string;
  name: string;
  icon: IconName;
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

// Predefined icons for habits (Material Icons names)
export const HABIT_ICONS = [
  // General
  "check-circle",
  "star",
  "favorite",
  // Health & Fitness
  "fitness-center",
  "directions-run",
  "directions-bike",
  "pool",
  "self-improvement",
  "sports-martial-arts",
  // Wellness
  "water-drop",
  "bedtime",
  "medication",
  "psychology",
  "wb-sunny",
  "spa",
  // Productivity
  "menu-book",
  "edit-note",
  "laptop-mac",
  "track-changes",
  "alarm",
  "task-alt",
  // Lifestyle
  "local-dining",
  "restaurant",
  "coffee",
  "smoke-free",
  "cleaning-services",
  "savings",
  // Creative & Social
  "palette",
  "music-note",
  "photo-camera",
  "record-voice-over",
  "groups",
  "call",
] as const;
