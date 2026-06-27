import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CoinIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { fetchMarket, fetchWallet } from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

const filters = ["all", "food", "wellness", "sport", "eco"] as const;

const filterLabels: Record<string, string> = {
  all: "Wszystko",
  food: "Jedzenie",
  wellness: "Wellness",
  sport: "Sport",
  eco: "Eko",
};

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
      <View style={styles.header}>
        <Text style={styles.headerBack}>‹</Text>
        <Text style={styles.headerTitle}>Rynek nagrod</Text>
        <View style={styles.headerBack} />
      </View>

      <View style={styles.balanceRow}>
        <View style={styles.balanceIconWrap}>
          <CoinIcon size={18} color={colors.warmGold} />
        </View>
        <Text style={styles.balanceLabel}>Saldo: {balance} EC</Text>
      </View>

      <View style={styles.filters}>
        {filters.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {filterLabels[f]}
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
            style={styles.card}
          >
            <View style={styles.cardImage}>
              <Text style={styles.cardEmoji}>{reward.icon}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {reward.title}
              </Text>
              <Text style={styles.cardMerchant}>{reward.merchant}</Text>
              <View style={styles.cardPrice}>
                <CoinIcon size={12} color={colors.warmGold} />
                <Text style={styles.cardPriceText}>{reward.cost} EC</Text>
              </View>
            </View>
          </Link>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headerBack: {
    width: 24,
    fontSize: 22,
    color: colors.slate900,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
    flex: 1,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  balanceIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.slate600,
    fontWeight: "600",
  },
  filters: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#F8FAFC",
  },
  filterChipActive: {
    backgroundColor: colors.mossGreen,
    borderColor: colors.mossGreen,
  },
  filterText: {
    fontSize: 13,
    color: colors.slate500,
    fontWeight: "600",
  },
  filterTextActive: {
    color: colors.white,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  cardImage: {
    height: 100,
    backgroundColor: "#DDE6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardInfo: {
    padding: 12,
    gap: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.slate900,
    lineHeight: 18,
  },
  cardMerchant: {
    fontSize: 12,
    color: colors.slate500,
  },
  cardPrice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  cardPriceText: {
    fontSize: 13,
    color: colors.warmGold,
    fontWeight: "700",
  },
});
