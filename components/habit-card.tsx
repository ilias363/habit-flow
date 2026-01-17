/**
 * HabitCard - Displays a single habit with quick log button
 */

import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { HabitWithStats } from "@/types";

interface HabitCardProps {
  habit: HabitWithStats;
  onPress: () => void;
  onLog: () => void;
}

export function HabitCard({ habit, onPress, onLog }: HabitCardProps) {
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");

  const handleLog = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLog();
  };

  const formatLastLog = () => {
    if (!habit.lastLogDate) return "Never logged";
    const now = Date.now();
    const diff = now - habit.lastLogDate;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: cardBackground, borderColor }]}
    >
      <View style={styles.content}>
        <View style={[styles.emojiContainer, { backgroundColor: habit.color + "20" }]}>
          <ThemedText style={styles.emoji}>{habit.emoji}</ThemedText>
        </View>

        <View style={styles.info}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {habit.name}
          </ThemedText>
          <View style={styles.stats}>
            <ThemedText style={[styles.stat, { color: mutedColor }]}>
              🔥 {habit.currentStreak} streak
            </ThemedText>
            <ThemedText style={[styles.stat, { color: mutedColor }]}>
              • {formatLastLog()}
            </ThemedText>
          </View>
        </View>

        <Pressable
          onPress={handleLog}
          style={({ pressed }) => [
            styles.logButton,
            { backgroundColor: habit.color, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText style={styles.logButtonText}>+1</ThemedText>
          {habit.todayLogs > 0 && (
            <View style={styles.todayBadge}>
              <ThemedText style={styles.todayBadgeText}>{habit.todayLogs}</ThemedText>
            </View>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    fontSize: 13,
  },
  logButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  logButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  todayBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  todayBadgeText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700",
  },
});
