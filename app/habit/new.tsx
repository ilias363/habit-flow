/**
 * New Habit Screen - Create a new habit
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { HABIT_COLORS, HABIT_ICONS, IconName } from "@/types";

export default function NewHabitScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createHabit } = useHabits();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconName>(HABIT_ICONS[0]);
  const [color, setColor] = useState<string>(HABIT_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "muted");

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await createHabit({ name: name.trim(), icon, color });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to create habit");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Haptics.selectionAsync();
    router.back();
  };

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
          <ThemedText type="subtitle">New Habit</ThemedText>
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
