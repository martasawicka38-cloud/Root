import { Stack } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../styles/tokens";

export default function CompanyLayout() {
  if (Platform.OS !== "web") {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTitle}>Panel firmy</Text>
        <Text style={styles.fallbackText}>
          Panel administracyjny firmy jest dostepny tylko na platformie web.
        </Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
  },
  fallbackText: {
    fontSize: 15,
    color: colors.olive,
    textAlign: "center",
    marginTop: 8,
  },
});
