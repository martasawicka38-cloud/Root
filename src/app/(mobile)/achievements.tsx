import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchAchievements } from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";

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
            style={[styles.item, isUnlocked && styles.itemOn]}
          >
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.status}>
              {isUnlocked ? "Odblokowane" : "Zablokowane"}
            </Text>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  meta: { color: colors.slate600 },
  item: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
  itemOn: { borderColor: colors.sage, backgroundColor: colors.mist },
  name: { color: colors.slate900, fontWeight: "700" },
  status: { marginTop: 4, color: colors.slate600 },
});
