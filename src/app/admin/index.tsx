import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { fetchAdminDashboard } from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";

export default function AdminScreen() {
  const { data, isPending, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
  });

  if (Platform.OS !== "web") {
    return (
      <View style={styles.fallbackRoot}>
        <Text style={styles.fallbackTitle}>Panel admin</Text>
        <Text style={styles.fallbackText}>
          Panel administracyjny jest dostepny tylko na platformie web.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <Text style={styles.topbarTitle}>Eco-Pulse Admin</Text>
        <View style={styles.topbarRight}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Admin</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} style={{ flex: 1 }}>
        <View style={styles.bodyInner}>
          <Text style={styles.pageTitle}>Dashboard</Text>

          {isPending ? (
            <ActivityIndicator
              size="large"
              color={colors.mossGreen}
              style={{ marginTop: 48 }}
            />
          ) : error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>
                Nie udalo sie zaladowac danych.
              </Text>
              <Text style={styles.errorDetail}>{error.message}</Text>
            </View>
          ) : (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{data?.users.total}</Text>
                  <Text style={styles.statLabel}>Uzytkownikow</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {data?.users.activeDeclarations}
                  </Text>
                  <Text style={styles.statLabel}>Aktywnych deklaracji</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {data?.economy.totalEcInCirculation.toLocaleString("pl-PL")}
                  </Text>
                  <Text style={styles.statLabel}>EC w obiegu</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {data?.users.participationRate}%
                  </Text>
                  <Text style={styles.statLabel}>Udzial w programie</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {data?.activity.totalActivities}
                  </Text>
                  <Text style={styles.statLabel}>Lacznie aktywnosci</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {data?.activity.totalSteps.toLocaleString("pl-PL")}
                  </Text>
                  <Text style={styles.statLabel}>Lacznie krokow</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {data?.activity.avgStepsPerActivity.toLocaleString("pl-PL")}
                  </Text>
                  <Text style={styles.statLabel}>Srednio krokow</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {data?.economy.totalEarned.toLocaleString("pl-PL")}
                  </Text>
                  <Text style={styles.statLabel}>EC zarobione</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Kroki w ostatnim tygodniu</Text>
              <View style={styles.chartRow}>
                {data?.activity.weeklySteps.map((day) => {
                  const max = Math.max(
                    ...data.activity.weeklySteps.map((d) => d.steps),
                    1,
                  );
                  const height = (day.steps / max) * 120;
                  return (
                    <View key={day.day} style={styles.chartCol}>
                      <Text style={styles.chartBarValue}>
                        {day.steps > 0
                          ? (day.steps / 1000).toFixed(1) + "k"
                          : ""}
                      </Text>
                      <View
                        style={[
                          styles.chartBar,
                          { height: Math.max(height, 4) },
                        ]}
                      />
                      <Text style={styles.chartLabel}>
                        {new Date(day.day).toLocaleDateString("pl-PL", {
                          weekday: "short",
                        })}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <Text style={styles.sectionTitle}>Ostatnie aktywnosci</Text>
              {data?.recentActivity.length === 0 ? (
                <Text style={styles.emptyText}>Brak aktywnosci.</Text>
              ) : (
                <View style={styles.activityList}>
                  {data?.recentActivity.map((act) => (
                    <View key={act.id} style={styles.activityRow}>
                      <View style={styles.activityLeft}>
                        <Text style={styles.activityName}>
                          {act.userName}
                        </Text>
                        <Text style={styles.activityType}>{act.type}</Text>
                      </View>
                      <Text style={styles.activityPoints}>
                        +{act.points} EC
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  fallbackRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
  },
  fallbackText: {
    fontSize: 15,
    color: colors.slate500,
    textAlign: "center",
    marginTop: 8,
  },

  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate200,
  },
  topbarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.deepForest,
  },
  topbarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    backgroundColor: colors.mist,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.mossGreen,
  },

  body: {
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 48,
  },
  bodyInner: {
    maxWidth: 1100,
    width: "100%",
    alignSelf: "center",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.slate900,
    marginBottom: 24,
  },

  errorCard: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: radius.md,
    padding: 20,
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#991B1B",
  },
  errorDetail: {
    fontSize: 14,
    color: "#7F1D1D",
  },

  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate200,
    padding: 20,
    gap: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.deepForest,
  },
  statLabel: {
    fontSize: 14,
    color: colors.slate500,
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
    marginBottom: 14,
    marginTop: 8,
  },

  chartRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    alignItems: "flex-end",
  },
  chartCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  chartBarValue: {
    fontSize: 11,
    color: colors.slate500,
    fontWeight: "600",
  },
  chartBar: {
    width: "100%",
    maxWidth: 40,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.sm,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 11,
    color: colors.slate500,
    textTransform: "capitalize",
  },

  activityList: {
    gap: 8,
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
  },
  activityLeft: {
    gap: 2,
  },
  activityName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.slate900,
  },
  activityType: {
    fontSize: 13,
    color: colors.slate500,
    textTransform: "capitalize",
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.mossGreen,
  },
  emptyText: {
    fontSize: 15,
    color: colors.slate500,
    textAlign: "center",
    marginTop: 24,
  },
});
