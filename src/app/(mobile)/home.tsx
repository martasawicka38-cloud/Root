import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchMe, fetchWallet } from "../../lib/api/endpoints";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../../styles/tokens";

export default function HomeScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWallet,
  });

  const profileName = me?.name ?? "Jan Kowalski";
  const declarationsToday = me?.declarationsToday ?? 0;
  const balance = wallet?.balance ?? me?.balance ?? 0;
  const stepGoal = me?.stepGoal ?? 8000;
  const currentSteps = 6200;
  const progress = Math.min(100, Math.round((currentSteps / stepGoal) * 100));
  const declarationsLeft = Math.max(0, 3 - declarationsToday);

  const declarationCards = [
    { emoji: "🌳", label: "Drzewo", points: "+10" },
    { emoji: "🚲", label: "Rower", points: "+10" },
    { emoji: "♻️", label: "Recykling", points: "+10" },
    { emoji: "🛒", label: "Lokalne zakupy", points: "+10" },
  ];

  return (
    <Screen>
      <View style={styles.topBar}>
        <Text style={styles.topIcon}>🔍</Text>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {profileName[0]?.toUpperCase() ?? "K"}
          </Text>
          <View style={styles.onlineDot} />
        </View>
      </View>

      <Text style={styles.greetingTitle}>
        Dzien dobry, {profileName.split(" ")[0]} 🌿
      </Text>

      <View style={styles.streakRow}>
        <Text style={styles.streakText}>🔥 5-dniowa passa! +20%</Text>
        <Link href="/(mobile)/notifications" style={styles.bellButton}>
          🔔
        </Link>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHead}>
          <View style={styles.progressRing}>
            <View style={styles.progressRingInner}>
              <Text style={styles.progressValue}>{progress}%</Text>
            </View>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.stepsMain}>
              {currentSteps.toLocaleString("pl-PL")}
            </Text>
            <Text style={styles.stepsSub}>
              z {stepGoal.toLocaleString("pl-PL")} krokow
            </Text>
            <Text style={styles.earnedText}>
              <Text style={styles.earnedStrong}>31</Text> dzisiaj
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.progressStats}>
          <Text style={styles.progressStatText}>0</Text>
          <Text style={styles.progressStatText}>
            {stepGoal.toLocaleString("pl-PL")}
          </Text>
        </View>

        <View style={styles.streakDotsRow}>
          {Array.from({ length: 7 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.streakDot,
                index < 5 && styles.streakDotDone,
                index === 4 && styles.streakDotToday,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.grid}>
        <Link href="/(mobile)/activity" style={styles.quickItem}>
          <Text style={styles.quickIcon}>🌱</Text>
          <Text style={styles.quickText}>Eko-deklaracje</Text>
        </Link>

        <Link href="/(mobile)/market" style={styles.quickItem}>
          <Text style={styles.quickIcon}>🏪</Text>
          <Text style={styles.quickText}>Rynek</Text>
        </Link>

        <Link href="/(mobile)/ranking" style={styles.quickItem}>
          <Text style={styles.quickIcon}>🏆</Text>
          <Text style={styles.quickText}>Ranking</Text>
        </Link>

        <Link href="/(mobile)/profile" style={styles.quickItem}>
          <Text style={styles.quickIcon}>📊</Text>
          <Text style={styles.quickText}>Moj profil</Text>
        </Link>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Eko-deklaracje</Text>
        <Text style={styles.sectionCounter}>zostalo {declarationsLeft}/3</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.declarationsCarousel}
      >
        {declarationCards.map((card, idx) => (
          <Link
            href="/(mobile)/declarations"
            key={`${card.label}-${idx}`}
            style={styles.declarationCard}
          >
            <Text style={styles.declarationEmoji}>{card.emoji}</Text>
            <Text style={styles.declarationLabel}>{card.label}</Text>
            <Text style={styles.declarationPoints}>{card.points}</Text>
          </Link>
        ))}
      </ScrollView>

      <Link href="/(mobile)/history" style={styles.balanceCard}>
        <View style={styles.balanceIconWrap}>
          <Text style={styles.balanceIcon}>💰</Text>
        </View>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Twoje saldo</Text>
          <Text style={styles.balanceValue}>{balance} Eco-Coins</Text>
        </View>
        <Text style={styles.balanceArrow}>→</Text>
      </Link>

      <Link href="/(mobile)/challenge" style={styles.challengeBanner}>
        <View style={styles.challengeIconWrap}>
          <Text style={styles.challengeIcon}>🏅</Text>
        </View>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle}>Nowe wyzwanie dostepne!</Text>
          <Text style={styles.challengeSub}>Tydzien bez samochodu</Text>
        </View>
        <Text style={styles.challengeArrow}>›</Text>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.x4s,
    paddingBottom: spacing.xs,
  },
  topIcon: {
    fontSize: 20,
    color: colors.slate600,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  onlineDot: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.slate100,
  },
  greetingTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
    color: colors.deepForest,
  },
  streakRow: {
    marginTop: spacing.x3s,
    marginBottom: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  streakText: {
    fontSize: 12,
    color: colors.slate600,
    fontWeight: "500",
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.slate200,
    ...shadows.sm,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  progressHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.x2s,
  },
  progressRing: {
    width: 92,
    height: 92,
    borderRadius: radius.full,
    borderWidth: 8,
    borderColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  progressRingInner: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
    backgroundColor: colors.slate100,
    alignItems: "center",
    justifyContent: "center",
  },
  progressValue: {
    ...typography.caption,
    color: colors.mossGreen,
    fontSize: 13,
  },
  progressInfo: {
    flex: 1,
    gap: 2,
  },
  stepsMain: {
    ...typography.points,
    color: colors.deepForest,
    letterSpacing: -1,
    fontSize: 36,
  },
  stepsSub: {
    ...typography.bodySmall,
    color: colors.slate400,
  },
  earnedText: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  earnedStrong: {
    color: colors.warmGold,
    fontWeight: "700",
    fontSize: 15,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.slate200,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.mossGreen,
  },
  progressStats: {
    marginTop: spacing.x3s,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressStatText: {
    ...typography.caption,
    color: colors.slate400,
  },
  streakDotsRow: {
    marginTop: spacing.x2s,
    paddingTop: spacing.x2s,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
    flexDirection: "row",
    gap: spacing.x4s,
  },
  streakDot: {
    width: 22,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.slate200,
  },
  streakDotDone: {
    backgroundColor: colors.warmGold,
  },
  streakDotToday: {
    backgroundColor: colors.sunset,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: spacing.xs,
  },
  quickItem: {
    width: "48.5%",
    backgroundColor: colors.white,
    borderColor: colors.slate200,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
    ...shadows.sm,
  },
  quickIcon: {
    fontSize: 22,
  },
  quickText: {
    fontSize: 11,
    color: colors.slate600,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.slate900,
    fontWeight: "600",
  },
  sectionCounter: {
    ...typography.caption,
    color: colors.slate400,
  },
  declarationsCarousel: {
    gap: 10,
    paddingBottom: spacing.x4s,
    marginBottom: spacing.xs,
  },
  declarationCard: {
    width: 110,
    backgroundColor: colors.white,
    borderColor: colors.slate200,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.x2s,
    alignItems: "center",
    ...shadows.sm,
  },
  declarationEmoji: {
    fontSize: 28,
    marginBottom: spacing.x3s,
  },
  declarationLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "600",
    textAlign: "center",
    color: colors.slate900,
  },
  declarationPoints: {
    marginTop: 6,
    fontSize: 9,
    fontWeight: "700",
    color: colors.warmGold,
  },
  balanceCard: {
    marginBottom: spacing.xs,
    borderRadius: 14,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(149,213,178,0.3)",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mist,
  },
  balanceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.warmGold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.x2s,
  },
  balanceIcon: {
    fontSize: 20,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.slate600,
    fontWeight: "600",
  },
  balanceValue: {
    color: colors.deepForest,
    fontWeight: "800",
    fontSize: 26,
    letterSpacing: -1,
  },
  balanceArrow: {
    fontSize: 20,
    color: colors.mossGreen,
    opacity: 0.5,
  },
  challengeBanner: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.slate200,
    marginBottom: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
  },
  challengeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.slate100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.x2s,
  },
  challengeIcon: {
    fontSize: 20,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate900,
  },
  challengeSub: {
    fontSize: 11,
    color: colors.slate600,
  },
  challengeArrow: {
    fontSize: 16,
    color: colors.slate400,
  },
});
