import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../styles/tokens";

interface EmptyStateProps {
  icon?: string;
  message?: string;
  style?: object;
}

export function EmptyState({ icon, message, style }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.message}>{message ?? t("common.empty")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: 48, gap: 8 },
  icon: { fontSize: 32 },
  message: { fontSize: 14, color: colors.slate500, textAlign: "center" },
});
