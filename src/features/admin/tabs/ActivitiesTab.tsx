import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { Company, EcoActivity } from "../../../lib/types/api";
import { createRewardActivity, deleteRewardActivity, fetchCompanyActivities } from "../../../lib/api/endpoints";
import { EmptyState } from "../../../components/shared/EmptyState";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { styles } from "../admin.styles";
import { colors, spacing } from "../../../styles/tokens";

export function ActivitiesTab({ companiesQuery }: { companiesQuery: { data?: Company[]; isPending: boolean; error: Error | null } }) {
  const { t } = useTranslation();
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("leaf");
  const [category, setCategory] = useState("MOBILITY");
  const [basePoints, setBasePoints] = useState("10");
  const [activityType, setActivityType] = useState<"one_time" | "cyclical">("cyclical");
  const [expiresAt, setExpiresAt] = useState("");

  const queryClient = useQueryClient();

  const { data: activities = [], isPending: activitiesPending } = useQuery({
    queryKey: ["admin-activities", selectedCompany],
    queryFn: () => fetchCompanyActivities(selectedCompany),
    enabled: !!selectedCompany,
  });

  const createMutation = useMutation({
    mutationFn: createRewardActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-activities", selectedCompany] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRewardActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-activities", selectedCompany] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setName("");
    setDescription("");
    setIcon("leaf");
    setCategory("MOBILITY");
    setBasePoints("10");
    setActivityType("cyclical");
    setExpiresAt("");
  };

  const handleSubmit = () => {
    if (!selectedCompany || !name || !basePoints) return;
    createMutation.mutate({
      name,
      description: description || undefined,
      icon,
      category,
      basePoints: parseInt(basePoints, 10),
      activityType,
      expiresAt: activityType === "cyclical" && expiresAt ? expiresAt : undefined,
      companyId: selectedCompany,
    });
  };

  const categoryLabels: Record<string, string> = {
    MOBILITY: t("admin.activities.categories.mobility"),
    CIRCULARITY: t("admin.activities.categories.circularity"),
    LOCAL_CONSUMPTION: t("admin.activities.categories.localConsumption"),
    NATURE_ACTIVITY: t("admin.activities.categories.natureActivity"),
  };

  return (
    <>
      <Text style={styles.sectionTitle}>{t("admin.activities.title")}</Text>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>{t("admin.activities.company")}</Text>
        <View style={styles.filterButtons}>
          {companiesQuery.data?.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.filterBtn, selectedCompany === c.id && styles.filterBtnActive]}
              onPress={() => setSelectedCompany(c.id)}
            >
              <Text style={[styles.filterBtnText, selectedCompany === c.id && styles.filterBtnTextActive]}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedCompany && (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs }}>
            <Text style={styles.pageTitle}>{t("admin.activities.companyActivities")} ({activities.length})</Text>
            <Pressable style={[styles.genBigBtn, showForm && { opacity: 0.7 }]} onPress={() => showForm ? resetForm() : setShowForm(true)}>
              <Text style={styles.genBigBtnText}>{showForm ? t("common.cancel") : t("admin.activities.addActivity")}</Text>
            </Pressable>
          </View>

          {showForm && (
            <View style={styles.formCard}>
              <TextInput style={styles.input} placeholder={t("admin.activities.activityName")} value={name} onChangeText={setName} placeholderTextColor={colors.inputPlaceholder} />
              <TextInput style={styles.input} placeholder={t("admin.activities.description")} value={description} onChangeText={setDescription} placeholderTextColor={colors.inputPlaceholder} />
              <TextInput style={styles.input} placeholder={t("admin.activities.icon")} value={icon} onChangeText={setIcon} placeholderTextColor={colors.inputPlaceholder} />
              <TextInput style={styles.input} placeholder={t("admin.activities.basePoints")} value={basePoints} onChangeText={setBasePoints} keyboardType="numeric" placeholderTextColor={colors.inputPlaceholder} />

              <Text style={styles.formLabel}>{t("admin.activities.category")}</Text>
              <View style={styles.filterButtons}>
                {["MOBILITY", "CIRCULARITY", "LOCAL_CONSUMPTION", "NATURE_ACTIVITY"].map((c) => (
                  <Pressable
                    key={c}
                    style={[styles.filterBtn, category === c && styles.filterBtnActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.filterBtnText, category === c && styles.filterBtnTextActive]}>
                      {categoryLabels[c]}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.formLabel}>{t("admin.activities.activityType")}</Text>
              <View style={styles.filterButtons}>
                <Pressable
                  style={[styles.filterBtn, activityType === "one_time" && styles.filterBtnActive]}
                  onPress={() => setActivityType("one_time")}
                >
                  <Text style={[styles.filterBtnText, activityType === "one_time" && styles.filterBtnTextActive]}>{t("admin.activities.oneTime")}</Text>
                </Pressable>
                <Pressable
                  style={[styles.filterBtn, activityType === "cyclical" && styles.filterBtnActive]}
                  onPress={() => setActivityType("cyclical")}
                >
                  <Text style={[styles.filterBtnText, activityType === "cyclical" && styles.filterBtnTextActive]}>{t("admin.activities.cyclical")}</Text>
                </Pressable>
              </View>

              {activityType === "cyclical" && (
                <TextInput style={styles.input} placeholder={t("admin.activities.expiresAt")} value={expiresAt} onChangeText={setExpiresAt} placeholderTextColor={colors.inputPlaceholder} />
              )}

              <Pressable style={[styles.primaryBtn, (!name || !basePoints || createMutation.isPending) && { opacity: 0.5 }]} onPress={handleSubmit} disabled={!name || !basePoints || createMutation.isPending}>
                <Text style={styles.primaryBtnText}>{createMutation.isPending ? t("common.creating") : t("admin.activities.createActivity")}</Text>
              </Pressable>
            </View>
          )}

          {activitiesPending ? (
            <ActivityIndicator />
          ) : activities.length === 0 ? (
            <EmptyState message={t("admin.activities.noActivities")} />
          ) : (
            <View style={{ gap: spacing.x4s }}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t("common.name")}</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Typ</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t("common.points")}</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Wygasa</Text>
                <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>{t("common.actions")}</Text>
              </View>
              {activities.map((a) => (
                <View key={a.id} style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.tableCell, { fontWeight: "600" }]}>{a.name}</Text>
                    {a.description && <Text style={{ fontSize: 12, color: colors.slate500 }}>{a.description}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <StatusBadge type={a.activityType === "one_time" ? "one_time" : "cyclical"} />
                  </View>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{a.basePoints} {t("common.points")}</Text>
                  <Text style={[styles.tableCell, { flex: 1, fontSize: 12 }]}>
                    {a.expiresAt ? new Date(a.expiresAt).toLocaleDateString("pl-PL") : "-"}
                  </Text>
                  <View style={{ flex: 0.7 }}>
                    <Pressable
                      style={[styles.dangerBtn, deleteMutation.isPending && { opacity: 0.5 }]}
                      onPress={() => deleteMutation.mutate(a.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Text style={styles.dangerBtnText}>{t("common.delete")}</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </>
  );
}
