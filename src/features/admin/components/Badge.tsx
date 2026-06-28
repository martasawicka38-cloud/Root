import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../styles/tokens";

const ROLE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  user: { label: "Uzytkownik", color: colors.deepForest, bg: colors.successBg },
  company: { label: "Firma", color: colors.roleCompany, bg: colors.roleCompanyBg },
  superadmin: { label: "Superadmin", color: colors.roleSuperadmin, bg: colors.roleSuperadminBg },
};

export function getRoleBadge(role: string) {
  return ROLE_BADGE[role] ?? { label: role, color: colors.olive, bg: colors.creamLight };
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
