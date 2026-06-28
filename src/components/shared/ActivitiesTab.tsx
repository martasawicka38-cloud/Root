import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Company, EcoActivity } from "../../lib/types/api";
import { ActivitiesForm } from "./ActivitiesForm";
import { ActivitiesTable } from "./ActivitiesTable";
import { EmptyState } from "./EmptyState";
import { ErrorCard } from "./ErrorCard";
import { LoadingState } from "./LoadingState";
import { colors, radius, spacing } from "../../styles/tokens";

interface ActivityInput {
  name: string;
  description?: string;
  icon: string;
  category: string;
  basePoints: number;
  activityType: string;
  expiresAt?: string;
}

interface ActivitiesTabProps {
  activities: EcoActivity[];
  isPending: boolean;
  error: Error | null;
  onCreate: (input: ActivityInput) => void;
  creating: boolean;
  onDelete: (id: string) => void;
  deleting: boolean;
  companies?: Company[];
  selectedCompanyId?: string;
  onSelectCompany?: (id: string) => void;
  titleKey?: string;
  emptyKey?: string;
}

export function ActivitiesTab({
  activities, isPending, error, onCreate, creating, onDelete, deleting,
  companies, selectedCompanyId, onSelectCompany, titleKey, emptyKey,
}: ActivitiesTabProps) {
  const { t } = useTranslation();

  if (isPending) return <LoadingState />;
  if (error) return <ErrorCard title={t("common.errorLoading")} error={error} />;

  return (
    <>
      {companies && onSelectCompany && (
        <View style={styles.companySelector}>
          <Text style={styles.companyLabel}>{t("admin.activities.company")}</Text>
          <View style={styles.companyButtons}>
            {companies.map((c) => (
              <Pressable key={c.id} style={[styles.companyBtn, selectedCompanyId === c.id && styles.companyBtnActive]} onPress={() => onSelectCompany(c.id)}>
                <Text style={[styles.companyBtnText, selectedCompanyId === c.id && styles.companyBtnTextActive]}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {(!companies || selectedCompanyId) && (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{t(titleKey ?? "company.activities.title")} ({activities.length})</Text>
            <ActivitiesForm onCreate={onCreate} creating={creating} />
          </View>

          {activities.length === 0 ? (
            <EmptyState message={t(emptyKey ?? "company.activities.noActivities")} />
          ) : (
            <ActivitiesTable activities={activities} onDelete={onDelete} deleting={deleting} />
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  companySelector: { marginBottom: spacing.xs },
  companyLabel: { fontSize: 14, fontWeight: "600", color: colors.slate700, marginBottom: spacing.x3s },
  companyButtons: { flexDirection: "row", gap: spacing.x3s, flexWrap: "wrap" },
  companyBtn: { paddingHorizontal: spacing.xs, paddingVertical: spacing.x3s, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.slate200, backgroundColor: colors.white },
  companyBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  companyBtnText: { fontSize: 13, fontWeight: "600", color: colors.slate600 },
  companyBtnTextActive: { color: colors.primaryForeground },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  title: { fontSize: 18, fontWeight: "700", color: colors.slate900 },
});
