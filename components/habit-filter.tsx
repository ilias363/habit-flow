/**
 * HabitFilter - Dropdown filter to select "All Habits" or a specific habit
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HabitWithStats } from "@/types";

interface HabitFilterProps {
  habits: HabitWithStats[];
  selectedHabitId: string | null;
  onSelect: (habitId: string | null) => void;
}

export function HabitFilter({ habits, selectedHabitId, onSelect }: HabitFilterProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [isOpen, setIsOpen] = useState(false);

  const selectedHabit = selectedHabitId ? habits.find(h => h.id === selectedHabitId) : null;

  const handleSelect = (habitId: string | null) => {
    onSelect(habitId);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[
          styles.filterButton,
          {
            backgroundColor: colors.glass,
            borderColor: selectedHabit ? selectedHabit.color : colors.glassBorder,
          },
        ]}
      >
        {selectedHabit ? (
          <View style={[styles.habitDot, { backgroundColor: selectedHabit.color }]} />
        ) : (
          <MaterialIcons name="filter-list" size={18} color={colors.tint} />
        )}
        <ThemedText
          style={[styles.filterText, { color: selectedHabit ? colors.text : colors.muted }]}
          numberOfLines={1}
        >
          {selectedHabit ? selectedHabit.name : "All Habits"}
        </ThemedText>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          color={colors.muted}
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <Pressable
            style={[
              styles.dropdownContainer,
              {
                backgroundColor: colorScheme === "dark" ? "#1a1a2e" : "#ffffff",
                borderColor: colors.glassBorder,
              },
            ]}
            onPress={e => e.stopPropagation()}
          >
            <ThemedText style={[styles.dropdownTitle, { color: colors.muted }]}>
              Filter Stats By
            </ThemedText>

            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {/* All Habits Option */}
              <Pressable
                style={[styles.option, !selectedHabitId && { backgroundColor: colors.tint + "15" }]}
                onPress={() => handleSelect(null)}
              >
                <View style={[styles.optionIcon, { backgroundColor: colors.tint + "20" }]}>
                  <MaterialIcons name="dashboard" size={20} color={colors.tint} />
                </View>
                <ThemedText style={[styles.optionText, { color: colors.text }]}>
                  All Habits
                </ThemedText>
                {!selectedHabitId && <MaterialIcons name="check" size={20} color={colors.tint} />}
              </Pressable>

              {/* Individual Habits */}
              {habits.map(habit => (
                <Pressable
                  key={habit.id}
                  style={[
                    styles.option,
                    selectedHabitId === habit.id && { backgroundColor: habit.color + "15" },
                  ]}
                  onPress={() => handleSelect(habit.id)}
                >
                  <View style={[styles.optionIcon, { backgroundColor: habit.color + "20" }]}>
                    <MaterialIcons name={habit.icon} size={20} color={habit.color} />
                  </View>
                  <View style={styles.optionInfo}>
                    <ThemedText style={[styles.optionText, { color: colors.text }]}>
                      {habit.name}
                    </ThemedText>
                    <ThemedText style={[styles.optionStats, { color: colors.muted }]}>
                      {habit.totalLogs} logs
                    </ThemedText>
                  </View>
                  {selectedHabitId === habit.id && (
                    <MaterialIcons name="check" size={20} color={habit.color} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: GlassStyles.borderRadius.lg,
    borderWidth: 1,
    gap: 8,
    marginHorizontal: GlassStyles.spacing.md,
    marginBottom: GlassStyles.spacing.md,
  },
  habitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  filterText: {
    ...Typography.subhead,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: GlassStyles.spacing.xl,
  },
  dropdownContainer: {
    width: "100%",
    maxWidth: 340,
    maxHeight: Dimensions.get("window").height * 0.6,
    borderRadius: GlassStyles.borderRadius.xl,
    borderWidth: 1,
    padding: GlassStyles.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownTitle: {
    ...Typography.caption1,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: GlassStyles.spacing.sm,
    marginLeft: GlassStyles.spacing.xs,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: GlassStyles.spacing.sm,
    borderRadius: GlassStyles.borderRadius.md,
    marginBottom: 4,
    gap: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optionInfo: {
    flex: 1,
  },
  optionText: {
    ...Typography.body,
  },
  optionStats: {
    ...Typography.caption1,
    marginTop: 2,
  },
});
