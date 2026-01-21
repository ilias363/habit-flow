/**
 * Habit Detail Screen - Glassmorphism habit details and logs
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { LogEntry } from "@/components/log-entry";
import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHabitLogs, useHabits } from "@/hooks/use-habits";
import { getHabits } from "@/lib/storage";
import { Habit, HabitLog } from "@/types";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { deleteHabit, logHabit, refreshHabits } = useHabits();
  const { logs, refreshLogs, deleteLog } = useHabitLogs(id || "");

  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const loadHabit = useCallback(async () => {
    if (!id) return;
    const habits = await getHabits();
    const found = habits.find(h => h.id === id);
    setHabit(found || null);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadHabit().finally(() => setLoading(false));
  }, [loadHabit]);

  useFocusEffect(
    useCallback(() => {
      // Refresh both habit and logs when screen comes into focus
      loadHabit();
      refreshLogs();
    }, [loadHabit, refreshLogs]),
  );

  const handleBack = () => {
    router.back();
  };

  const handleLogNow = async () => {
    if (!habit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logHabit(habit.id);
    refreshLogs();
  };

  const handleLogCustomDate = async () => {
    const now = new Date();
    setSelectedDate(now);

    if (Platform.OS === "android") {
      // Use imperative API for Android to avoid dismiss error
      try {
        const dateResult = await new Promise<Date | null>(resolve => {
          DateTimePickerAndroid.open({
            value: now,
            mode: "date",
            maximumDate: new Date(),
            onChange: (event, date) => {
              if (event.type === "set" && date) {
                resolve(date);
              } else {
                resolve(null);
              }
            },
          });
        });

        if (!dateResult) return;

        // Now pick time
        const timeResult = await new Promise<Date | null>(resolve => {
          DateTimePickerAndroid.open({
            value: dateResult,
            mode: "time",
            is24Hour: true,
            onChange: (event, date) => {
              if (event.type === "set" && date) {
                resolve(date);
              } else {
                resolve(null);
              }
            },
          });
        });

        if (timeResult && habit) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await logHabit(habit.id, undefined, timeResult.getTime());
          await refreshLogs();
        }
      } catch (error) {
        console.log("DatePicker error:", error);
      }
    } else {
      setShowDatePicker(true);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirmDate = async () => {
    if (!habit) return;
    setShowDatePicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await logHabit(habit.id, undefined, selectedDate.getTime());
    await refreshLogs();
  };

  const handleEdit = () => {
    if (!habit) return;
    router.push(`/habit/edit/${habit.id}`);
  };

  const handleDelete = () => {
    if (!habit) return;

    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.name}"? This will also delete all log entries.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await deleteHabit(habit.id);
            router.back();
          },
        },
      ],
    );
  };

  const handleDeleteLog = (log: HabitLog) => {
    Alert.alert("Delete Log", "Are you sure you want to delete this log entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await deleteLog(log.id);
          await refreshHabits();
        },
      },
    ]);
  };

  const renderLog = ({ item }: { item: HabitLog }) => (
    <LogEntry log={item} color={habit?.color || "#6366F1"} onDelete={() => handleDeleteLog(item)} />
  );

  if (!habit) {
    return (
      <GradientBackground style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
            <ThemedText style={[styles.backText, { color: colors.primary }]}>Back</ThemedText>
          </Pressable>
        </View>
        {loading ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <EmptyState
            icon="❌"
            title="Habit not found"
            description="This habit may have been deleted"
          />
        )}
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
          <ThemedText style={[styles.backText, { color: colors.primary }]}>Back</ThemedText>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={handleEdit} style={styles.headerAction}>
            <ThemedText style={[styles.editText, { color: colors.text }]}>Edit</ThemedText>
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.headerAction}>
            <ThemedText style={[styles.deleteText, { color: colors.danger }]}>Delete</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Habit Header */}
      <View style={styles.habitHeader}>
        <View style={styles.habitTitleRow}>
          <LinearGradient
            colors={[habit.color + "30", habit.color + "15"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <MaterialIcons name={habit.icon} size={28} color={habit.color} />
          </LinearGradient>
          <View style={styles.habitInfo}>
            <ThemedText style={[styles.habitName, { color: colors.text }]}>{habit.name}</ThemedText>
            <ThemedText style={[styles.habitStats, { color: colors.muted }]}>
              {logs.length} entries logged
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Quick Log Buttons */}
      <View style={styles.logButtonContainer}>
        <Pressable
          onPress={handleLogNow}
          style={({ pressed }) => [styles.logButton, { opacity: pressed ? 0.8 : 1 }]}
        >
          <LinearGradient
            colors={[habit.color, habit.color + "CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logButtonGradient}
          >
            <MaterialIcons name="add" size={20} color="#FFFFFF" />
            <ThemedText style={styles.logButtonText}>Log Now</ThemedText>
          </LinearGradient>
        </Pressable>
        <Pressable
          onPress={handleLogCustomDate}
          style={({ pressed }) => [
            styles.logButtonSecondary,
            {
              borderColor: habit.color,
              backgroundColor: habit.color + "10",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <MaterialIcons name="schedule" size={18} color={habit.color} />
          <ThemedText style={[styles.logButtonSecondaryText, { color: habit.color }]}>
            Custom Date
          </ThemedText>
        </Pressable>
      </View>

      {/* Date Picker Modal */}
      {Platform.OS === "ios" ? (
        <Modal visible={showDatePicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <GlassCard variant="elevated" style={styles.datePickerModal}>
              <ThemedText style={[styles.datePickerTitle, { color: colors.text }]}>
                Select Date & Time
              </ThemedText>
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={styles.datePicker}
              />
              <View style={styles.datePickerButtons}>
                <Pressable
                  onPress={() => setShowDatePicker(false)}
                  style={[styles.datePickerButton, { backgroundColor: colors.glass }]}
                >
                  <ThemedText style={{ color: colors.text }}>Cancel</ThemedText>
                </Pressable>
                <Pressable onPress={handleConfirmDate}>
                  <LinearGradient
                    colors={[habit.color, habit.color + "CC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.datePickerButton}
                  >
                    <ThemedText style={styles.datePickerConfirmText}>Confirm</ThemedText>
                  </LinearGradient>
                </Pressable>
              </View>
            </GlassCard>
          </View>
        </Modal>
      ) : null}

      {/* Logs List */}
      <View style={styles.logsSection}>
        <ThemedText style={[styles.logsTitle, { color: colors.text }]}>History</ThemedText>
        {logs.length === 0 ? (
          <GlassCard style={styles.emptyLogs}>
            <ThemedText style={[styles.emptyLogsText, { color: colors.muted }]}>
              No logs yet. Tap &quot;Log Now&quot; to record your first entry!
            </ThemedText>
          </GlassCard>
        ) : (
          <FlatList
            data={logs}
            renderItem={renderLog}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.logsList}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={15}
            windowSize={10}
            initialNumToRender={15}
          />
        )}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: GlassStyles.spacing.md,
    paddingBottom: GlassStyles.spacing.sm,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  backText: {
    ...Typography.body,
  },
  headerActions: {
    flexDirection: "row",
    gap: GlassStyles.spacing.md,
  },
  headerAction: {
    paddingVertical: 8,
  },
  editText: {
    ...Typography.body,
  },
  deleteText: {
    ...Typography.body,
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: GlassStyles.spacing.md,
    paddingVertical: GlassStyles.spacing.lg,
    marginBottom: GlassStyles.spacing.md,
  },
  habitTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: GlassStyles.spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  habitInfo: {
    flex: 1,
    gap: 4,
  },
  habitName: {
    ...Typography.title2,
  },
  habitStats: {
    ...Typography.caption1,
  },
  logButtonContainer: {
    paddingHorizontal: GlassStyles.spacing.md,
    marginBottom: GlassStyles.spacing.md,
    flexDirection: "row",
    gap: GlassStyles.spacing.sm,
  },
  logButton: {
    flex: 3,
    borderRadius: GlassStyles.borderRadius.md,
    overflow: "hidden",
  },
  logButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  logButtonText: {
    color: "#FFFFFF",
    ...Typography.subhead,
    fontWeight: "600",
  },
  logButtonSecondary: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: GlassStyles.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    gap: 6,
  },
  logButtonSecondaryText: {
    ...Typography.subhead,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  datePickerModal: {
    width: "100%",
    maxWidth: 360,
    padding: GlassStyles.spacing.lg,
  },
  datePickerTitle: {
    ...Typography.title3,
    textAlign: "center",
    marginBottom: GlassStyles.spacing.md,
  },
  datePicker: {
    height: 200,
  },
  datePickerButtons: {
    flexDirection: "row",
    gap: GlassStyles.spacing.sm,
    marginTop: GlassStyles.spacing.md,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: GlassStyles.borderRadius.md,
    alignItems: "center",
  },
  datePickerConfirmText: {
    color: "#FFFFFF",
    ...Typography.headline,
  },
  logsSection: {
    flex: 1,
    paddingTop: GlassStyles.spacing.md,
  },
  logsTitle: {
    ...Typography.subhead,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    paddingHorizontal: GlassStyles.spacing.md,
    marginBottom: GlassStyles.spacing.md,
  },
  logsList: {
    paddingBottom: GlassStyles.spacing.xxl,
    paddingHorizontal: GlassStyles.spacing.md,
  },
  emptyLogs: {
    marginHorizontal: GlassStyles.spacing.md,
    alignItems: "center",
  },
  emptyLogsText: {
    textAlign: "center",
    ...Typography.body,
  },
});
