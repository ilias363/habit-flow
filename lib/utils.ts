/**
 * Utility functions for the app
 */

/**
 * Day name constants
 */
export const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"] as const;
export const FULL_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/**
 * Format a timestamp as a relative time string (e.g., "Just now", "5m ago", "2d ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

/**
 * Adjust a hex color by a given amount (positive = lighter, negative = darker)
 */
export function adjustColor(color: string, amount: number): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, val));
  const hex = color.replace("#", "");
  const r = clamp(parseInt(hex.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.slice(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
