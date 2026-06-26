import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { colors } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "../../lib/api/endpoints";

export default function HistoryScreen() {
  const filter = useAppStore((s) => s.historyFilter);
  const setFilter = useAppStore((s) => s.setHistoryFilter);
  const { data: items = [] } = useQuery({
    queryKey: ["history", filter],
    queryFn: () => fetchHistory(filter),
  });

  const visible = items;

  return (
    <Screen>
      <Text style={styles.title}>Historia transakcji</Text>
      <View style={styles.filters}>
        <Text style={styles.filter} onPress={() => setFilter("all")}>
          Wszystko
        </Text>
        <Text style={styles.filter} onPress={() => setFilter("earned")}>
          Zdobyte
        </Text>
        <Text style={styles.filter} onPress={() => setFilter("spent")}>
          Wydane
        </Text>
      </View>
      {visible.map((i) => (
        <View key={i.id} style={styles.item}>
          <Text style={styles.name}>{i.name}</Text>
          <Text
            style={[styles.points, i.points < 0 ? styles.spent : styles.earned]}
          >
            {i.points > 0 ? "+" : ""}
            {i.points}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  filters: { flexDirection: "row", gap: 12 },
  filter: { color: colors.mossGreen, fontWeight: "600" },
  item: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: { color: colors.slate900 },
  points: { fontWeight: "700" },
  earned: { color: colors.success },
  spent: { color: colors.error },
});
