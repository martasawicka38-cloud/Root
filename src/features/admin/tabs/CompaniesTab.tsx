import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import type { Company, CompanyToken } from "../../../lib/types/api";
import { Badge } from "../components/Badge";
import { styles } from "../admin.styles";
import { colors } from "../../../styles/tokens";

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
  return (
    <>
      <Text style={styles.pageTitle}>Zarzadzanie firmami</Text>

      <View style={styles.createCard}>
        <Text style={styles.createTitle}>Dodaj nowa firme</Text>
        <View style={styles.createRow}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Nazwa firmy" value={newName} onChangeText={onNameChange} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={[styles.input, { flex: 0.5 }]} placeholder="slug" value={newSlug} onChangeText={onSlugChange} placeholderTextColor={colors.inputPlaceholder} autoCapitalize="none" />
          <Pressable style={[styles.createBtn, (!newName || !newSlug || creating) && { opacity: 0.5 }]} onPress={onCreateCompany} disabled={!newName || !newSlug || creating}>
            <Text style={styles.createBtnText}>Dodaj</Text>
          </Pressable>
        </View>
      </View>

      {companiesQuery.isPending ? (
        <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 32 }} />
      ) : companiesQuery.error ? (
        <View style={styles.errorCard}><Text style={styles.errorText}>Nie udalo sie zaladowac firm.</Text><Text style={styles.errorDetail}>{companiesQuery.error.message}</Text></View>
      ) : (
        <View style={{ gap: 8, marginTop: 16 }}>
          {companiesQuery.data?.map((c) => (
            <View key={c.id} style={styles.companyCard}>
              <Pressable style={styles.companyCardHeader} onPress={() => onToggleExpand(expandedCompanyId === c.id ? null : c.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.companyName}>{c.name}</Text>
                  <Text style={styles.companyMeta}>ID: {c.id} | {c._count?.users ?? 0} uzytkownikow | {c._count?.tokens ?? 0} tokenow</Text>
                </View>
                <Text style={styles.expandIcon}>{expandedCompanyId === c.id ? "▼" : "▶"}</Text>
              </Pressable>

              {expandedCompanyId === c.id && (
                <View style={styles.companyDetails}>
                  <View style={styles.tokenActions}>
                    <Pressable style={[styles.genTokenBtn, generating && { opacity: 0.5 }]} onPress={() => onGenerateToken(c.id)} disabled={generating}>
                      <Text style={styles.genTokenBtnText}>{generating ? "Generowanie..." : "Generuj token pracowniczy"}</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.tokensTitle}>Tokeny ({tokensQuery.data?.length ?? 0})</Text>
                  {tokensQuery.isPending ? (
                    <ActivityIndicator size="small" color={colors.mossGreen} />
                  ) : tokensQuery.data?.length === 0 ? (
                    <Text style={styles.emptyText}>Brak tokenow dla tej firmy.</Text>
                  ) : (
                    <View style={styles.tokenList}>
                      <View style={styles.tokenHeader}>
                        <Text style={[styles.tokenHeaderCell, { flex: 2 }]}>Token</Text>
                        <Text style={[styles.tokenHeaderCell, { flex: 0.7 }]}>Status</Text>
                        <Text style={[styles.tokenHeaderCell, { flex: 1 }]}>Data</Text>
                      </View>
                      {tokensQuery.data?.map((t) => (
                        <View key={t.id} style={styles.tokenRow}>
                          <Text style={[styles.tokenCell, { flex: 2, fontFamily: "monospace", fontSize: 12 }]}>{t.token}</Text>
                          <View style={{ flex: 0.7 }}>
                            <Badge label={t.used ? "Uzyty" : "Dostepny"} color={t.used ? colors.error : colors.success} bg={t.used ? colors.errorBg : colors.successBg} />
                          </View>
                          <Text style={[styles.tokenCell, { flex: 1 }]}>{new Date(t.createdAt).toLocaleDateString("pl-PL")}</Text>
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
