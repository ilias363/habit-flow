/**
 * Custom hook for computing filtered stats data
 */

import { DAY_NAMES, FULL_DAY_NAMES } from "@/lib";
import { CachedStats, HabitLog, HeatmapData, HourlyData, LogsByDay, WeekdayData } from "@/types";

/**
 * Hook to compute filtered stats data
 * @param logs All logs
 * @param selectedHabitId Optional habit ID to filter by (null = all habits)
 */
export function useFilteredStats(logs: HabitLog[], selectedHabitId: string | null): CachedStats {
  // Filter logs by habit if one is selected
  const filteredLogs = selectedHabitId ? logs.filter(log => log.habitId === selectedHabitId) : logs;

  // Compute heatmap data
  const logsByDay: LogsByDay = {};
  filteredLogs.forEach(log => {
    const date = new Date(log.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    logsByDay[key] = (logsByDay[key] || 0) + 1;
  });
  const heatmapData: HeatmapData = {
    logsByDay,
    maxLogs: Math.max(1, ...Object.values(logsByDay)),
    totalActiveDays: Object.keys(logsByDay).length,
  };

  // Compute weekday data
  const today = new Date().getDay();
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
  filteredLogs.forEach(log => {
    const day = new Date(log.timestamp).getDay();
    weekdayCounts[day]++;
  });
  const weekdayData: WeekdayData[] = FULL_DAY_NAMES.map((name, i) => ({
    name: DAY_NAMES[i],
    fullName: name,
    count: weekdayCounts[i],
    isToday: i === today,
  }));

  // Compute hourly data
  const currentHour = new Date().getHours();
  const intervals = [
    { label: "12-4a", start: 0, end: 4, count: 0 },
    { label: "4-8a", start: 4, end: 8, count: 0 },
    { label: "8-12p", start: 8, end: 12, count: 0 },
    { label: "12-4p", start: 12, end: 16, count: 0 },
    { label: "4-8p", start: 16, end: 20, count: 0 },
    { label: "8-12a", start: 20, end: 24, count: 0 },
  ];
  filteredLogs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    const interval = intervals.find(i => hour >= i.start && hour < i.end);
    if (interval) interval.count++;
  });
  const hourlyData: HourlyData[] = intervals.map(i => ({
    ...i,
    isCurrent: currentHour >= i.start && currentHour < i.end,
  }));

  return {
    heatmapData,
    weekdayData,
    hourlyData,
    filteredLogs,
  };
}
