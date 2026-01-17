/**
 * EmojiPicker - Grid of emoji options for habit customization
 */

import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { HABIT_EMOJIS } from "@/types";

interface EmojiPickerProps {
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
}

function EmojiOption({
  emoji,
  isSelected,
  onPress,
}: {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const cardBorder = useThemeColor({}, "cardBorder");

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.emojiOption, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        style={[
          styles.emojiCircle,
          { borderColor: isSelected ? "#6366F1" : cardBorder },
          isSelected && styles.selected,
        ]}
      >
        <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      </View>
    </Pressable>
  );
}

export function EmojiPicker({ selectedEmoji, onSelect }: EmojiPickerProps) {
  return (
    <View style={styles.container}>
      {HABIT_EMOJIS.map(emoji => (
        <EmojiOption
          key={emoji}
          emoji={emoji}
          isSelected={selectedEmoji === emoji}
          onPress={() => onSelect(emoji)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 8,
  },
  emojiOption: {
    padding: 2,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    borderColor: "#6366F1",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  emoji: {
    fontSize: 24,
  },
});
