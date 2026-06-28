import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { AdminDashboard } from "../../../lib/types/api";
import { styles } from "../admin.styles";

export function DashboardTab({ data }: { data?: AdminDashboard }) {
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <>
      <Text style={styles.pageTitle}>{t("admin.tabs.dashboard")}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.users.total}</Text>
          <Text style={styles.statLabel}>{t("admin.dashboard.users")}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.companies.length}</Text>
          <Text style={styles.statLabel}>{t("admin.dashboard.companies")}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.activity.totalActivities}</Text>
          <Text style={styles.statLabel}>{t("admin.dashboard.activities")}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t("admin.dashboard.companies")}</Text>
      <View style={styles.companyMinList}>
        {data.companies?.map((c) => (
          <View key={c.id} style={styles.companyMinRow}>
            <Text style={styles.companyMinName}>{c.name}</Text>
            <Text style={styles.companyMinCount}>{c.employeeCount} {t("admin.dashboard.employees")}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t("admin.dashboard.recentActivity")}</Text>
      <View style={styles.activityList}>
        {data.recentActivity?.map((a) => (
          <View key={a.id} style={styles.activityRow}>
            <View style={styles.activityLeft}>
              <Text style={styles.activityName}>{a.userName}</Text>
              <Text style={styles.activityType}>{a.type}</Text>
            </View>
            <Text style={styles.activityPoints}>+{a.points} EC</Text>
          </View>
        ))}
      </View>
    </>
  );
}
