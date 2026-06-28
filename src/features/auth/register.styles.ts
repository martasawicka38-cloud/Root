import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../styles/tokens";

export const registerStyles = StyleSheet.create({
  roleRow: { flexDirection: "row", gap: spacing.x3s, marginBottom: spacing.x3s },
  roleBtn: { flex: 1, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: spacing.x2s, gap: spacing.x4s, backgroundColor: colors.inputBg },
  roleDot: { width: 10, height: 10, borderRadius: 5 },
  roleLabel: { fontSize: 14, fontWeight: "700" },
  roleDesc: { fontSize: 11, color: colors.slate500, lineHeight: 14 },
});
