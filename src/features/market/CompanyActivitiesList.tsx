import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { EcoIcon } from "../../components/EcoIcon";
import type { EcoActivity } from "../../lib/types/api";
import { colors, radius, spacing } from "../../styles/tokens";

interface CompanyActivitiesListProps {
  activities: EcoActivity[];
  isPending: boolean;
  submittingId: string | null;
  onSubmit: (id: string) => void;
}

export function CompanyActivitiesList({ activities, isPending, submittingId, onSubmit }: CompanyActivitiesListProps) {
  const { t } = useTranslation();

  if (isPending) return <ActivityIndicator style={{ padding: spacing.xl }} />;
  if (activities.length === 0) return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{t("market.noCompanyActivities")}</Text>
      <Text style={styles.emptyDesc}>{t("market.noCompanyActivitiesDesc")}</Text>
    </View>
  );

  return (
    <View style={styles.list}>
      {activities.map((act) => {
        const done = act.completedToday ?? false;
        const oneTimeDone = act.completedOneTime ?? false;
        const isOneTime = act.activityType === "one_time";
        return (
          <View key={act.id} style={[styles.card, (done || oneTimeDone) && styles.cardDone]}>
            <View style={styles.left}>
              <View style={styles.iconBox}><EcoIcon name={act.icon} size={24} /></View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, (done || oneTimeDone) && styles.muted]}>{act.name}</Text>
                  {isOneTime && <View style={styles.badgeOne}><Text style={styles.badgeOneText}>{t("market.oneTime")}</Text></View>}
                  {act.activityType === "cyclical" && <View style={styles.badgeCyc}><Text style={styles.badgeCycText}>{t("market.cyclical")}</Text></View>}
                </View>
                {act.description && <Text style={[styles.desc, (done || oneTimeDone) && styles.muted]}>{act.description}</Text>}
                <View style={styles.meta}>
                  <Text style={[styles.points, (done || oneTimeDone) && styles.muted]}>+{act.basePoints} EXP</Text>
                  {act.expiresAt && <Text style={[styles.expiry, (done || oneTimeDone) && styles.muted]}>{t("market.expiresPrefix")} {new Date(act.expiresAt).toLocaleDateString("pl-PL")}</Text>}
                </View>
              </View>
            </View>
            {done || oneTimeDone ? (
              <View style={styles.done}><Text style={styles.doneCheck}>✓</Text></View>
            ) : (
              <Pressable style={[styles.submit, submittingId === act.id && { opacity: 0.5 }]} onPress={() => onSubmit(act.id)} disabled={submittingId === act.id}>
                {submittingId === act.id ? <ActivityIndicator size="small" color={colors.white} /> : <Text style={styles.submitText}>+</Text>}
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.x2s },
  empty: { padding: spacing.xl, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: colors.brownDark, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.olive, textAlign: "center" },
  card: { backgroundColor: colors.creamLight, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: spacing.xs, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardDone: { opacity: 0.6 },
  left: { flexDirection: "row", alignItems: "center", gap: spacing.x2s, flex: 1 },
  iconBox: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.creamMedium, alignItems: "center", justifyContent: "center" },
  info: { flex: 1, gap: spacing.x4s },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.x3s },
  name: { fontSize: 16, fontWeight: "600", color: colors.brownDark },
  desc: { fontSize: 13, color: colors.olive },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing.x2s, marginTop: 4 },
  points: { fontSize: 14, fontWeight: "700", color: colors.greenDark },
  expiry: { fontSize: 12, color: colors.olive },
  muted: { opacity: 0.6 },
  badgeOne: { backgroundColor: colors.greenLight, paddingHorizontal: spacing.x3s, paddingVertical: 2, borderRadius: 4 },
  badgeOneText: { fontSize: 11, fontWeight: "600", color: colors.greenDark },
  badgeCyc: { backgroundColor: colors.creamDark, paddingHorizontal: spacing.x3s, paddingVertical: 2, borderRadius: 4 },
  badgeCycText: { fontSize: 11, fontWeight: "600", color: colors.olive },
  done: { width: 32, height: 32, borderRadius: radius.lg, backgroundColor: colors.greenDark, alignItems: "center", justifyContent: "center" },
  doneCheck: { color: colors.white, fontSize: 16, fontWeight: "700" },
  submit: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.greenBright, alignItems: "center", justifyContent: "center" },
  submitText: { color: colors.white, fontSize: 24, fontWeight: "700", lineHeight: 28 },
});
