import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { CompanyToken } from "../../../lib/types/api";
import { styles } from "../company.styles";
import { colors } from "../../../styles/tokens";

export function TokensTab({ query, onGenerate, generating }: {
  query: { data?: CompanyToken[]; isPending: boolean; error: Error | null };
  onGenerate: () => void;
  generating: boolean;
}) {
  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac tokenow.</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  const tokens = query.data ?? [];

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>Tokeny ({tokens.length})</Text>
        <Pressable style={[styles.genBigBtn, generating && { opacity: 0.5 }]} onPress={onGenerate} disabled={generating}>
          <Text style={styles.genBigBtnText}>{generating ? "Generowanie..." : "Generuj token"}</Text>
        </Pressable>
      </View>

      {tokens.length === 0 ? (
        <Text style={styles.emptyText}>Brak tokenow. Kliknij Generuj token, aby utworzyc pierwszy.</Text>
      ) : (
        <View style={styles.tokenListFull}>
          <View style={styles.tokenTableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Kod</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Utworzono</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Uzyty przez</Text>
          </View>
          {tokens.map((t) => (
            <View key={t.id} style={styles.tokenTableRow}>
              <Text style={[styles.tokenCell, { flex: 2, fontFamily: "monospace", fontWeight: "700" }]}>{t.token}</Text>
              <View style={{ flex: 1 }}>
                <View style={[styles.badge, { backgroundColor: t.used ? colors.errorBg : colors.successBg }]}>
                  <Text style={[styles.badgeText, { color: t.used ? colors.error : colors.success }]}>{t.used ? "Uzyty" : "Aktywny"}</Text>
                </View>
              </View>
              <Text style={[styles.tokenCell, { flex: 1.5 }]}>{new Date(t.createdAt).toLocaleString()}</Text>
              <Text style={[styles.tokenCell, { flex: 1 }]}>{t.usedBy ?? "-"}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
