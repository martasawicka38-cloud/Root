import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyEmployeeSteps } from "../../../lib/api/endpoints";
import { IconSteps, IconTrophy, IconActivity } from "../../admin/components/Icons";
import { CompanyBarChart } from "../components/CompanyBarChart";
import { styles } from "../company.styles";
import { colors } from "../../../styles/tokens";

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
  const [subTab, setSubTab] = useState<CompanyAnalyticsSubTab>("steps");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac analityki.</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  const d = query.data;
  if (!d) return null;

  const selectedEmployee = d.employees.find((e) => e.id === selectedEmployeeId);

  const SUB_TABS: { key: CompanyAnalyticsSubTab; label: string; icon: React.ReactNode }[] = [
    { key: "steps", label: "Liczba krokow", icon: <IconSteps color={subTab === "steps" ? colors.mossGreen : colors.slate500} /> },
    { key: "ranking", label: "Ranking pracownikow", icon: <IconTrophy color={subTab === "ranking" ? colors.mossGreen : colors.slate500} /> },
    { key: "activity", label: "Ostatnie aktywnosci", icon: <IconActivity color={subTab === "activity" ? colors.mossGreen : colors.slate500} /> },
  ];

  return (
    <View style={styles.analyticsLayout}>
      <View style={styles.analyticsSidebar}>
        {SUB_TABS.map((t) => (
          <Pressable key={t.key} style={[styles.analyticsSidebarItem, subTab === t.key && styles.analyticsSidebarItemActive]} onPress={() => setSubTab(t.key)}>
            <View style={styles.analyticsSidebarIcon}>{t.icon}</View>
            <Text style={[styles.analyticsSidebarLabel, subTab === t.key && styles.analyticsSidebarLabelActive]}>{t.label}</Text>
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
    { key: "day", label: "7 dni" },
    { key: "week", label: "9 tygodni" },
    { key: "month", label: "12 miesiecy" },
    { key: "custom", label: "Wlasny zakres" },
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
      <Text style={styles.sectionTitle}>Wybierz pracownika</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
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
                <Text style={styles.customDateLabel}>Od:</Text>
                <TextInput style={styles.customDateInput} placeholder="RRRR-MM-DD" value={customFrom} onChangeText={setCustomFrom} placeholderTextColor={colors.inputPlaceholder} />
              </View>
              <View style={styles.customDateField}>
                <Text style={styles.customDateLabel}>Do:</Text>
                <TextInput style={styles.customDateInput} placeholder="RRRR-MM-DD" value={customTo} onChangeText={setCustomTo} placeholderTextColor={colors.inputPlaceholder} />
              </View>
            </View>
          )}

          <CompanyBarChart data={data.map((s) => ({ label: formatLabel(s.label), steps: s.steps }))} emptyMsg="Brak danych krokow dla wybranego okresu." />
        </>
      )}

      {!selectedEmployeeId && (
        <View style={styles.analyticsPlaceholder}>
          <Text style={styles.analyticsPlaceholderText}>Wybierz pracownika, aby zobaczyc wykresy krokow.</Text>
        </View>
      )}
    </>
  );
}

function CompanyRankingView({ employees }: { employees: { id: string; name: string; points: number }[] }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Ranking pracownikow</Text>
      {employees.length === 0 ? (
        <Text style={styles.emptyText}>Brak pracownikow.</Text>
      ) : (
        <View style={{ gap: 4 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Pracownik</Text>
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
  return (
    <>
      <Text style={styles.sectionTitle}>Ostatnie aktywnosci ({activities.length})</Text>
      {activities.length === 0 ? (
        <Text style={styles.emptyText}>Brak aktywnosci.</Text>
      ) : (
        <View style={{ gap: 4 }}>
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
