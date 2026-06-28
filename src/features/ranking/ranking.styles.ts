import { StyleSheet } from "react-native";
import { colors, spacing } from "../../styles/tokens";

export const rankingStyles = StyleSheet.create({
  errorText: { textAlign: "center", paddingVertical: spacing.xl, color: colors.olive },
  emptyText: { textAlign: "center", paddingVertical: spacing.xl, color: colors.olive },
  podiumRow: { flexDirection: "row", gap: spacing.x2s, marginBottom: spacing.xs },
  podiumCard: { flex: 1, borderWidth: 1, borderRadius: 12, overflow: "hidden" },
  podiumCardBody: { alignItems: "center", gap: spacing.x3s, paddingVertical: spacing.xs },
  podiumIcon: { width: 32, height: 32, borderRadius: 9999, alignItems: "center", justifyContent: "center" },
  podiumIconText: { fontSize: 14, fontWeight: "700", color: colors.brownDark },
  podiumName: { fontSize: 14, fontWeight: "600", color: colors.brownDark, textAlign: "center" },
  podiumPoints: { fontSize: 18, fontWeight: "700", color: colors.greenDark },
  listContainer: { gap: spacing.x3s },
  listRow: { flexDirection: "row", alignItems: "center", gap: spacing.x2s, paddingVertical: spacing.x2s, paddingHorizontal: spacing.xs, backgroundColor: colors.creamLight, borderWidth: 1, borderColor: colors.creamDark, borderRadius: 12 },
  listRank: { width: 32, fontSize: 14, fontWeight: "600", color: colors.olive, textAlign: "center" },
  listAvatar: { width: 40, height: 40, borderRadius: 9999, backgroundColor: colors.creamMedium, alignItems: "center", justifyContent: "center" },
  listAvatarText: { fontSize: 14, fontWeight: "700", color: colors.brownDark },
  listName: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.brownDark },
  levelBadge: { backgroundColor: colors.greenLight, paddingHorizontal: spacing.x3s, paddingVertical: spacing.x4s, borderRadius: 6 },
  levelBadgeText: { fontSize: 12, fontWeight: "600", color: colors.greenDark },
  listPoints: { fontSize: 14, fontWeight: "700", color: colors.greenDark },
  companyInfo: { flex: 1 },
  companyMembers: { fontSize: 12, color: colors.olive },
  myRankBox: { marginTop: spacing.xs, paddingVertical: spacing.x2s, paddingHorizontal: spacing.xs, backgroundColor: colors.creamDark, borderRadius: 12, gap: spacing.x4s },
  myRankLabel: { fontSize: 12, fontWeight: "600", color: colors.olive, textTransform: "uppercase", letterSpacing: 0.5 },
  myRankText: { fontSize: 14, fontWeight: "600", color: colors.brownDark },
});
