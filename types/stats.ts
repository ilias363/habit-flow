/**
 * Types for stats and caching
 */

export interface LogsByDay {
  [key: string]: number;
}

export interface WeekdayData {
  name: string;
  fullName: string;
  count: number;
  isToday: boolean;
}

export interface HourlyData {
  label: string;
  start: number;
  end: number;
  count: number;
  isCurrent: boolean;
}

export interface HeatmapData {
  logsByDay: LogsByDay;
  maxLogs: number;
  totalActiveDays: number;
}

export interface CachedStats {
  heatmapData: HeatmapData;
  weekdayData: WeekdayData[];
  hourlyData: HourlyData[];
  filteredLogs: import("./habit").HabitLog[];
}
