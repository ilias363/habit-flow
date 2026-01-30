/**
 * HabitCard - Glassmorphism habit card with visual progress
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { adjustColor, formatRelativeTime } from "@/lib";
import { HabitWithStats } from "@/types";

interface HabitCardProps {
  habit: HabitWithStats;
  onPress: () => void;
  onLog: () => void;
}

export function HabitCard({ habit, onPress, onLog }: HabitCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const handleLog = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLog();
  };

  const lastLogText = habit.lastLogDate
    ? formatRelativeTime(habit.lastLogDate)
    : "Not logged yet";

  const hasLogsThisWeek = habit.weeklyLogs > 0;

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <GlassCard variant="default" style={styles.card} noPadding>
        <View style={styles.content}>
          {/* Icon with gradient background */}
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={[habit.color + "30", habit.color + "15"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <MaterialIcons name={habit.icon} size={26} color={habit.color} />
            </LinearGradient>
          </View>

          {/* Habit Info */}
          <View style={styles.info}>
            <ThemedText style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {habit.name}
            </ThemedText>
            <View style={styles.meta}>
              {habit.currentStreak > 0 && (
                <View style={styles.streakBadge}>
                  <ThemedText style={[styles.streakText, { color: colors.warning }]}>
                    🔥 {habit.currentStreak}
                  </ThemedText>
                </View>
              )}
              <ThemedText style={[styles.lastLog, { color: colors.muted }]}>
                {lastLogText}
              </ThemedText>
            </View>
          </View>

          {/* Log Button */}
          <Pressable
            onPress={handleLog}
            accessibilityLabel={`Log ${habit.name}`}
            accessibilityRole="button"
            style={({ pressed }) => [styles.logButton, { opacity: pressed ? 0.8 : 1 }]}
          >
            <LinearGradient
              colors={[habit.color, adjustColor(habit.color, -20)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logButtonGradient}
            >
              <ThemedText style={styles.logButtonText}>+1</ThemedText>
            </LinearGradient>
            {habit.weeklyLogs > 0 && (
              <View style={[styles.todayBadge, { backgroundColor: colors.cardSolid }]}>
                <ThemedText style={[styles.todayBadgeText, { color: habit.color }]}>
                  {habit.weeklyLogs}
                </ThemedText>
              </View>
            )}
          </Pressable>
        </View>

        {/* Activity indicator at bottom */}
        {hasLogsThisWeek && (
          <View style={styles.activityIndicator}>
            <View style={[styles.activityDot, { backgroundColor: habit.color }]} />
            <ThemedText style={[styles.activityText, { color: colors.muted }]}>
              {habit.weeklyLogs} {habit.weeklyLogs === 1 ? "entry" : "entries"} this week
            </ThemedText>
          </View>
        )}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: GlassStyles.spacing.md,
    marginVertical: GlassStyles.spacing.xs,
  },
  card: {
    borderRadius: GlassStyles.borderRadius.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: GlassStyles.spacing.md,
    paddingRight: GlassStyles.spacing.lg,
    gap: 14,
  },
  iconWrapper: {
    borderRadius: GlassStyles.borderRadius.md,
    overflow: "hidden",
  },
  iconContainer: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: GlassStyles.borderRadius.md,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...Typography.headline,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: 13,
    fontWeight: "600",
  },
  lastLog: {
    ...Typography.caption1,
  },
  logButton: {
    position: "relative",
    marginRight: 4,
  },
  logButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  todayBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  todayBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  activityIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: GlassStyles.spacing.md,
    paddingBottom: GlassStyles.spacing.sm,
    gap: 8,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activityText: {
    ...Typography.caption2,
  },
});
