import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchChallenge } from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";

export default function ChallengeScreen() {
  const { data } = useQuery({
    queryKey: ["challenge"],
    queryFn: fetchChallenge,
  });

  return (
    <Screen>
      <Text style={styles.title}>Wyzwanie</Text>
      <View style={styles.hero}>
        <Text style={styles.head}>
          {data?.title ?? "10 000 krokow dziennie"}
        </Text>
        <Text style={styles.sub}>Zespol {data?.team ?? "ERGO Hestia"}</Text>
      </View>
      <View style={styles.card}>
        <Text>
          Postep: {data?.daysDone ?? 5}/{data?.daysTotal ?? 7} dni (
          {data?.progress ?? 71}%)
        </Text>
      </View>
      <View style={styles.card}>
        <Text>Bonus po ukonczeniu: +{data?.reward ?? 200} EC</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  hero: { backgroundColor: "#FEF3C7", borderRadius: 12, padding: 12 },
  head: { color: colors.deepForest, fontWeight: "700", fontSize: 18 },
  sub: { color: colors.slate600, marginTop: 4 },
  card: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
});
