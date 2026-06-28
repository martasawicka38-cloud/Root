import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { EcoActivity } from "../../../lib/types/api";
import { styles } from "../company.styles";
import { colors, radius } from "../../../styles/tokens";

export function ActivitiesTab({ query, onCreate, creating, onDelete, deleting }: {
  query: { data?: EcoActivity[]; isPending: boolean; error: Error | null };
  onCreate: (input: { name: string; description?: string; icon: string; category: string; basePoints: number; activityType: string; expiresAt?: string }) => void;
  creating: boolean;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("leaf");
  const [category, setCategory] = useState("MOBILITY");
  const [basePoints, setBasePoints] = useState("10");
  const [activityType, setActivityType] = useState<"one_time" | "cyclical">("cyclical");
  const [expiresAt, setExpiresAt] = useState("");

  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>{t("common.errorLoading")}</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  const activities = query.data ?? [];

  const handleCreate = () => {
    if (!name || !basePoints) return;
    onCreate({ name, description: description || undefined, icon, category, basePoints: parseInt(basePoints, 10), activityType, expiresAt: activityType === "cyclical" && expiresAt ? expiresAt : undefined });
    setName(""); setDescription(""); setBasePoints("10"); setActivityType("cyclical"); setExpiresAt(""); setShowForm(false);
  };

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>{t("company.activities.title")} ({activities.length})</Text>
        <Pressable style={[styles.genBigBtn, showForm && { opacity: 0.7 }]} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.genBigBtnText}>{showForm ? t("common.cancel") : t("company.activities.addActivity")}</Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: 16, gap: 10, marginBottom: 16 }}>
          <TextInput style={styles.inputSmall} placeholder={t("company.activities.activityName")} value={name} onChangeText={setName} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder={t("company.activities.description")} value={description} onChangeText={setDescription} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder={t("company.activities.icon")} value={icon} onChangeText={setIcon} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder={t("company.activities.basePoints")} value={basePoints} onChangeText={setBasePoints} keyboardType="numeric" placeholderTextColor={colors.inputPlaceholder} />
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.olive }}>{t("company.activities.category")}</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {["MOBILITY", "CIRCULARITY", "LOCAL_CONSUMPTION", "NATURE_ACTIVITY"].map((c) => (
              <Pressable key={c} style={[styles.actionBtn, category === c && { backgroundColor: colors.greenDark, borderColor: colors.greenDark }]} onPress={() => setCategory(c)}>
                <Text style={[styles.actionBtnText, category === c && { color: colors.creamLight }]}>{{ MOBILITY: t("company.activities.categories.mobility"), CIRCULARITY: t("company.activities.categories.circularity"), LOCAL_CONSUMPTION: t("company.activities.categories.localConsumption"), NATURE_ACTIVITY: t("company.activities.categories.natureActivity") }[c]}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.olive }}>{t("company.activities.activityType")}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable style={[styles.actionBtn, activityType === "one_time" && { backgroundColor: colors.greenDark, borderColor: colors.greenDark }]} onPress={() => setActivityType("one_time")}>
              <Text style={[styles.actionBtnText, activityType === "one_time" && { color: colors.creamLight }]}>{t("company.activities.oneTime")}</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, activityType === "cyclical" && { backgroundColor: colors.greenDark, borderColor: colors.greenDark }]} onPress={() => setActivityType("cyclical")}>
              <Text style={[styles.actionBtnText, activityType === "cyclical" && { color: colors.creamLight }]}>{t("company.activities.cyclical")}</Text>
            </Pressable>
          </View>
          {activityType === "cyclical" && <TextInput style={styles.inputSmall} placeholder={t("company.activities.expiresAt")} value={expiresAt} onChangeText={setExpiresAt} placeholderTextColor={colors.inputPlaceholder} />}
          <Pressable style={[styles.genBigBtn, (!name || !basePoints || creating) && { opacity: 0.5 }]} onPress={handleCreate} disabled={!name || !basePoints || creating}>
            <Text style={styles.genBigBtnText}>{creating ? t("common.creating") : t("company.activities.createActivity")}</Text>
          </Pressable>
        </View>
      )}

      {activities.length === 0 ? (
        <Text style={styles.emptyText}>{t("company.activities.noActivities")}</Text>
      ) : (
        <View style={{ gap: 4 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t("company.activities.table.name")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t("company.activities.table.type")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t("company.activities.table.points")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t("company.activities.table.expires")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>{t("common.actions")}</Text>
          </View>
          {activities.map((a) => (
            <View key={a.id} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.tableCell, { fontWeight: "600" }]}>{a.name}</Text>
                {a.description && <Text style={{ fontSize: 12, color: colors.olive }}>{a.description}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={[styles.badge, { backgroundColor: a.activityType === "one_time" ? colors.creamMedium : colors.successBg }]}>
                  <Text style={[styles.badgeText, { color: a.activityType === "one_time" ? colors.warning : colors.success }]}>{a.activityType === "one_time" ? t("company.activities.oneTime") : t("company.activities.cyclicalShort")}</Text>
                </View>
              </View>
              <Text style={[styles.tableCell, { flex: 1 }]}>{a.basePoints} {t("common.points")}</Text>
              <Text style={[styles.tableCell, { flex: 1, fontSize: 12 }]}>{a.expiresAt ? new Date(a.expiresAt).toLocaleDateString("pl-PL") : "-"}</Text>
              <View style={{ flex: 0.7 }}>
                <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }, deleting && { opacity: 0.5 }]} onPress={() => onDelete(a.id)} disabled={deleting}>
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>{t("common.delete")}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
