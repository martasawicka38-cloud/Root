import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { AppLogo } from "../../features/common/AppLogo";
import { Screen } from "../../features/common/Screen";
import { loginUser } from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 12.2c0-.8 0-1.5-.2-2.2H12v4.4h5.7a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.2-4.6 3.2-8.2Z" fill="#4285F4" />
      <Path d="M12 22c2.9 0 5.4-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1-3.7 1-2.8 0-5.2-1.9-6-4.5H2.3v2.8A10.7 10.7 0 0 0 12 22Z" fill="#34A853" />
      <Path d="M6 12.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3V5.4H2.3A10.7 10.7 0 0 0 1 10.5c0 1.8.5 3.5 1.3 5l3-2.7Z" fill="#FBBC05" />
      <Path d="M12 3.8c1.6 0 3 .6 4.1 1.7l3-3A10.6 10.6 0 0 0 12 1 10.7 10.7 0 0 0 2.3 5.4L6 8.2C6.8 5.7 9.2 3.8 12 3.8Z" fill="#EA4335" />
    </Svg>
  );
}

function AppleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17.5 12.3c0-1.6.8-3 2-3.9a5 5 0 0 0-3.5-1.7c-1.5 0-3 .9-3.8.9-.8 0-2-.9-3.3-.9A5.3 5.3 0 0 0 3.5 8.2C2 10.5 2.9 14 4.3 16c.7 1 1.5 2.2 2.5 2.2s1.5-.7 2.8-.7c1.3 0 1.7.7 2.8.7 1 0 1.7-1 2.4-2 .7-1 1-2 1-2.1-.1 0-2.3-.9-2.3-3.6Z" fill="#333" />
      <Path d="M14.5 5.5c.6-.8 1-1.8 1-2.8 0-.1 0-.3-.1-.4-1 .1-2 .6-2.7 1.4-.5.7-1 1.7-1 2.7 0 .1 0 .3.1.4.1 0 .3.1.4.1.9 0 1.8-.5 2.3-1.4Z" fill="#333" />
    </Svg>
  );
}

export default function LoginScreen() {
  const queryClient = useQueryClient();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      queryClient.clear();
      login(res.accessToken, res.user.role, res.user.name, res.user.email);
      if (res.user.role === "superadmin") {
        router.replace("/admin");
      } else if (res.user.role === "company") {
        router.replace(`/company/${res.user.partner}`);
      } else {
        router.replace("/(auth)/onboarding");
      }
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response: { data: { message: string } } }).response.data
              .message
          : "Blad logowania";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.logoSection}>
        <AppLogo compact />
        <Text style={styles.tagline}>Zakorzen dobre nawyki</Text>
      </View>

      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Zaloguj</Text>
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.tabText}>Rejestracja</Text>
        </Pressable>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.label}>Adres e-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="jan@intel.com"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colors.slate400}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Haslo</Text>
      <TextInput
        style={styles.input}
        placeholder="Haslo"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={colors.slate400}
      />

      <Text style={styles.forgot}>Nie pamietam hasla</Text>

      <Pressable
        style={[styles.loginButton, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text style={styles.loginButtonText}>Zaloguj sie</Text>
        )}
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>lub kontynuuj przez</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable style={styles.socialButton}>
        <GoogleIcon size={20} />
        <Text style={styles.socialText}>Google</Text>
      </Pressable>
      <Pressable style={styles.socialButton}>
        <AppleIcon size={20} />
        <Text style={styles.socialText}>Apple</Text>
      </Pressable>
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
  tabRow: {
    flexDirection: "row",
    backgroundColor: colors.slate100,
    borderRadius: radius.md,
    padding: 3,
    marginTop: 16,
    marginBottom: 16,
    gap: 3,
  },
  tab: {
    flex: 1,
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    color: colors.slate500,
    fontWeight: "600",
    fontSize: 14,
  },
  tabTextActive: {
    color: colors.slate900,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: radius.sm,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#991B1B",
    fontWeight: "600",
    textAlign: "center",
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
  forgot: {
    alignSelf: "flex-end",
    marginTop: 8,
    color: colors.mossGreen,
    fontSize: 13,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: colors.mossGreen,
    paddingVertical: 14,
    borderRadius: radius.md,
    marginTop: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.slate200,
  },
  dividerText: {
    fontSize: 12,
    color: colors.slate400,
    fontWeight: "600",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginBottom: 6,
  },
  socialText: {
    fontSize: 15,
    color: colors.slate700,
    fontWeight: "600",
  },
});
