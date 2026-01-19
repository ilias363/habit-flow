/**
 * QuickStats - Horizontal row of key statistics
 */

import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

interface StatItem {
  value: number | string;
  label: string;
}

interface QuickStatsProps {
  stats: StatItem[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={[styles.container, { backgroundColor: cardBackground, borderColor }]}>
      {stats.map((stat, i) => (
        <View key={i} style={[styles.stat, i < stats.length - 1 && styles.statBorder]}>
          <ThemedText style={[styles.value, { color: tintColor }]}>{stat.value}</ThemedText>
          <ThemedText style={[styles.label, { color: mutedColor }]}>{stat.label}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: "rgba(128, 128, 128, 0.2)",
  },
  value: { fontSize: 22, fontWeight: "700" },
  label: { fontSize: 12, marginTop: 4, fontWeight: "500" },
});
