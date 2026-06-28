import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { HistoryIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { colors, radius } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";
import { fetchHistory } from "../../lib/api/endpoints";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const filter = useAppStore((s) => s.historyFilter);
  const setFilter = useAppStore((s) => s.setHistoryFilter);
  const { data: items = [] } = useQuery({
    queryKey: ["history", filter],
    queryFn: () => fetchHistory(filter),
  });

  const visible = items;

  return (
    <Screen>
      <Text style={styles.title}>{t("history.title")}</Text>

      <View style={styles.filterRow}>
        {(["all", "earned", "spent"] as const).map((f) => (
          <Text
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            {t(`history.filters.${f}`)}
          </Text>
        ))}
      </View>

      {visible.length === 0 && (
        <View style={styles.emptyState}>
          <HistoryIcon size={48} color={colors.slate200} />
          <Text style={styles.emptyText}>{t("history.empty")}</Text>
        </View>
      )}

      {visible.map((i) => (
        <View key={i.id} style={styles.card}>
          <Text style={styles.cardName}>{i.name}</Text>
          <View
            style={[
              styles.pointsBadge,
              i.points < 0
                ? { backgroundColor: colors.errorBg }
                : { backgroundColor: colors.mist },
            ]}
          >
            <Text
              style={[
                styles.pointsText,
                { color: i.points < 0 ? colors.error : colors.mossGreen },
              ]}
            >
              {i.points > 0 ? "+" : ""}
              {i.points}
            </Text>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate500,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.slate200,
    overflow: "hidden",
  },
  filterChipActive: {
    color: colors.white,
    backgroundColor: colors.mossGreen,
    borderColor: colors.mossGreen,
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  emptyText: {
    color: colors.slate400,
    fontSize: 15,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: colors.inputBg,
  },
  cardName: {
    fontSize: 15,
    color: colors.slate900,
    fontWeight: "500",
    flex: 1,
  },
  pointsBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
