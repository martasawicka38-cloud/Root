import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { EcoIcon } from "../../components/EcoIcon";
import type { EcoActivity } from "../../lib/types/api";
import { colors } from "../../styles/tokens";
import { ekoStyles as styles } from "./eko.styles";

interface EcoActivityCategoryProps {
  category: string;
  label: string;
  bgColor: string;
  textColor: string;
  activities: EcoActivity[];
  submittingId: string | null;
  onSubmit: (id: string) => void;
}

export function EcoActivityCategory({ category, label, bgColor, textColor, activities, submittingId, onSubmit }: EcoActivityCategoryProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.categoryBlock}>
      <View style={[styles.categoryHeader, { backgroundColor: bgColor }]}>
        <Text style={[styles.categoryHeaderText, { color: textColor }]}>{label}</Text>
      </View>
      {activities.map((act) => {
        const done = act.completedToday ?? false;
        const oneTimeDone = act.completedOneTime ?? false;
        const isOneTime = act.activityType === "one_time";
        return (
          <View key={act.id} style={[styles.activityRow, (done || oneTimeDone) && styles.activityRowDone]}>
            <View style={styles.activityLeft}>
              <EcoIcon name={act.icon} size={20} />
              <View style={styles.activityInfo}>
                <Text style={[styles.activityName, (done || oneTimeDone) && styles.textMuted]}>
                  {act.name}
                  {isOneTime && <Text style={styles.badgeOneTime}> {t("market.oneTime")}</Text>}
                </Text>
                <Text style={[styles.activityMeta, (done || oneTimeDone) && styles.textMuted]}>
                  {act.basePoints} {t("common.points")} · EXP + {t("ranking.title")}
                  {act.expiresAt && ` · ${t("market.expiresPrefix")} ${new Date(act.expiresAt).toLocaleDateString("pl-PL")}`}
                </Text>
              </View>
            </View>
            {done || oneTimeDone ? (
              <View style={styles.doneCircle}>
                <Text style={styles.doneCheck}>✓</Text>
              </View>
            ) : (
              <Pressable onPress={() => onSubmit(act.id)} disabled={submittingId === act.id} style={styles.addBtn}>
                {submittingId === act.id ? <ActivityIndicator size="small" color={colors.brownDark} /> : <Text style={styles.addBtnText}>+</Text>}
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}
