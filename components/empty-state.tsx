/**
 * EmptyState - Displays when there are no habits
 */

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = "📋" }: EmptyStateProps) {
  const mutedColor = useThemeColor({}, "muted");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.icon}>{icon}</ThemedText>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.description, { color: mutedColor }]}>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  icon: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
