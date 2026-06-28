import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { CompanyToken } from "../../../lib/types/api";
import { Badge } from "../components/Badge";
import { styles } from "../admin.styles";
import { colors } from "../../../styles/tokens";

interface CompanyTokensTabProps {
  tokensQuery: { data?: CompanyToken[]; isPending: boolean; error: Error | null };
  onGenerate: () => void;
  generating: boolean;
}

export function CompanyTokensTab({ tokensQuery, onGenerate, generating }: CompanyTokensTabProps) {
  return (
    <>
      <Text style={styles.pageTitle}>Tokeny rejestracyjne dla firm</Text>
      <Text style={styles.hintText}>
        Tokeny umozliwiaja firmom rejestracje konta firmowego. Kazdy token jest jednorazowy.
      </Text>

      <Pressable
        style={[styles.genBigBtn, generating && { opacity: 0.5 }]}
        onPress={onGenerate}
        disabled={generating}
      >
        <Text style={styles.genBigBtnText}>
          {generating ? "Generowanie..." : "Generuj nowy token dla firmy"}
        </Text>
      </Pressable>

      {tokensQuery.isPending ? (
        <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 32 }} />
      ) : tokensQuery.error ? (
        <View style={styles.errorCard}><Text style={styles.errorText}>Blad ladowania tokenow.</Text></View>
      ) : (
        <View style={styles.tokenListFull}>
          <View style={styles.tokenTableHeader}>
            <Text style={[styles.tokenHeaderCell, { flex: 3 }]}>Token</Text>
            <Text style={[styles.tokenHeaderCell, { flex: 0.7 }]}>Status</Text>
            <Text style={[styles.tokenHeaderCell, { flex: 1 }]}>Data utworzenia</Text>
          </View>
          {tokensQuery.data?.map((t) => (
            <View key={t.id} style={styles.tokenTableRow}>
              <Text style={[styles.tokenCell, { flex: 3, fontFamily: "monospace", fontSize: 13 }]}>{t.token}</Text>
              <View style={{ flex: 0.7 }}>
                <Badge label={t.used ? "Uzyty" : "Dostepny"} color={t.used ? colors.error : colors.success} bg={t.used ? colors.errorBg : colors.successBg} />
              </View>
              <Text style={[styles.tokenCell, { flex: 1 }]}>{new Date(t.createdAt).toLocaleDateString("pl-PL")}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
