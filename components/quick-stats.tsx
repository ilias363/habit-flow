/**
 * QuickStats - Grid of key statistics
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

  return (
    <View style={styles.container}>
      {stats.map((stat, i) => (
        <View key={i} style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
          <ThemedText style={styles.value}>{stat.value}</ThemedText>
          <ThemedText style={[styles.label, { color: mutedColor }]}>{stat.label}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 8, marginBottom: 16 },
  card: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center" },
  value: { fontSize: 22, fontWeight: "700" },
  label: { fontSize: 11, marginTop: 2, textAlign: "center" },
});
