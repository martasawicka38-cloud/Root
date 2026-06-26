import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchRanking } from "../../lib/api/endpoints";
import { colors, radius, spacing, typography } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function RankingScreen() {
  const mode = useAppStore((s) => s.rankMode);
  const setMode = useAppStore((s) => s.setRankMode);
  const { data } = useQuery({ queryKey: ["ranking"], queryFn: fetchRanking });
  const rows = mode === "team" ? (data?.team ?? []) : (data?.individual ?? []);
  const podium = rows.slice(0, 3);
  const listRows = rows.slice(3, 6);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.back}>‹</Text>
        <Text style={styles.title}>Ranking</Text>
        <Text style={styles.back}> </Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, mode === "team" && styles.tabActive]}
          onPress={() => setMode("team")}
        >
          <Text
            style={[styles.tabText, mode === "team" && styles.tabTextActive]}
          >
            Druzynowy
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, mode === "individual" && styles.tabActive]}
          onPress={() => setMode("individual")}
        >
          <Text
            style={[
              styles.tabText,
              mode === "individual" && styles.tabTextActive,
            ]}
          >
            Indywidualny
          </Text>
        </Pressable>
      </View>

      <View style={styles.podiumRow}>
        {podium.map((row, idx) => (
          <View
            style={[
              styles.podiumCard,
              idx === 1 && styles.podiumCenter,
              idx === 0 && styles.podiumLeft,
              idx === 2 && styles.podiumRight,
            ]}
            key={`${row.name}-${idx}`}
          >
            <Text style={styles.podiumMedal}>
              {idx === 0 ? "🥈" : idx === 1 ? "🥇" : "🥉"}
            </Text>
            <Text style={styles.podiumName}>
              Zespol {String.fromCharCode(65 + idx)}
            </Text>
            <Text style={styles.podiumPoints}>
              {row.points.toLocaleString("pl-PL")}
            </Text>
          </View>
        ))}
      </View>

      {listRows.map((row, index) => (
        <View
          style={[styles.rowCard, index === 2 && styles.rowCardActive]}
          key={`${row.name}-${index}`}
        >
          <Text style={styles.rowIndex}>{index + 4}</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{row.name.slice(0, 1)}</Text>
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowName}>{row.name}</Text>
            <Text style={styles.rowMeta}>
              {Math.round(row.points * 0.84).toLocaleString("pl-PL")} krokow
            </Text>
          </View>
          <Text style={styles.rowPoints}>
            {row.points.toLocaleString("pl-PL")}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  back: {
    width: 24,
    fontSize: 22,
    color: colors.slate900,
  },
  title: {
    ...typography.h1,
    color: colors.deepForest,
    textAlign: "center",
    flex: 1,
  },
  tabs: { flexDirection: "row", gap: 8, marginTop: spacing.xs },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    alignItems: "center",
    backgroundColor: "#EEF2F5",
  },
  tabActive: { backgroundColor: colors.white, borderColor: colors.slate300 },
  tabText: {
    ...typography.body,
    color: colors.slate600,
    fontWeight: "700",
  },
  tabTextActive: {
    color: colors.slate900,
  },
  podiumRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.x3s,
  },
  podiumCard: {
    flex: 1,
    backgroundColor: "#D6DAE5",
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.x2s,
    height: 96,
  },
  podiumLeft: {
    backgroundColor: "#D0D5E0",
  },
  podiumCenter: {
    height: 128,
    backgroundColor: "#E8C44C",
  },
  podiumRight: {
    backgroundColor: "#E79D70",
  },
  podiumMedal: {
    fontSize: 18,
  },
  podiumName: {
    ...typography.h3,
    color: colors.slate900,
  },
  podiumPoints: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  rowCard: {
    marginTop: spacing.x3s,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    padding: 12,
    backgroundColor: colors.white,
  },
  rowCardActive: {
    backgroundColor: "#D8EEE3",
    borderColor: "#80D1AD",
  },
  rowIndex: {
    width: 22,
    ...typography.h3,
    color: colors.slate600,
    textAlign: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "#AF28E3",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.x3s,
  },
  avatarText: {
    color: colors.white,
    fontWeight: "700",
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    ...typography.h3,
    color: colors.slate900,
  },
  rowMeta: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  rowPoints: {
    ...typography.h3,
    color: colors.deepForest,
    fontWeight: "800",
  },
});
