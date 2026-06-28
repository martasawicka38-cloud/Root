import { StyleSheet } from "react-native";
import { colors } from "../../styles/tokens";

export const rankingStyles = StyleSheet.create({
  errorText: { textAlign: "center", paddingVertical: 40, color: colors.olive },
  emptyText: { textAlign: "center", paddingVertical: 40, color: colors.olive },
  podiumRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  podiumCard: { flex: 1, borderWidth: 1, borderRadius: 12, overflow: "hidden" },
  podiumCardBody: { alignItems: "center", gap: 8, paddingVertical: 16 },
  podiumIcon: { width: 32, height: 32, borderRadius: 9999, alignItems: "center", justifyContent: "center" },
  podiumIconText: { fontSize: 14, fontWeight: "700", color: colors.brownDark },
  podiumName: { fontSize: 14, fontWeight: "600", color: colors.brownDark, textAlign: "center" },
  podiumPoints: { fontSize: 18, fontWeight: "700", color: colors.greenDark },
  listContainer: { gap: 8 },
  listRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: colors.creamLight, borderWidth: 1, borderColor: colors.creamDark, borderRadius: 12 },
  listRank: { width: 32, fontSize: 14, fontWeight: "600", color: colors.olive, textAlign: "center" },
  listAvatar: { width: 40, height: 40, borderRadius: 9999, backgroundColor: colors.creamMedium, alignItems: "center", justifyContent: "center" },
  listAvatarText: { fontSize: 14, fontWeight: "700", color: colors.brownDark },
  listName: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.brownDark },
  levelBadge: { backgroundColor: colors.greenLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  levelBadgeText: { fontSize: 12, fontWeight: "600", color: colors.greenDark },
  listPoints: { fontSize: 14, fontWeight: "700", color: colors.greenDark },
  companyInfo: { flex: 1 },
  companyMembers: { fontSize: 12, color: colors.olive },
  myRankBox: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: colors.creamDark, borderRadius: 12, gap: 4 },
  myRankLabel: { fontSize: 12, fontWeight: "600", color: colors.olive, textTransform: "uppercase", letterSpacing: 0.5 },
  myRankText: { fontSize: 14, fontWeight: "600", color: colors.brownDark },
});
