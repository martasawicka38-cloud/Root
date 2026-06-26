import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchMe } from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function SettingsScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const partner = me?.partner ?? "intel";
  const logout = useAppStore((s) => s.logout);

  return (
    <Screen>
      <Text style={styles.title}>Ustawienia</Text>
      <View style={styles.item}>
        <Text>
          Partner: {partner === "intel" ? "Intel Poland" : "ERGO Hestia"}
        </Text>
      </View>
      <View style={styles.item}>
        <Text>Wersja: 1.0.0</Text>
      </View>
      <Pressable
        style={styles.button}
        onPress={() => {
          logout();
          router.replace("/(auth)/login");
        }}
      >
        <Text style={styles.buttonText}>Wyloguj</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  item: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
  button: { backgroundColor: colors.sunset, borderRadius: 10, padding: 12 },
  buttonText: { color: colors.white, textAlign: "center", fontWeight: "700" },
});
