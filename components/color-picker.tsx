/**
 * ColorPicker - Grid of color options for habit customization
 */

import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { HABIT_COLORS } from "@/types";

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

function ColorOption({
  color,
  isSelected,
  onPress,
}: {
  color: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const backgroundColor = useThemeColor({}, "background");

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.colorOption, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        style={[
          styles.colorCircle,
          { backgroundColor: color },
          isSelected && [styles.selected, { borderColor: backgroundColor }],
        ]}
      >
        {isSelected && <View style={[styles.checkmark, { backgroundColor }]} />}
      </View>
    </Pressable>
  );
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {HABIT_COLORS.map(color => (
        <ColorOption
          key={color}
          color={color}
          isSelected={selectedColor === color}
          onPress={() => onSelect(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    paddingVertical: 8,
  },
  colorOption: {
    padding: 4,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
