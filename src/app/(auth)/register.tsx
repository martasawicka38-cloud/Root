import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useMemo } from "react";
import { Link, router } from "expo-router";
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

const ROLE_CONFIG: Record<
  RoleOption,
  { label: string; desc: string; color: string; bgColor: string }
> = {
  user: {
    label: "Uzytkownik",
    desc: "Zakladam konto osobiste",
    color: colors.deepForest,
    bgColor: colors.successBg,
  },
  employer: {
    label: "Pracownik",
    desc: "Dolaczam do firmy z kodem",
    color: colors.info,
    bgColor: colors.infoBg,
  },
  company: {
    label: "Firma",
    desc: "Rejestruje konto firmowe",
    color: colors.roleCompany,
    bgColor: colors.roleCompanyBg,
  },
};

export default function RegisterScreen() {
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

  const canSubmit = email && password && name && (
    role === "user" ||
    (role === "employer" && selectedCompany && companyToken) ||
    (role === "company" && companyToken && companyName && companySlug)
  );

  const handleRegister = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        email, password, name, role,
      };
      if (role === "employer") {
        payload.companyToken = companyToken;
      }
      if (role === "company") {
        payload.companyToken = companyToken;
        payload.companyName = companyName;
        payload.companySlug = companySlug;
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
          : "Blad rejestracji";
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
      <View style={{ height: 24 }} />
      <Text style={styles.tagline}>Zakorzen dobre nawyki</Text>

      <Text style={styles.title}>Zaloz konto</Text>

      <Text style={styles.label}>Wybierz typ konta</Text>
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

      <Text style={styles.label}>Imie i nazwisko</Text>
      <TextInput
        style={styles.input}
        placeholder="Jan Kowalski"
        value={name}
        onChangeText={setName}
        placeholderTextColor={colors.slate400}
      />

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
        placeholder="Haslo (min. 6 znakow)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={colors.slate400}
      />

      {role === "employer" && (
        <>
          <Text style={styles.label}>Wybierz firme</Text>

          {selectedCompany ? (
            <View style={styles.selectedCompanyRow}>
              <View style={styles.selectedCompanyInfo}>
                <Text style={styles.selectedCompanyName}>{selectedCompany.name}</Text>
              </View>
              <Pressable onPress={clearCompanySelection} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Zmień</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.dropdownWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Wpisz nazwe firmy..."
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
                        <Text style={styles.emptyText}>Brak wyników</Text>
                      ) : (
                        <Text style={styles.emptyText}>Wpisz nazwe firmy...</Text>
                      )}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          )}

          {selectedCompany && (
            <>
              <Text style={styles.label}>Kod dostepu do firmy</Text>
              <TextInput
                style={styles.input}
                placeholder="Wpisz kod otrzymany od pracodawcy"
                value={companyToken}
                onChangeText={setCompanyToken}
                placeholderTextColor={colors.slate400}
                autoCapitalize="characters"
              />
              <Text style={styles.hint}>
                Kod otrzymasz od administratora firmy {selectedCompany.name}
              </Text>
            </>
          )}
        </>
      )}

      {role === "company" && (
        <>
          <Text style={styles.label}>Kod autoryzacyjny (od superadmina)</Text>
          <TextInput
            style={styles.input}
            placeholder="Kod rejestracyjny dla firm"
            value={companyToken}
            onChangeText={setCompanyToken}
            placeholderTextColor={colors.slate400}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Nazwa firmy</Text>
          <TextInput
            style={styles.input}
            placeholder="Np. Moja Firma Sp. z o.o."
            value={companyName}
            onChangeText={setCompanyName}
            placeholderTextColor={colors.slate400}
          />

          <Text style={styles.label}>Identyfikator firmy (slug)</Text>
          <TextInput
            style={styles.input}
            placeholder="moja-firma (bez spacji)"
            value={companySlug}
            onChangeText={setCompanySlug}
            placeholderTextColor={colors.slate400}
            autoCapitalize="none"
          />
          <Text style={styles.hint}>
            Kod rejestracyjny otrzymasz od administratora platformy
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
          <Text style={styles.buttonText}>Zaloz konto</Text>
        )}
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
