import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  fetchAuthMe,
  fetchCompanyAnalytics,
  fetchCompanyBySlug,
  fetchCompanyEmployees,
  fetchCompanyTokensBySlug,
  generateEmployerTokenBySlug,
  toggleUserActive,
} from "../../../lib/api/endpoints";
import { colors, radius } from "../../../styles/tokens";
import { useAppStore } from "../../../store/useAppStore";

type Tab = "employees" | "analytics" | "tokens";

export default function CompanyPanelScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const userRole = useAppStore((s) => s.userRole);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("employees");

  const authQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchAuthMe,
  });

  const companyQuery = useQuery({
    queryKey: ["company", slug],
    queryFn: () => fetchCompanyBySlug(slug!),
    enabled: !!slug,
  });

  const employeesQuery = useQuery({
    queryKey: ["company", slug, "employees"],
    queryFn: () => fetchCompanyEmployees(slug!),
    enabled: !!slug,
  });

  const analyticsQuery = useQuery({
    queryKey: ["company", slug, "analytics"],
    queryFn: () => fetchCompanyAnalytics(slug!),
    enabled: !!slug,
  });

  const tokensQuery = useQuery({
    queryKey: ["company", slug, "tokens"],
    queryFn: () => fetchCompanyTokensBySlug(slug!),
    enabled: !!slug,
  });

  const generateTokenMutation = useMutation({
    mutationFn: () => generateEmployerTokenBySlug(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", slug, "tokens"] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleUserActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", slug, "employees"] });
    },
  });

  if (userRole !== "company" && userRole !== "superadmin") {
    return (
      <View style={styles.fallbackRoot}>
        <Text style={styles.fallbackTitle}>Brak dostepu</Text>
        <Text style={styles.fallbackText}>Tylko konto firmowe ma dostep do tego panelu.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <Text style={styles.topbarTitle}>
          {companyQuery.data?.name ?? "Panel firmy"}
        </Text>
        <View style={styles.topbarRight}>
          <Pressable onPress={() => router.push("/(mobile)/home")}>
            <Text style={styles.backLink}>Powrot do aplikacji</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.navTabs}>
        {[
          { key: "employees" as Tab, label: "Pracownicy" },
          { key: "analytics" as Tab, label: "Analityka" },
          { key: "tokens" as Tab, label: "Tokeny" },
        ].map((t) => (
          <Pressable
            key={t.key}
            style={[styles.navTab, tab === t.key && styles.navTabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.navTabText, tab === t.key && styles.navTabTextActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body} style={{ flex: 1 }}>
        <View style={styles.bodyInner}>
          {authQuery.data && (
            <Text style={styles.welcome}>Witaj, {authQuery.data.name}</Text>
          )}

          {tab === "employees" && (
            <EmployeesTab
              query={employeesQuery}
              onToggleActive={(id) => toggleActiveMutation.mutate(id)}
              togglingId={toggleActiveMutation.isPending ? toggleActiveMutation.variables : null}
            />
          )}
          {tab === "analytics" && <AnalyticsTab query={analyticsQuery} />}
          {tab === "tokens" && (
            <TokensTab
              query={tokensQuery}
              onGenerate={() => generateTokenMutation.mutate()}
              generating={generateTokenMutation.isPending}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function EmployeesTab({
  query, onToggleActive, togglingId,
}: {
  query: { data?: { id: string; name: string; email: string; isActive: boolean; balance: number }[]; isPending: boolean; error: Error | null };
  onToggleActive: (id: string) => void;
  togglingId: string | null;
}) {
  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac pracownikow.</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  if (!query.data?.length) {
    return <Text style={styles.emptyText}>Brak pracownikow w tej firmie.</Text>;
  }

  return (
    <>
      <Text style={styles.pageTitle}>Pracownicy ({query.data.length})</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Nazwa</Text>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Email</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>EC</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
        <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>Akcje</Text>
      </View>
      {query.data.map((e) => (
        <View key={e.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>{e.name}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>{e.email}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{e.balance}</Text>
          <View style={{ flex: 1 }}>
            <View style={[styles.badge, { backgroundColor: e.isActive ? "#D8F3DC" : "#FFE5E5" }]}>
              <Text style={[styles.badgeText, { color: e.isActive ? "#40916C" : "#D62828" }]}>
                {e.isActive ? "Aktywny" : "Nieaktywny"}
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.7 }}>
            <Pressable
              style={[styles.actionBtn, { borderColor: e.isActive ? "#FECACA" : "#BBF7D0", backgroundColor: e.isActive ? "#FEF2F2" : "#F0FDF4" }, togglingId === e.id && { opacity: 0.5 }]}
              onPress={() => onToggleActive(e.id)}
              disabled={togglingId === e.id}
            >
              <Text style={[styles.actionBtnText, { color: e.isActive ? "#D62828" : "#40916C" }]}>
                {e.isActive ? "Dezaktywuj" : "Aktywuj"}
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </>
  );
}

function AnalyticsTab({ query }: {
  query: { data?: {
    employees: { id: string; name: string; points: number }[];
    totalActivities: number;
    totalSteps: number;
    totalDeclarations: number;
    totalEarned: number;
    totalPoints: number;
    weeklySteps: { day: string; steps: number }[];
    recentActivity: { id: string; userName: string; type: string; points: number; createdAt: string }[];
  }; isPending: boolean; error: Error | null };
}) {
  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac analityki.</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );
  const d = query.data!;

  return (
    <>
      <Text style={styles.pageTitle}>Analityka</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.employees.length}</Text>
          <Text style={styles.statLabel}>Pracownikow</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalActivities}</Text>
          <Text style={styles.statLabel}>Aktywnosci</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalSteps.toLocaleString("pl-PL")}</Text>
          <Text style={styles.statLabel}>Krokow</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalDeclarations}</Text>
          <Text style={styles.statLabel}>Deklaracji</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalPoints.toLocaleString("pl-PL")}</Text>
          <Text style={styles.statLabel}>EC w obiegu</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalEarned.toLocaleString("pl-PL")}</Text>
          <Text style={styles.statLabel}>EC zarobione</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Ranking pracownikow</Text>
      {d.employees.length === 0 ? (
        <Text style={styles.emptyText}>Brak pracownikow.</Text>
      ) : (
        <View style={styles.rankList}>
          {[...d.employees].sort((a, b) => b.points - a.points).map((e, i) => (
            <View key={e.id} style={styles.rankRow}>
              <Text style={styles.rankPos}>{i + 1}.</Text>
              <Text style={styles.rankName}>{e.name}</Text>
              <Text style={styles.rankPoints}>{e.points} EC</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Kroki w ostatnim tygodniu</Text>
      <View style={styles.chartRow}>
        {d.weeklySteps.map((day) => {
          const max = Math.max(...d.weeklySteps.map((d) => d.steps), 1);
          return (
            <View key={day.day} style={styles.chartCol}>
              <Text style={styles.chartBarValue}>{day.steps > 0 ? (day.steps / 1000).toFixed(1) + "k" : ""}</Text>
              <View style={[styles.chartBar, { height: Math.max((day.steps / max) * 120, 4) }]} />
              <Text style={styles.chartLabel}>{new Date(day.day).toLocaleDateString("pl-PL", { weekday: "short" })}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Ostatnie aktywnosci</Text>
      {d.recentActivity.length === 0 ? (
        <Text style={styles.emptyText}>Brak aktywnosci.</Text>
      ) : (
        <View style={styles.activityList}>
          {d.recentActivity.map((act) => (
            <View key={act.id} style={styles.activityRow}>
              <View style={styles.activityLeft}>
                <Text style={styles.activityName}>{act.userName}</Text>
                <Text style={styles.activityType}>{act.type}</Text>
              </View>
              <Text style={styles.activityPoints}>+{act.points} EC</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function TokensTab({
  query, onGenerate, generating,
}: {
  query: { data?: { id: string; token: string; used: boolean; createdAt: string }[]; isPending: boolean; error: Error | null };
  onGenerate: () => void;
  generating: boolean;
}) {
  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac tokenow.</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  return (
    <>
      <Text style={styles.pageTitle}>Tokeny dla pracownikow</Text>
      <Text style={styles.hintText}>Tokeny umozliwiaja pracownikom rejestracje i dolaczenie do Twojej firmy.</Text>

      <Pressable
        style={[styles.genBigBtn, generating && { opacity: 0.5 }]}
        onPress={onGenerate}
        disabled={generating}
      >
        <Text style={styles.genBigBtnText}>
          {generating ? "Generowanie..." : "Generuj token"}
        </Text>
      </Pressable>

      {query.data?.length === 0 ? (
        <Text style={styles.emptyText}>Brak tokenow.</Text>
      ) : (
        <View style={styles.tokenTable}>
          <View style={styles.tokenTableHeader}>
            <Text style={[styles.tokenHeaderCell, { flex: 3 }]}>Token</Text>
            <Text style={[styles.tokenHeaderCell, { flex: 0.7 }]}>Status</Text>
            <Text style={[styles.tokenHeaderCell, { flex: 1 }]}>Data</Text>
          </View>
          {query.data?.map((t) => (
            <View key={t.id} style={styles.tokenTableRow}>
              <Text style={[styles.tokenCell, { flex: 3, fontFamily: "monospace" as const, fontSize: 12 }]}>{t.token}</Text>
              <View style={{ flex: 0.7 }}>
                <View style={[styles.badge, { backgroundColor: t.used ? "#FFE5E5" : "#D8F3DC" }]}>
                  <Text style={[styles.badgeText, { color: t.used ? "#D62828" : "#40916C" }]}>
                    {t.used ? "Uzyty" : "Dostepny"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.tokenCell, { flex: 1 }]}>{new Date(t.createdAt).toLocaleDateString("pl-PL")}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F1F5F9" },
  fallbackRoot: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  fallbackTitle: { fontSize: 22, fontWeight: "700", color: colors.deepForest, textAlign: "center" },
  fallbackText: { fontSize: 15, color: colors.slate500, textAlign: "center", marginTop: 8 },
  topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 32, paddingVertical: 14, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate200 },
  topbarTitle: { fontSize: 18, fontWeight: "700", color: colors.deepForest },
  topbarRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  backLink: { fontSize: 14, color: colors.mossGreen, fontWeight: "600" },
  navTabs: { flexDirection: "row", backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate200, paddingHorizontal: 32 },
  navTab: { paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: "transparent" },
  navTabActive: { borderBottomColor: "#0B5E6E" },
  navTabText: { fontSize: 14, fontWeight: "600", color: colors.slate500 },
  navTabTextActive: { color: "#0B5E6E" },
  body: { paddingHorizontal: 32, paddingTop: 28, paddingBottom: 48 },
  bodyInner: { maxWidth: 1100, width: "100%", alignSelf: "center" },
  welcome: { fontSize: 20, fontWeight: "700", color: colors.slate900, marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: "700", color: colors.slate900, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.slate900, marginBottom: 14, marginTop: 16 },
  errorCard: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: radius.md, padding: 20, gap: 8 },
  errorText: { fontSize: 16, fontWeight: "600", color: "#991B1B" },
  errorDetail: { fontSize: 14, color: "#7F1D1D" },
  hintText: { fontSize: 14, color: colors.slate500, marginBottom: 16 },

  statsRow: { flexDirection: "row", gap: 16, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.slate200, padding: 20, gap: 4 },
  statValue: { fontSize: 32, fontWeight: "800", color: colors.deepForest },
  statLabel: { fontSize: 14, color: colors.slate500, fontWeight: "500" },

  tableHeader: { flexDirection: "row", backgroundColor: colors.slate100, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  tableHeaderCell: { fontSize: 12, fontWeight: "700", color: colors.slate500, textTransform: "uppercase" as const },
  tableRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 4, gap: 4 },
  tableCell: { fontSize: 14, color: colors.slate900 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, borderWidth: 1, alignItems: "center" },
  actionBtnText: { fontSize: 12, fontWeight: "600" },

  emptyText: { fontSize: 15, color: colors.slate500, textAlign: "center", marginTop: 24 },

  rankList: { gap: 4, marginBottom: 16 },
  rankRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12 },
  rankPos: { fontSize: 16, fontWeight: "700", color: colors.slate400, width: 30 },
  rankName: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.slate900 },
  rankPoints: { fontSize: 15, fontWeight: "700", color: colors.mossGreen },

  chartRow: { flexDirection: "row", gap: 8, marginBottom: 24, alignItems: "flex-end" },
  chartCol: { flex: 1, alignItems: "center", gap: 4 },
  chartBarValue: { fontSize: 11, color: colors.slate500, fontWeight: "600" },
  chartBar: { width: "100%", maxWidth: 40, backgroundColor: "#0B5E6E", borderRadius: radius.sm, minHeight: 4 },
  chartLabel: { fontSize: 11, color: colors.slate500, textTransform: "capitalize" as const },

  activityList: { gap: 8 },
  activityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 14 },
  activityLeft: { gap: 2 },
  activityName: { fontSize: 15, fontWeight: "600", color: colors.slate900 },
  activityType: { fontSize: 13, color: colors.slate500, textTransform: "capitalize" as const },
  activityPoints: { fontSize: 16, fontWeight: "700", color: "#0B5E6E" },

  tokenTable: { gap: 4 },
  tokenTableHeader: { flexDirection: "row", backgroundColor: colors.slate100, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  tokenHeaderCell: { fontSize: 11, fontWeight: "700", color: colors.slate500, textTransform: "uppercase" as const },
  tokenTableRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 4 },
  tokenCell: { fontSize: 13, color: colors.slate900 },
  genBigBtn: { backgroundColor: "#0B5E6E", borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 24, alignItems: "center", marginBottom: 20, alignSelf: "flex-start" },
  genBigBtnText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
