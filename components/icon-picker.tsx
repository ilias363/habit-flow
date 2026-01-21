/**
 * IconPicker - Glassmorphism icon selection grid
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { Colors, GlassStyles } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HABIT_ICONS, IconName } from "@/types";

interface IconPickerProps {
  selectedIcon: IconName;
  onSelect: (icon: IconName) => void;
  color?: string;
}

function IconOption({
  icon,
  isSelected,
  onPress,
  accentColor,
  colors,
}: {
  icon: IconName;
  isSelected: boolean;
  onPress: () => void;
  accentColor: string;
  colors: typeof Colors.light;
}) {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.iconOption, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            borderColor: isSelected ? accentColor : colors.glassBorder,
            backgroundColor: isSelected ? accentColor + "20" : colors.glass,
          },
          isSelected && styles.selected,
        ]}
      >
        <MaterialIcons name={icon} size={24} color={isSelected ? accentColor : colors.muted} />
      </View>
    </Pressable>
  );
}

export function IconPicker({ selectedIcon, onSelect, color }: IconPickerProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const accentColor = color || colors.primary;

  return (
    <View style={styles.container}>
      {HABIT_ICONS.map(icon => (
        <IconOption
          key={icon}
          icon={icon}
          isSelected={selectedIcon === icon}
          onPress={() => onSelect(icon)}
          accentColor={accentColor}
          colors={colors}
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
  iconOption: {
    padding: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: GlassStyles.borderRadius.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {},
});
