import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Screen } from "../../features/common/Screen";
import { fetchEcoActivities, fetchRootStatus, submitEcoActivity, transformRoot } from "../../lib/api/endpoints";
import { RootEvolutionCard } from "../../features/eko/RootEvolutionCard";
import { SubmissionFeedback } from "../../features/eko/SubmissionFeedback";
import { EcoActivityCategory } from "../../features/eko/EcoActivityCategory";
import type { EcoActivity, SubmitActivityResponse } from "../../lib/types/api";
import { colors, radius, spacing } from "../../styles/tokens";

const CATEGORY_META: Record<string, { bgColor: string; textColor: string }> = {
  MOBILITY: { bgColor: colors.greenLight, textColor: colors.brownDark },
  CIRCULARITY: { bgColor: colors.creamDark, textColor: colors.brownDark },
  LOCAL_CONSUMPTION: { bgColor: colors.creamMedium, textColor: colors.brownDark },
  NATURE_ACTIVITY: { bgColor: colors.greenBright, textColor: colors.brownDark },
};

export default function EkoScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SubmitActivityResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const CATEGORY_LABELS: Record<string, string> = {
    MOBILITY: t("eco.categories.mobility"),
    CIRCULARITY: t("eco.categories.circularity"),
    LOCAL_CONSUMPTION: t("eco.categories.localConsumption"),
    NATURE_ACTIVITY: t("eco.categories.natureActivity"),
  };

  const rootQuery = useQuery({ queryKey: ["root-status"], queryFn: fetchRootStatus });
  const activitiesQuery = useQuery({ queryKey: ["eco-activities"], queryFn: fetchEcoActivities });

  const submitMutation = useMutation({
    mutationFn: submitEcoActivity,
    onSuccess: (data) => {
      setSubmittingId(null);
      if (data.ok) { setSubmitError(null); setLastResult(data); queryClient.invalidateQueries({ queryKey: ["eco-activities"] }); queryClient.invalidateQueries({ queryKey: ["root-status"] }); }
      else { setSubmitError(data.message ?? t("eco.submitError")); }
    },
    onError: (err: Error) => { setSubmittingId(null); setSubmitError(err.message); },
  });

  const transformMutation = useMutation({ mutationFn: transformRoot, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["root-status"] }) });

  const handleSubmit = (id: string) => { setSubmittingId(id); submitMutation.mutate(id); };

  if (rootQuery.isPending || activitiesQuery.isPending) return <Screen><ActivityIndicator style={{ padding: spacing.xl }} color={colors.mossGreen} /></Screen>;
  if (rootQuery.error || activitiesQuery.error) return <Screen><Text style={screenStyles.title}>{t("eco.title")}</Text><Text style={screenStyles.errorText}>{t("common.errorLoading")} {rootQuery.error?.message || activitiesQuery.error?.message}</Text></Screen>;

  const rootStatus = rootQuery.data!;
  const activities = activitiesQuery.data ?? [];
  const grouped = activities.reduce<Record<string, EcoActivity[]>>((acc, a) => { (acc[a.category] ??= []).push(a); return acc; }, {});

  return (
    <Screen>
      <Text style={screenStyles.title}>{t("eco.title")}</Text>
      <RootEvolutionCard currentStage={rootStatus.currentStage} nextStage={rootStatus.nextStage} totalExp={rootStatus.totalExp ?? 0} canTransform={rootStatus.canTransform} onTransform={() => transformMutation.mutate()} transforming={transformMutation.isPending} />
      <SubmissionFeedback error={submitError} result={lastResult} />
      <Text style={screenStyles.sectionTitle}>{t("eco.activities")}</Text>
      {Object.entries(grouped).map(([cat, acts]) => {
        const meta = CATEGORY_META[cat] ?? { bgColor: colors.creamDark, textColor: colors.brownDark };
        return <EcoActivityCategory key={cat} category={cat} label={CATEGORY_LABELS[cat] ?? cat} bgColor={meta.bgColor} textColor={meta.textColor} activities={acts} submittingId={submittingId} onSubmit={handleSubmit} />;
      })}
    </Screen>
  );
}

const screenStyles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.brownDark, marginBottom: spacing.xs },
  errorText: { textAlign: "center", paddingVertical: spacing.xl, color: colors.olive },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.brownDark, marginBottom: spacing.x2s },
});
