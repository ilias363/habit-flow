/**
 * Habit Detail Screen - View habit details and logs
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
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
import { ThemedView } from "@/components/themed-view";
import { useHabitLogs, useHabits } from "@/hooks/use-habits";
import { useThemeColor } from "@/hooks/use-theme-color";
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

  const mutedColor = useThemeColor({}, "muted");
  const dangerColor = useThemeColor({}, "danger");
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const tintColor = useThemeColor({}, "tint");

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
    await logHabit(habit.id);
    await refreshLogs();
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

  const handleDateChange = (event: any, date?: Date) => {
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
    router.push(`/habit/edit/${habit.id}` as any);
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

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!habit) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="chevron-left" size={28} color={tintColor} />
            <ThemedText style={[styles.backText, { color: tintColor }]}>Back</ThemedText>
          </Pressable>
        </View>
        <EmptyState
          icon="❌"
          title="Habit not found"
          description="This habit may have been deleted"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={28} color={tintColor} />
          <ThemedText style={[styles.backText, { color: tintColor }]}>Back</ThemedText>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={handleEdit} style={styles.headerAction}>
            <ThemedText style={styles.editText}>Edit</ThemedText>
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.headerAction}>
            <ThemedText style={[styles.deleteText, { color: dangerColor }]}>Delete</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Habit Header */}
      <View style={styles.habitHeader}>
        <View style={[styles.emojiContainer, { backgroundColor: habit.color + "20" }]}>
          <ThemedText style={styles.emoji}>{habit.emoji}</ThemedText>
        </View>
        <ThemedText type="title" style={styles.habitName}>
          {habit.name}
        </ThemedText>
        <View style={styles.statsRow}>
          <ThemedText style={[styles.stat, { color: mutedColor }]}>
            {logs.length} total logs
          </ThemedText>
        </View>
      </View>

      {/* Quick Log Buttons */}
      <View style={styles.logButtonContainer}>
        <Pressable
          onPress={handleLogNow}
          style={({ pressed }) => [
            styles.logButton,
            { backgroundColor: habit.color, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText style={styles.logButtonText}>Log Now</ThemedText>
        </Pressable>
        <Pressable
          onPress={handleLogCustomDate}
          style={({ pressed }) => [
            styles.logButtonSecondary,
            { borderColor: habit.color, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText style={[styles.logButtonSecondaryText, { color: habit.color }]}>
            Custom Date
          </ThemedText>
        </Pressable>
      </View>

      {/* Date Picker Modal */}
      {Platform.OS === "ios" ? (
        <Modal visible={showDatePicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.datePickerModal, { backgroundColor: cardBackground }]}>
              <ThemedText type="subtitle" style={styles.datePickerTitle}>
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
                  style={[styles.datePickerButton, { borderColor }]}
                >
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable
                  onPress={handleConfirmDate}
                  style={[styles.datePickerButton, { backgroundColor: habit.color }]}
                >
                  <ThemedText style={styles.datePickerConfirmText}>Confirm</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      {/* Logs List */}
      <View style={styles.logsSection}>
        <ThemedText type="subtitle" style={styles.logsTitle}>
          History
        </ThemedText>
        {logs.length === 0 ? (
          <View style={styles.emptyLogs}>
            <ThemedText style={[styles.emptyLogsText, { color: mutedColor }]}>
              No logs yet. Tap &quot;Log Now&quot; to record your first entry!
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={logs}
            renderItem={renderLog}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.logsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  backText: {
    fontSize: 17,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  headerAction: {
    paddingVertical: 8,
  },
  editText: {
    fontSize: 17,
  },
  deleteText: {
    fontSize: 17,
  },
  habitHeader: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  emojiContainer: {
    width: 88,
    height: 88,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 44,
    lineHeight: 52,
  },
  habitName: {
    textAlign: "center",
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    fontSize: 15,
  },
  logButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    flexDirection: "row",
    gap: 12,
  },
  logButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  logButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  logButtonSecondary: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  logButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  datePickerModal: {
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 360,
  },
  datePickerTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  datePicker: {
    height: 200,
  },
  datePickerButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  datePickerConfirmText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  logsSection: {
    flex: 1,
    paddingTop: 8,
  },
  logsTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  logsList: {
    paddingBottom: 32,
  },
  emptyLogs: {
    padding: 32,
    alignItems: "center",
  },
  emptyLogsText: {
    textAlign: "center",
    fontSize: 15,
  },
});
