import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyEmployeeSteps } from "../../../lib/api/endpoints";
import { IconSteps, IconTrophy, IconActivity } from "../../admin/components/Icons";
import { CompanyBarChart } from "../components/CompanyBarChart";
import { EmptyState } from "../../../components/shared/EmptyState";
import { ErrorCard } from "../../../components/shared/ErrorCard";
import { styles } from "../company.styles";
import { colors, spacing } from "../../../styles/tokens";
import { LoadingState } from "../../../components/shared/LoadingState";

type CompanyAnalyticsSubTab = "steps" | "ranking" | "activity";
type StepsPeriod = "day" | "week" | "month" | "custom";

interface AnalyticsData {
  employees: { id: string; name: string; points: number }[];
  totalActivities: number;
  totalSteps: number;
  totalDeclarations: number;
  totalEarned: number;
  totalPoints: number;
  weeklySteps: { day: string; steps: number }[];
  weeklySteps9: { label: string; steps: number }[];
  monthlySteps12: { label: string; steps: number }[];
  recentActivity: { id: string; userName: string; type: string; points: number; createdAt: string }[];
}

export function AnalyticsTab({ query, slug }: {
  query: { data?: AnalyticsData; isPending: boolean; error: Error | null };
  slug: string;
}) {
  const { t } = useTranslation();
  const [subTab, setSubTab] = useState<CompanyAnalyticsSubTab>("steps");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  if (query.isPending) return <LoadingState />;
  if (query.error) return <ErrorCard title={t("common.errorLoading")} error={query.error} />;

  const d = query.data;
  if (!d) return null;

  const selectedEmployee = d.employees.find((e) => e.id === selectedEmployeeId);

  const SUB_TABS: { key: CompanyAnalyticsSubTab; label: string; icon: React.ReactNode }[] = [
    { key: "steps", label: t("company.analytics.selectEmployee"), icon: <IconSteps color={subTab === "steps" ? colors.mossGreen : colors.slate500} /> },
    { key: "ranking", label: t("company.analytics.employeeRanking"), icon: <IconTrophy color={subTab === "ranking" ? colors.mossGreen : colors.slate500} /> },
    { key: "activity", label: t("company.analytics.recentActivity"), icon: <IconActivity color={subTab === "activity" ? colors.mossGreen : colors.slate500} /> },
  ];

  return (
    <View style={styles.analyticsLayout}>
      <View style={styles.analyticsSidebar}>
        {SUB_TABS.map((st) => (
          <Pressable key={st.key} style={[styles.analyticsSidebarItem, subTab === st.key && styles.analyticsSidebarItemActive]} onPress={() => setSubTab(st.key)}>
            <View style={styles.analyticsSidebarIcon}>{st.icon}</View>
            <Text style={[styles.analyticsSidebarLabel, subTab === st.key && styles.analyticsSidebarLabelActive]}>{st.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.analyticsMain}>
        <View style={{ minHeight: 500 }}>
          {subTab === "steps" && <CompanyStepsView employees={d.employees} selectedEmployeeId={selectedEmployeeId} selectedEmployee={selectedEmployee} onSelectEmployee={setSelectedEmployeeId} slug={slug} />}
          {subTab === "ranking" && <CompanyRankingView employees={d.employees} />}
          {subTab === "activity" && <CompanyActivityView activities={d.recentActivity} />}
        </View>
      </View>
    </View>
  );
}

function CompanyStepsView({ employees, selectedEmployeeId, selectedEmployee, onSelectEmployee, slug }: {
  employees: { id: string; name: string; points: number }[];
  selectedEmployeeId: string;
  selectedEmployee?: { id: string; name: string; points: number };
  onSelectEmployee: (id: string) => void;
  slug: string;
}) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<StepsPeriod>("day");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const getEffectivePeriod = (): "day" | "week" | "month" => {
    if (period !== "custom") return period;
    if (!customFrom || !customTo) return "day";
    const diffMs = new Date(customTo).getTime() - new Date(customFrom).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays <= 14) return "day";
    if (diffDays <= 90) return "week";
    return "month";
  };

  const effectivePeriod = getEffectivePeriod();
  const from = period === "custom" ? customFrom : undefined;
  const to = period === "custom" ? customTo : undefined;

  const stepsQuery = useQuery({
    queryKey: ["company", slug, "employee-steps", selectedEmployeeId, effectivePeriod, from, to],
    queryFn: () => fetchCompanyEmployeeSteps(slug, selectedEmployeeId, effectivePeriod, from, to),
    enabled: selectedEmployeeId.length > 0 && (period !== "custom" || (!!customFrom && !!customTo)),
  });

  const PERIOD_OPTIONS: { key: StepsPeriod; label: string }[] = [
    { key: "day", label: t("admin.analytics.periods.7days") },
    { key: "week", label: t("admin.analytics.periods.9weeks") },
    { key: "month", label: t("admin.analytics.periods.12months") },
    { key: "custom", label: t("admin.analytics.periods.custom") },
  ];

  const formatLabel = (label: string) => {
    if (effectivePeriod === "day") {
      const d = new Date(label);
      if (period === "day") return d.toLocaleDateString("pl-PL", { weekday: "short" });
      return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
    }
    if (effectivePeriod === "week") {
      const parts = label.split("-W");
      return parts.length === 2 ? `T${parts[1]}` : label;
    }
    if (effectivePeriod === "month") {
      const monthNames = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru"];
      const idx = parseInt(label.split("-")[1], 10) - 1;
      return monthNames[idx] ?? label;
    }
    return label;
  };

  const data = stepsQuery.data?.data ?? [];

  return (
    <>
      <Text style={styles.sectionTitle}>{t("company.analytics.selectEmployee")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: spacing.sm }}>
        <View style={{ flexDirection: "row", gap: spacing.x3s }}>
          {employees.map((emp) => (
            <Pressable key={emp.id} style={[styles.filterBtn, selectedEmployeeId === emp.id && styles.filterBtnActive]} onPress={() => onSelectEmployee(emp.id)}>
              <Text style={[styles.filterBtnText, selectedEmployeeId === emp.id && styles.filterBtnTextActive]}>{emp.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {selectedEmployeeId && selectedEmployee && (
        <>
          <View style={styles.analyticsUserInfo}>
            <Text style={styles.analyticsUserName}>{selectedEmployee.name}</Text>
            <Text style={styles.analyticsUserPoints}>{selectedEmployee.points} PKT</Text>
          </View>

          <View style={styles.periodSelector}>
            {PERIOD_OPTIONS.map((opt) => (
              <Pressable key={opt.key} style={[styles.periodBtn, period === opt.key && styles.periodBtnActive]} onPress={() => setPeriod(opt.key)}>
                <Text style={[styles.periodBtnText, period === opt.key && styles.periodBtnTextActive]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>

          {period === "custom" && (
            <View style={styles.customDateRow}>
              <View style={styles.customDateField}>
                <Text style={styles.customDateLabel}>{t("admin.analytics.from")}</Text>
                <TextInput style={styles.customDateInput} placeholder="RRRR-MM-DD" value={customFrom} onChangeText={setCustomFrom} placeholderTextColor={colors.inputPlaceholder} />
              </View>
              <View style={styles.customDateField}>
                <Text style={styles.customDateLabel}>{t("admin.analytics.to")}</Text>
                <TextInput style={styles.customDateInput} placeholder="RRRR-MM-DD" value={customTo} onChangeText={setCustomTo} placeholderTextColor={colors.inputPlaceholder} />
              </View>
            </View>
          )}

          <CompanyBarChart data={data.map((s) => ({ label: formatLabel(s.label), steps: s.steps }))} emptyMsg={t("company.analytics.noData")} />
        </>
      )}

      {!selectedEmployeeId && (
        <View style={styles.analyticsPlaceholder}>
          <Text style={styles.analyticsPlaceholderText}>{t("company.analytics.noEmployee")}</Text>
        </View>
      )}
    </>
  );
}

function CompanyRankingView({ employees }: { employees: { id: string; name: string; points: number }[] }) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={styles.sectionTitle}>{t("company.analytics.employeeRanking")}</Text>
      {employees.length === 0 ? (
        <EmptyState message={t("company.analytics.noEmployees")} />
      ) : (
        <View style={{ gap: spacing.x4s }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t("company.tabs.employees")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>PKT</Text>
          </View>
          {employees.map((emp, i) => (
            <View key={emp.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5, fontWeight: "700", color: colors.mossGreen }]}>{i + 1}</Text>
              <Text style={[styles.tableCell, { flex: 2, fontWeight: "600" }]}>{emp.name}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>{emp.points}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function CompanyActivityView({ activities }: { activities: { id: string; userName: string; type: string; points: number; createdAt: string }[] }) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={styles.sectionTitle}>{t("company.analytics.recentActivity")} ({activities.length})</Text>
      {activities.length === 0 ? (
        <EmptyState message={t("company.analytics.noActivity")} />
      ) : (
        <View style={{ gap: spacing.x4s }}>
          {activities.map((a) => (
            <View key={a.id} style={styles.tableRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.slate900 }}>{a.userName}</Text>
                <Text style={{ fontSize: 12, color: colors.slate500 }}>{a.type} · {new Date(a.createdAt).toLocaleDateString("pl-PL")}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.mossGreen }}>+{a.points}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
