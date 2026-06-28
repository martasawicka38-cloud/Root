import { useRef, useState, useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, radius, shadows, spacing } from "../../styles/tokens";

interface Company {
  id: string;
  name: string;
  slug: string;
}

interface CompanySearchProps {
  companies: Company[];
  isPending: boolean;
  selectedCompany: Company | null;
  onSelect: (company: Company) => void;
  onClear: () => void;
}

export function CompanySearch({ companies, isPending, selectedCompany, onSelect, onClear }: CompanySearchProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const filtered = useMemo(() => {
    if (!companies || !searchQuery) return companies ?? [];
    const q = searchQuery.toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [companies, searchQuery]);

  const handleFocus = () => { if (blurTimer.current) clearTimeout(blurTimer.current); setIsFocused(true); };
  const handleBlur = () => { blurTimer.current = setTimeout(() => setIsFocused(false), 180); };
  const handleSelect = (item: Company) => { if (blurTimer.current) clearTimeout(blurTimer.current); onSelect(item); setSearchQuery(""); setIsFocused(false); };

  if (selectedCompany) {
    return (
      <View style={styles.selectedRow}>
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedName}>{selectedCompany.name}</Text>
        </View>
        <Pressable onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>{t("auth.change")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
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
      {isFocused && (
        <View style={styles.dropdown}>
          {isPending ? (
            <ActivityIndicator color={colors.mossGreen} style={styles.loader} />
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll} nestedScrollEnabled>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <Pressable key={item.id} style={styles.option} onPress={() => handleSelect(item)}>
                    <Text style={styles.optionName}>{item.name}</Text>
                    <Text style={styles.optionSlug}>{item.slug}</Text>
                  </Pressable>
                ))
              ) : searchQuery.length > 0 ? (
                <Text style={styles.empty}>{t("auth.noResults")}</Text>
              ) : (
                <Text style={styles.empty}>{t("auth.typeCompanyName")}</Text>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectedRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.infoBg, borderWidth: 1, borderColor: colors.info, borderRadius: radius.md, padding: 14 },
  selectedInfo: { flex: 1 },
  selectedName: { fontSize: 15, fontWeight: "700", color: colors.info },
  clearBtn: { paddingHorizontal: spacing.x2s, paddingVertical: 6 },
  clearBtnText: { fontSize: 13, color: colors.info, fontWeight: "600" },
  wrapper: { position: "relative", zIndex: 100 },
  input: { borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 14, fontSize: 15, color: colors.slate900, backgroundColor: colors.inputBg },
  dropdown: { position: "absolute", top: "100%", left: 0, right: 0, marginTop: spacing.x4s, maxHeight: 200, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, backgroundColor: colors.white, ...shadows.lg },
  loader: { paddingVertical: spacing.xs },
  scroll: { maxHeight: 200 },
  option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.x2s, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  optionName: { fontSize: 15, fontWeight: "600", color: colors.slate900 },
  optionSlug: { fontSize: 12, color: colors.slate400 },
  empty: { fontSize: 14, color: colors.slate500, textAlign: "center", paddingVertical: spacing.xs },
});
