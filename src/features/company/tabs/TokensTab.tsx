import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { CompanyToken } from "../../../lib/types/api";
import { styles } from "../company.styles";
import { colors } from "../../../styles/tokens";

export function TokensTab({ query, onGenerate, generating }: {
  query: { data?: CompanyToken[]; isPending: boolean; error: Error | null };
  onGenerate: () => void;
  generating: boolean;
}) {
  const { t } = useTranslation();

  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>{t("common.errorLoading")}</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  const tokens = query.data ?? [];

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>{t("company.tokens.title")} ({tokens.length})</Text>
        <Pressable style={[styles.genBigBtn, generating && { opacity: 0.5 }]} onPress={onGenerate} disabled={generating}>
          <Text style={styles.genBigBtnText}>{generating ? t("common.generating") : t("company.tokens.generate")}</Text>
        </Pressable>
      </View>

      {tokens.length === 0 ? (
        <Text style={styles.emptyText}>{t("company.tokens.noTokens")}</Text>
      ) : (
        <View style={styles.tokenListFull}>
          <View style={styles.tokenTableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t("company.tokens.code")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t("company.tokens.status")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>{t("company.tokens.createdAt")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t("company.tokens.usedBy")}</Text>
          </View>
          {tokens.map((tok) => (
            <View key={tok.id} style={styles.tokenTableRow}>
              <Text style={[styles.tokenCell, { flex: 2, fontFamily: "monospace", fontWeight: "700" }]}>{tok.token}</Text>
              <View style={{ flex: 1 }}>
                <View style={[styles.badge, { backgroundColor: tok.used ? colors.errorBg : colors.successBg }]}>
                  <Text style={[styles.badgeText, { color: tok.used ? colors.error : colors.success }]}>{tok.used ? t("company.tokens.used") : t("company.tokens.active")}</Text>
                </View>
              </View>
              <Text style={[styles.tokenCell, { flex: 1.5 }]}>{new Date(tok.createdAt).toLocaleString()}</Text>
              <Text style={[styles.tokenCell, { flex: 1 }]}>{tok.usedBy ?? "-"}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
