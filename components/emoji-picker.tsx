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
  const tintColor = useThemeColor({}, "tint");

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
          { borderColor: isSelected ? tintColor : cardBorder },
          isSelected && { borderColor: tintColor, backgroundColor: tintColor + "15" },
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
  emoji: {
    fontSize: 22,
  },
});
