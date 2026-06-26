import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppLogo } from "../../features/common/AppLogo";
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
  const balance = wallet?.balance ?? me?.balance ?? 0;
  const stepGoal = me?.stepGoal ?? 8000;
  const currentSteps = 6200;
  const progress = Math.min(100, Math.round((currentSteps / stepGoal) * 100));

  const declarationCards = [
    {
      emoji: "🚲",
      label: "Rower zamiast auta",
      points: "+5 EC",
      tint: "#CCE0E2",
    },
    {
      emoji: "♻️",
      label: "Segregacja odpadow",
      points: "+3 EC",
      tint: "#E5E8DF",
    },
    {
      emoji: "💡",
      label: "Oszczedzanie energii",
      points: "+3 EC",
      tint: "#E4E8F2",
    },
  ];

  return (
    <Screen>
      <View style={styles.headerRow}>
        <AppLogo compact />
        <View style={styles.headerRight}>
          <View style={styles.balancePill}>
            <Text style={styles.balancePillIcon}>🪙</Text>
            <Text style={styles.balancePillValue}>{balance}</Text>
            <Text style={styles.balancePillUnit}> EC</Text>
          </View>
          <Link href="/(mobile)/notifications" style={styles.bellWrap}>
            🔔
            <View style={styles.bellDot} />
          </Link>
        </View>
      </View>

      <Text style={styles.greeting}>
        👋 Dzien dobry,{" "}
        <Text style={styles.greetingStrong}>{profileName.split(" ")[0]}</Text>
      </Text>

      <View style={styles.goalCard}>
        <View style={styles.goalRowTop}>
          <Text style={styles.goalTitle}>Dzienny cel krokow</Text>
          <Text style={styles.goalMainValue}>
            {currentSteps.toLocaleString("pl-PL")}
            <Text style={styles.goalSubValue}>
              {" "}
              / {stepGoal.toLocaleString("pl-PL")}
            </Text>
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.goalMetaRow}>
          <Text style={styles.goalMetaLeft}>
            Postep: <Text style={styles.goalMetaStrong}>{progress}%</Text>
          </Text>
          <Text style={styles.goalMetaRight}>
            {stepGoal - currentSteps} krokow do celu
          </Text>
        </View>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakLeft}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakDays}>5 dni</Text>
            <Text style={styles.streakCaption}>passa aktywnosci</Text>
          </View>
        </View>
        <Text style={styles.streakBonus}>+20%</Text>
      </View>

      <View style={styles.grid}>
        <Link href="/(mobile)/activity" style={styles.quickItem}>
          <Text style={styles.quickIcon}>🏃</Text>
          <Text style={styles.quickText}>Dodaj aktywnosc</Text>
        </Link>

        <Link href="/(mobile)/declarations" style={styles.quickItem}>
          <Text style={styles.quickIcon}>🌿</Text>
          <Text style={styles.quickText}>Deklaracje</Text>
        </Link>

        <Link href="/(mobile)/market" style={styles.quickItem}>
          <Text style={styles.quickIcon}>🏪</Text>
          <Text style={styles.quickText}>Rynek nagrod</Text>
        </Link>

        <Link href="/(mobile)/ranking" style={styles.quickItem}>
          <Text style={styles.quickIcon}>🏆</Text>
          <Text style={styles.quickText}>Ranking</Text>
        </Link>
      </View>

      <Text style={styles.sectionTitle}>Eko-deklaracje</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.declarationsCarousel}
      >
        {declarationCards.map((card, idx) => (
          <Link
            href="/(mobile)/declarations"
            key={`${card.label}-${idx}`}
            style={[styles.declarationCard, { backgroundColor: card.tint }]}
          >
            <Text style={styles.declarationEmoji}>{card.emoji}</Text>
            <Text style={styles.declarationLabel}>{card.label}</Text>
            <Text style={styles.declarationPoints}>{card.points}</Text>
          </Link>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Wyzwanie tygodnia</Text>

      <Link href="/(mobile)/challenge" style={styles.challengeBanner}>
        <Text style={styles.challengeTeam}>ZESPOL INTEL POLAND</Text>
        <Text style={styles.challengeTitle}>🌱 10 000 krokow dziennie</Text>
        <Text style={styles.challengeSub}>
          Razem z kolegami z pracy • 6 dni zostalo
        </Text>
        <View style={styles.challengeTrack}>
          <View style={styles.challengeFill} />
        </View>
        <Text style={styles.challengeProgress}>65% · 147/225 osob</Text>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.x4s,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x3s,
  },
  balancePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C6ECD2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  balancePillIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  balancePillValue: {
    color: colors.deepForest,
    fontWeight: "800",
    fontSize: 30,
    lineHeight: 34,
  },
  balancePillUnit: {
    color: colors.slate600,
    fontWeight: "700",
    fontSize: 17,
  },
  bellWrap: {
    fontSize: 30,
    position: "relative",
    color: colors.warmGold,
  },
  bellDot: {
    position: "absolute",
    right: 1,
    top: -2,
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.error,
  },
  greeting: {
    marginTop: spacing.x3s,
    ...typography.h2,
    color: colors.slate700,
  },
  greetingStrong: {
    color: colors.slate900,
    fontWeight: "800",
  },
  goalCard: {
    marginTop: spacing.x3s,
    backgroundColor: "#EEF2F5",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.lg,
    padding: spacing.xs,
  },
  goalRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTitle: {
    ...typography.h3,
    color: colors.deepForest,
  },
  goalMainValue: {
    fontSize: 45,
    color: colors.deepForest,
    fontWeight: "800",
    lineHeight: 48,
  },
  goalSubValue: {
    fontSize: 28,
    color: colors.slate600,
    fontWeight: "700",
  },
  progressTrack: {
    marginTop: spacing.x3s,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.slate200,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#5CC08B",
  },
  goalMetaRow: {
    marginTop: spacing.x3s,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalMetaLeft: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  goalMetaStrong: {
    color: colors.deepForest,
    fontWeight: "700",
  },
  goalMetaRight: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  streakCard: {
    marginTop: spacing.xs,
    backgroundColor: "#EEF2F5",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.lg,
    padding: spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x2s,
  },
  streakEmoji: {
    fontSize: 30,
  },
  streakDays: {
    color: colors.error,
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 39,
  },
  streakCaption: {
    color: colors.slate600,
    ...typography.body,
  },
  streakBonus: {
    backgroundColor: "#ECE2AE",
    color: colors.warmGold,
    fontWeight: "700",
    borderRadius: radius.full,
    paddingHorizontal: spacing.x2s,
    paddingVertical: spacing.x3s,
    overflow: "hidden",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.x3s,
    marginTop: spacing.xs,
  },
  quickItem: {
    width: "48%",
    backgroundColor: "#EEF2F5",
    borderColor: colors.slate200,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    alignItems: "center",
    gap: spacing.x3s,
  },
  quickIcon: {
    fontSize: 34,
  },
  quickText: {
    ...typography.h3,
    color: colors.slate900,
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: spacing.sm,
    ...typography.h2,
    color: colors.slate900,
  },
  declarationsCarousel: {
    gap: spacing.x3s,
    paddingBottom: spacing.x2s,
  },
  declarationCard: {
    width: 172,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  declarationEmoji: {
    fontSize: 44,
    marginBottom: spacing.x3s,
  },
  declarationLabel: {
    ...typography.h3,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.slate900,
  },
  declarationPoints: {
    marginTop: spacing.x3s,
    fontSize: 28,
    fontWeight: "700",
    color: colors.warmGold,
  },
  challengeBanner: {
    backgroundColor: "#EFF0BF",
    borderRadius: radius.md,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: "#E4DCA3",
    marginBottom: spacing.xs,
    gap: spacing.x3s,
  },
  challengeTeam: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.warmGold,
  },
  challengeTitle: {
    ...typography.h2,
    color: colors.deepForest,
  },
  challengeSub: {
    ...typography.body,
    color: colors.slate600,
  },
  challengeTrack: {
    height: 7,
    borderRadius: radius.full,
    backgroundColor: "#E7DFA9",
    overflow: "hidden",
  },
  challengeFill: {
    width: "65%",
    height: "100%",
    backgroundColor: colors.sunset,
  },
  challengeProgress: {
    ...typography.bodySmall,
    color: colors.slate600,
    fontWeight: "700",
  },
});
