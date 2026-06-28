import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
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

interface ActivitiesFormProps {
  onCreate: (input: ActivityInput) => void;
  creating: boolean;
}

const CATEGORIES = ["MOBILITY", "CIRCULARITY", "LOCAL_CONSUMPTION", "NATURE_ACTIVITY"] as const;

export function ActivitiesForm({ onCreate, creating }: ActivitiesFormProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("leaf");
  const [category, setCategory] = useState<string>("MOBILITY");
  const [basePoints, setBasePoints] = useState("10");
  const [activityType, setActivityType] = useState<"one_time" | "cyclical">("cyclical");
  const [expiresAt, setExpiresAt] = useState("");

  const categoryLabels: Record<string, string> = {
    MOBILITY: t("admin.activities.categories.mobility"),
    CIRCULARITY: t("admin.activities.categories.circularity"),
    LOCAL_CONSUMPTION: t("admin.activities.categories.localConsumption"),
    NATURE_ACTIVITY: t("admin.activities.categories.natureActivity"),
  };

  const resetForm = () => {
    setShowForm(false); setName(""); setDescription(""); setIcon("leaf");
    setCategory("MOBILITY"); setBasePoints("10"); setActivityType("cyclical"); setExpiresAt("");
  };

  const handleSubmit = () => {
    if (!name || !basePoints) return;
    onCreate({ name, description: description || undefined, icon, category, basePoints: parseInt(basePoints, 10), activityType, expiresAt: activityType === "cyclical" && expiresAt ? expiresAt : undefined });
    resetForm();
  };

  return (
    <>
      <Pressable style={[styles.addBtn, showForm && { opacity: 0.7 }]} onPress={() => showForm ? resetForm() : setShowForm(true)}>
        <Text style={styles.addBtnText}>{showForm ? t("common.cancel") : t("admin.activities.addActivity")}</Text>
      </Pressable>

      {showForm && (
        <View style={styles.formCard}>
          <TextInput style={styles.input} placeholder={t("admin.activities.activityName")} value={name} onChangeText={setName} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.input} placeholder={t("admin.activities.description")} value={description} onChangeText={setDescription} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.input} placeholder={t("admin.activities.icon")} value={icon} onChangeText={setIcon} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.input} placeholder={t("admin.activities.basePoints")} value={basePoints} onChangeText={setBasePoints} keyboardType="numeric" placeholderTextColor={colors.inputPlaceholder} />

          <Text style={styles.label}>{t("admin.activities.category")}</Text>
          <View style={styles.filterRow}>
            {CATEGORIES.map((c) => (
              <Pressable key={c} style={[styles.filterBtn, category === c && styles.filterBtnActive]} onPress={() => setCategory(c)}>
                <Text style={[styles.filterText, category === c && styles.filterTextActive]}>{categoryLabels[c]}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>{t("admin.activities.activityType")}</Text>
          <View style={styles.filterRow}>
            <Pressable style={[styles.filterBtn, activityType === "one_time" && styles.filterBtnActive]} onPress={() => setActivityType("one_time")}>
              <Text style={[styles.filterText, activityType === "one_time" && styles.filterTextActive]}>{t("admin.activities.oneTime")}</Text>
            </Pressable>
            <Pressable style={[styles.filterBtn, activityType === "cyclical" && styles.filterBtnActive]} onPress={() => setActivityType("cyclical")}>
              <Text style={[styles.filterText, activityType === "cyclical" && styles.filterTextActive]}>{t("admin.activities.cyclical")}</Text>
            </Pressable>
          </View>

          {activityType === "cyclical" && (
            <TextInput style={styles.input} placeholder={t("admin.activities.expiresAt")} value={expiresAt} onChangeText={setExpiresAt} placeholderTextColor={colors.inputPlaceholder} />
          )}

          <Pressable style={[styles.submitBtn, (!name || !basePoints || creating) && { opacity: 0.5 }]} onPress={handleSubmit} disabled={!name || !basePoints || creating}>
            <Text style={styles.submitBtnText}>{creating ? t("common.creating") : t("admin.activities.createActivity")}</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  addBtn: { backgroundColor: colors.roleCompany, borderRadius: radius.md, paddingVertical: spacing.x2s, paddingHorizontal: spacing.md, alignItems: "center", alignSelf: "flex-start" },
  addBtnText: { color: colors.white, fontSize: 15, fontWeight: "700" },
  formCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: spacing.xs, gap: 10, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, padding: spacing.x3s, fontSize: 14, color: colors.slate900, backgroundColor: colors.inputBg },
  label: { fontSize: 13, fontWeight: "600", color: colors.olive },
  filterRow: { flexDirection: "row", gap: spacing.x3s, flexWrap: "wrap" },
  filterBtn: { paddingHorizontal: spacing.xs, paddingVertical: spacing.x3s, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.slate200, backgroundColor: colors.white },
  filterBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: colors.slate600 },
  filterTextActive: { color: colors.primaryForeground },
  submitBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.x2s, alignItems: "center" },
  submitBtnText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
