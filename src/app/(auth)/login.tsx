import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppLogo } from "../../features/common/AppLogo";
import { Screen } from "../../features/common/Screen";
import { colors } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function LoginScreen() {
  const login = useAppStore((s) => s.login);

  return (
    <Screen>
      <AppLogo subtitle="Zakorzen dobre nawyki" />
      <TextInput
        style={styles.input}
        placeholder="Adres e-mail"
        defaultValue="jan@hestia.pl"
      />
      <TextInput
        style={styles.input}
        placeholder="Haslo"
        secureTextEntry
        defaultValue="haslo123"
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          login();
          router.replace("/(auth)/onboarding");
        }}
      >
        <Text style={styles.buttonText}>Zaloguj sie</Text>
      </Pressable>
      <Link href="/(auth)/register" style={styles.link}>
        Rejestracja
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.mossGreen,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: { color: colors.white, textAlign: "center", fontWeight: "700" },
  link: {
    marginTop: 12,
    textAlign: "center",
    color: colors.mossGreen,
    fontWeight: "600",
  },
});
