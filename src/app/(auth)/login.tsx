import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppLogo } from "../../features/common/AppLogo";
import { Screen } from "../../features/common/Screen";
import { colors, radius, spacing, typography } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function LoginScreen() {
  const login = useAppStore((s) => s.login);

  return (
    <Screen>
      <View style={styles.logoRow}>
        <AppLogo compact />
      </View>
      <Text style={styles.tagline}>Zakorzen dobre nawyki</Text>

      <View style={styles.segmentedTabs}>
        <View style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Zaloguj</Text>
        </View>
        <Link href="/(auth)/register" style={styles.tab}>
          <Text style={styles.tabText}>Rejestracja</Text>
        </Link>
      </View>

      <Text style={styles.label}>Adres e-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="jan@intel.com"
        defaultValue="jan@intel.com"
      />

      <Text style={styles.label}>Haslo</Text>
      <TextInput
        style={styles.input}
        placeholder="Haslo"
        secureTextEntry
        defaultValue="haslo123"
      />

      <Text style={styles.forgot}>Nie pamietam hasla</Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          login();
          router.replace("/(auth)/onboarding");
        }}
      >
        <Text style={styles.buttonText}>Zaloguj sie</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>lub kontynuuj przez</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable style={styles.socialButton}>
        <Text style={styles.socialText}>G</Text>
      </Pressable>
      <Pressable style={styles.socialButton}>
        <Text style={styles.socialText}></Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoRow: {
    marginTop: spacing.x3s,
    alignItems: "flex-start",
  },
  tagline: {
    ...typography.body,
    color: colors.slate600,
    marginBottom: spacing.x2s,
  },
  segmentedTabs: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.xs,
  },
  tab: {
    flex: 1,
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
  },
  tabText: {
    color: colors.slate600,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.slate900,
  },
  label: {
    ...typography.h3,
    color: colors.slate900,
    fontWeight: "500",
    marginTop: spacing.x4s,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
  },
  forgot: {
    alignSelf: "flex-end",
    marginTop: spacing.x3s,
    color: colors.mossGreen,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.mossGreen,
    padding: 14,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  buttonText: { color: colors.white, textAlign: "center", fontWeight: "700" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x3s,
    marginTop: spacing.md,
    marginBottom: spacing.x2s,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.slate200,
  },
  dividerText: {
    color: colors.slate300,
    fontWeight: "600",
  },
  socialButton: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: radius.md,
    paddingVertical: spacing.x2s,
    alignItems: "center",
    marginBottom: spacing.x3s,
  },
  socialText: {
    ...typography.h3,
    color: colors.slate900,
  },
});
