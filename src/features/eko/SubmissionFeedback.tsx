import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { SubmitActivityResponse } from "../../lib/types/api";
import { colors } from "../../styles/tokens";
import { ekoStyles as styles } from "./eko.styles";

interface SubmissionFeedbackProps {
  error?: string | null;
  result?: SubmitActivityResponse | null;
}

export function SubmissionFeedback({ error, result }: SubmissionFeedbackProps) {
  const { t } = useTranslation();

  if (error) {
    return (
      <View style={styles.errorBanner}>
        <Text style={styles.errorBannerText}>{error}</Text>
      </View>
    );
  }

  if (!result) return null;

  return (
    <View style={styles.resultBanner}>
      <Text style={styles.resultText}>+{result.points.exp} EXP · +{result.points.leaderboard} {t("common.points")} {t("eco.rankingPoints")}</Text>
      <View style={styles.badgesRow}>
        {result.caps.firstTimeBonus && (
          <View style={[styles.badge, { backgroundColor: colors.greenLight }]}>
            <Text style={styles.badgeText}>{t("eco.firstTimeBonus")}</Text>
          </View>
        )}
        {result.caps.synergyBonus && (
          <View style={[styles.badge, { backgroundColor: colors.greenBright }]}>
            <Text style={styles.badgeText}>{t("eco.synergyBonus")}</Text>
          </View>
        )}
        {result.caps.diminishingMultiplier < 1 && result.caps.diminishingMultiplier > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.creamMedium }]}>
            <Text style={styles.badgeText}>x{result.caps.diminishingMultiplier}</Text>
          </View>
        )}
        {result.caps.diminishingMultiplier === 0 && (
          <View style={[styles.badge, { backgroundColor: colors.warning }]}>
            <Text style={styles.badgeText}>{t("eco.noRankingPoints")}</Text>
          </View>
        )}
      </View>
      <Text style={styles.remainingText}>
        {t("eco.remaining")} {result.caps.categoryRemaining}/{result.caps.globalRemaining} {t("common.points")} ({t("eco.perCategory")})
      </Text>
    </View>
  );
}
