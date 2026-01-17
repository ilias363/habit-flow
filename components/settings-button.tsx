/**
 * Settings action button
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

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
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");
  const tintColor = useThemeColor({}, "tint");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.content}>
        <ThemedText style={[styles.title, destructive && styles.destructiveText]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.description, { color: mutedColor }]}>{description}</ThemedText>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={destructive ? "#ef4444" : tintColor} />
      ) : (
        <MaterialIcons name="chevron-right" size={22} color={mutedColor} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
  },
  destructiveText: {
    color: "#ef4444",
  },
});
