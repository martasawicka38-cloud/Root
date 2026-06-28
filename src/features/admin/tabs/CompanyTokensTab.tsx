import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { CompanyToken } from "../../../lib/types/api";
import { Badge } from "../components/Badge";
import { ErrorCard } from "../../../components/shared/ErrorCard";
import { styles } from "../admin.styles";
import { colors } from "../../../styles/tokens";
import { LoadingState } from "../../../components/shared/LoadingState";

interface CompanyTokensTabProps {
  tokensQuery: { data?: CompanyToken[]; isPending: boolean; error: Error | null };
  onGenerate: () => void;
  generating: boolean;
}

export function CompanyTokensTab({ tokensQuery, onGenerate, generating }: CompanyTokensTabProps) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={styles.pageTitle}>{t("admin.tokens.title")}</Text>
      <Text style={styles.hintText}>
        {t("admin.tokens.description")}
      </Text>

      <Pressable
        style={[styles.genBigBtn, generating && { opacity: 0.5 }]}
        onPress={onGenerate}
        disabled={generating}
      >
        <Text style={styles.genBigBtnText}>
          {generating ? t("common.generating") : t("admin.tokens.generate")}
        </Text>
      </Pressable>

      {tokensQuery.isPending ? (
        <LoadingState />
      ) : tokensQuery.error ? (
        <ErrorCard title={t("common.errorLoading")} error={tokensQuery.error} />
      ) : (
        <View style={styles.tokenListFull}>
          <View style={styles.tokenTableHeader}>
            <Text style={[styles.tokenHeaderCell, { flex: 3 }]}>{t("admin.tokens.token")}</Text>
            <Text style={[styles.tokenHeaderCell, { flex: 0.7 }]}>{t("common.status")}</Text>
            <Text style={[styles.tokenHeaderCell, { flex: 1 }]}>{t("admin.tokens.createdAt")}</Text>
          </View>
          {tokensQuery.data?.map((tk) => (
            <View key={tk.id} style={styles.tokenTableRow}>
              <Text style={[styles.tokenCell, { flex: 3, fontFamily: "monospace", fontSize: 13 }]}>{tk.token}</Text>
              <View style={{ flex: 0.7 }}>
                <Badge label={tk.used ? t("admin.companies.used") : t("admin.companies.available")} color={tk.used ? colors.error : colors.success} bg={tk.used ? colors.errorBg : colors.successBg} />
              </View>
              <Text style={[styles.tokenCell, { flex: 1 }]}>{new Date(tk.createdAt).toLocaleDateString("pl-PL")}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
