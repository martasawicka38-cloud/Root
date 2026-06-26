import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import {
  addActivity,
  deleteActivity,
  fetchActivities,
} from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";

const types = [
  "walking",
  "running",
  "cycling",
  "swimming",
  "yoga",
  "gym",
] as const;

export default function ActivityScreen() {
  const queryClient = useQueryClient();
  const [type, setType] = useState<(typeof types)[number]>("walking");
  const [minutes, setMinutes] = useState("30");
  const { data: log = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });
  const createMutation = useMutation({
    mutationFn: addActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const estimate = useMemo(() => {
    const map = {
      walking: 120,
      running: 200,
      cycling: 150,
      swimming: 180,
      yoga: 50,
      gym: 100,
    } as const;
    const m = Number(minutes) || 0;
    const steps = m * map[type];
    return { steps, points: Math.min(40, Math.floor(steps / 200)) };
  }, [minutes, type]);

  return (
    <Screen>
      <Text style={styles.title}>Dodaj aktywnosc</Text>
      <View style={styles.rowWrap}>
        {types.map((t) => (
          <Pressable
            key={t}
            style={[styles.typeBtn, t === type && styles.typeBtnActive]}
            onPress={() => setType(t)}
          >
            <Text style={styles.typeText}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={minutes}
        onChangeText={setMinutes}
        keyboardType="number-pad"
        style={styles.input}
      />
      <Text style={styles.meta}>
        Szacowane kroki: {estimate.steps} | +{estimate.points} EC
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          const m = Number(minutes) || 0;
          if (m > 0) createMutation.mutate({ type, minutes: m });
        }}
      >
        <Text style={styles.buttonText}>Dodaj aktywnosc</Text>
      </Pressable>
      {log.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.itemText}>
            {item.type} • {item.minutes} min • +{item.points} EC
          </Text>
          <Pressable onPress={() => deleteMutation.mutate(item.id)}>
            <Text style={styles.del}>Usun</Text>
          </Pressable>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeBtn: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  typeBtnActive: {
    borderColor: colors.mossGreen,
    backgroundColor: colors.mist,
  },
  typeText: { color: colors.slate900, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
  meta: { color: colors.slate600 },
  button: { backgroundColor: colors.mossGreen, borderRadius: 10, padding: 12 },
  buttonText: { color: colors.white, fontWeight: "700", textAlign: "center" },
  item: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: { color: colors.slate900 },
  del: { color: colors.error, fontWeight: "700" },
});
