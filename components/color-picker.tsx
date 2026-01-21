/**
 * ColorPicker - Glassmorphism color selection grid
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { GlassStyles } from "@/constants/theme";
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
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.colorOption, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={[styles.colorCircle, { backgroundColor: color }, isSelected && styles.selected]}>
        {isSelected && <MaterialIcons name="check" size={20} color="#FFFFFF" />}
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
    gap: GlassStyles.spacing.sm,
    justifyContent: "center",
    paddingVertical: GlassStyles.spacing.sm,
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
    transform: [{ scale: 1.1 }],
  },
});
