import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchMarket } from "../../lib/api/endpoints";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../../styles/tokens";
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
      <Text style={styles.title}>← Rynek nagrod</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Saldo: {balance} Eco-Coins</Text>
        <Text style={styles.balanceIcon}>💰</Text>
      </View>

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
              {f}
            </Text>
          </Pressable>
        ))}
      </View>
      {visible.map((reward) => (
        <Link
          key={reward.id}
          href={{
            pathname: "/(mobile)/reward",
            params: { rewardId: reward.id },
          }}
          style={styles.item}
        >
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>
              {reward.icon} {reward.title}
            </Text>
            <Text style={styles.cardCost}>{reward.cost} Eco-Coins</Text>
          </View>
          <Text style={styles.cardMerchant}>{reward.merchant}</Text>
          <Text style={styles.cta}>Wymien</Text>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    color: colors.deepForest,
    marginBottom: spacing.x3s,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.x2s,
  },
  balanceLabel: {
    ...typography.body,
    color: colors.slate600,
    fontWeight: "600",
  },
  balanceIcon: {
    fontSize: 18,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.x3s,
    marginBottom: spacing.x3s,
  },
  filter: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: radius.full,
    paddingVertical: spacing.x3s,
    paddingHorizontal: spacing.xs,
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
  item: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: spacing.xs,
    backgroundColor: colors.white,
    ...shadows.sm,
    marginBottom: spacing.x3s,
  },
  cardHead: {
    gap: spacing.x4s,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.slate900,
  },
  cardCost: {
    ...typography.body,
    color: colors.warmGold,
    fontWeight: "700",
  },
  cardMerchant: {
    ...typography.bodySmall,
    color: colors.slate600,
    marginTop: spacing.x3s,
  },
  cta: {
    marginTop: spacing.x2s,
    alignSelf: "flex-start",
    backgroundColor: colors.mossGreen,
    color: colors.white,
    fontWeight: "700",
    borderRadius: radius.md,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.x3s,
  },
});
