import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchRanking } from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function RankingScreen() {
  const mode = useAppStore((s) => s.rankMode);
  const setMode = useAppStore((s) => s.setRankMode);
  const { data } = useQuery({ queryKey: ["ranking"], queryFn: fetchRanking });
  const rows = mode === "team" ? (data?.team ?? []) : (data?.individual ?? []);

  return (
    <Screen>
      <Text style={styles.title}>Ranking</Text>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, mode === "team" && styles.tabActive]}
          onPress={() => setMode("team")}
        >
          <Text>Druzynowy</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, mode === "individual" && styles.tabActive]}
          onPress={() => setMode("individual")}
        >
          <Text>Indywidualny</Text>
        </Pressable>
      </View>
      {rows.map((row, index) => (
        <View style={styles.card} key={`${row.name}-${index}`}>
          <Text>
            {index + 1}. {row.name} ({row.points})
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  tabs: { flexDirection: "row", gap: 8 },
  tab: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: { backgroundColor: colors.mist, borderColor: colors.mossGreen },
  card: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
});
