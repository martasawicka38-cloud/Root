import { Platform, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { colors } from "../../styles/tokens";

export default function AdminScreen() {
  if (Platform.OS !== "web") {
    return (
      <Screen>
        <Text style={styles.title}>Admin</Text>
        <Text style={styles.body}>Panel admin jest dostepny tylko na web.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Panel Admin (web-only)</Text>
      <View style={styles.card}>
        <Text>Zarzadzanie uzytkownikami</Text>
      </View>
      <View style={styles.card}>
        <Text>Moderacja deklaracji</Text>
      </View>
      <View style={styles.card}>
        <Text>Statystyki programu wellbeing</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  body: { color: colors.slate600 },
  card: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
});
