/**
 * Settings screen - Export, import, and data management
 */

import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DataStatsCard } from "@/components/data-stats-card";
import { SettingsButton } from "@/components/settings-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHabits } from "@/hooks/use-habits";
import { useThemeColor } from "@/hooks/use-theme-color";
import { clearAllData, getHabits, getLogs, saveHabits, saveLogs } from "@/lib/storage";
import { Habit, HabitLog } from "@/types";

interface ExportData {
  version: 1;
  exportedAt: number;
  habits: Habit[];
  logs: HabitLog[];
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { refreshHabits } = useHabits();
  const [loading, setLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({ habitCount: 0, logCount: 0 });

  const cardBg = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "cardBorder");
  const mutedColor = useThemeColor({}, "muted");

  const loadStats = async () => {
    const [habits, logs] = await Promise.all([getHabits(), getLogs()]);
    setStats({ habitCount: habits.length, logCount: logs.length });
  };

  useFocusEffect(() => {
    loadStats();
  });

  const handleExport = async () => {
    try {
      setLoading("export");
      const [habits, logs] = await Promise.all([getHabits(), getLogs()]);

      const exportData: ExportData = {
        version: 1,
        exportedAt: Date.now(),
        habits,
        logs,
      };

      const fileName = `habit-flow-backup-${new Date().toISOString().split("T")[0]}.json`;
      const file = new File(Paths.cache, fileName);

      if (file.exists) file.delete();
      file.create();
      file.write(JSON.stringify(exportData, null, 2));

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: "Export Habit Data",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Error", "Failed to export data");
    } finally {
      setLoading(null);
    }
  };

  const handleImport = async () => {
    try {
      setLoading("import");

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        setLoading(null);
        return;
      }

      const importFile = new File(result.assets[0].uri);
      const fileContent = await importFile.text();
      const importData = JSON.parse(fileContent) as ExportData;

      if (
        !importData.version ||
        !Array.isArray(importData.habits) ||
        !Array.isArray(importData.logs)
      ) {
        Alert.alert("Error", "Invalid backup file format");
        setLoading(null);
        return;
      }

      Alert.alert(
        "Import Data",
        `Found ${importData.habits.length} habits and ${importData.logs.length} logs.`,
        [
          { text: "Cancel", style: "cancel", onPress: () => setLoading(null) },
          {
            text: "Merge",
            onPress: async () => {
              try {
                const [existingHabits, existingLogs] = await Promise.all([getHabits(), getLogs()]);
                const existingHabitIds = new Set(existingHabits.map(h => h.id));
                const newHabits = importData.habits.filter(h => !existingHabitIds.has(h.id));
                await saveHabits([...existingHabits, ...newHabits]);

                const existingLogIds = new Set(existingLogs.map(l => l.id));
                const newLogs = importData.logs.filter(l => !existingLogIds.has(l.id));
                await saveLogs([...existingLogs, ...newLogs]);

                await loadStats();
                await refreshHabits();
                Alert.alert(
                  "Success",
                  `Added ${newHabits.length} habits and ${newLogs.length} logs`,
                );
              } catch {
                Alert.alert("Error", "Failed to merge data");
              } finally {
                setLoading(null);
              }
            },
          },
          {
            text: "Replace",
            style: "destructive",
            onPress: async () => {
              try {
                await Promise.all([saveHabits(importData.habits), saveLogs(importData.logs)]);
                await loadStats();
                await refreshHabits();
                Alert.alert("Success", `Imported ${importData.habits.length} habits`);
              } catch {
                Alert.alert("Error", "Failed to import data");
              } finally {
                setLoading(null);
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error("Import error:", error);
      Alert.alert("Error", "Failed to read backup file");
      setLoading(null);
    }
  };

  const handleClearData = () => {
    if (stats.habitCount === 0 && stats.logCount === 0) {
      Alert.alert("No Data", "There's no data to clear");
      return;
    }

    Alert.alert(
      "Clear All Data",
      `Delete ${stats.habitCount} habits and ${stats.logCount} logs? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading("clear");
              await clearAllData();
              await loadStats();
              await refreshHabits();
              Alert.alert("Done", "All data has been cleared");
            } catch {
              Alert.alert("Error", "Failed to clear data");
            } finally {
              setLoading(null);
            }
          },
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <ThemedText type="title">Settings</ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedColor }]}>Manage your data</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DataStatsCard habitCount={stats.habitCount} logCount={stats.logCount} />

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Backup
          </ThemedText>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <SettingsButton
              icon="file-upload"
              iconColor="#3b82f6"
              title="Export Data"
              description="Save as JSON backup file"
              onPress={handleExport}
              loading={loading === "export"}
            />
            <SettingsButton
              icon="file-download"
              iconColor="#10b981"
              title="Import Data"
              description="Restore from backup file"
              onPress={handleImport}
              loading={loading === "import"}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Danger Zone
          </ThemedText>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <SettingsButton
              icon="delete-forever"
              iconColor="#ef4444"
              title="Clear All Data"
              description="Delete all habits and logs"
              onPress={handleClearData}
              loading={loading === "clear"}
              destructive
              isLast
            />
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: cardBg, borderColor }]}>
          <ThemedText style={[styles.infoText, { color: mutedColor }]}>
            All data is stored locally on your device.{"\n"}
            Create regular backups to prevent data loss.
          </ThemedText>
        </View>

        <ThemedText style={[styles.version, { color: mutedColor }]}>
          Habit Flow v{Constants.expoConfig?.version ?? "1.0.0"}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  version: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 24,
    opacity: 0.6,
  },
});
