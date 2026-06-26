import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchMe } from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";

export default function ProfileScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const name = me?.name ?? "Jan Kowalski";
  const email = me?.email ?? "jan@intel.com";

  return (
    <Screen>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <Link href="/(mobile)/edit-profile" style={styles.link}>
        Edytuj profil
      </Link>
      <Link href="/(mobile)/history" style={styles.link}>
        Historia transakcji
      </Link>
      <Link href="/(mobile)/achievements" style={styles.link}>
        Osiagniecia
      </Link>
      <Link href="/(mobile)/settings" style={styles.link}>
        Ustawienia
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  card: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
  name: { color: colors.slate900, fontWeight: "700", fontSize: 18 },
  email: { color: colors.slate600, marginTop: 4 },
  link: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
    color: colors.slate900,
    fontWeight: "600",
  },
});
