import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import { TrophyIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { fetchAchievements } from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";

const list = [
  { id: "first-step", title: "Pierwszy krok" },
  { id: "streak-3", title: "Passa 3 dni" },
  { id: "streak-7", title: "Passa 7 dni" },
  { id: "eco-10", title: "Eko-wojownik" },
];

export default function AchievementsScreen() {
  const { data: unlockedRows = [] } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });
  const unlocked = unlockedRows.map((item) => item.key);

  return (
    <Screen>
      <Text style={styles.title}>Osiagniecia</Text>
      <Text style={styles.meta}>
        Zdobyte: {unlocked.length}/{list.length}
      </Text>

      {list.map((item) => {
        const isUnlocked = unlocked.includes(item.id);
        return (
          <View
            key={item.id}
            style={[styles.card, isUnlocked && styles.cardUnlocked]}
          >
            <View
              style={[
                styles.iconWrap,
                isUnlocked
                  ? { backgroundColor: colors.warningBg }
                  : { backgroundColor: colors.slate100 },
              ]}
            >
              <TrophyIcon
                size={24}
                color={isUnlocked ? colors.mossGreen : colors.slate400}
              />
            </View>
            <View style={styles.cardContent}>
              <Text
                style={[styles.cardTitle, !isUnlocked && styles.cardTitleLocked]}
              >
                {item.title}
              </Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    isUnlocked
                      ? { backgroundColor: colors.mossGreen }
                      : { backgroundColor: colors.slate300 },
                  ]}
                />
                <Text style={styles.statusText}>
                  {isUnlocked ? "Odblokowane" : "Zablokowane"}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
  },
  meta: {
    fontSize: 14,
    color: colors.slate500,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: colors.inputBg,
  },
  cardUnlocked: {
    borderColor: colors.creamDark,
    backgroundColor: colors.creamLight,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.slate900,
  },
  cardTitleLocked: {
    color: colors.slate400,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    color: colors.slate500,
    fontWeight: "500",
  },
});
