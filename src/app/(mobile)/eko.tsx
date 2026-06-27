import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Screen } from "../../features/common/Screen";
import {
  fetchEcoActivities,
  fetchRootStatus,
  submitEcoActivity,
  transformRoot,
} from "../../lib/api/endpoints";
import { EcoIcon } from "../../components/EcoIcon";
import type { EcoActivity, SubmitActivityResponse } from "../../lib/types/api";
import { colors } from "../../styles/tokens";

const CATEGORY_META: Record<
  string,
  { label: string; bgColor: string; textColor: string }
> = {
  MOBILITY: {
    label: "Mobilność",
    bgColor: colors.greenLight,
    textColor: colors.brownDark,
  },
  CIRCULARITY: {
    label: "Cyrkularność",
    bgColor: colors.creamDark,
    textColor: colors.brownDark,
  },
  LOCAL_CONSUMPTION: {
    label: "Lokalne",
    bgColor: colors.creamMedium,
    textColor: colors.brownDark,
  },
  NATURE_ACTIVITY: {
    label: "Natura",
    bgColor: colors.greenBright,
    textColor: colors.brownDark,
  },
};

const STAGE_IMAGES: Record<number, any> = {
  1: require("../../../assets/00_seed.png"),
  2: require("../../../assets/01_seed.png"),
  3: require("../../../assets/02_seed.png"),
};

function StageImage({ level }: { level: number }) {
  const src = STAGE_IMAGES[level];
  if (src) {
    return <Image source={src} style={styles.stageImage} />;
  }
  return null;
}

export default function EkoScreen() {
  const queryClient = useQueryClient();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SubmitActivityResponse | null>(
    null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      if (data.ok) {
        setSubmitError(null);
        setLastResult(data);
        queryClient.invalidateQueries({ queryKey: ["eco-activities"] });
        queryClient.invalidateQueries({ queryKey: ["root-status"] });
      } else {
        setSubmitError(data.message ?? "Nie udało się dodać aktywności.");
      }
    },
    onError: (err: Error) => {
      setSubmittingId(null);
      setSubmitError(err.message);
    },
  });

  const transformMutation = useMutation({
    mutationFn: transformRoot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["root-status"] });
    },
  });

  const handleSubmit = (id: string) => {
    setSubmittingId(id);
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
    ? Math.min(
        100,
        ((totalExp - (currentStage?.expRequired ?? 0)) /
          (nextStage.expRequired - (currentStage?.expRequired ?? 0))) *
          100
      )
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
        <Text style={styles.title}>Eko-rozwój</Text>
        <Text style={styles.errorText}>
          Nie udało się załadować danych:{" "}
          {rootError?.message || activitiesError?.message}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Eko-rozwój</Text>

      {/* Root Evolution Card */}
      <View style={[styles.card, styles.cardLight, { marginBottom: 16 }]}>
        <View style={styles.cardBody}>
          <View style={styles.row}>
            <StageImage level={currentStage?.level ?? 1} />
            <View style={styles.stageInfo}>
              <Text style={styles.stageName}>
                {currentStage?.name ?? "Ziarenko"}
              </Text>
              <Text style={styles.expLabel}>{totalExp} EXP</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(1, expProgress)}%` },
              ]}
            />
          </View>

          {nextStage && (
            <Text style={styles.nextStageText}>
              {nextStage.name} · {nextStage.expRequired} EXP
            </Text>
          )}

          {rootStatus?.canTransform && (
            <Pressable
              onPress={() => transformMutation.mutate()}
              style={[styles.btnPrimary, { marginTop: 8 }]}
            >
              {transformMutation.isPending ? (
                <ActivityIndicator color={colors.brownDark} />
              ) : (
                <Text style={styles.btnPrimaryText}>Ewoluuj!</Text>
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* Submission feedback */}
      {submitError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{submitError}</Text>
        </View>
      )}

      {lastResult && (
        <View style={[styles.resultBanner]}>
          <Text style={styles.resultText}>
            +{lastResult.points.exp} EXP · +{lastResult.points.leaderboard} pkt
            rankingowych
          </Text>
          <View style={styles.badgesRow}>
            {lastResult.caps.firstTimeBonus && (
              <View style={[styles.badge, { backgroundColor: colors.greenLight }]}>
                <Text style={styles.badgeText}>First-time x2</Text>
              </View>
            )}
            {lastResult.caps.synergyBonus && (
              <View
                style={[styles.badge, { backgroundColor: colors.greenBright }]}
              >
                <Text style={styles.badgeText}>Synergia +20%</Text>
              </View>
            )}
            {lastResult.caps.diminishingMultiplier < 1 &&
              lastResult.caps.diminishingMultiplier > 0 && (
                <View
                  style={[styles.badge, { backgroundColor: colors.creamMedium }]}
                >
                  <Text style={styles.badgeText}>
                    x{lastResult.caps.diminishingMultiplier}
                  </Text>
                </View>
              )}
            {lastResult.caps.diminishingMultiplier === 0 && (
              <View style={[styles.badge, { backgroundColor: colors.warning }]}>
                <Text style={styles.badgeText}>Brak pkt rankingowych</Text>
              </View>
            )}
          </View>
          <Text style={styles.remainingText}>
            Pozostało: {lastResult.caps.categoryRemaining}/
            {lastResult.caps.globalRemaining} pkt (kategoria/dzień)
          </Text>
        </View>
      )}

      {/* Eco Activities by Category */}
      <Text style={styles.sectionTitle}>Aktywności</Text>

      {!activities ? (
        <ActivityIndicator style={{ padding: 20 }} />
      ) : (
        Object.entries(grouped).map(([cat, acts]) => {
          const meta = CATEGORY_META[cat] ?? {
            label: cat,
            bgColor: colors.creamDark,
            textColor: colors.brownDark,
          };
          return (
            <View key={cat} style={styles.categoryBlock}>
              <View
                style={[styles.categoryHeader, { backgroundColor: meta.bgColor }]}
              >
                <Text style={[styles.categoryHeaderText, { color: meta.textColor }]}>
                  {meta.label}
                </Text>
              </View>
              {acts.map((act) => {
                const done = act.completedToday ?? false;
                const oneTimeDone = act.completedOneTime ?? false;
                const isOneTime = act.activityType === "one_time";
                return (
                  <View
                    key={act.id}
                    style={[
                      styles.activityRow,
                      (done || oneTimeDone) && styles.activityRowDone,
                    ]}
                  >
                    <View style={styles.activityLeft}>
                      <EcoIcon name={act.icon} size={20} />
                      <View style={styles.activityInfo}>
                        <Text
                          style={[
                            styles.activityName,
                            (done || oneTimeDone) && styles.textMuted,
                          ]}
                        >
                          {act.name}
                          {isOneTime && <Text style={styles.badgeOneTime}> Jednorazowa</Text>}
                        </Text>
                        <Text
                          style={[
                            styles.activityMeta,
                            (done || oneTimeDone) && styles.textMuted,
                          ]}
                        >
                          {act.basePoints} pkt bazowych · EXP + ranking
                          {act.expiresAt && ` · Do ${new Date(act.expiresAt).toLocaleDateString("pl-PL")}`}
                        </Text>
                      </View>
                    </View>

                    {done || oneTimeDone ? (
                      <View style={styles.doneCircle}>
                        <Text style={styles.doneCheck}>✓</Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => handleSubmit(act.id)}
                        disabled={submittingId === act.id}
                        style={styles.addBtn}
                      >
                        {submittingId === act.id ? (
                          <ActivityIndicator
                            size="small"
                            color={colors.brownDark}
                          />
                        ) : (
                          <Text style={styles.addBtnText}>+</Text>
                        )}
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.brownDark,
    marginBottom: 16,
  },
  errorText: {
    textAlign: "center",
    paddingVertical: 40,
    color: colors.olive,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stageImage: {
    width: 48,
    height: 48,
  },
  stageInfo: {
    flex: 1,
  },
  stageName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.brownDark,
  },
  expLabel: {
    fontSize: 14,
    color: colors.olive,
    marginTop: 4,
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
  nextStageText: {
    fontSize: 12,
    color: colors.olive,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryForeground,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "rgba(139, 69, 19, 0.1)",
  },
  errorBannerText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.error,
  },
  resultBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
    backgroundColor: colors.creamDark,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.brownDark,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.brownDark,
  },
  remainingText: {
    fontSize: 12,
    color: colors.olive,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.brownDark,
    marginBottom: 12,
  },
  categoryBlock: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  categoryHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryHeaderText: {
    fontSize: 14,
    fontWeight: "700",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.creamDark,
  },
  activityRowDone: {
    opacity: 0.55,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.brownDark,
  },
  activityMeta: {
    fontSize: 12,
    color: colors.olive,
    marginTop: 4,
  },
  textMuted: {
    opacity: 0.6,
  },
  badgeOneTime: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.greenBright,
    backgroundColor: colors.greenLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  doneCircle: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: colors.olive,
    alignItems: "center",
    justifyContent: "center",
  },
  doneCheck: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primaryForeground,
  },
});
