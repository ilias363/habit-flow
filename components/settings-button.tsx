/**
 * SettingsButton - Glassmorphism action button for settings
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface SettingsButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  title: string;
  description: string;
  onPress: () => void;
  loading?: boolean;
  destructive?: boolean;
  isLast?: boolean;
}

export function SettingsButton({
  icon,
  iconColor,
  title,
  description,
  onPress,
  loading = false,
  destructive = false,
  isLast = false,
}: SettingsButtonProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.glassBorder },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + "18" }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: destructive ? colors.danger : colors.text }]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.description, { color: colors.muted }]}>{description}</ThemedText>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={destructive ? colors.danger : colors.tint} />
      ) : (
        <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: GlassStyles.spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.headline,
    marginBottom: 2,
  },
  description: {
    ...Typography.footnote,
  },
});
