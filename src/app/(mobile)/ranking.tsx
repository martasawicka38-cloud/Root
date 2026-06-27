import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import {
  fetchCompanyLeaderboard,
  fetchLeaderboard,
  fetchMyRank,
} from "../../lib/api/endpoints";
import type {
  CompanyLeaderboardEntry,
  LeaderboardEntry,
  LeaderboardPeriod,
} from "../../lib/types/api";
import { colors } from "../../styles/tokens";

const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
  { key: "daily", label: "Dzien" },
  { key: "weekly", label: "Tydzien" },
  { key: "monthly", label: "Miesiac" },
  { key: "quarterly", label: "Kwartal" },
  { key: "yearly", label: "Rok" },
];

type Scope = "individual" | "company";

function PodiumIcon({ rank }: { rank: number }) {
  const bgColors = [colors.greenBright, colors.creamDark, colors.creamMedium];
  return (
    <View
      style={[
        styles.podiumIcon,
        { backgroundColor: bgColors[rank - 1] ?? colors.creamDark },
      ]}
    >
      <Text style={styles.podiumIconText}>{rank}</Text>
    </View>
  );
}

function IndividualRanking({ period }: { period: LeaderboardPeriod }) {
  const {
    data: leaderboard,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leaderboard", period, "individual"],
    queryFn: () => fetchLeaderboard(period),
  });

  const { data: myRank } = useQuery({
    queryKey: ["my-rank", period],
    queryFn: () => fetchMyRank(period),
  });

  if (isLoading) return <ActivityIndicator style={{ padding: 40 }} />;
  if (error)
    return (
      <Text style={styles.errorText}>Blad rankingu: {error.message}</Text>
    );

  const rows = leaderboard ?? [];
  const podium = rows.slice(0, 3);
  const listRows = rows.slice(3, 20);

  if (rows.length === 0) {
    return <Text style={styles.emptyText}>Brak aktywnosci w tym okresie.</Text>;
  }

  return (
    <>
      {podium.length > 0 && (
        <View style={styles.podiumRow}>
          {podium.map((entry: LeaderboardEntry, idx: number) => (
            <View
              key={entry.userId}
              style={[
                styles.podiumCard,
                idx === 0
                  ? { backgroundColor: colors.greenLight, borderColor: colors.greenBright }
                  : { backgroundColor: colors.creamLight, borderColor: colors.creamDark },
              ]}
            >
              <View style={styles.podiumCardBody}>
                <PodiumIcon rank={entry.rank} />
                <Text style={styles.podiumName} numberOfLines={1}>
                  {entry.name}
                </Text>
                <Text style={styles.podiumPoints}>{entry.points} pkt</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.listContainer}>
        {listRows.map((entry: LeaderboardEntry) => (
          <View key={entry.userId} style={styles.listRow}>
            <Text style={styles.listRank}>{entry.rank}</Text>
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>
                {entry.name.slice(0, 1)}
              </Text>
            </View>
            <Text style={styles.listName} numberOfLines={1}>
              {entry.name}
            </Text>
            {entry.rootStage && (
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>
                  Poziom {entry.rootStage.level}
                </Text>
              </View>
            )}
            <Text style={styles.listPoints}>{entry.points} pkt</Text>
          </View>
        ))}
      </View>

      {myRank && myRank.rank && (
        <View style={styles.myRankBox}>
          <Text style={styles.myRankLabel}>Twoja pozycja</Text>
          <Text style={styles.myRankText}>
            #{myRank.rank} z {myRank.totalParticipants} uczestnikow · {myRank.points} pkt
          </Text>
        </View>
      )}
    </>
  );
}

function CompanyRanking({ period }: { period: LeaderboardPeriod }) {
  const {
    data: companies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leaderboard", period, "company"],
    queryFn: () => fetchCompanyLeaderboard(period),
  });

  if (isLoading) return <ActivityIndicator style={{ padding: 40 }} />;
  if (error)
    return (
      <Text style={styles.errorText}>Blad rankingu firm: {error.message}</Text>
    );

  const rows = companies ?? [];
  const podium = rows.slice(0, 3);
  const listRows = rows.slice(3);

  if (rows.length === 0) {
    return <Text style={styles.emptyText}>Brak aktywnosci w tym okresie.</Text>;
  }

  return (
    <>
      {podium.length > 0 && (
        <View style={styles.podiumRow}>
          {podium.map((entry: CompanyLeaderboardEntry, idx: number) => (
            <View
              key={entry.slug}
              style={[
                styles.podiumCard,
                idx === 0
                  ? { backgroundColor: colors.greenLight, borderColor: colors.greenBright }
                  : { backgroundColor: colors.creamLight, borderColor: colors.creamDark },
              ]}
            >
              <View style={styles.podiumCardBody}>
                <PodiumIcon rank={entry.rank} />
                <Text style={styles.podiumName} numberOfLines={1}>
                  {entry.name}
                </Text>
                <Text style={styles.podiumPoints}>{entry.points} pkt</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.listContainer}>
        {listRows.map((entry: CompanyLeaderboardEntry) => (
          <View key={entry.slug} style={styles.listRow}>
            <Text style={styles.listRank}>{entry.rank}</Text>
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>
                {entry.name.slice(0, 1)}
              </Text>
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.listName} numberOfLines={1}>
                {entry.name}
              </Text>
              <Text style={styles.companyMembers}>
                {entry.memberCount} czlonkow
              </Text>
            </View>
            <Text style={styles.listPoints}>{entry.points} pkt</Text>
          </View>
        ))}
      </View>
    </>
  );
}

export default function RankingScreen() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<LeaderboardPeriod>("weekly");
  const [scope, setScope] = useState<Scope>("individual");

  return (
    <Screen>
      <Text style={styles.title}>Ranking</Text>
      <Text style={styles.subtitle}>
        Punkty zdobywasz za aktywnosci ekologiczne. Im wiecej dzialasz, tym wyzej w rankingu.
      </Text>

      {/* Scope tabs */}
      <View style={styles.scopeTabs}>
        <Pressable
          onPress={() => setScope("individual")}
          style={[
            styles.scopeTab,
            scope === "individual"
              ? styles.scopeTabActive
              : styles.scopeTabInactive,
          ]}
        >
          <Text
            style={
              scope === "individual"
                ? styles.scopeTabTextActive
                : styles.scopeTabTextInactive
            }
          >
            Indywidualny
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setScope("company")}
          style={[
            styles.scopeTab,
            scope === "company"
              ? styles.scopeTabActive
              : styles.scopeTabInactive,
          ]}
        >
          <Text
            style={
              scope === "company"
                ? styles.scopeTabTextActive
                : styles.scopeTabTextInactive
            }
          >
            Firmowy
          </Text>
        </Pressable>
      </View>

      {/* Period selector */}
      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <Pressable
            key={p.key}
            onPress={() => setSelectedPeriod(p.key)}
            style={[
              styles.periodTab,
              selectedPeriod === p.key
                ? styles.periodTabActive
                : styles.periodTabInactive,
            ]}
          >
            <Text
              style={
                selectedPeriod === p.key
                  ? styles.periodTextActive
                  : styles.periodTextInactive
              }
            >
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.brownDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.olive,
    marginBottom: 16,
    lineHeight: 20,
  },
  scopeTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  scopeTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scopeTabActive: {
    backgroundColor: colors.primary,
  },
  scopeTabInactive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  scopeTabTextActive: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryForeground,
  },
  scopeTabTextInactive: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.olive,
  },
  periodRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  periodTabActive: {
    backgroundColor: colors.primary,
  },
  periodTabInactive: {
    backgroundColor: "transparent",
  },
  periodTextActive: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primaryForeground,
  },
  periodTextInactive: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.olive,
  },
  errorText: {
    textAlign: "center",
    paddingVertical: 40,
    color: colors.olive,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 40,
    color: colors.olive,
  },
  podiumRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  podiumCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  podiumCardBody: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  podiumIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumIconText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.brownDark,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.brownDark,
    textAlign: "center",
  },
  podiumPoints: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.greenDark,
  },
  listContainer: {
    gap: 8,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 12,
  },
  listRank: {
    width: 32,
    fontSize: 14,
    fontWeight: "600",
    color: colors.olive,
    textAlign: "center",
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: colors.creamMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  listAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.brownDark,
  },
  listName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.brownDark,
  },
  levelBadge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.greenDark,
  },
  listPoints: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.greenDark,
  },
  companyInfo: {
    flex: 1,
  },
  companyMembers: {
    fontSize: 12,
    color: colors.olive,
  },
  myRankBox: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.creamDark,
    borderRadius: 12,
    gap: 4,
  },
  myRankLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.olive,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  myRankText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.brownDark,
  },
});
