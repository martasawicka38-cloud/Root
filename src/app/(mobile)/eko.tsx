import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { SproutIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import {
  fetchEcoActivities,
  fetchRootStatus,
  submitEcoActivity,
  transformRoot,
} from "../../lib/api/endpoints";
import type { EcoActivity, SubmitActivityResponse } from "../../lib/types/api";
import { colors, radius, spacing } from "../../styles/tokens";

const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  MOBILITY: { label: "Mobilność", color: "#1E6F5C", bg: "#D8F3DC" },
  CIRCULARITY: { label: "Cyrkularność", color: "#5C4D7D", bg: "#EDE4F2" },
  LOCAL_CONSUMPTION: { label: "Lokalne", color: "#B47A3B", bg: "#FEF3C7" },
  NATURE_ACTIVITY: { label: "Natura", color: "#2D6A4F", bg: "#C6ECD2" },
};

export default function EkoScreen() {
  const queryClient = useQueryClient();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SubmitActivityResponse | null>(null);

  const {
    data: rootStatus,
    isPending: rootPending,
    error: rootError,
  } = useQuery({
    queryKey: ["root-status"],
    queryFn: fetchRootStatus,
  });

  const {
    data: activities,
    isPending: activitiesPending,
    error: activitiesError,
  } = useQuery({
    queryKey: ["eco-activities"],
    queryFn: fetchEcoActivities,
  });

  const submitMutation = useMutation({
    mutationFn: submitEcoActivity,
    onSuccess: (data) => {
      setSubmittingId(null);
      setLastResult(data);
      queryClient.invalidateQueries({ queryKey: ["eco-activities"] });
      queryClient.invalidateQueries({ queryKey: ["root-status"] });
    },
    onError: () => setSubmittingId(null),
  });

  const transformMutation = useMutation({
    mutationFn: transformRoot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["root-status"] });
    },
  });

  const handleSubmit = (id: string) => {
    setSubmittingId(id);
    setLastResult(null);
    submitMutation.mutate(id);
  };

  const grouped = activities
    ? activities.reduce<Record<string, EcoActivity[]>>((acc, a) => {
        (acc[a.category] ??= []).push(a);
        return acc;
      }, {})
    : {};

  const currentStage = rootStatus?.currentStage;
  const nextStage = rootStatus?.nextStage;
  const totalExp = rootStatus?.totalExp ?? 0;
  const expProgress = nextStage
    ? Math.min(100, ((totalExp - (currentStage?.expRequired ?? 0)) / (nextStage.expRequired - (currentStage?.expRequired ?? 0))) * 100)
    : 100;

  if (rootPending || activitiesPending) {
    return (
      <Screen>
        <ActivityIndicator style={{ padding: 40 }} color={colors.mossGreen} />
      </Screen>
    );
  }

  if (rootError || activitiesError) {
    return (
      <Screen>
        <Text style={styles.screenTitle}>🌱 Eko-rozwój</Text>
        <Text style={styles.emptyText}>
          Nie udało się załadować danych: {rootError?.message || activitiesError?.message}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.screenTitle}>🌱 Eko-rozwój</Text>

      {/* Root Evolution Card */}
      <View style={styles.rootCard}>
        <View style={styles.rootHeader}>
          <SproutIcon size={48} color={colors.mossGreen} />
          <View style={styles.rootInfo}>
            <Text style={styles.rootStage}>{currentStage?.name ?? "Ziarenko"}</Text>
            <Text style={styles.rootExp}>{totalExp} EXP</Text>
          </View>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${Math.max(1, expProgress)}%` }]} />
        </View>
        {nextStage && (
          <Text style={styles.rootNext}>
            {nextStage.name} · {nextStage.expRequired} EXP
          </Text>
        )}
        {rootStatus?.canTransform && (
          <Pressable
            style={styles.transformBtn}
            onPress={() => transformMutation.mutate()}
          >
            {transformMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.transformBtnText}>🌿 Ewoluuj!</Text>
            )}
          </Pressable>
        )}
      </View>

      {/* Last submission feedback */}
      {lastResult && (
        <View style={[styles.toast, lastResult.caps.diminishingMultiplier === 0 && styles.toastWarn]}>
          <Text style={styles.toastTitle}>
            +{lastResult.points.exp} EXP · +{lastResult.points.leaderboard} pkt rankingowych
          </Text>
          <View style={styles.toastBadges}>
            {lastResult.caps.firstTimeBonus && <Text style={styles.badge}>🌟 First-time x2</Text>}
            {lastResult.caps.synergyBonus && <Text style={styles.badge}>🔗 Synergia +20%</Text>}
            {lastResult.caps.diminishingMultiplier < 1 && lastResult.caps.diminishingMultiplier > 0 && (
              <Text style={styles.badge}>📉 x{lastResult.caps.diminishingMultiplier}</Text>
            )}
            {lastResult.caps.diminishingMultiplier === 0 && (
              <Text style={[styles.badge, styles.badgeWarn]}>⛔ Brak pkt rankingowych (diminishing)</Text>
            )}
          </View>
          <Text style={styles.toastCaps}>
            Pozostało: {lastResult.caps.categoryRemaining}/{lastResult.caps.globalRemaining} pkt (kategoria/dzień)
          </Text>
        </View>
      )}

      {/* Eco Activities by Category */}
      <Text style={styles.sectionTitle}>Aktywności</Text>
      {!activities ? (
        <ActivityIndicator style={{ padding: 20 }} />
      ) : (
        Object.entries(grouped).map(([cat, acts]) => {
          const meta = CATEGORY_META[cat] ?? { label: cat, color: "#333", bg: "#eee" };
          return (
            <View key={cat} style={styles.catSection}>
              <View style={[styles.catHeader, { backgroundColor: meta.bg }]}>
                <Text style={[styles.catLabel, { color: meta.color }]}>{meta.label}</Text>
              </View>
              {acts.map((act) => (
                <View key={act.id} style={styles.actRow}>
                  <View style={styles.actInfo}>
                    <Text style={styles.actIcon}>{act.icon}</Text>
                    <View style={styles.actTextWrap}>
                      <Text style={styles.actName}>{act.name}</Text>
                      <Text style={styles.actPoints}>{act.basePoints} pkt bazowych · EXP + ranking</Text>
                    </View>
                  </View>
                  <Pressable
                    style={[styles.submitBtn, submittingId === act.id && styles.submitBtnDisabled]}
                    onPress={() => handleSubmit(act.id)}
                    disabled={submittingId === act.id}
                  >
                    {submittingId === act.id ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.submitBtnText}>+</Text>
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: 22, fontWeight: "700", color: colors.slate900, marginBottom: spacing.x2s },
  rootCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.lg, padding: spacing.sm, gap: spacing.x2s },
  rootHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rootInfo: { flex: 1 },
  rootStage: { fontSize: 20, fontWeight: "700", color: colors.deepForest },
  rootExp: { fontSize: 14, color: colors.slate600, marginTop: 2 },
  rootNext: { fontSize: 13, color: colors.slate500 },
  bar: { height: 8, borderRadius: radius.full, backgroundColor: colors.slate200, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: colors.mossGreen, borderRadius: radius.full },
  transformBtn: { backgroundColor: colors.deepForest, borderRadius: radius.md, paddingVertical: 12, alignItems: "center", marginTop: 4 },
  transformBtnText: { color: colors.white, fontSize: 16, fontWeight: "700" },

  toast: { marginTop: spacing.xs, padding: spacing.xs, backgroundColor: colors.mist, borderRadius: radius.md, gap: 4 },
  toastWarn: { backgroundColor: "#FEF3C7" },
  toastTitle: { fontSize: 14, fontWeight: "700", color: colors.deepForest },
  toastBadges: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  badge: { fontSize: 11, fontWeight: "600", color: colors.deepForest, backgroundColor: "rgba(0,0,0,0.05)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
  badgeWarn: { backgroundColor: "#FDE68A", color: "#92400E" },
  toastCaps: { fontSize: 11, color: colors.slate500, marginTop: 2 },

  emptyText: { textAlign: "center", padding: 40, color: colors.slate400, fontSize: 14 },
  sectionTitle: { marginTop: spacing.md, marginBottom: spacing.x2s, fontSize: 18, fontWeight: "700", color: colors.slate900 },

  catSection: { marginBottom: spacing.x2s, borderRadius: radius.md, borderWidth: 1, borderColor: colors.slate200, overflow: "hidden" },
  catHeader: { paddingHorizontal: spacing.sm, paddingVertical: spacing.x3s },
  catLabel: { fontSize: 13, fontWeight: "700" },
  actRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.x2s, paddingHorizontal: spacing.sm, borderTopWidth: 1, borderTopColor: colors.slate100 },
  actInfo: { flexDirection: "row", alignItems: "center", gap: spacing.x2s, flex: 1 },
  actIcon: { fontSize: 20 },
  actTextWrap: { flex: 1 },
  actName: { fontSize: 13, fontWeight: "600", color: colors.slate900 },
  actPoints: { fontSize: 11, color: colors.slate500, marginTop: 1 },
  submitBtn: { width: 32, height: 32, borderRadius: radius.full, backgroundColor: colors.mossGreen, alignItems: "center", justifyContent: "center", marginLeft: spacing.x2s },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: colors.white, fontSize: 18, fontWeight: "700", lineHeight: 20 },
});
