import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  BikeIcon,
  LightbulbIcon,
  RecycleIcon,
  RunningIcon,
} from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import {
  addDeclaration,
  fetchDeclarations,
  fetchMe,
} from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";

const declarations = [
  { id: "d1", name: "Dojazd rowerem do pracy", points: 5, icon: BikeIcon },
  { id: "d2", name: "Segregacja odpadow", points: 3, icon: RecycleIcon },
  { id: "d3", name: "Oszczedzanie energii", points: 3, icon: LightbulbIcon },
  { id: "d4", name: "Pieszo zamiast auta", points: 5, icon: RunningIcon },
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

      <View style={styles.counterRow}>
        <View
          style={[
            styles.counterBadge,
            !canDeclare && styles.counterBadgeFull,
          ]}
        >
          <Text
            style={[styles.counterText, !canDeclare && styles.counterTextFull]}
          >
            {used}/{limit} dzisiaj
          </Text>
        </View>
        {!canDeclare && (
          <Text style={styles.warning}>Dzisiejszy limit wykorzystany.</Text>
        )}
      </View>

      {declarations.map((d) => {
        const Icon = d.icon;
        return (
          <Pressable
            key={d.id}
            style={styles.card}
            disabled={!canDeclare}
            onPress={() => add.mutate({ name: d.name, points: d.points })}
          >
            <View style={styles.cardIconWrap}>
              <Icon size={24} color={colors.mossGreen} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{d.name}</Text>
              <Text style={styles.cardPoints}>+{d.points} EC</Text>
            </View>
            <Text
              style={[
                styles.cardAction,
                !canDeclare && styles.cardActionDisabled,
              ]}
            >
              Potwierdz
            </Text>
          </Pressable>
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
    marginBottom: 4,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  counterBadge: {
    backgroundColor: colors.mist,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  counterBadgeFull: {
    backgroundColor: colors.errorBg,
  },
  counterText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.mossGreen,
  },
  counterTextFull: {
    color: colors.error,
  },
  warning: {
    fontSize: 13,
    color: colors.error,
    fontWeight: "500",
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
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 15,
    color: colors.slate900,
    fontWeight: "600",
  },
  cardPoints: {
    fontSize: 13,
    color: colors.mossGreen,
    fontWeight: "700",
  },
  cardAction: {
    fontSize: 14,
    color: colors.mossGreen,
    fontWeight: "700",
  },
  cardActionDisabled: {
    color: colors.slate300,
  },
});
