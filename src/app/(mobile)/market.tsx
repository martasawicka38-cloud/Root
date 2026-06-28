import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CoinIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { RewardsGrid } from "../../features/market/RewardsGrid";
import { CompanyActivitiesList } from "../../features/market/CompanyActivitiesList";
import { fetchMarket, fetchWallet, fetchEcoActivities, submitEcoActivity } from "../../lib/api/endpoints";
import { useAppStore } from "../../store/useAppStore";
import { colors, radius, spacing } from "../../styles/tokens";

type Tab = "rewards" | "activities";

export default function MarketScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("rewards");
  const filter = useAppStore((s) => s.marketFilter);
  const setFilter = useAppStore((s) => s.setMarketFilter);
  const queryClient = useQueryClient();
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const rewardsQuery = useQuery({ queryKey: ["market"], queryFn: fetchMarket });
  const walletQuery = useQuery({ queryKey: ["wallet"], queryFn: fetchWallet });
  const activitiesQuery = useQuery({ queryKey: ["eco-activities"], queryFn: fetchEcoActivities });

  const submitMutation = useMutation({
    mutationFn: submitEcoActivity,
    onSuccess: () => { setSubmittingId(null); queryClient.invalidateQueries({ queryKey: ["eco-activities"] }); queryClient.invalidateQueries({ queryKey: ["wallet"] }); },
    onError: () => setSubmittingId(null),
  });

  const companyActivities = (activitiesQuery.data ?? []).filter((a) => a.companyId && a.activityType !== "permanent");
  const balance = walletQuery.data?.balance ?? 0;

  return (
    <Screen>
      <Text style={styles.title}>{t("market.rewards")} i {t("market.companyActivities").toLowerCase()}</Text>
      <View style={styles.balanceRow}>
        <View style={styles.coinBox}><CoinIcon size={18} color={colors.mossGreen} /></View>
        <Text style={styles.balanceText}>{t("market.balance")}: {balance} {t("common.ec")}</Text>
      </View>
      <View style={styles.tabsRow}>
        <Pressable style={[styles.tabBtn, tab === "rewards" && styles.tabBtnActive]} onPress={() => setTab("rewards")}>
          <Text style={[styles.tabText, tab === "rewards" && styles.tabTextActive]}>{t("market.rewards")}</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, tab === "activities" && styles.tabBtnActive]} onPress={() => setTab("activities")}>
          <Text style={[styles.tabText, tab === "activities" && styles.tabTextActive]}>{t("market.companyActivities")} ({companyActivities.length})</Text>
        </Pressable>
      </View>
      {tab === "rewards" ? (
        <RewardsGrid rewards={rewardsQuery.data ?? []} filter={filter} onFilterChange={setFilter} />
      ) : (
        <CompanyActivitiesList activities={companyActivities} isPending={activitiesQuery.isPending} submittingId={submittingId} onSubmit={(id) => { setSubmittingId(id); submitMutation.mutate(id); }} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.brownDark, marginBottom: spacing.xs },
  balanceRow: { flexDirection: "row", alignItems: "center", gap: spacing.x3s, marginBottom: spacing.xs },
  coinBox: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.creamDark, alignItems: "center", justifyContent: "center" },
  balanceText: { fontSize: 14, color: colors.olive, fontWeight: "600" },
  tabsRow: { flexDirection: "row", gap: spacing.x3s, marginBottom: spacing.xs },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.md, alignItems: "center", backgroundColor: colors.creamLight, borderWidth: 1, borderColor: colors.creamDark },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: "600", color: colors.olive },
  tabTextActive: { color: colors.primaryForeground },
});
