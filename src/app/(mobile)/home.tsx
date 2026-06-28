import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
import { fetchMe, fetchCompanyBySlug, fetchCompanyEmployees } from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";

const CARD_W = 188;

function CompanyHome({ companySlug }: { companySlug: string }) {
  const { data: company, isPending: companyPending } = useQuery({
    queryKey: ["company", companySlug],
    queryFn: () => fetchCompanyBySlug(companySlug),
    enabled: !!companySlug,
  });

  const { data: employees, isPending: employeesPending } = useQuery({
    queryKey: ["company", companySlug, "employees"],
    queryFn: () => fetchCompanyEmployees(companySlug),
    enabled: !!companySlug,
  });

  if (companyPending || employeesPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.mossGreen} />
      </View>
    );
  }

  const employeeCount = employees?.length ?? 0;
  const totalBalance = employees?.reduce((sum, e) => sum + e.balance, 0) ?? 0;
  const activeEmployees = employees?.filter((e) => e.isActive).length ?? 0;

  return (
    <>
      <Text style={styles.greeting}>
        Dzien dobry, <Text style={styles.greetingName}>{company?.name ?? "Firma"}</Text>
      </Text>

      <View style={[styles.card, styles.cardLight, { marginBottom: 16 }]}>
        <View style={styles.cardBody}>
          <Text style={styles.companyStatsTitle}>Twoja firma</Text>
          <View style={styles.companyStatsRow}>
            <View style={styles.companyStatItem}>
              <Text style={styles.companyStatValue}>{employeeCount}</Text>
              <Text style={styles.companyStatLabel}>Pracownikow</Text>
            </View>
            <View style={styles.companyStatItem}>
              <Text style={styles.companyStatValue}>{activeEmployees}</Text>
              <Text style={styles.companyStatLabel}>Aktywnych</Text>
            </View>
            <View style={styles.companyStatItem}>
              <Text style={styles.companyStatValue}>{totalBalance}</Text>
              <Text style={styles.companyStatLabel}>Suma EC</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Link href="/(mobile)/ranking" asChild>
          <Pressable style={styles.actionTile}>
            <TrophyIcon size={28} color={colors.mossGreen} />
            <Text style={styles.actionLabel}>Ranking pracownikow</Text>
          </Pressable>
        </Link>

        <Link href="/company" asChild>
          <Pressable style={styles.actionTile}>
            <LeafIcon size={28} color={colors.mossGreen} />
            <Text style={styles.actionLabel}>Panel firmy</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

function UserHome({ userName }: { userName: string }) {
  const stepGoal = 8000;
  const currentSteps = 6200;
  const progress = Math.min(100, Math.round((currentSteps / stepGoal) * 100));

  const declarationCards = [
    {
      icon: BikeIcon,
      label: "Rower zamiast auta",
      points: "+5",
      bgColor: colors.greenLight,
    },
    {
      icon: RecycleIcon,
      label: "Segregacja odpadow",
      points: "+3",
      bgColor: colors.creamDark,
    },
    {
      icon: LightbulbIcon,
      label: "Oszczedzanie energii",
      points: "+3",
      bgColor: colors.creamMedium,
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

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [declarationCards.length]);

  const allCards = [...declarationCards, ...declarationCards];

  return (
    <>
      <Text style={styles.greeting}>
        Dzien dobry,{" "}
        <Text style={styles.greetingName}>{userName.split(" ")[0]}</Text>
      </Text>

      {/* Steps Card */}
      <View style={[styles.card, styles.cardLight, { marginBottom: 16 }]}>
        <View style={styles.cardBody}>
          <View style={styles.stepsHeader}>
            <Text style={styles.labelSmall}>Dzienny cel krokow</Text>
            <Text style={styles.stepsValue}>
              {currentSteps.toLocaleString("pl-PL")}
              <Text style={styles.stepsGoal}>
                {" "}/ {stepGoal.toLocaleString("pl-PL")}
              </Text>
            </Text>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>

          <View style={styles.stepsFooter}>
            <Text style={styles.labelSmall}>
              Postep: <Text style={{ fontWeight: "600" }}>{progress}%</Text>
            </Text>
            <Text style={styles.labelSmall}>
              {stepGoal - currentSteps} krokow do celu
            </Text>
          </View>
        </View>
      </View>

      {/* Streak Card */}
      <View style={[styles.card, styles.cardLight, { marginBottom: 16 }]}>
        <View style={styles.cardBody}>
          <View style={styles.streakRow}>
            <View style={styles.streakLeft}>
              <View style={styles.streakIconBox}>
                <FireIcon size={24} color={colors.sunset} />
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
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Link href="/(mobile)/activity" asChild>
          <Pressable style={styles.actionTile}>
            <RunningIcon size={28} color={colors.mossGreen} />
            <Text style={styles.actionLabel}>Dodaj aktywnosc</Text>
          </Pressable>
        </Link>

        <Link href="/(mobile)/declarations" asChild>
          <Pressable style={styles.actionTile}>
            <LeafIcon size={28} color={colors.mossGreen} />
            <Text style={styles.actionLabel}>Zloz eko-deklaracje</Text>
          </Pressable>
        </Link>

        <Link href="/(mobile)/market" asChild>
          <Pressable style={styles.actionTile}>
            <CoinIcon size={28} color={colors.mossGreen} />
            <Text style={styles.actionLabel}>Przegladaj rynek nagrod</Text>
          </Pressable>
        </Link>

        <Link href="/(mobile)/ranking" asChild>
          <Pressable style={styles.actionTile}>
            <TrophyIcon size={28} color={colors.mossGreen} />
            <Text style={styles.actionLabel}>Sprawdz ranking</Text>
          </Pressable>
        </Link>
      </View>

      {/* Eko-deklaracje Carousel */}
      <Text style={styles.sectionTitle}>Eko-deklaracje</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingVertical: 8,
          paddingRight: 12,
        }}
        scrollEnabled={false}
      >
        {allCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              href="/(mobile)/declarations"
              key={`${card.label}-${idx}`}
              style={{ width: CARD_W }}
            >
              <View
                style={[
                  styles.declCard,
                  { backgroundColor: card.bgColor },
                ]}
              >
                <View style={styles.declCardBody}>
                  <Icon size={32} color={colors.brownDark} />
                  <View style={styles.declCardInfo}>
                    <Text style={styles.declCardLabel} numberOfLines={2}>
                      {card.label}
                    </Text>
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

      {/* Weekly Challenge */}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
        Wyzwanie tygodnia
      </Text>
      <Link href="/(mobile)/challenge" asChild>
        <View style={styles.challengeCard}>
          <View style={styles.cardBody}>
            <View style={{ gap: 4 }}>
              <Text style={styles.challengeOrg}>ZESPOL INTEL POLAND</Text>
              <Text style={styles.challengeTitle}>10 000 krokow dziennie</Text>
            </View>
            <Text style={styles.labelSmall}>
              Razem z kolegami z pracy • 6 dni zostalo
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFillGreen, { width: "65%" }]}
              />
            </View>
            <Text style={styles.labelSmall}>65% · 147/225 osob</Text>
          </View>
        </View>
      </Link>
    </>
  );
}

export default function HomeScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });

  if (me?.role === "company") {
    return (
      <Screen>
        <CompanyHome companySlug={me.partner} />
      </Screen>
    );
  }

  return (
    <Screen>
      <UserHome userName={me?.name ?? ""} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.brownDark,
    marginBottom: 16,
  },
  greetingName: {
    color: colors.greenDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
  },
  companyStatsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.brownDark,
    marginBottom: 8,
  },
  companyStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  companyStatItem: {
    alignItems: "center",
  },
  companyStatValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.greenDark,
  },
  companyStatLabel: {
    fontSize: 12,
    color: colors.olive,
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 12,
  },
  cardLight: {
    backgroundColor: colors.creamLight,
  },
  cardBody: {
    gap: 12,
    padding: 16,
  },
  stepsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelSmall: {
    fontSize: 13,
    color: colors.olive,
  },
  stepsValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.brownDark,
  },
  stepsGoal: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.olive,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 9999,
    backgroundColor: colors.creamDark,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: colors.greenDark,
  },
  progressBarFillGreen: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: colors.greenBright,
  },
  stepsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakIconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(139, 69, 19, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  streakDays: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.error,
  },
  streakLabel: {
    fontSize: 14,
    color: colors.olive,
    marginTop: 4,
  },
  streakBadge: {
    backgroundColor: colors.creamDark,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  streakBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.greenDark,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  actionTile: {
    width: "48%",
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 12,
    backgroundColor: colors.creamLight,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },

  actionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.brownDark,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.brownDark,
    marginBottom: 12,
  },
  declCard: {
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 12,
    overflow: "hidden",
    width: CARD_W,
  },
  declCardBody: {
    padding: 16,
    gap: 12,
  },
  declCardInfo: {
    gap: 4,
  },
  declCardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.brownDark,
  },
  declCardPointsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  declCardPoints: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.greenDark,
  },
  declCardPointsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.olive,
  },
  challengeOrg: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.greenDark,
    letterSpacing: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.brownDark,
  },
  challengeCard: {
    backgroundColor: colors.creamMedium,
    borderColor: colors.creamDark,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
});
