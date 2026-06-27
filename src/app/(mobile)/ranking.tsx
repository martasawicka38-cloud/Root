import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

import { Screen } from "../../features/common/Screen";
import { fetchRanking } from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

function GoldMedal({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={14} r={6} fill="#E8C44C" stroke="#D4A020" strokeWidth={1.5} />
      <Path d="M12 8l2-6h-4l2 6Z" fill="#E8C44C" stroke="#D4A020" strokeWidth={1} />
    </Svg>
  );
}

function SilverMedal({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={14} r={6} fill="#D0D5E0" stroke="#A0A8B8" strokeWidth={1.5} />
      <Path d="M12 8l2-6h-4l2 6Z" fill="#D0D5E0" stroke="#A0A8B8" strokeWidth={1} />
    </Svg>
  );
}

function BronzeMedal({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={14} r={6} fill="#E79D70" stroke="#D08050" strokeWidth={1.5} />
      <Path d="M12 8l2-6h-4l2 6Z" fill="#E79D70" stroke="#D08050" strokeWidth={1} />
    </Svg>
  );
}

export default function RankingScreen() {
  const mode = useAppStore((s) => s.rankMode);
  const setMode = useAppStore((s) => s.setRankMode);
  const { data } = useQuery({ queryKey: ["ranking"], queryFn: fetchRanking });
  const rows = mode === "team" ? (data?.team ?? []) : (data?.individual ?? []);
  const podium = rows.slice(0, 3);
  const listRows = rows.slice(3, 8);

  const medals = [SilverMedal, GoldMedal, BronzeMedal];

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerBack}>‹</Text>
        <Text style={styles.headerTitle}>Ranking</Text>
        <View style={styles.headerBack} />
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, mode === "team" && styles.tabActive]}
          onPress={() => setMode("team")}
        >
          <Text style={[styles.tabText, mode === "team" && styles.tabTextActive]}>
            Druzynowy
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, mode === "individual" && styles.tabActive]}
          onPress={() => setMode("individual")}
        >
          <Text style={[styles.tabText, mode === "individual" && styles.tabTextActive]}>
            Indywidualny
          </Text>
        </Pressable>
      </View>

      <View style={styles.podium}>
        {podium.map((row, idx) => {
          const Medal = medals[idx];
          return (
            <View
              key={`${row.name}-${idx}`}
              style={[
                styles.podiumCard,
                idx === 0 && styles.podiumFirst,
                idx === 1 && styles.podiumSecond,
                idx === 2 && styles.podiumThird,
              ]}
            >
              <Medal size={32} />
              <Text style={styles.podiumName}>
                {mode === "team"
                  ? `Zespol ${String.fromCharCode(65 + idx)}`
                  : row.name}
              </Text>
              <Text style={styles.podiumPoints}>
                {row.points.toLocaleString("pl-PL")}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.list}>
        {listRows.map((row, index) => (
          <View
            key={`${row.name}-${index}`}
            style={[styles.listCard, index === 1 && styles.listCardHighlight]}
          >
            <Text style={styles.listRank}>{index + 4}</Text>
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>{row.name.slice(0, 1)}</Text>
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{row.name}</Text>
              <Text style={styles.listMeta}>
                {Math.round(row.points * 0.84).toLocaleString("pl-PL")} krokow
              </Text>
            </View>
            <Text style={styles.listPoints}>
              {row.points.toLocaleString("pl-PL")}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBack: {
    width: 24,
    fontSize: 22,
    color: colors.slate900,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  tabActive: {
    backgroundColor: colors.mossGreen,
    borderColor: colors.mossGreen,
  },
  tabText: {
    fontSize: 14,
    color: colors.slate600,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.white,
  },
  podium: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  podiumCard: {
    flex: 1,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  podiumFirst: {
    height: 140,
    backgroundColor: "#FEF3C7",
  },
  podiumSecond: {
    height: 112,
    backgroundColor: "#F1F5F9",
  },
  podiumThird: {
    height: 96,
    backgroundColor: "#FFF7ED",
  },
  podiumName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate700,
    textAlign: "center",
  },
  podiumPoints: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.deepForest,
  },
  list: {
    marginTop: 12,
    gap: 8,
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: "#F8FAFC",
  },
  listCardHighlight: {
    backgroundColor: colors.mist,
    borderColor: colors.sage,
  },
  listRank: {
    width: 24,
    fontSize: 15,
    fontWeight: "700",
    color: colors.slate400,
    textAlign: "center",
  },
  listAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "#AF28E3",
    alignItems: "center",
    justifyContent: "center",
  },
  listAvatarText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  listInfo: {
    flex: 1,
    gap: 2,
  },
  listName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.slate900,
  },
  listMeta: {
    fontSize: 12,
    color: colors.slate500,
  },
  listPoints: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepForest,
  },
});
