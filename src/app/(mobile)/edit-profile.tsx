import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchMe, patchProfile } from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";

export default function EditProfileScreen() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const [name, setName] = useState(me?.name ?? "");
  const [goal, setGoal] = useState(String(me?.stepGoal ?? 8000));
  const isCompany = me?.role === "company";
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

      <Text style={styles.label}>{isCompany ? "Nazwa firmy" : "Imie i nazwisko"}</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder={isCompany ? "Nazwa firmy" : "Imie i nazwisko"}
      />

      <Text style={styles.label}>Dzienny cel krokow</Text>
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
            name: name.trim() || (isCompany ? "Firma" : "Jan Kowalski"),
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate500,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 15,
    color: colors.slate900,
    backgroundColor: colors.inputBg,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
