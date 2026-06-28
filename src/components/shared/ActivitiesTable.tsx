import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { EcoActivity } from "../../lib/types/api";
import { StatusBadge } from "./StatusBadge";
import { colors, radius, spacing } from "../../styles/tokens";

interface ActivitiesTableProps {
  activities: EcoActivity[];
  onDelete: (id: string) => void;
  deleting: boolean;
}

export function ActivitiesTable({ activities, onDelete, deleting }: ActivitiesTableProps) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: spacing.x4s }}>
      <View style={styles.header}>
        <Text style={[styles.headerCell, { flex: 2 }]}>{t("company.activities.table.name")}</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>{t("company.activities.table.type")}</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>{t("company.activities.table.points")}</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>{t("company.activities.table.expires")}</Text>
        <Text style={[styles.headerCell, { flex: 0.7 }]}>{t("common.actions")}</Text>
      </View>
      {activities.map((a) => (
        <View key={a.id} style={styles.row}>
          <View style={{ flex: 2 }}>
            <Text style={[styles.cell, { fontWeight: "600" }]}>{a.name}</Text>
            {a.description && <Text style={styles.desc}>{a.description}</Text>}
          </View>
          <View style={{ flex: 1 }}>
            <StatusBadge type={a.activityType === "one_time" ? "one_time" : "cyclical"} />
          </View>
          <Text style={[styles.cell, { flex: 1 }]}>{a.basePoints} {t("common.points")}</Text>
          <Text style={[styles.cell, { flex: 1, fontSize: 12 }]}>{a.expiresAt ? new Date(a.expiresAt).toLocaleDateString("pl-PL") : "-"}</Text>
          <View style={{ flex: 0.7 }}>
            <Pressable style={[styles.deleteBtn, deleting && { opacity: 0.5 }]} onPress={() => onDelete(a.id)} disabled={deleting}>
              <Text style={styles.deleteBtnText}>{t("common.delete")}</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", backgroundColor: colors.slate100, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  headerCell: { fontSize: 12, fontWeight: "700", color: colors.slate500, textTransform: "uppercase", letterSpacing: 0.5 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 4 },
  cell: { fontSize: 14, color: colors.slate900 },
  desc: { fontSize: 12, color: colors.olive },
  deleteBtn: { paddingHorizontal: spacing.x3s, paddingVertical: 5, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.errorBorder, backgroundColor: colors.errorBg, alignItems: "center" },
  deleteBtnText: { fontSize: 12, fontWeight: "600", color: colors.error },
});
