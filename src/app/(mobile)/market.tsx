import { Link } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { CoinIcon } from "../../components/icons";
import { EcoIcon } from "../../components/EcoIcon";
import { Screen } from "../../features/common/Screen";
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

  const { data: rewards = [] } = useQuery({
    queryKey: ["market"],
    queryFn: fetchMarket,
  });

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWallet,
  });

  const { data: activities = [], isPending: activitiesPending } = useQuery({
    queryKey: ["eco-activities"],
    queryFn: fetchEcoActivities,
  });

  const submitMutation = useMutation({
    mutationFn: submitEcoActivity,
    onSuccess: () => {
      setSubmittingId(null);
      queryClient.invalidateQueries({ queryKey: ["eco-activities"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: () => setSubmittingId(null),
  });

  const visibleRewards = rewards.filter((r) => filter === "all" || r.category === filter);

  // Filter company activities (not global ones)
  const companyActivities = activities.filter((a) => a.companyId && a.activityType !== "permanent");

  const balance = wallet?.balance ?? 0;

  return (
    <Screen>
      <Text style={styles.title}>{t("market.rewards")} i {t("market.companyActivities").toLowerCase()}</Text>

      {/* Balance */}
      <View style={styles.balanceRow}>
        <View style={styles.coinBox}>
          <CoinIcon size={18} color={colors.mossGreen} />
        </View>
        <Text style={styles.balanceText}>{t("market.balance")}: {balance} {t("common.ec")}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Pressable
          style={[styles.tabBtn, tab === "rewards" && styles.tabBtnActive]}
          onPress={() => setTab("rewards")}
        >
          <Text style={[styles.tabText, tab === "rewards" && styles.tabTextActive]}>
            {t("market.rewards")}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, tab === "activities" && styles.tabBtnActive]}
          onPress={() => setTab("activities")}
        >
          <Text style={[styles.tabText, tab === "activities" && styles.tabTextActive]}>
            {t("market.companyActivities")} ({companyActivities.length})
          </Text>
        </Pressable>
      </View>

      {tab === "rewards" ? (
        <>
          {/* Filters */}
          <View style={styles.filtersRow}>
            {(["all", "food", "wellness", "sport", "eco"] as const).map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterBtn,
                  filter === f ? styles.filterBtnActive : styles.filterBtnInactive,
                ]}
              >
                <Text
                  style={filter === f ? styles.filterTextActive : styles.filterTextInactive}
                >
                  {t(`market.filters.${f}`)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Rewards Grid */}
          <View style={styles.rewardsGrid}>
            {visibleRewards.map((reward) => (
              <Link
                key={reward.id}
                href={{ pathname: "/(mobile)/reward", params: { rewardId: reward.id } }}
                asChild
              >
                <Pressable style={styles.rewardCard}>
                  <EcoIcon name={reward.icon} size={28} />
                  <View style={styles.rewardBody}>
                    <Text style={styles.rewardTitle} numberOfLines={2}>{reward.title}</Text>
                    <Text style={styles.rewardMerchant}>{reward.merchant}</Text>
                    <View style={styles.rewardCostRow}>
                      <CoinIcon size={12} color={colors.mossGreen} />
                      <Text style={styles.rewardCost}>{reward.cost} EC</Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </>
      ) : (
        <>
          {/* Company Activities */}
          {activitiesPending ? (
            <ActivityIndicator style={{ padding: spacing.xl }} />
          ) : companyActivities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("market.noCompanyActivities")}</Text>
              <Text style={styles.emptySubtext}>{t("market.noCompanyActivitiesDesc")}</Text>
            </View>
          ) : (
            <View style={styles.activitiesList}>
              {companyActivities.map((act) => {
                const done = act.completedToday ?? false;
                const oneTimeDone = act.completedOneTime ?? false;
                const isOneTime = act.activityType === "one_time";
                return (
                  <View
                    key={act.id}
                    style={[styles.activityCard, (done || oneTimeDone) && styles.activityCardDone]}
                  >
                    <View style={styles.activityLeft}>
                      <View style={styles.activityIconBox}>
                        <EcoIcon name={act.icon} size={24} />
                      </View>
                      <View style={styles.activityInfo}>
                        <View style={styles.activityNameRow}>
                          <Text style={[styles.activityName, (done || oneTimeDone) && styles.textMuted]}>
                            {act.name}
                          </Text>
                          {isOneTime && (
                            <View style={styles.badgeOneTime}>
                              <Text style={styles.badgeOneTimeText}>{t("market.oneTime")}</Text>
                            </View>
                          )}
                          {act.activityType === "cyclical" && (
                            <View style={styles.badgeCyclical}>
                              <Text style={styles.badgeCyclicalText}>{t("market.cyclical")}</Text>
                            </View>
                          )}
                        </View>
                        {act.description && (
                          <Text style={[styles.activityDesc, (done || oneTimeDone) && styles.textMuted]}>
                            {act.description}
                          </Text>
                        )}
                        <View style={styles.activityMeta}>
                          <Text style={[styles.activityPoints, (done || oneTimeDone) && styles.textMuted]}>
                            +{act.basePoints} EXP
                          </Text>
                          {act.expiresAt && (
                            <Text style={[styles.activityExpiry, (done || oneTimeDone) && styles.textMuted]}>
                              {t("market.expiresPrefix")} {new Date(act.expiresAt).toLocaleDateString("pl-PL")}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>

                    {done || oneTimeDone ? (
                      <View style={styles.doneBadge}>
                        <Text style={styles.doneCheck}>✓</Text>
                      </View>
                    ) : (
                      <Pressable
                        style={[styles.submitBtn, submittingId === act.id && styles.submitBtnDisabled]}
                        onPress={() => {
                          setSubmittingId(act.id);
                          submitMutation.mutate(act.id);
                        }}
                        disabled={submittingId === act.id}
                      >
                        {submittingId === act.id ? (
                          <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                          <Text style={styles.submitBtnText}>+</Text>
                        )}
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.brownDark,
    marginBottom: spacing.xs,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x3s,
    marginBottom: spacing.xs,
  },
  coinBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.creamDark,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceText: {
    fontSize: 14,
    color: colors.olive,
    fontWeight: "600",
  },
  tabsRow: {
    flexDirection: "row",
    gap: spacing.x3s,
    marginBottom: spacing.xs,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.olive,
  },
  tabTextActive: {
    color: colors.primaryForeground,
  },
  filtersRow: {
    flexDirection: "row",
    gap: spacing.x3s,
    marginBottom: spacing.xs,
  },
  filterBtn: {
    paddingVertical: spacing.x3s,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
  },
  filterBtnInactive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  filterTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryForeground,
  },
  filterTextInactive: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.olive,
  },
  rewardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.x2s,
  },
  rewardCard: {
    width: "47%",
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: radius.md,
    padding: spacing.x2s,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rewardBody: {
    flex: 1,
    gap: spacing.x4s,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.brownDark,
  },
  rewardMerchant: {
    fontSize: 13,
    color: colors.olive,
  },
  rewardCostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x4s,
    marginTop: 8,
  },
  rewardCost: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.greenDark,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.brownDark,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.olive,
    textAlign: "center",
  },
  activitiesList: {
    gap: spacing.x2s,
  },
  activityCard: {
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: radius.md,
    padding: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityCardDone: {
    opacity: 0.6,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x2s,
    flex: 1,
  },
  activityIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.creamMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  activityInfo: {
    flex: 1,
    gap: spacing.x4s,
  },
  activityNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x3s,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.brownDark,
  },
  activityDesc: {
    fontSize: 13,
    color: colors.olive,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x2s,
    marginTop: 4,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.greenDark,
  },
  activityExpiry: {
    fontSize: 12,
    color: colors.olive,
  },
  badgeOneTime: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: spacing.x3s,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeOneTimeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.greenDark,
  },
  badgeCyclical: {
    backgroundColor: colors.creamDark,
    paddingHorizontal: spacing.x3s,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeCyclicalText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.olive,
  },
  doneBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    backgroundColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
  },
  doneCheck: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  submitBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greenBright,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },
  textMuted: {
    opacity: 0.6,
  },
});
