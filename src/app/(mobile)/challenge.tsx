import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { TrophyIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { fetchChallenge } from "../../lib/api/endpoints";
import { colors, radius, spacing } from "../../styles/tokens";

export default function ChallengeScreen() {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["challenge"],
    queryFn: fetchChallenge,
  });

  const pct = data?.progress ?? 71;

  return (
    <Screen>
      <Text style={styles.title}>{t("challenge.title")}</Text>

      <View style={styles.heroCard}>
        <View style={styles.heroIconWrap}>
          <TrophyIcon size={36} color={colors.mossGreen} />
        </View>
        <Text style={styles.heroTitle}>
          {data?.title ?? "10 000 krokow dziennie"}
        </Text>
        <Text style={styles.heroSub}>
          {t("challenge.team")} {data?.team ?? "ERGO Hestia"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t("challenge.progress")}</Text>
        <View style={styles.cardHeader}>
          <Text style={styles.cardValue}>
            {data?.daysDone ?? 5}/{data?.daysTotal ?? 7}
          </Text>
          <Text style={styles.cardDays}>{t("challenge.days")}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.progressText}>{pct}% {t("challenge.completed")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t("challenge.reward")}</Text>
        <Text style={styles.rewardValue}>+{data?.reward ?? 200} EC</Text>
        <Text style={styles.rewardHint}>{t("challenge.bonusHint")}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
  },
  heroCard: {
    marginTop: 12,
    backgroundColor: colors.warningBg,
    borderRadius: radius.lg,
    padding: spacing.xs,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 14,
    color: colors.slate600,
  },
  card: {
    marginTop: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    gap: spacing.x3s,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.deepForest,
  },
  cardDays: {
    fontSize: 16,
    color: colors.slate500,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.slate200,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.mossGreen,
    borderRadius: radius.full,
  },
  progressText: {
    fontSize: 13,
    color: colors.slate500,
    fontWeight: "600",
  },
  rewardValue: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.mossGreen,
  },
  rewardHint: {
    fontSize: 13,
    color: colors.slate500,
  },
});
