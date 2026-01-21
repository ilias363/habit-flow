/**
 * New Habit Screen - Glassmorphism habit creation form
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHabits } from "@/hooks/use-habits";
import { HABIT_COLORS, HABIT_ICONS, IconName } from "@/types";

export default function NewHabitScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createHabit } = useHabits();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconName>(HABIT_ICONS[0]);
  const [color, setColor] = useState<string>(HABIT_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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
    <GradientBackground style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleCancel} style={styles.headerButton}>
            <ThemedText style={[styles.cancelText, { color: colors.muted }]}>Cancel</ThemedText>
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: colors.text }]}>New Habit</ThemedText>
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
          <View style={styles.previewSection}>
            <View style={styles.previewRow}>
              <LinearGradient
                colors={[color + "30", color + "15"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.previewIcon}
              >
                <MaterialIcons name={icon} size={28} color={color} />
              </LinearGradient>
              <View style={styles.previewInfo}>
                <ThemedText style={[styles.previewName, { color: colors.text }]} numberOfLines={1}>
                  {name || "Your Habit"}
                </ThemedText>
                <ThemedText style={[styles.previewHint, { color: colors.muted }]}>
                  Preview
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: colors.muted }]}>NAME</ThemedText>
            <GlassCard noPadding>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Morning Meditation"
                placeholderTextColor={colors.muted}
                style={[styles.input, { color: colors.text }]}
                maxLength={50}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </GlassCard>
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: colors.muted }]}>ICON</ThemedText>
            <GlassCard noPadding style={styles.pickerCard}>
              <IconPicker selectedIcon={icon} onSelect={setIcon} color={color} />
            </GlassCard>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: colors.muted }]}>COLOR</ThemedText>
            <GlassCard noPadding style={styles.pickerCard}>
              <ColorPicker selectedColor={color} onSelect={setColor} />
            </GlassCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
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
    paddingHorizontal: GlassStyles.spacing.md,
    paddingBottom: GlassStyles.spacing.sm,
  },
  headerButton: {
    minWidth: 70,
    paddingVertical: 8,
  },
  cancelText: {
    ...Typography.body,
  },
  headerTitle: {
    ...Typography.headline,
  },
  saveText: {
    ...Typography.headline,
    textAlign: "right",
  },
  content: {
    paddingHorizontal: GlassStyles.spacing.md,
    paddingBottom: GlassStyles.spacing.xxl,
  },
  previewSection: {
    marginBottom: GlassStyles.spacing.xl,
    paddingVertical: GlassStyles.spacing.md,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: GlassStyles.spacing.md,
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  previewInfo: {
    flex: 1,
    gap: 2,
  },
  previewName: {
    ...Typography.title2,
  },
  previewHint: {
    ...Typography.caption1,
  },
  section: {
    marginBottom: GlassStyles.spacing.lg,
  },
  label: {
    ...Typography.caption1,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: GlassStyles.spacing.sm,
    marginLeft: GlassStyles.spacing.xs,
  },
  input: {
    ...Typography.body,
    padding: GlassStyles.spacing.md,
  },
  pickerCard: {
    padding: GlassStyles.spacing.sm,
  },
});
