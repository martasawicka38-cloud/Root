import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { fetchCompanyLeaderboard } from "../../lib/api/endpoints";
import type { CompanyLeaderboardEntry, LeaderboardPeriod } from "../../lib/types/api";
import { colors } from "../../styles/tokens";
import { rankingStyles as styles } from "./ranking.styles";
import { PodiumIcon } from "./PodiumIcon";

export function CompanyRanking({ period }: { period: LeaderboardPeriod }) {
  const { t } = useTranslation();
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ["leaderboard", period, "company"],
    queryFn: () => fetchCompanyLeaderboard(period),
  });

  if (isLoading) return <ActivityIndicator style={{ padding: 40 }} />;
  if (error) return <Text style={styles.errorText}>{t("ranking.companyError")} {error.message}</Text>;

  const rows = companies ?? [];
  const podium = rows.slice(0, 3);
  const listRows = rows.slice(3);

  if (rows.length === 0) return <Text style={styles.emptyText}>{t("ranking.empty")}</Text>;

  return (
    <>
      {podium.length > 0 && (
        <View style={styles.podiumRow}>
          {podium.map((entry: CompanyLeaderboardEntry, idx: number) => (
            <View key={entry.slug} style={[styles.podiumCard, idx === 0 ? { backgroundColor: colors.greenLight, borderColor: colors.greenBright } : { backgroundColor: colors.creamLight, borderColor: colors.creamDark }]}>
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
        {listRows.map((entry: CompanyLeaderboardEntry) => (
          <View key={entry.slug} style={styles.listRow}>
            <Text style={styles.listRank}>{entry.rank}</Text>
            <View style={styles.listAvatar}><Text style={styles.listAvatarText}>{entry.name.slice(0, 1)}</Text></View>
            <View style={styles.companyInfo}>
              <Text style={styles.listName} numberOfLines={1}>{entry.name}</Text>
              <Text style={styles.companyMembers}>{entry.memberCount} {t("ranking.members")}</Text>
            </View>
            <Text style={styles.listPoints}>{entry.points} pkt</Text>
          </View>
        ))}
      </View>
    </>
  );
}
