import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchMe, patchProfile } from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";

export default function EditProfileScreen() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const [name, setName] = useState(me?.name ?? "Jan Kowalski");
  const [goal, setGoal] = useState(String(me?.stepGoal ?? 8000));
  const save = useMutation({
    mutationFn: patchProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });

  return (
    <Screen>
      <Text style={styles.title}>Edytuj profil</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Imie i nazwisko"
      />
      <TextInput
        value={goal}
        onChangeText={setGoal}
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Cel krokow"
      />
      <Pressable
        style={styles.button}
        onPress={() =>
          save.mutate({
            name: name.trim() || "Jan Kowalski",
            stepGoal: Number(goal) || 8000,
            partner: me?.partner ?? "intel",
          })
        }
      >
        <Text style={styles.buttonText}>Zapisz zmiany</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  input: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
  button: { backgroundColor: colors.mossGreen, borderRadius: 10, padding: 12 },
  buttonText: { color: colors.white, textAlign: "center", fontWeight: "700" },
});
