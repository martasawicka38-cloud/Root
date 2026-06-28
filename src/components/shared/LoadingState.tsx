import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../styles/tokens";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
  style?: object;
}

export function LoadingState({ message, size = "large", style }: LoadingStateProps) {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.mossGreen} />
      {message !== undefined && <Text style={styles.message}>{message ?? t("common.loading")}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 48 },
  message: { fontSize: 14, color: colors.slate500, marginTop: 12 },
});
