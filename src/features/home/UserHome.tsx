import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BikeIcon, CoinIcon, FireIcon, LeafIcon, LightbulbIcon, RecycleIcon, RunningIcon, TrophyIcon } from "../../components/icons";
import { colors, spacing } from "../../styles/tokens";
import { homeStyles as styles } from "./home.styles";

const CARD_W = 188;

export function UserHome({ userName }: { userName: string }) {
  const { t } = useTranslation();
  const stepGoal = 8000;
  const currentSteps = 6200;
  const progress = Math.min(100, Math.round((currentSteps / stepGoal) * 100));

  const declarationCards = [
    { icon: BikeIcon, label: t("home.activityCycling"), points: "+5", bgColor: colors.greenLight },
    { icon: RecycleIcon, label: t("home.activityRecycling"), points: "+3", bgColor: colors.creamDark },
    { icon: LightbulbIcon, label: t("home.activityEnergySaving"), points: "+3", bgColor: colors.creamMedium },
  ];

  const scrollRef = useRef<ScrollView>(null);
  const idxRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      idxRef.current += 1;
      const next = idxRef.current * CARD_W;
      scrollRef.current?.scrollTo({ x: next, animated: true });
      if (idxRef.current >= declarationCards.length) {
        setTimeout(() => { idxRef.current = 0; scrollRef.current?.scrollTo({ x: 0, animated: false }); }, 350);
      }
    }, 3200);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [declarationCards.length]);

  const allCards = [...declarationCards, ...declarationCards];

  return (
    <>
      <Text style={styles.greeting}>{t("home.greeting")} <Text style={styles.greetingName}>{userName.split(" ")[0]}</Text></Text>

      <View style={[styles.card, styles.cardLight, { marginBottom: spacing.xs }]}>
        <View style={styles.cardBody}>
          <View style={styles.stepsHeader}>
            <Text style={styles.labelSmall}>{t("home.dailyStepGoal")}</Text>
            <Text style={styles.stepsValue}>{currentSteps.toLocaleString("pl-PL")}<Text style={styles.stepsGoal}> / {stepGoal.toLocaleString("pl-PL")}</Text></Text>
          </View>
          <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: `${progress}%` }]} /></View>
          <View style={styles.stepsFooter}>
            <Text style={styles.labelSmall}>{t("home.progress")} <Text style={{ fontWeight: "600" }}>{progress}%</Text></Text>
            <Text style={styles.labelSmall}>{stepGoal - currentSteps} {t("home.stepsToGoal")}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.cardLight, { marginBottom: spacing.xs }]}>
        <View style={styles.cardBody}>
          <View style={styles.streakRow}>
            <View style={styles.streakLeft}>
              <View style={styles.streakIconBox}><FireIcon size={24} color={colors.sunset} /></View>
              <View>
                <Text style={styles.streakDays}>5 {t("home.streakDays")}</Text>
                <Text style={styles.streakLabel}>{t("home.streakLabel")}</Text>
              </View>
            </View>
            <View style={styles.streakBadge}><Text style={styles.streakBadgeText}>+20%</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Link href="/(mobile)/activity" asChild><Pressable style={styles.actionTile}><RunningIcon size={28} color={colors.mossGreen} /><Text style={styles.actionLabel}>{t("home.addActivity")}</Text></Pressable></Link>
        <Link href="/(mobile)/declarations" asChild><Pressable style={styles.actionTile}><LeafIcon size={28} color={colors.mossGreen} /><Text style={styles.actionLabel}>{t("home.ecoDeclaration")}</Text></Pressable></Link>
        <Link href="/(mobile)/market" asChild><Pressable style={styles.actionTile}><CoinIcon size={28} color={colors.mossGreen} /><Text style={styles.actionLabel}>{t("home.browseRewards")}</Text></Pressable></Link>
        <Link href="/(mobile)/ranking" asChild><Pressable style={styles.actionTile}><TrophyIcon size={28} color={colors.mossGreen} /><Text style={styles.actionLabel}>{t("home.checkRanking")}</Text></Pressable></Link>
      </View>

      <Text style={styles.sectionTitle}>{t("home.ecoDeclarations")}</Text>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: spacing.x3s, paddingRight: spacing.x2s }} scrollEnabled={false}>
        {allCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link href="/(mobile)/declarations" key={`${card.label}-${idx}`} style={{ width: CARD_W }}>
              <View style={[styles.declCard, { backgroundColor: card.bgColor }]}>
                <View style={styles.declCardBody}>
                  <Icon size={32} color={colors.brownDark} />
                  <View style={styles.declCardInfo}>
                    <Text style={styles.declCardLabel} numberOfLines={2}>{card.label}</Text>
                    <View style={styles.declCardPointsRow}>
                      <Text style={styles.declCardPoints}>{card.points}</Text>
                      <Text style={styles.declCardPointsLabel}>EC</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Link>
          );
        })}
      </ScrollView>

      <Text style={[styles.sectionTitle, { marginTop: spacing.xs }]}>{t("home.weeklyChallenge")}</Text>
      <Link href="/(mobile)/challenge" asChild>
        <View style={styles.challengeCard}>
          <View style={styles.cardBody}>
            <View style={{ gap: spacing.x4s }}>
              <Text style={styles.challengeOrg}>{t("home.challengeOrg")}</Text>
              <Text style={styles.challengeTitle}>{t("home.challengeTitle")}</Text>
            </View>
            <Text style={styles.labelSmall}>{t("home.challengeDesc")}</Text>
            <View style={styles.progressBarBg}><View style={[styles.progressBarFillGreen, { width: "65%" }]} /></View>
            <Text style={styles.labelSmall}>{t("home.challengeProgress")}</Text>
          </View>
        </View>
      </Link>
    </>
  );
}
