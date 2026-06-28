import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { fetchLeaderboard, fetchMyRank } from "../../lib/api/endpoints";
import type { LeaderboardEntry, LeaderboardPeriod } from "../../lib/types/api";
import { colors } from "../../styles/tokens";
import { rankingStyles as styles } from "./ranking.styles";
import { PodiumIcon } from "./PodiumIcon";

export function IndividualRanking({ period }: { period: LeaderboardPeriod }) {
  const { t } = useTranslation();
  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ["leaderboard", period, "individual"],
    queryFn: () => fetchLeaderboard(period),
  });

  const { data: myRank } = useQuery({
    queryKey: ["my-rank", period],
    queryFn: () => fetchMyRank(period),
  });

  if (isLoading) return <ActivityIndicator style={{ padding: 40 }} />;
  if (error) return <Text style={styles.errorText}>{t("ranking.error")} {error.message}</Text>;

  const rows = leaderboard ?? [];
  const podium = rows.slice(0, 3);
  const listRows = rows.slice(3, 20);

  if (rows.length === 0) return <Text style={styles.emptyText}>{t("ranking.empty")}</Text>;

  return (
    <>
      {podium.length > 0 && (
        <View style={styles.podiumRow}>
          {podium.map((entry: LeaderboardEntry, idx: number) => (
            <View key={entry.userId} style={[styles.podiumCard, idx === 0 ? { backgroundColor: colors.greenLight, borderColor: colors.greenBright } : { backgroundColor: colors.creamLight, borderColor: colors.creamDark }]}>
              <View style={styles.podiumCardBody}>
                <PodiumIcon rank={entry.rank} />
                <Text style={styles.podiumName} numberOfLines={1}>{entry.name}</Text>
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
            <View style={styles.listAvatar}><Text style={styles.listAvatarText}>{entry.name.slice(0, 1)}</Text></View>
            <Text style={styles.listName} numberOfLines={1}>{entry.name}</Text>
            {entry.rootStage && <View style={styles.levelBadge}><Text style={styles.levelBadgeText}>{t("ranking.level")} {entry.rootStage.level}</Text></View>}
            <Text style={styles.listPoints}>{entry.points} pkt</Text>
          </View>
        ))}
      </View>

      {myRank && myRank.rank && (
        <View style={styles.myRankBox}>
          <Text style={styles.myRankLabel}>{t("ranking.yourPosition")}</Text>
          <Text style={styles.myRankText}>#{myRank.rank} z {myRank.totalParticipants} uczestnikow · {myRank.points} pkt</Text>
        </View>
      )}
    </>
  );
}
