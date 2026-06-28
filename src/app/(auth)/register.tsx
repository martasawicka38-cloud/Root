import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useMemo } from "react";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


import { Screen } from "../../features/common/Screen";
import { fetchPublicCompanies, loginUser, registerUser } from "../../lib/api/endpoints";
import { colors, radius, shadows } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

type RoleOption = "user" | "employer" | "company";

const useRoleConfig = (t: (key: string) => string): Record<
  RoleOption,
  { label: string; desc: string; color: string; bgColor: string }
> => ({
  user: {
    label: t("auth.user"),
    desc: t("auth.userDesc"),
    color: colors.deepForest,
    bgColor: colors.successBg,
  },
  employer: {
    label: t("auth.employer"),
    desc: t("auth.employerDesc"),
    color: colors.info,
    bgColor: colors.infoBg,
  },
  company: {
    label: t("auth.company"),
    desc: t("auth.companyDesc"),
    color: colors.roleCompany,
    bgColor: colors.roleCompanyBg,
  },
});

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const ROLE_CONFIG = useRoleConfig(t);

  const { data: companies, isPending: companiesPending } = useQuery({
    queryKey: ["public-companies"],
    queryFn: fetchPublicCompanies,
    enabled: role === "employer",
  });

  const filteredCompanies = useMemo(() => {
    if (!companies || !searchQuery) return companies ?? [];
    const q = searchQuery.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    );
  }, [companies, searchQuery]);

  const canSubmit = email && password && (
    (role === "user" && name) ||
    (role === "employer" && name && selectedCompany && companyToken) ||
    (role === "company" && companyToken && companyName && companySlug)
  );

  const handleRegister = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        email, password, role,
      };
      if (role === "company") {
        payload.name = companyName;
        payload.companyToken = companyToken;
        payload.companyName = companyName;
        payload.companySlug = companySlug;
      } else {
        payload.name = name;
        if (role === "employer") {
          payload.companyToken = companyToken;
        }
      }
      await registerUser(payload as Parameters<typeof registerUser>[0]);
      const res = await loginUser({ email, password });
      login(res.accessToken, res.user.role, res.user.name, res.user.email);
      router.replace("/(auth)/onboarding");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response: { data: { message: string } } }).response.data
              .message
          : t("auth.registerError");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setIsFocused(false), 180);
  };

  const handleSelectCompany = (item: { id: string; name: string; slug: string }) => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setSelectedCompany(item);
    setSearchQuery("");
    setIsFocused(false);
  };

  const clearCompanySelection = () => {
    setSelectedCompany(null);
    setSearchQuery("");
  };

  const showDropdown = isFocused && !selectedCompany;

  return (
    <Screen>
      <Text style={styles.title}>{t("auth.registerTitle")}</Text>

      <Text style={styles.label}>{t("auth.selectAccountType")}</Text>
      <View style={styles.roleRow}>
        {(Object.entries(ROLE_CONFIG) as [RoleOption, typeof ROLE_CONFIG["user"]][]).map(
          ([key, cfg]) => (
            <Pressable
              key={key}
              style={[
                styles.roleBtn,
                role === key && {
                  backgroundColor: cfg.bgColor,
                  borderColor: cfg.color,
                },
              ]}
              onPress={() => {
                setRole(key);
                clearCompanySelection();
              }}
            >
              <View
                style={[
                  styles.roleDot,
                  { backgroundColor: role === key ? cfg.color : colors.slate300 },
                ]}
              />
              <Text
                style={[
                  styles.roleLabel,
                  { color: role === key ? cfg.color : colors.slate600 },
                ]}
              >
                {cfg.label}
              </Text>
              <Text style={styles.roleDesc}>{cfg.desc}</Text>
            </Pressable>
          ),
        )}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {role !== "company" && (
        <>
          <Text style={styles.label}>{t("auth.fullName")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.fullNamePlaceholder")}
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.slate400}
          />
        </>
      )}

      <Text style={styles.label}>{t("auth.emailLabel")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("auth.emailPlaceholder")}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colors.slate400}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>{t("auth.passwordLabel")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("auth.passwordPlaceholder")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={colors.slate400}
      />

      {role === "employer" && (
        <>
          <Text style={styles.label}>{t("auth.selectCompany")}</Text>

          {selectedCompany ? (
            <View style={styles.selectedCompanyRow}>
              <View style={styles.selectedCompanyInfo}>
                <Text style={styles.selectedCompanyName}>{selectedCompany.name}</Text>
              </View>
              <Pressable onPress={clearCompanySelection} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>{t("auth.change")}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.dropdownWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t("auth.typeCompanyName")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholderTextColor={colors.slate400}
                autoCapitalize="none"
              />
              {showDropdown && (
                <View style={styles.dropdown}>
                  {companiesPending ? (
                    <ActivityIndicator color={colors.mossGreen} style={styles.dropdownLoader} />
                  ) : (
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      style={styles.dropdownScroll}
                      nestedScrollEnabled
                    >
                      {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((item) => (
                          <Pressable
                            key={item.id}
                            style={styles.companyOption}
                            onPress={() => handleSelectCompany(item)}
                          >
                            <Text style={styles.companyOptionName}>{item.name}</Text>
                            <Text style={styles.companyOptionSlug}>{item.slug}</Text>
                          </Pressable>
                        ))
                      ) : searchQuery.length > 0 ? (
                        <Text style={styles.emptyText}>{t("auth.noResults")}</Text>
                      ) : (
                        <Text style={styles.emptyText}>{t("auth.typeCompanyName")}</Text>
                      )}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          )}

          {selectedCompany && (
            <>
              <Text style={styles.label}>{t("auth.accessCode")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("auth.accessCodePlaceholder")}
                value={companyToken}
                onChangeText={setCompanyToken}
                placeholderTextColor={colors.slate400}
                autoCapitalize="characters"
              />
              <Text style={styles.hint}>
                {t("auth.accessCodeHint")} {selectedCompany.name}
              </Text>
            </>
          )}
        </>
      )}

      {role === "company" && (
        <>
          <Text style={styles.label}>{t("auth.companyAuthCode")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.companyAuthCodePlaceholder")}
            value={companyToken}
            onChangeText={setCompanyToken}
            placeholderTextColor={colors.slate400}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>{t("auth.companyName")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.companyNamePlaceholder")}
            value={companyName}
            onChangeText={setCompanyName}
            placeholderTextColor={colors.slate400}
          />

          <Text style={styles.label}>{t("auth.companySlugLabel")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("auth.companySlugPlaceholder")}
            value={companySlug}
            onChangeText={setCompanySlug}
            placeholderTextColor={colors.slate400}
            autoCapitalize="none"
          />
          <Text style={styles.hint}>
            {t("auth.companySlugHint")}
          </Text>
        </>
      )}

      <Pressable
        style={[
          styles.button,
          role === "employer" && { backgroundColor: colors.info },
          role === "company" && { backgroundColor: colors.roleCompany },
          (!canSubmit || loading) && styles.buttonDisabled,
        ]}
        disabled={!canSubmit || loading}
        onPress={handleRegister}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text style={styles.buttonText}>{t("auth.registerButton")}</Text>
        )}
      </Pressable>

      <Link href="/(auth)/login" style={styles.link}>
        {t("auth.hasAccountLink")}
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
    backgroundColor: colors.inputBg,
  },

  roleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 12,
    gap: 4,
    backgroundColor: colors.inputBg,
  },
  roleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  roleDesc: {
    fontSize: 11,
    color: colors.slate500,
    lineHeight: 14,
  },

  errorBox: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: radius.sm,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: "600",
    textAlign: "center",
  },

  selectedCompanyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.info,
    borderRadius: radius.md,
    padding: 14,
  },
  selectedCompanyInfo: {
    flex: 1,
  },
  selectedCompanyName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.info,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearBtnText: {
    fontSize: 13,
    color: colors.info,
    fontWeight: "600",
  },

  dropdownWrapper: {
    position: "relative",
    zIndex: 100,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    ...shadows.lg,
  },
  dropdownLoader: {
    paddingVertical: 16,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  companyOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  companyOptionName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.slate900,
  },
  companyOptionSlug: {
    fontSize: 12,
    color: colors.slate400,
  },
  emptyText: {
    fontSize: 14,
    color: colors.slate500,
    textAlign: "center",
    paddingVertical: 16,
  },

  hint: {
    fontSize: 12,
    color: colors.slate400,
    marginTop: 4,
  },

  button: {
    marginTop: 16,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
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
