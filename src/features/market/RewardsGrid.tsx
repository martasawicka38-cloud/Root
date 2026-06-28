import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CoinIcon } from "../../components/icons";
import { EcoIcon } from "../../components/EcoIcon";
import type { Reward } from "../../lib/types/api";
import { colors, radius, spacing } from "../../styles/tokens";

interface RewardsGridProps {
  rewards: Reward[];
  filter: string;
  onFilterChange: (f: "all" | "food" | "wellness" | "sport" | "eco") => void;
}

export function RewardsGrid({ rewards, filter, onFilterChange }: RewardsGridProps) {
  const { t } = useTranslation();
  const visible = rewards.filter((r) => filter === "all" || r.category === filter);

  return (
    <>
      <View style={styles.filtersRow}>
        {(["all", "food", "wellness", "sport", "eco"] as const).map((f) => (
          <Pressable key={f} onPress={() => onFilterChange(f)} style={[styles.filterBtn, filter === f ? styles.filterBtnActive : styles.filterBtnInactive]}>
            <Text style={filter === f ? styles.filterTextActive : styles.filterTextInactive}>{t(`market.filters.${f}`)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.grid}>
        {visible.map((reward) => (
          <Link key={reward.id} href={{ pathname: "/(mobile)/reward", params: { rewardId: reward.id } }} asChild>
            <Pressable style={styles.card}>
              <EcoIcon name={reward.icon} size={28} />
              <View style={styles.body}>
                <Text style={styles.title} numberOfLines={2}>{reward.title}</Text>
                <Text style={styles.merchant}>{reward.merchant}</Text>
                <View style={styles.costRow}>
                  <CoinIcon size={12} color={colors.mossGreen} />
                  <Text style={styles.cost}>{reward.cost} EC</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filtersRow: { flexDirection: "row", gap: spacing.x3s, marginBottom: spacing.xs },
  filterBtn: { paddingVertical: spacing.x3s, paddingHorizontal: spacing.xs, borderRadius: radius.md },
  filterBtnActive: { backgroundColor: colors.primary },
  filterBtnInactive: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.creamDark },
  filterTextActive: { fontSize: 14, fontWeight: "600", color: colors.primaryForeground },
  filterTextInactive: { fontSize: 14, fontWeight: "600", color: colors.olive },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.x2s },
  card: { width: "47%", backgroundColor: colors.creamLight, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: spacing.x2s, flexDirection: "row", alignItems: "center", gap: 10 },
  body: { flex: 1, gap: spacing.x4s },
  title: { fontSize: 14, fontWeight: "600", color: colors.brownDark },
  merchant: { fontSize: 13, color: colors.olive },
  costRow: { flexDirection: "row", alignItems: "center", gap: spacing.x4s, marginTop: 8 },
  cost: { fontSize: 14, fontWeight: "700", color: colors.greenDark },
});
