/**
 * Data stats card for settings
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

interface DataStatsCardProps {
  habitCount: number;
  logCount: number;
}

export function DataStatsCard({ habitCount, logCount }: DataStatsCardProps) {
  const cardBg = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const tintColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "muted");

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: tintColor + "20" }]}>
          <MaterialIcons name="storage" size={22} color={tintColor} />
        </View>
        <ThemedText type="subtitle">Your Data</ThemedText>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <ThemedText style={[styles.value, { color: tintColor }]}>{habitCount}</ThemedText>
          <ThemedText style={[styles.label, { color: mutedColor }]}>Habits</ThemedText>
        </View>
        <View style={styles.item}>
          <ThemedText style={[styles.value, { color: tintColor }]}>{logCount}</ThemedText>
          <ThemedText style={[styles.label, { color: mutedColor }]}>Log Entries</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  item: {
    alignItems: "center",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
  },
  label: {
    fontSize: 13,
    marginTop: 4,
  },
});
