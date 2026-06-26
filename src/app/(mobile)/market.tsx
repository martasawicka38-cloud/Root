import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchMarket } from "../../lib/api/endpoints";
import { colors, radius, spacing, typography } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";
import { fetchWallet } from "../../lib/api/endpoints";

const filters = ["all", "food", "wellness", "sport", "eco"] as const;

export default function MarketScreen() {
  const filter = useAppStore((s) => s.marketFilter);
  const setFilter = useAppStore((s) => s.setMarketFilter);
  const { data: rewards = [] } = useQuery({
    queryKey: ["market"],
    queryFn: fetchMarket,
  });
  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWallet,
  });

  const visible = rewards.filter(
    (r) => filter === "all" || r.category === filter,
  );
  const balance = wallet?.balance ?? 0;

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.back}>‹</Text>
        <Text style={styles.title}>Rynek nagrod</Text>
        <Text style={styles.back}> </Text>
      </View>

      <Text style={styles.balanceLabel}>Saldo: {balance} EC</Text>

      <View style={styles.filters}>
        {filters.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filter, filter === f && styles.filterActive]}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === "all" ? "Wszystko" : f[0].toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.grid}>
        {visible.map((reward) => (
          <Link
            key={reward.id}
            href={{
              pathname: "/(mobile)/reward",
              params: { rewardId: reward.id },
            }}
            style={styles.item}
          >
            <View style={styles.cardIconWrap}>
              <Text style={styles.cardIcon}>{reward.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{reward.title}</Text>
            <Text style={styles.cardMerchant}>{reward.merchant}</Text>
            <Text style={styles.cardCost}>{reward.cost} EC</Text>
          </Link>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.x3s,
  },
  back: {
    fontSize: 22,
    color: colors.slate900,
    width: 24,
  },
  title: {
    ...typography.h2,
    color: colors.deepForest,
    textAlign: "center",
    flex: 1,
  },
  balanceLabel: {
    ...typography.bodySmall,
    color: colors.slate400,
    marginBottom: spacing.x2s,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: spacing.x3s,
    marginBottom: spacing.x3s,
  },
  filter: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: radius.full,
    paddingVertical: spacing.x3s,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.white,
  },
  filterActive: {
    backgroundColor: colors.mossGreen,
    borderColor: colors.mossGreen,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.slate600,
    fontWeight: "600",
  },
  filterTextActive: { color: colors.white },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.x3s,
  },
  item: {
    width: "48%",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: spacing.xs,
    backgroundColor: "#EEF2F5",
  },
  cardIconWrap: {
    borderRadius: radius.sm,
    backgroundColor: "#DDE6F6",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.x2s,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.slate900,
  },
  cardMerchant: {
    ...typography.bodySmall,
    color: colors.slate600,
    marginTop: 2,
  },
  cardCost: {
    ...typography.h3,
    marginTop: spacing.x3s,
    color: colors.warmGold,
    fontWeight: "700",
  },
});
