import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import {
  fetchCompanyLeaderboard,
  fetchLeaderboard,
  fetchMyRank,
} from "../../lib/api/endpoints";
import type { CompanyLeaderboardEntry, LeaderboardEntry, LeaderboardPeriod } from "../../lib/types/api";
import { colors, radius, spacing } from "../../styles/tokens";

const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
  { key: "daily", label: "Dzień" },
  { key: "weekly", label: "Tydzień" },
  { key: "monthly", label: "Miesiąc" },
  { key: "quarterly", label: "Kwartał" },
  { key: "yearly", label: "Rok" },
];

type Scope = "individual" | "company";

function PodiumIcon({ rank }: { rank: number }) {
  const colorsMap = ["#E8C44C", "#D0D5E0", "#E79D70"];
  return (
    <View style={[styles.podiumIcon, { backgroundColor: colorsMap[rank - 1] ?? colors.slate300 }]}>
      <Text style={styles.podiumIconText}>{rank}</Text>
    </View>
  );
}

function IndividualRanking({ period }: { period: LeaderboardPeriod }) {
  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ["leaderboard", period, "individual"],
    queryFn: () => fetchLeaderboard(period),
  });

  const { data: myRank } = useQuery({
    queryKey: ["my-rank", period],
    queryFn: () => fetchMyRank(period),
  });

  if (isLoading) return <ActivityIndicator style={{ padding: 40 }} />;
  if (error) return <Text style={styles.emptyText}>Błąd rankingu: {error.message}</Text>;

  const rows = leaderboard ?? [];
  const podium = rows.slice(0, 3);
  const listRows = rows.slice(3, 20);

  if (rows.length === 0) {
    return <Text style={styles.emptyText}>Brak aktywności w tym okresie.</Text>;
  }

  return (
    <>
      {podium.length > 0 && (
        <View style={styles.podium}>
          {podium.map((entry: LeaderboardEntry, idx: number) => (
            <View
              key={entry.userId}
              style={[
                styles.podiumCard,
                idx === 0 && styles.podiumFirst,
                idx === 1 && styles.podiumSecond,
                idx === 2 && styles.podiumThird,
              ]}
            >
              <PodiumIcon rank={entry.rank} />
              <Text style={styles.podiumName} numberOfLines={1}>{entry.name}</Text>
              <Text style={styles.podiumPoints}>{entry.points}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.list}>
        {listRows.map((entry: LeaderboardEntry) => (
          <View key={entry.userId} style={styles.listRow}>
            <Text style={styles.listRank}>{entry.rank}</Text>
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>{entry.name.slice(0, 1)}</Text>
            </View>
            <Text style={styles.listName} numberOfLines={1}>{entry.name}</Text>
            {entry.rootStage && (
              <View style={styles.stageBadge}>
                <Text style={styles.stageBadgeText}>Lv.{entry.rootStage.level}</Text>
              </View>
            )}
            <Text style={styles.listPoints}>{entry.points}</Text>
          </View>
        ))}
      </View>

      {myRank && myRank.rank && (
        <View style={styles.myRank}>
          <Text style={styles.myRankText}>
            #{myRank.rank} / {myRank.totalParticipants} · {myRank.points} pkt
          </Text>
        </View>
      )}
    </>
  );
}

function CompanyRanking({ period }: { period: LeaderboardPeriod }) {
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ["leaderboard", period, "company"],
    queryFn: () => fetchCompanyLeaderboard(period),
  });

  if (isLoading) return <ActivityIndicator style={{ padding: 40 }} />;
  if (error) return <Text style={styles.emptyText}>Błąd rankingu firm: {error.message}</Text>;

  const rows = companies ?? [];
  const podium = rows.slice(0, 3);
  const listRows = rows.slice(3);

  if (rows.length === 0) {
    return <Text style={styles.emptyText}>Brak aktywności w tym okresie.</Text>;
  }

  return (
    <>
      {podium.length > 0 && (
        <View style={styles.podium}>
          {podium.map((entry: CompanyLeaderboardEntry, idx: number) => (
            <View
              key={entry.slug}
              style={[
                styles.podiumCard,
                idx === 0 && styles.podiumFirst,
                idx === 1 && styles.podiumSecond,
                idx === 2 && styles.podiumThird,
              ]}
            >
              <PodiumIcon rank={entry.rank} />
              <Text style={styles.podiumName} numberOfLines={1}>{entry.name}</Text>
              <Text style={styles.podiumPoints}>{entry.points}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.list}>
        {listRows.map((entry: CompanyLeaderboardEntry) => (
          <View key={entry.slug} style={styles.listRow}>
            <Text style={styles.listRank}>{entry.rank}</Text>
            <View style={[styles.listAvatar, styles.companyAvatar]}>
              <Text style={styles.listAvatarText}>{entry.name.slice(0, 1)}</Text>
            </View>
            <View style={styles.listNameWrap}>
              <Text style={styles.listName} numberOfLines={1}>{entry.name}</Text>
              <Text style={styles.listMemberCount}>{entry.memberCount} członków</Text>
            </View>
            <Text style={styles.listPoints}>{entry.points}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

export default function RankingScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>("weekly");
  const [scope, setScope] = useState<Scope>("individual");

  return (
    <Screen>
      <Text style={styles.screenTitle}>Ranking</Text>

      {/* Scope tabs */}
      <View style={styles.scopeRow}>
        <Pressable
          style={[styles.scopeTab, scope === "individual" && styles.scopeTabActive]}
          onPress={() => setScope("individual")}
        >
          <Text style={[styles.scopeText, scope === "individual" && styles.scopeTextActive]}>
            Indywidualny
          </Text>
        </Pressable>
        <Pressable
          style={[styles.scopeTab, scope === "company" && styles.scopeTabActive]}
          onPress={() => setScope("company")}
        >
          <Text style={[styles.scopeText, scope === "company" && styles.scopeTextActive]}>
            Firmowy
          </Text>
        </Pressable>
      </View>

      {/* Period selector */}
      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <Pressable
            key={p.key}
            style={[styles.periodBtn, selectedPeriod === p.key && styles.periodBtnActive]}
            onPress={() => setSelectedPeriod(p.key)}
          >
            <Text style={[styles.periodText, selectedPeriod === p.key && styles.periodTextActive]}>
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {scope === "individual" ? (
        <IndividualRanking period={selectedPeriod} />
      ) : (
        <CompanyRanking period={selectedPeriod} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: 22, fontWeight: "700", color: colors.slate900, marginBottom: spacing.sm },

  scopeRow: { flexDirection: "row", gap: 8, marginBottom: spacing.xs },
  scopeTab: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, alignItems: "center", backgroundColor: "#F8FAFC" },
  scopeTabActive: { backgroundColor: colors.mossGreen, borderColor: colors.mossGreen },
  scopeText: { fontSize: 14, fontWeight: "600", color: colors.slate600 },
  scopeTextActive: { color: colors.white },

  periodRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: spacing.sm },
  periodBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.slate100 },
  periodBtnActive: { backgroundColor: colors.deepForest },
  periodText: { fontSize: 13, fontWeight: "600", color: colors.slate600 },
  periodTextActive: { color: colors.white },

  emptyText: { textAlign: "center", padding: 40, color: colors.slate400, fontSize: 14 },

  podium: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: spacing.sm },
  podiumCard: { flex: 1, borderRadius: radius.md, alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 6 },
  podiumFirst: { height: 140, backgroundColor: "#FEF3C7" },
  podiumSecond: { height: 112, backgroundColor: "#F1F5F9" },
  podiumThird: { height: 96, backgroundColor: "#FFF7ED" },
  podiumIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  podiumIconText: { fontSize: 14, fontWeight: "800", color: colors.white },
  podiumName: { fontSize: 13, fontWeight: "600", color: colors.slate700, textAlign: "center", maxWidth: "90%" },
  podiumPoints: { fontSize: 16, fontWeight: "800", color: colors.deepForest },

  list: { gap: 6, marginBottom: spacing.sm },
  listRow: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 12, backgroundColor: "#F8FAFC" },
  listRank: { width: 24, fontSize: 14, fontWeight: "700", color: colors.slate400, textAlign: "center" },
  listAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#AF28E3", alignItems: "center", justifyContent: "center" },
  companyAvatar: { backgroundColor: colors.deepForest },
  listAvatarText: { color: colors.white, fontWeight: "700", fontSize: 13 },
  listName: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.slate900 },
  listNameWrap: { flex: 1 },
  listMemberCount: { fontSize: 11, color: colors.slate500, marginTop: 1 },
  stageBadge: { backgroundColor: colors.mossGreen, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  stageBadgeText: { color: colors.white, fontSize: 11, fontWeight: "700" },
  listPoints: { fontSize: 15, fontWeight: "800", color: colors.deepForest },

  myRank: { padding: spacing.xs, backgroundColor: colors.mist, borderRadius: radius.md, alignItems: "center" },
  myRankText: { fontSize: 13, fontWeight: "600", color: colors.deepForest },
});
