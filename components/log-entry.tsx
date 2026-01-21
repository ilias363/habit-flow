/**
 * LogEntry - Glassmorphism habit log entry display
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HabitLog } from "@/types";

interface LogEntryProps {
  log: HabitLog;
  color: string;
  onDelete?: () => void;
}

export function LogEntry({ log, color, onDelete }: LogEntryProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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
      style={[
        styles.container,
        {
          backgroundColor: colors.glass,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <ThemedText style={[styles.date, { color: colors.text }]}>
          {formatDate(log.timestamp)}
        </ThemedText>
        {log.note && (
          <ThemedText style={[styles.note, { color: colors.muted }]} numberOfLines={2}>
            {log.note}
          </ThemedText>
        )}
      </View>
      {onDelete && (
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <MaterialIcons name="close" size={18} color={colors.danger} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: GlassStyles.spacing.xs,
    borderRadius: GlassStyles.borderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  indicator: {
    width: 4,
    alignSelf: "stretch",
  },
  content: {
    flex: 1,
    padding: GlassStyles.spacing.md,
    gap: 4,
  },
  date: {
    ...Typography.subhead,
    fontWeight: "500",
  },
  note: {
    ...Typography.footnote,
  },
  deleteButton: {
    padding: GlassStyles.spacing.md,
  },
});
