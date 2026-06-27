import { Stack } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function AdminLayout() {
  if (Platform.OS !== "web") {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTitle}>Panel administracyjny</Text>
        <Text style={styles.fallbackText}>
          Panel administracyjny jest dostepny tylko na platformie web.
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
    padding: 40,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B4332",
    textAlign: "center",
  },
  fallbackText: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
  },
});
