import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppLogo } from "../../features/common/AppLogo";
import { Screen } from "../../features/common/Screen";
import { colors, radius } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function RegisterScreen() {
  const setPartner = useAppStore((s) => s.setPartner);
  const login = useAppStore((s) => s.login);

  return (
    <Screen>
      <View style={styles.logoSection}>
        <AppLogo compact />
        <Text style={styles.tagline}>Zakorzen dobre nawyki</Text>
      </View>

      <Text style={styles.title}>Zaloz konto</Text>

      <Text style={styles.label}>Adres e-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="jan@intel.com"
        defaultValue="jan@intel.com"
        placeholderTextColor={colors.slate400}
      />

      <Text style={styles.label}>Haslo</Text>
      <TextInput
        style={styles.input}
        placeholder="Haslo"
        secureTextEntry
        placeholderTextColor={colors.slate400}
      />

      <Text style={styles.label}>Wybierz partnera</Text>
      <View style={styles.partnerRow}>
        <Pressable
          style={styles.partnerBtn}
          onPress={() => setPartner("intel")}
        >
          <Text style={styles.partnerText}>Intel Poland</Text>
        </Pressable>
        <Pressable
          style={styles.partnerBtn}
          onPress={() => setPartner("ergo")}
        >
          <Text style={styles.partnerText}>ERGO Hestia</Text>
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
        Masz juz konto? Zaloguj sie
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoSection: {
    marginTop: 12,
    gap: 4,
  },
  tagline: {
    fontSize: 14,
    color: colors.slate500,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
    marginTop: 16,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate500,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 15,
    color: colors.slate900,
    backgroundColor: "#F8FAFC",
  },
  partnerRow: {
    flexDirection: "row",
    gap: 8,
  },
  partnerBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  partnerText: {
    fontSize: 14,
    color: colors.slate700,
    fontWeight: "600",
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    marginTop: 12,
    textAlign: "center",
    color: colors.mossGreen,
    fontWeight: "600",
    fontSize: 14,
  },
});
