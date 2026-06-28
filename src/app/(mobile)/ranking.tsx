import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Screen } from "../../features/common/Screen";
import type { LeaderboardPeriod } from "../../lib/types/api";
import { IndividualRanking } from "../../features/ranking/IndividualRanking";
import { CompanyRanking } from "../../features/ranking/CompanyRanking";
import { colors, radius, spacing, typography } from "../../styles/tokens";

type Scope = "individual" | "company";

export default function RankingScreen() {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>("weekly");
  const [scope, setScope] = useState<Scope>("individual");

  const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
    { key: "daily", label: t("ranking.periods.day") },
    { key: "weekly", label: t("ranking.periods.week") },
    { key: "monthly", label: t("ranking.periods.month") },
    { key: "quarterly", label: t("ranking.periods.quarter") },
    { key: "yearly", label: t("ranking.periods.year") },
  ];

  return (
    <Screen>
      <Text style={styles.title}>{t("ranking.title")}</Text>
      <Text style={styles.subtitle}>{t("ranking.subtitle")}</Text>

      <View style={styles.scopeTabs}>
        <Pressable onPress={() => setScope("individual")} style={[styles.scopeTab, scope === "individual" ? styles.scopeTabActive : styles.scopeTabInactive]}>
          <Text style={scope === "individual" ? styles.scopeTabTextActive : styles.scopeTabTextInactive}>{t("ranking.individual")}</Text>
        </Pressable>
        <Pressable onPress={() => setScope("company")} style={[styles.scopeTab, scope === "company" ? styles.scopeTabActive : styles.scopeTabInactive]}>
          <Text style={scope === "company" ? styles.scopeTabTextActive : styles.scopeTabTextInactive}>{t("ranking.companyScope")}</Text>
        </Pressable>
      </View>

      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <Pressable key={p.key} onPress={() => setSelectedPeriod(p.key)} style={[styles.periodTab, selectedPeriod === p.key ? styles.periodTabActive : styles.periodTabInactive]}>
            <Text style={selectedPeriod === p.key ? styles.periodTextActive : styles.periodTextInactive}>{p.label}</Text>
          </Pressable>
        ))}
      </View>

      {scope === "individual" ? <IndividualRanking period={selectedPeriod} /> : <CompanyRanking period={selectedPeriod} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.steps, color: colors.brownDark, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.olive, marginBottom: 16, lineHeight: 20 },
  scopeTabs: { flexDirection: "row", gap: spacing.x3s, marginBottom: spacing.xs },
  scopeTab: { flex: 1, paddingVertical: 12, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  scopeTabActive: { backgroundColor: colors.primary },
  scopeTabInactive: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.creamDark },
  scopeTabTextActive: { fontSize: 15, fontWeight: "600", color: colors.primaryForeground },
  scopeTabTextInactive: { fontSize: 15, fontWeight: "600", color: colors.olive },
  periodRow: { flexDirection: "row", gap: spacing.x3s, marginBottom: spacing.xs },
  periodTab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: "center" },
  periodTabActive: { backgroundColor: colors.primary },
  periodTabInactive: { backgroundColor: "transparent" },
  periodTextActive: { fontSize: 13, fontWeight: "600", color: colors.primaryForeground },
  periodTextInactive: { fontSize: 13, fontWeight: "600", color: colors.olive },
});
