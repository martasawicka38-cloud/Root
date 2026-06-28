import { Text, View } from "react-native";
import type { AdminDashboard } from "../../../lib/types/api";
import { styles } from "../admin.styles";

export function DashboardTab({ data }: { data?: AdminDashboard }) {
  if (!data) return null;

  return (
    <>
      <Text style={styles.pageTitle}>Dashboard</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.users.total}</Text>
          <Text style={styles.statLabel}>Uzytkownicy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.companies.length}</Text>
          <Text style={styles.statLabel}>Firmy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.activity.totalActivities}</Text>
          <Text style={styles.statLabel}>Aktywnosci</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Firmy</Text>
      <View style={styles.companyMinList}>
        {data.companies?.map((c) => (
          <View key={c.id} style={styles.companyMinRow}>
            <Text style={styles.companyMinName}>{c.name}</Text>
            <Text style={styles.companyMinCount}>{c.employeeCount} pracownikow</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Ostatnie aktywnosci</Text>
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
