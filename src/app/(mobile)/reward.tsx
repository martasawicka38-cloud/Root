import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CoinIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import {
  fetchMarket,
  fetchWallet,
  redeemReward,
} from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";

export default function RewardScreen() {
  const { rewardId } = useLocalSearchParams<{ rewardId?: string }>();
  const queryClient = useQueryClient();
  const { data: rewards = [] } = useQuery({
    queryKey: ["market"],
    queryFn: fetchMarket,
  });
  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWallet,
  });

  const redeem = useMutation({
    mutationFn: (id: string) => redeemReward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const reward = rewards.find((item) => item.id === rewardId);
  const code = redeem.data?.code;
  const balance = wallet?.balance ?? 0;

  if (!reward) {
    return (
      <Screen>
        <Text style={styles.emptyText}>Nie znaleziono nagrody.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Szczegoly nagrody</Text>

      <View style={styles.card}>
        <View style={styles.imageWrap}>
          <Text style={styles.imageEmoji}>{reward.icon}</Text>
        </View>

        <Text style={styles.cardTitle}>{reward.title}</Text>
        <Text style={styles.cardMerchant}>{reward.merchant}</Text>
        <Text style={styles.cardDesc}>{reward.description}</Text>

        <View style={styles.priceRow}>
          <View style={styles.priceIconWrap}>
            <CoinIcon size={20} color={colors.warmGold} />
          </View>
          <Text style={styles.priceText}>{reward.cost} EC</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Twoje saldo</Text>
          <Text style={styles.balanceValue}>{balance} EC</Text>
        </View>

        {!code ? (
          <>
            {balance < reward.cost && (
              <View style={styles.missingBadge}>
                <Text style={styles.missingText}>
                  Brakuje {reward.cost - balance} EC
                </Text>
              </View>
            )}
            <Pressable
              style={[
                styles.button,
                balance < reward.cost && styles.buttonDisabled,
              ]}
              disabled={balance < reward.cost}
              onPress={() => redeem.mutate(reward.id)}
            >
              <CoinIcon size={18} color={colors.white} />
              <Text style={styles.buttonText}>
                Wymien za {reward.cost} EC
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.codeSection}>
            <Text style={styles.codeLabel}>Kod odbioru</Text>
            <Text style={styles.codeValue}>{code}</Text>
            <Text style={styles.codeHint}>
              Pokaz ten kod przy odbiorze nagrody
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
    marginBottom: 6,
  },
  emptyText: {
    color: colors.slate500,
    fontSize: 15,
    textAlign: "center",
    marginTop: 24,
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.lg,
    padding: 14,
    gap: 10,
  },
  imageWrap: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: "#DDE6F6",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  imageEmoji: {
    fontSize: 42,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
  },
  cardMerchant: {
    fontSize: 14,
    color: colors.slate500,
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 14,
    color: colors.slate600,
    textAlign: "center",
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  priceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.warmGold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.slate200,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.slate500,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.deepForest,
  },
  missingBadge: {
    backgroundColor: "#FEE2E2",
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "center",
  },
  missingText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    paddingVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: colors.slate300,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  codeSection: {
    backgroundColor: colors.mist,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.sage,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mossGreen,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  codeValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.deepForest,
    letterSpacing: 1,
  },
  codeHint: {
    fontSize: 12,
    color: colors.slate500,
    textAlign: "center",
  },
});
