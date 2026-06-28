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
import { useTranslation } from "react-i18next";
import { Screen } from "../../features/common/Screen";
import {
  fetchEcoActivities,
  fetchRootStatus,
  submitEcoActivity,
  transformRoot,
} from "../../lib/api/endpoints";
import { EcoIcon } from "../../components/EcoIcon";
import type { EcoActivity, SubmitActivityResponse } from "../../lib/types/api";
import { colors, radius, spacing } from "../../styles/tokens";

const CATEGORY_META_BASE: Record<
  string,
  { bgColor: string; textColor: string }
> = {
  MOBILITY: { bgColor: colors.greenLight, textColor: colors.brownDark },
  CIRCULARITY: { bgColor: colors.creamDark, textColor: colors.brownDark },
  LOCAL_CONSUMPTION: { bgColor: colors.creamMedium, textColor: colors.brownDark },
  NATURE_ACTIVITY: { bgColor: colors.greenBright, textColor: colors.brownDark },
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const CATEGORY_LABELS: Record<string, string> = {
    MOBILITY: t("eco.categories.mobility"),
    CIRCULARITY: t("eco.categories.circularity"),
    LOCAL_CONSUMPTION: t("eco.categories.localConsumption"),
    NATURE_ACTIVITY: t("eco.categories.natureActivity"),
  };
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
        setSubmitError(data.message ?? t("eco.submitError"));
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
        <ActivityIndicator style={{ padding: spacing.xl }} color={colors.mossGreen} />
      </Screen>
    );
  }

  if (rootError || activitiesError) {
    return (
      <Screen>
        <Text style={styles.title}>{t("eco.title")}</Text>
        <Text style={styles.errorText}>
          {t("common.errorLoading")}{" "}
          {rootError?.message || activitiesError?.message}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>{t("eco.title")}</Text>

      {/* Root Evolution Card */}
      <View style={[styles.card, styles.cardLight, { marginBottom: spacing.xs }]}>
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
                <Text style={styles.btnPrimaryText}>{t("eco.evolve")}</Text>
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
            +{lastResult.points.exp} EXP · +{lastResult.points.leaderboard} {t("common.points")}
            {" "}{t("eco.rankingPoints")}
          </Text>
          <View style={styles.badgesRow}>
            {lastResult.caps.firstTimeBonus && (
              <View style={[styles.badge, { backgroundColor: colors.greenLight }]}>
                <Text style={styles.badgeText}>{t("eco.firstTimeBonus")}</Text>
              </View>
            )}
            {lastResult.caps.synergyBonus && (
              <View
                style={[styles.badge, { backgroundColor: colors.greenBright }]}
              >
                <Text style={styles.badgeText}>{t("eco.synergyBonus")}</Text>
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
                <Text style={styles.badgeText}>{t("eco.noRankingPoints")}</Text>
              </View>
            )}
          </View>
          <Text style={styles.remainingText}>
            {t("eco.remaining")} {lastResult.caps.categoryRemaining}/
            {lastResult.caps.globalRemaining} {t("common.points")} ({t("eco.perCategory")})
          </Text>
        </View>
      )}

      {/* Eco Activities by Category */}
      <Text style={styles.sectionTitle}>{t("eco.activities")}</Text>

      {!activities ? (
        <ActivityIndicator style={{ padding: spacing.sm }} />
      ) : (
        Object.entries(grouped).map(([cat, acts]) => {
          const meta = CATEGORY_META_BASE[cat] ?? {
            bgColor: colors.creamDark,
            textColor: colors.brownDark,
          };
          const label = CATEGORY_LABELS[cat] ?? cat;
          return (
            <View key={cat} style={styles.categoryBlock}>
              <View
                style={[styles.categoryHeader, { backgroundColor: meta.bgColor }]}
              >
                <Text style={[styles.categoryHeaderText, { color: meta.textColor }]}>
                  {label}
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
    marginBottom: spacing.xs,
  },
  errorText: {
    textAlign: "center",
    paddingVertical: spacing.xl,
    color: colors.olive,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: radius.md,
  },
  cardLight: {
    backgroundColor: colors.creamLight,
  },
  cardBody: {
    gap: spacing.x2s,
    padding: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
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
    borderRadius: radius.full,
    backgroundColor: colors.creamDark,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.greenDark,
  },
  nextStageText: {
    fontSize: 12,
    color: colors.olive,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.x2s,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryForeground,
  },
  errorBanner: {
    padding: spacing.x2s,
    borderRadius: radius.sm,
    marginBottom: spacing.x2s,
    backgroundColor: "rgba(139, 69, 19, 0.1)",
  },
  errorBannerText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.error,
  },
  resultBanner: {
    padding: spacing.x2s,
    borderRadius: radius.sm,
    marginBottom: spacing.x2s,
    gap: spacing.x3s,
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
    gap: spacing.x3s,
  },
  badge: {
    paddingHorizontal: spacing.x3s,
    paddingVertical: spacing.x4s,
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
    marginBottom: spacing.x2s,
  },
  categoryBlock: {
    marginBottom: spacing.x2s,
    borderRadius: radius.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  categoryHeader: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.x3s,
  },
  categoryHeaderText: {
    fontSize: 14,
    fontWeight: "700",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.x2s,
    paddingHorizontal: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.creamDark,
  },
  activityRowDone: {
    opacity: 0.55,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x2s,
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
    borderRadius: radius.full,
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
    borderRadius: radius.md,
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
