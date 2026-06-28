import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, radius } from "../../styles/tokens";

interface ErrorCardProps {
  title?: string;
  error?: Error | string;
  onRetry?: () => void;
  style?: object;
}

export function ErrorCard({ title, error, onRetry, style }: ErrorCardProps) {
  const { t } = useTranslation();
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title ?? t("common.error")}</Text>
      {errorMessage && <Text style={styles.detail}>{errorMessage}</Text>}
      {onRetry && (
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>{t("common.retry")}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.errorBg, borderWidth: 1, borderColor: colors.errorBorder, borderRadius: radius.md, padding: 20, gap: 8 },
  title: { fontSize: 16, fontWeight: "600", color: colors.error },
  detail: { fontSize: 14, color: colors.deepForest },
  retryBtn: { alignSelf: "flex-start", marginTop: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.sm, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200 },
  retryText: { fontSize: 14, fontWeight: "600", color: colors.slate700 },
});
