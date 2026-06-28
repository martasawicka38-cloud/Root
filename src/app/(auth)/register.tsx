import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../features/common/Screen";
import { RoleSelector } from "../../features/auth/RoleSelector";
import { CompanySearch } from "../../features/auth/CompanySearch";
import { fetchPublicCompanies, loginUser, registerUser } from "../../lib/api/endpoints";
import { colors, radius, spacing } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

type RoleOption = "user" | "employer" | "company";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleOption>("user");
  const [companyToken, setCompanyToken] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string; slug: string } | null>(null);

  const ROLE_CONFIG: Record<RoleOption, { label: string; desc: string; color: string; bgColor: string }> = {
    user: { label: t("auth.user"), desc: t("auth.userDesc"), color: colors.deepForest, bgColor: colors.successBg },
    employer: { label: t("auth.employer"), desc: t("auth.employerDesc"), color: colors.info, bgColor: colors.infoBg },
    company: { label: t("auth.company"), desc: t("auth.companyDesc"), color: colors.roleCompany, bgColor: colors.roleCompanyBg },
  };

  const { data: companies, isPending: companiesPending } = useQuery({ queryKey: ["public-companies"], queryFn: fetchPublicCompanies, enabled: role === "employer" });

  const canSubmit = email && password && ((role === "user" && name) || (role === "employer" && name && selectedCompany && companyToken) || (role === "company" && companyToken && companyName && companySlug));

  const handleRegister = async () => {
    if (!canSubmit) return;
    setLoading(true); setError(null);
    try {
      const payload: Record<string, unknown> = { email, password, role };
      if (role === "company") { payload.name = companyName; payload.companyToken = companyToken; payload.companyName = companyName; payload.companySlug = companySlug; }
      else { payload.name = name; if (role === "employer") payload.companyToken = companyToken; }
      await registerUser(payload as Parameters<typeof registerUser>[0]);
      const res = await loginUser({ email, password });
      login(res.accessToken, res.user.role, res.user.name, res.user.email);
      router.replace("/(auth)/onboarding");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "response" in e ? (e as { response: { data: { message: string } } }).response.data.message : t("auth.registerError");
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <Screen>
      <Text style={styles.title}>{t("auth.registerTitle")}</Text>
      <Text style={styles.label}>{t("auth.selectAccountType")}</Text>
      <RoleSelector role={role} roleConfig={ROLE_CONFIG} onSelect={(r) => { setRole(r); setSelectedCompany(null); }} />
      {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
      {role !== "company" && (<><Text style={styles.label}>{t("auth.fullName")}</Text><TextInput style={styles.input} placeholder={t("auth.fullNamePlaceholder")} value={name} onChangeText={setName} placeholderTextColor={colors.slate400} /></>)}
      <Text style={styles.label}>{t("auth.emailLabel")}</Text>
      <TextInput style={styles.input} placeholder={t("auth.emailPlaceholder")} value={email} onChangeText={setEmail} placeholderTextColor={colors.slate400} autoCapitalize="none" keyboardType="email-address" />
      <Text style={styles.label}>{t("auth.passwordLabel")}</Text>
      <TextInput style={styles.input} placeholder={t("auth.passwordPlaceholder")} secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor={colors.slate400} />
      {role === "employer" && (
        <>
          <Text style={styles.label}>{t("auth.selectCompany")}</Text>
          <CompanySearch companies={companies ?? []} isPending={companiesPending} selectedCompany={selectedCompany} onSelect={setSelectedCompany} onClear={() => setSelectedCompany(null)} />
          {selectedCompany && (
            <>
              <Text style={styles.label}>{t("auth.accessCode")}</Text>
              <TextInput style={styles.input} placeholder={t("auth.accessCodePlaceholder")} value={companyToken} onChangeText={setCompanyToken} placeholderTextColor={colors.slate400} autoCapitalize="characters" />
              <Text style={styles.hint}>{t("auth.accessCodeHint")} {selectedCompany.name}</Text>
            </>
          )}
        </>
      )}
      {role === "company" && (
        <>
          <Text style={styles.label}>{t("auth.companyAuthCode")}</Text>
          <TextInput style={styles.input} placeholder={t("auth.companyAuthCodePlaceholder")} value={companyToken} onChangeText={setCompanyToken} placeholderTextColor={colors.slate400} autoCapitalize="characters" />
          <Text style={styles.label}>{t("auth.companyName")}</Text>
          <TextInput style={styles.input} placeholder={t("auth.companyNamePlaceholder")} value={companyName} onChangeText={setCompanyName} placeholderTextColor={colors.slate400} />
          <Text style={styles.label}>{t("auth.companySlugLabel")}</Text>
          <TextInput style={styles.input} placeholder={t("auth.companySlugPlaceholder")} value={companySlug} onChangeText={setCompanySlug} placeholderTextColor={colors.slate400} autoCapitalize="none" />
          <Text style={styles.hint}>{t("auth.companySlugHint")}</Text>
        </>
      )}
      <Pressable style={[styles.button, role === "employer" && { backgroundColor: colors.info }, role === "company" && { backgroundColor: colors.roleCompany }, (!canSubmit || loading) && styles.buttonDisabled]} disabled={!canSubmit || loading} onPress={handleRegister}>
        {loading ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={styles.buttonText}>{t("auth.registerButton")}</Text>}
      </Pressable>
      <Link href="/(auth)/login" style={styles.link}>{t("auth.hasAccountLink")}</Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", color: colors.deepForest, marginTop: spacing.xs, marginBottom: 6 },
  label: { fontSize: 13, fontWeight: "600", color: colors.slate500, marginBottom: 6, marginTop: spacing.x3s },
  input: { borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 14, fontSize: 15, color: colors.slate900, backgroundColor: colors.inputBg },
  errorBox: { backgroundColor: colors.errorBg, borderWidth: 1, borderColor: colors.errorBorder, borderRadius: radius.sm, padding: spacing.x2s, marginBottom: spacing.x3s },
  errorText: { fontSize: 14, color: colors.error, fontWeight: "600", textAlign: "center" },
  hint: { fontSize: 12, color: colors.slate400, marginTop: spacing.x4s },
  button: { marginTop: spacing.xs, backgroundColor: colors.mossGreen, borderRadius: radius.md, paddingVertical: 14, alignItems: "center" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  link: { marginTop: spacing.x2s, textAlign: "center", color: colors.mossGreen, fontWeight: "600", fontSize: 14 },
});
