import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import {
  addDeclaration,
  fetchDeclarations,
  fetchMe,
} from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";

const declarations = [
  { id: "d1", name: "Dojazd rowerem do pracy", points: 5 },
  { id: "d2", name: "Segregacja odpadow", points: 3 },
  { id: "d3", name: "Oszczedzanie energii", points: 3 },
  { id: "d4", name: "Pieszo zamiast auta", points: 5 },
];

export default function DeclarationsScreen() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  useQuery({ queryKey: ["declarations"], queryFn: fetchDeclarations });
  const add = useMutation({
    mutationFn: addDeclaration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["declarations"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const used = me?.declarationsToday ?? 0;
  const limit = 3;
  const canDeclare = used < limit;

  return (
    <Screen>
      <Text style={styles.title}>Eko-deklaracje</Text>
      <Text style={styles.meta}>
        {used}/{limit} dzisiaj
      </Text>
      {!canDeclare && (
        <Text style={styles.warning}>Dzisiejszy limit wykorzystany.</Text>
      )}
      {declarations.map((d) => (
        <Pressable
          key={d.id}
          style={styles.item}
          disabled={!canDeclare}
          onPress={() => add.mutate({ name: d.name, points: d.points })}
        >
          <View>
            <Text style={styles.name}>{d.name}</Text>
            <Text style={styles.points}>+{d.points} EC</Text>
          </View>
          <Text style={styles.action}>Potwierdz</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  meta: { color: colors.slate600 },
  warning: { color: colors.error, fontWeight: "600" },
  item: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { color: colors.slate900, fontWeight: "600" },
  points: { color: colors.warmGold, fontWeight: "700", marginTop: 4 },
  action: { color: colors.mossGreen, fontWeight: "700" },
});
