/**
 * IconPicker - Grid of icon options for habit customization
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
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
}: {
  icon: IconName;
  isSelected: boolean;
  onPress: () => void;
  accentColor: string;
}) {
  const cardBorder = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");

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
          { borderColor: isSelected ? accentColor : cardBorder },
          isSelected && { borderColor: accentColor, backgroundColor: accentColor + "15" },
        ]}
      >
        <MaterialIcons name={icon} size={24} color={isSelected ? accentColor : mutedColor} />
      </View>
    </Pressable>
  );
}

export function IconPicker({ selectedIcon, onSelect, color }: IconPickerProps) {
  const tintColor = useThemeColor({}, "tint");
  const accentColor = color || tintColor;

  return (
    <View style={styles.container}>
      {HABIT_ICONS.map(icon => (
        <IconOption
          key={icon}
          icon={icon}
          isSelected={selectedIcon === icon}
          onPress={() => onSelect(icon)}
          accentColor={accentColor}
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
  iconOption: {
    padding: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
