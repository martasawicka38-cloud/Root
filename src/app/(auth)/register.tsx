import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppLogo } from "../../features/common/AppLogo";
import { Screen } from "../../features/common/Screen";
import { colors } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function RegisterScreen() {
  const setPartner = useAppStore((s) => s.setPartner);
  const login = useAppStore((s) => s.login);

  return (
    <Screen>
      <AppLogo subtitle="Zakorzen dobre nawyki" />
      <Text style={styles.title}>Rejestracja</Text>
      <TextInput
        style={styles.input}
        placeholder="Adres e-mail"
        defaultValue="jan@intel.com"
      />
      <TextInput style={styles.input} placeholder="Haslo" secureTextEntry />
      <View style={styles.row}>
        <Pressable
          style={styles.partnerBtn}
          onPress={() => setPartner("intel")}
        >
          <Text>Intel</Text>
        </Pressable>
        <Pressable style={styles.partnerBtn} onPress={() => setPartner("ergo")}>
          <Text>ERGO</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.button}
        onPress={() => {
          login();
          router.replace("/(auth)/onboarding");
        }}
      >
        <Text style={styles.buttonText}>Zaloz konto</Text>
      </Pressable>
      <Link href="/(auth)/login" style={styles.link}>
        Powrot do logowania
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.deepForest,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 12,
    padding: 12,
  },
  row: { flexDirection: "row", gap: 8 },
  partnerBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  button: { backgroundColor: colors.mossGreen, padding: 14, borderRadius: 12 },
  buttonText: { color: colors.white, textAlign: "center", fontWeight: "700" },
  link: {
    marginTop: 8,
    textAlign: "center",
    color: colors.mossGreen,
    fontWeight: "600",
  },
});
