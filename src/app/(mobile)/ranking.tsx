import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../features/common/Screen";
import type { LeaderboardPeriod } from "../../lib/types/api";
import { IndividualRanking } from "../../features/ranking/IndividualRanking";
import { CompanyRanking } from "../../features/ranking/CompanyRanking";
import { colors } from "../../styles/tokens";

const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
  { key: "daily", label: "Dzien" },
  { key: "weekly", label: "Tydzien" },
  { key: "monthly", label: "Miesiac" },
  { key: "quarterly", label: "Kwartal" },
  { key: "yearly", label: "Rok" },
];

type Scope = "individual" | "company";

export default function RankingScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>("weekly");
  const [scope, setScope] = useState<Scope>("individual");

  return (
    <Screen>
      <Text style={styles.title}>Ranking</Text>
      <Text style={styles.subtitle}>Punkty zdobywasz za aktywnosci ekologiczne. Im wiecej dzialasz, tym wyzej w rankingu.</Text>

      <View style={styles.scopeTabs}>
        <Pressable onPress={() => setScope("individual")} style={[styles.scopeTab, scope === "individual" ? styles.scopeTabActive : styles.scopeTabInactive]}>
          <Text style={scope === "individual" ? styles.scopeTabTextActive : styles.scopeTabTextInactive}>Indywidualny</Text>
        </Pressable>
        <Pressable onPress={() => setScope("company")} style={[styles.scopeTab, scope === "company" ? styles.scopeTabActive : styles.scopeTabInactive]}>
          <Text style={scope === "company" ? styles.scopeTabTextActive : styles.scopeTabTextInactive}>Firmowy</Text>
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
  title: { fontSize: 24, fontWeight: "700", color: colors.brownDark, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.olive, marginBottom: 16, lineHeight: 20 },
  scopeTabs: { flexDirection: "row", gap: 8, marginBottom: 16 },
  scopeTab: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  scopeTabActive: { backgroundColor: colors.primary },
  scopeTabInactive: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.creamDark },
  scopeTabTextActive: { fontSize: 15, fontWeight: "600", color: colors.primaryForeground },
  scopeTabTextInactive: { fontSize: 15, fontWeight: "600", color: colors.olive },
  periodRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  periodTab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  periodTabActive: { backgroundColor: colors.primary },
  periodTabInactive: { backgroundColor: "transparent" },
  periodTextActive: { fontSize: 13, fontWeight: "600", color: colors.primaryForeground },
  periodTextInactive: { fontSize: 13, fontWeight: "600", color: colors.olive },
});
