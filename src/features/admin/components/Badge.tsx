import { StyleSheet, Text, View } from "react-native";
import type { useTranslation } from "react-i18next";
import { colors } from "../../../styles/tokens";

type TFunction = ReturnType<typeof useTranslation>["t"];

function buildRoleBadge(t: TFunction): Record<string, { label: string; color: string; bg: string }> {
  return {
    user: { label: t("admin.users.user"), color: colors.deepForest, bg: colors.successBg },
    company: { label: t("admin.users.companyRole"), color: colors.roleCompany, bg: colors.roleCompanyBg },
    superadmin: { label: t("admin.users.superadmin"), color: colors.roleSuperadmin, bg: colors.roleSuperadminBg },
  };
}

export function getRoleBadge(role: string, t: TFunction) {
  const badges = buildRoleBadge(t);
  return badges[role] ?? { label: role, color: colors.olive, bg: colors.creamLight };
}

export function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={[badgeStyles.badge, { backgroundColor: bg }]}>
      <Text style={[badgeStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  text: { fontSize: 12, fontWeight: "600" },
});
