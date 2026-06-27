import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import {
  BikeIcon,
  CoinIcon,
  FireIcon,
  LeafIcon,
  LightbulbIcon,
  RecycleIcon,
  RunningIcon,
  TrophyIcon,
} from "../../components/icons";

import { Screen } from "../../features/common/Screen";
import { fetchMe } from "../../lib/api/endpoints";
import { colors, radius, spacing } from "../../styles/tokens";

const CARD_W = 188;

export default function HomeScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });

  const profileName = me?.name ?? "";
  const stepGoal = me?.stepGoal ?? 8000;
  const currentSteps = 6200;
  const progress = Math.min(100, Math.round((currentSteps / stepGoal) * 100));

  const declarationCards = [
    {
      icon: BikeIcon,
      label: "Rower zamiast auta",
      points: "+5",
      tint: "#CCE0E2",
    },
    {
      icon: RecycleIcon,
      label: "Segregacja odpadow",
      points: "+3",
      tint: "#E5E8DF",
    },
    {
      icon: LightbulbIcon,
      label: "Oszczedzanie energii",
      points: "+3",
      tint: "#E4E8F2",
    },
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
        setTimeout(() => {
          idxRef.current = 0;
          scrollRef.current?.scrollTo({ x: 0, animated: false });
        }, 350);
      }
    }, 3200);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [declarationCards.length]);

  const allCards = [...declarationCards, ...declarationCards];

  return (
    <Screen>
      <Text style={styles.screenTitle}>
        Dzien dobry,{" "}
        <Text style={styles.screenTitleAccent}>{profileName.split(" ")[0]}</Text>
      </Text>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Dzienny cel krokow</Text>
          <Text style={styles.cardValue}>
            <Text style={styles.cardValueMain}>
              {currentSteps.toLocaleString("pl-PL")}
            </Text>
            <Text style={styles.cardValueSub}>
              {" "}/ {stepGoal.toLocaleString("pl-PL")}
            </Text>
          </Text>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMeta}>
            Postep: <Text style={styles.cardMetaStrong}>{progress}%</Text>
          </Text>
          <Text style={styles.cardMeta}>
            {stepGoal - currentSteps} krokow do celu
          </Text>
        </View>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakLeft}>
          <View style={styles.streakIconBox}>
            <FireIcon size={24} color={colors.error} />
          </View>
          <View>
            <Text style={styles.streakDays}>5 dni</Text>
            <Text style={styles.streakLabel}>passa aktywnosci</Text>
          </View>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>+20%</Text>
        </View>
      </View>

      <View style={styles.quickList}>
        <Link href="/(mobile)/activity" style={styles.quickRow}>
          <View style={styles.quickInner}>
            <View style={styles.quickIconBox}>
              <RunningIcon size={22} color={colors.mossGreen} />
            </View>
            <Text style={styles.quickLabel}>Dodaj aktywnosc</Text>
          </View>
        </Link>
        <Link href="/(mobile)/declarations" style={styles.quickRow}>
          <View style={styles.quickInner}>
            <View style={styles.quickIconBox}>
              <LeafIcon size={22} color={colors.mossGreen} />
            </View>
            <Text style={styles.quickLabel}>Zloz eko-deklaracje</Text>
          </View>
        </Link>
        <Link href="/(mobile)/market" style={styles.quickRow}>
          <View style={styles.quickInner}>
            <View style={styles.quickIconBox}>
              <CoinIcon size={22} color={colors.mossGreen} />
            </View>
            <Text style={styles.quickLabel}>Przegladaj rynek nagrod</Text>
          </View>
        </Link>
        <Link href="/(mobile)/ranking" style={styles.quickRow}>
          <View style={styles.quickInner}>
            <View style={styles.quickIconBox}>
              <TrophyIcon size={22} color={colors.mossGreen} />
            </View>
            <Text style={styles.quickLabel}>Sprawdz ranking</Text>
          </View>
        </Link>
      </View>

      <Text style={styles.sectionTitle}>Eko-deklaracje</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        scrollEnabled={false}
      >
        {allCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              href="/(mobile)/declarations"
              key={`${card.label}-${idx}`}
              style={[styles.declCard, { backgroundColor: card.tint }]}
            >
              <Icon size={32} color={colors.deepForest} />
              <View style={styles.declTextWrap}>
                <Text style={styles.declLabel} numberOfLines={2}>
                  {card.label}
                </Text>
                <View style={styles.declPointsRow}>
                  <Text style={styles.declPoints}>{card.points}</Text>
                  <Text style={styles.declUnit}>EC</Text>
                </View>
              </View>
            </Link>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>Wyzwanie tygodnia</Text>
      <Link href="/(mobile)/challenge" style={styles.challengeCard}>
        <View style={styles.challengeInner}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTeam}>ZESPOL INTEL POLAND</Text>
            <Text style={styles.challengeTitle}>10 000 krokow dziennie</Text>
          </View>
          <Text style={styles.challengeDesc}>
            Razem z kolegami z pracy • 6 dni zostalo
          </Text>
          <View style={styles.bar}>
            <View style={[styles.barFillOrange, { width: "65%" }]} />
          </View>
          <Text style={styles.challengeStats}>65% · 147/225 osob</Text>
        </View>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.slate900,
    marginBottom: spacing.sm,
  },
  screenTitleAccent: {
    color: colors.deepForest,
  },

  card: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.slate600,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.deepForest,
  },
  cardValueMain: {
    fontSize: 32,
    color: colors.deepForest,
  },
  cardValueSub: {
    fontSize: 20,
    color: colors.slate400,
    fontWeight: "600",
  },
  bar: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.slate200,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.mossGreen,
    borderRadius: radius.full,
  },
  barFillOrange: {
    height: "100%",
    backgroundColor: colors.sunset,
    borderRadius: radius.full,
  },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardMeta: {
    fontSize: 13,
    color: colors.slate600,
  },
  cardMetaStrong: {
    color: colors.deepForest,
    fontWeight: "700",
  },

  streakCard: {
    marginTop: 10,
    backgroundColor: colors.white,
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
  streakIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  streakDays: {
    color: colors.error,
    fontSize: 26,
    fontWeight: "800",
  },
  streakLabel: {
    color: colors.slate600,
    fontSize: 14,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  streakBadgeText: {
    color: colors.warmGold,
    fontWeight: "700",
    fontSize: 15,
  },

  quickList: {
    marginTop: spacing.xs,
    gap: spacing.x2s,
  },
  quickRow: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
  },
  quickInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  quickIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.slate900,
  },

  sectionTitle: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
  },

  carousel: {
    gap: 10,
    paddingVertical: 8,
    paddingRight: 12,
  },
  declCard: {
    width: 176,
    borderRadius: radius.md,
    padding: spacing.xs,
    gap: spacing.x2s,
  },
  declTextWrap: {
    gap: 2,
  },
  declLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.slate900,
    lineHeight: 18,
  },
  declPointsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  declPoints: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.warmGold,
  },
  declUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate600,
    marginTop: -2,
  },

  challengeCard: {
    marginTop: 10,
    backgroundColor: "#FEFCE8",
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: "#E7DFA9",
  },
  challengeInner: {
    gap: spacing.xs,
  },
  challengeHeader: {
    gap: 4,
  },
  challengeTeam: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.warmGold,
    letterSpacing: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.deepForest,
  },
  challengeDesc: {
    fontSize: 14,
    color: colors.slate600,
  },
  challengeStats: {
    fontSize: 13,
    color: colors.slate600,
    fontWeight: "600",
  },
});
