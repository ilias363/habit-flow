/**
 * Edit Habit Screen - Edit an existing habit
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ColorPicker } from "@/components/color-picker";
import { IconPicker } from "@/components/icon-picker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHabits } from "@/hooks/use-habits";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getHabits } from "@/lib/storage";
import { Habit, IconName } from "@/types";

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateHabit } = useHabits();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconName>("check-circle");
  const [color, setColor] = useState("");
  const [saving, setSaving] = useState(false);

  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "muted");

  useEffect(() => {
    const loadHabit = async () => {
      if (!id) return;
      const habits = await getHabits();
      const found = habits.find(h => h.id === id);
      if (found) {
        setHabit(found);
        setName(found.name);
        setIcon(found.icon);
        setColor(found.color);
      }
      setLoading(false);
    };
    loadHabit();
  }, [id]);

  const handleSave = async () => {
    if (!habit || !name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await updateHabit(habit.id, { name: name.trim(), icon, color });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to update habit");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Haptics.selectionAsync();
    router.back();
  };

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
          <Pressable onPress={handleCancel} style={styles.headerButton}>
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">Edit Habit</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.notFound}>
          <ThemedText>Habit not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleCancel} style={styles.headerButton}>
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">Edit Habit</ThemedText>
          <Pressable
            onPress={handleSave}
            disabled={saving || !name.trim()}
            style={styles.headerButton}
          >
            <ThemedText
              style={[styles.saveText, { color }, (!name.trim() || saving) && { opacity: 0.5 }]}
            >
              {saving ? "Saving..." : "Save"}
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Preview */}
          <View style={styles.previewContainer}>
            <View style={[styles.preview, { backgroundColor: color + "20" }]}>
              <MaterialIcons name={icon} size={40} color={color} />
              <ThemedText style={styles.previewName} numberOfLines={1}>
                {name || "Habit Name"}
              </ThemedText>
            </View>
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter habit name..."
              placeholderTextColor={mutedColor}
              style={[
                styles.input,
                { backgroundColor: cardBackground, borderColor, color: textColor },
              ]}
              maxLength={50}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Icon</ThemedText>
            <IconPicker selectedIcon={icon} onSelect={setIcon} color={color} />
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Color</ThemedText>
            <ColorPicker selectedColor={color} onSelect={setColor} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerButton: {
    minWidth: 70,
  },
  cancelText: {
    fontSize: 17,
  },
  saveText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "right",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  previewContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  preview: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: "center",
    gap: 8,
  },
  previewName: {
    fontSize: 20,
    fontWeight: "600",
    maxWidth: 200,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    fontSize: 17,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
});
