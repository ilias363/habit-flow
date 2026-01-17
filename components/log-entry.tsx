/**
 * LogEntry - Displays a single habit log entry
 */

import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { HabitLog } from "@/types";

interface LogEntryProps {
  log: HabitLog;
  color: string;
  onDelete?: () => void;
}

export function LogEntry({ log, color, onDelete }: LogEntryProps) {
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");
  const dangerColor = useThemeColor({}, "danger");

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === new Date(now.getTime() - 86400000).toDateString();

    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (isToday) return `Today at ${time}`;
    if (isYesterday) return `Yesterday at ${time}`;

    return (
      date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      }) + ` at ${time}`
    );
  };

  const handleLongPress = () => {
    if (onDelete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDelete();
    }
  };

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={500}
      style={[styles.container, { backgroundColor: cardBackground, borderColor }]}
    >
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <ThemedText style={styles.date}>{formatDate(log.timestamp)}</ThemedText>
        {log.note && (
          <ThemedText style={[styles.note, { color: mutedColor }]} numberOfLines={2}>
            {log.note}
          </ThemedText>
        )}
      </View>
      {onDelete && (
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <ThemedText style={[styles.deleteText, { color: dangerColor }]}>×</ThemedText>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  indicator: {
    width: 4,
    alignSelf: "stretch",
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  date: {
    fontSize: 15,
    fontWeight: "500",
  },
  note: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 12,
  },
  deleteText: {
    fontSize: 24,
    fontWeight: "300",
  },
});
