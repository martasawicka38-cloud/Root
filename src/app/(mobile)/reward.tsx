import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import {
  fetchMarket,
  fetchWallet,
  redeemReward,
} from "../../lib/api/endpoints";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../../styles/tokens";

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
        <Text style={styles.empty}>Brak wybranej nagrody.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.pageTitle}>Szczegoly nagrody</Text>

      <View style={styles.card}>
        <Text style={styles.title}>
          {reward.icon} {reward.title}
        </Text>
        <Text style={styles.meta}>{reward.merchant}</Text>
        <Text style={styles.cost}>{reward.cost} EC</Text>
        <Text style={styles.desc}>{reward.description}</Text>
        <Text style={styles.balance}>Saldo: {balance} EC</Text>

        {!code ? (
          <Pressable
            style={styles.button}
            onPress={() => redeem.mutate(reward.id)}
          >
            <Text style={styles.buttonText}>Wymien za {reward.cost} EC</Text>
          </Pressable>
        ) : (
          <View style={styles.codeWrap}>
            <Text style={styles.ok}>Nagroda wymieniona</Text>
            <Text style={styles.code}>{code}</Text>
            <Text style={styles.qrHint}>Pokaz ten kod przy odbiorze</Text>
          </View>
        )}
      </View>

      {!code && balance < reward.cost && (
        <View style={styles.missingWrap}>
          <Text style={styles.missingText}>
            Brakuje {reward.cost - balance} EC
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    ...typography.h2,
    color: colors.deepForest,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate200,
    padding: spacing.xs,
    ...shadows.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.deepForest,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  cost: {
    color: colors.warmGold,
    fontWeight: "800",
    fontSize: 20,
    marginTop: spacing.x3s,
  },
  desc: {
    ...typography.body,
    color: colors.slate600,
  },
  balance: {
    ...typography.h3,
    color: colors.deepForest,
    marginTop: spacing.x3s,
  },
  button: {
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    padding: 14,
    marginTop: spacing.x2s,
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "700",
  },
  codeWrap: {
    backgroundColor: colors.mist,
    borderRadius: radius.md,
    padding: spacing.x2s,
    gap: spacing.x3s,
    marginTop: spacing.x2s,
    borderWidth: 1,
    borderColor: colors.sage,
  },
  ok: {
    color: colors.success,
    fontWeight: "700",
  },
  code: {
    color: colors.deepForest,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  qrHint: {
    color: colors.slate600,
    ...typography.bodySmall,
  },
  missingWrap: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.x2s,
    paddingVertical: spacing.x3s,
    backgroundColor: colors.slate100,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.slate200,
  },
  missingText: {
    color: colors.slate600,
    fontWeight: "600",
  },
  empty: {
    color: colors.slate600,
    fontSize: 16,
  },
});
