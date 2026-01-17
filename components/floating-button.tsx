/**
 * FloatingButton - Floating action button for adding new habits
 */

import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";

interface FloatingButtonProps {
  onPress: () => void;
  color?: string;
}

export function FloatingButton({ onPress, color = "#6366F1" }: FloatingButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <ThemedText style={styles.icon}>+</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 34,
  },
});
