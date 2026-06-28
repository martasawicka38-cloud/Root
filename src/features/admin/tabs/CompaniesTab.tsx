import { Pressable, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Company, CompanyToken } from "../../../lib/types/api";
import { Badge } from "../components/Badge";
import { EmptyState } from "../../../components/shared/EmptyState";
import { ErrorCard } from "../../../components/shared/ErrorCard";
import { styles } from "../admin.styles";
import { colors, spacing } from "../../../styles/tokens";
import { LoadingState } from "../../../components/shared/LoadingState";

interface CompaniesTabProps {
  companiesQuery: { data?: Company[]; isPending: boolean; error: Error | null };
  tokensQuery: { data?: CompanyToken[]; isPending: boolean };
  expandedCompanyId: string | null;
  onToggleExpand: (id: string | null) => void;
  newName: string; newSlug: string;
  onNameChange: (v: string) => void; onSlugChange: (v: string) => void;
  onCreateCompany: () => void; creating: boolean;
  onGenerateToken: (id: string) => void; generating: boolean;
}

export function CompaniesTab({
  companiesQuery, tokensQuery, expandedCompanyId, onToggleExpand,
  newName, newSlug, onNameChange, onSlugChange, onCreateCompany,
  creating, onGenerateToken, generating,
}: CompaniesTabProps) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={styles.pageTitle}>{t("admin.companies.title")}</Text>

      <View style={styles.createCard}>
        <Text style={styles.createTitle}>{t("admin.companies.addCompany")}</Text>
        <View style={styles.createRow}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder={t("admin.companies.companyName")} value={newName} onChangeText={onNameChange} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={[styles.input, { flex: 0.5 }]} placeholder={t("admin.companies.slug")} value={newSlug} onChangeText={onSlugChange} placeholderTextColor={colors.inputPlaceholder} autoCapitalize="none" />
          <Pressable style={[styles.createBtn, (!newName || !newSlug || creating) && { opacity: 0.5 }]} onPress={onCreateCompany} disabled={!newName || !newSlug || creating}>
            <Text style={styles.createBtnText}>{t("common.add")}</Text>
          </Pressable>
        </View>
      </View>

      {companiesQuery.isPending ? (
        <LoadingState />
      ) : companiesQuery.error ? (
        <ErrorCard title={t("common.errorLoading")} error={companiesQuery.error} />
      ) : (
        <View style={{ gap: spacing.x3s, marginTop: spacing.xs }}>
          {companiesQuery.data?.map((c) => (
            <View key={c.id} style={styles.companyCard}>
              <Pressable style={styles.companyCardHeader} onPress={() => onToggleExpand(expandedCompanyId === c.id ? null : c.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.companyName}>{c.name}</Text>
                  <Text style={styles.companyMeta}>ID: {c.id} | {c._count?.users ?? 0} {t("admin.dashboard.users").toLowerCase()} | {c._count?.tokens ?? 0} {t("admin.companies.tokens").toLowerCase()}</Text>
                </View>
                <Text style={styles.expandIcon}>{expandedCompanyId === c.id ? "▼" : "▶"}</Text>
              </Pressable>

              {expandedCompanyId === c.id && (
                <View style={styles.companyDetails}>
                  <View style={styles.tokenActions}>
                    <Pressable style={[styles.genTokenBtn, generating && { opacity: 0.5 }]} onPress={() => onGenerateToken(c.id)} disabled={generating}>
                      <Text style={styles.genTokenBtnText}>{generating ? t("common.generating") : t("admin.companies.generateToken")}</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.tokensTitle}>{t("admin.companies.tokens")} ({tokensQuery.data?.length ?? 0})</Text>
                  {tokensQuery.isPending ? (
                    <LoadingState size="small" />
                  ) : tokensQuery.data?.length === 0 ? (
                    <EmptyState message={t("admin.companies.noTokens")} />
                  ) : (
                    <View style={styles.tokenList}>
                      <View style={styles.tokenHeader}>
                        <Text style={[styles.tokenHeaderCell, { flex: 2 }]}>{t("admin.tokens.token")}</Text>
                        <Text style={[styles.tokenHeaderCell, { flex: 0.7 }]}>{t("common.status")}</Text>
                        <Text style={[styles.tokenHeaderCell, { flex: 1 }]}>{t("common.date")}</Text>
                      </View>
                      {tokensQuery.data?.map((tk) => (
                        <View key={tk.id} style={styles.tokenRow}>
                          <Text style={[styles.tokenCell, { flex: 2, fontFamily: "monospace", fontSize: 12 }]}>{tk.token}</Text>
                          <View style={{ flex: 0.7 }}>
                            <Badge label={tk.used ? t("admin.companies.used") : t("admin.companies.available")} color={tk.used ? colors.error : colors.success} bg={tk.used ? colors.errorBg : colors.successBg} />
                          </View>
                          <Text style={[styles.tokenCell, { flex: 1 }]}>{new Date(tk.createdAt).toLocaleDateString("pl-PL")}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </>
  );
}
