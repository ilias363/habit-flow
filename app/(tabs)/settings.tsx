/**
 * Settings screen - Glassmorphism data management
 */

import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import { DataStatsCard } from "@/components/data-stats-card";
import { ScreenHeader } from "@/components/screen-header";
import { SettingsButton } from "@/components/settings-button";
import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Colors, GlassStyles, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHabits } from "@/hooks/use-habits";
import { useTheme } from "@/hooks/use-theme-context";
import {
  clearAllData,
  getHabits,
  getLogs,
  saveHabits,
  saveLogs,
  ThemePreference,
} from "@/lib/storage";
import { Habit, HabitLog } from "@/types";

interface ExportData {
  version: 1;
  exportedAt: number;
  habits: Habit[];
  logs: HabitLog[];
}

export default function SettingsScreen() {
  const { refreshHabits } = useHabits();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({ habitCount: 0, logCount: 0 });

  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const loadStats = async () => {
    const [habits, logs] = await Promise.all([getHabits(), getLogs()]);
    setStats({ habitCount: habits.length, logCount: logs.length });
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, []),
  );

  const handleThemeChange = () => {
    const themes: ThemePreference[] = ["system", "light", "dark"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "System";
    }
  };

  const getThemeIcon = (): "brightness-auto" | "light-mode" | "dark-mode" => {
    switch (theme) {
      case "light":
        return "light-mode";
      case "dark":
        return "dark-mode";
      default:
        return "brightness-auto";
    }
  };

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
    <GradientBackground style={styles.container}>
      <ScreenHeader title="Settings" subtitle="Manage" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DataStatsCard habitCount={stats.habitCount} logCount={stats.logCount} />

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Appearance</ThemedText>
          <GlassCard variant="default" noPadding style={styles.card}>
            <SettingsButton
              icon={getThemeIcon()}
              iconColor={colors.tint}
              title="Theme"
              description={getThemeLabel()}
              onPress={handleThemeChange}
              isLast
            />
          </GlassCard>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Backup & Restore
          </ThemedText>
          <GlassCard variant="default" noPadding style={styles.card}>
            <SettingsButton
              icon="cloud-upload"
              iconColor={colors.tint}
              title="Export Data"
              description="Save your habits as a backup file"
              onPress={handleExport}
              loading={loading === "export"}
            />
            <SettingsButton
              icon="cloud-download"
              iconColor={colors.success}
              title="Import Data"
              description="Restore from a backup file"
              onPress={handleImport}
              loading={loading === "import"}
              isLast
            />
          </GlassCard>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Danger Zone</ThemedText>
          <GlassCard variant="default" noPadding style={styles.card}>
            <SettingsButton
              icon="delete-forever"
              iconColor={colors.danger}
              title="Clear All Data"
              description="Permanently delete all habits and logs"
              onPress={handleClearData}
              loading={loading === "clear"}
              destructive
              isLast
            />
          </GlassCard>
        </View>

        <GlassCard variant="default" style={styles.infoCard}>
          <ThemedText style={[styles.infoText, { color: colors.muted }]}>
            Your data is stored securely on your device.{"\n"}
            Use export to transfer to another device.
          </ThemedText>
        </GlassCard>

        <ThemedText style={[styles.version, { color: colors.muted }]}>
          Habit Flow v{Constants.expoConfig?.version ?? "1.0.0"}
        </ThemedText>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: GlassStyles.spacing.md,
    paddingTop: GlassStyles.spacing.sm,
    paddingBottom: 120,
  },
  section: {
    marginBottom: GlassStyles.spacing.lg,
  },
  sectionTitle: {
    ...Typography.title3,
    marginBottom: GlassStyles.spacing.md,
    marginLeft: GlassStyles.spacing.xs,
  },
  card: {
    borderRadius: GlassStyles.borderRadius.lg,
    overflow: "hidden",
  },
  infoCard: {
    marginTop: GlassStyles.spacing.sm,
  },
  infoText: {
    ...Typography.footnote,
    lineHeight: 20,
    textAlign: "center",
  },
  version: {
    ...Typography.caption1,
    textAlign: "center",
    marginTop: GlassStyles.spacing.xl,
    opacity: 0.6,
  },
});
