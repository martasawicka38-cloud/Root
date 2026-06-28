import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../styles/tokens";

interface StatusBadgeProps {
  type: "one_time" | "cyclical" | "active" | "inactive" | "used" | "available";
  label?: string;
}

const BADGE_CONFIG = {
  one_time: { bg: colors.creamMedium, color: colors.warning, labelKey: "market.oneTime" },
  cyclical: { bg: colors.successBg, color: colors.success, labelKey: "market.cyclical" },
  active: { bg: colors.successBg, color: colors.success, labelKey: "admin.users.active" },
  inactive: { bg: colors.errorBg, color: colors.error, labelKey: "admin.users.inactive" },
  used: { bg: colors.errorBg, color: colors.error, labelKey: "admin.companies.used" },
  available: { bg: colors.successBg, color: colors.success, labelKey: "admin.companies.available" },
};

export function StatusBadge({ type, label }: StatusBadgeProps) {
  const { t } = useTranslation();
  const config = BADGE_CONFIG[type];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.color }]}>{label ?? t(config.labelKey)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  text: { fontSize: 12, fontWeight: "600" },
});
