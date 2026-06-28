import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

import {
  fetchAuthMe,
  fetchCompanyAnalytics,
  fetchCompanyEmployeeSteps,
  fetchCompanyBySlug,
  fetchCompanyEmployees,
  fetchCompanyTokensBySlug,
  generateEmployerTokenBySlug,
  toggleUserActive,
  companyEditEmployee,
  companyRemoveEmployee,
  createRewardActivity,
  deleteRewardActivity,
  fetchCompanyActivities,
  generateESGReport,
  fetchESGReports,
  deleteESGReport,
  updateESGReport,
  openESGReportHTML,
  downloadESGReportPDF,
  downloadESGReportDOCX,
  generateBulkCertificates,
  fetchCertificates,
  deleteCertificate,
  openCertificateHTML,
  downloadCertificatePDF,
} from "../../../lib/api/endpoints";
import type { CompanyToken, EcoActivity, ESGReportListItem, Certificate } from "../../../lib/types/api";
import { colors, radius } from "../../../styles/tokens";
import { useAppStore } from "../../../store/useAppStore";

type Tab = "employees" | "analytics" | "tokens" | "activities" | "esg";

export default function CompanyPanelScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const userRole = useAppStore((s) => s.userRole);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("employees");

  // Edit employee state
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [editEmployeeName, setEditEmployeeName] = useState("");
  const [editEmployeeEmail, setEditEmployeeEmail] = useState("");

  // Delete employee state
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);

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
      queryClient.invalidateQueries({
        queryKey: ["company", slug, "employees"],
      });
    },
  });

  const editEmployeeMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; email?: string };
    }) => companyEditEmployee(slug!, id, data),
    onSuccess: () => {
      setEditEmployeeId(null);
      setEditEmployeeName("");
      setEditEmployeeEmail("");
      queryClient.invalidateQueries({
        queryKey: ["company", slug, "employees"],
      });
    },
  });

  const removeEmployeeMutation = useMutation({
    mutationFn: (id: string) => companyRemoveEmployee(slug!, id),
    onSuccess: () => {
      setDeleteEmployeeId(null);
      queryClient.invalidateQueries({
        queryKey: ["company", slug, "employees"],
      });
    },
  });

  const companyId = companyQuery.data?.id;

  const activitiesQuery = useQuery({
    queryKey: ["company", slug, "activities"],
    queryFn: () => fetchCompanyActivities(companyId!),
    enabled: !!companyId,
  });

  const createActivityMutation = useMutation({
    mutationFn: (input: {
      name: string;
      description?: string;
      icon: string;
      category: string;
      basePoints: number;
      activityType: string;
      expiresAt?: string;
    }) => createRewardActivity({ ...input, companyId: companyId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", slug, "activities"] });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (id: string) => deleteRewardActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", slug, "activities"] });
    },
  });

  if (userRole !== "company" && userRole !== "superadmin") {
    return (
      <View style={styles.fallbackRoot}>
        <Text style={styles.fallbackTitle}>Brak dostepu</Text>
        <Text style={styles.fallbackText}>
          Tylko konto firmowe ma dostep do tego panelu.
        </Text>
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
          { key: "activities" as Tab, label: "Aktywności" },
          { key: "esg" as Tab, label: "Raporty ESG" },
        ].map((t) => (
          <Pressable
            key={t.key}
            style={[styles.navTab, tab === t.key && styles.navTabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text
              style={[
                styles.navTabText,
                tab === t.key && styles.navTabTextActive,
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body} style={{ flex: 1 }}>
        <View style={styles.bodyInner}>
          {companyQuery.data && (
            <Text style={styles.welcome}>Witaj, {companyQuery.data.name}</Text>
          )}

          {tab === "employees" && (
            <EmployeesTab
              query={employeesQuery}
              onToggleActive={(id) => toggleActiveMutation.mutate(id)}
              togglingId={
                toggleActiveMutation.isPending
                  ? toggleActiveMutation.variables
                  : null
              }
              editEmployeeId={editEmployeeId}
              editEmployeeName={editEmployeeName}
              editEmployeeEmail={editEmployeeEmail}
              onEditStart={(id, name, email) => {
                setEditEmployeeId(id);
                setEditEmployeeName(name);
                setEditEmployeeEmail(email);
              }}
              onEditCancel={() => {
                setEditEmployeeId(null);
                setEditEmployeeName("");
                setEditEmployeeEmail("");
              }}
              onEditNameChange={setEditEmployeeName}
              onEditEmailChange={setEditEmployeeEmail}
              onEditSave={() =>
                editEmployeeMutation.mutate({
                  id: editEmployeeId!,
                  data: { name: editEmployeeName, email: editEmployeeEmail },
                })
              }
              editingEmployee={editEmployeeMutation.isPending}
              deleteEmployeeId={deleteEmployeeId}
              onDeleteStart={setDeleteEmployeeId}
              onDeleteCancel={() => setDeleteEmployeeId(null)}
              onDeleteConfirm={() =>
                removeEmployeeMutation.mutate(deleteEmployeeId!)
              }
              deletingEmployee={removeEmployeeMutation.isPending}
            />
          )}
          {tab === "analytics" && <AnalyticsTab query={analyticsQuery} slug={slug!} />}
          {tab === "tokens" && (
            <TokensTab
              query={tokensQuery}
              onGenerate={() => generateTokenMutation.mutate()}
              generating={generateTokenMutation.isPending}
            />
          )}
          {tab === "activities" && (
            <ActivitiesTab
              query={activitiesQuery}
              onCreate={(input) => createActivityMutation.mutate(input)}
              creating={createActivityMutation.isPending}
              onDelete={(id) => deleteActivityMutation.mutate(id)}
              deleting={deleteActivityMutation.isPending}
            />
          )}
          {tab === "esg" && (
            <ESGTab slug={slug!} employees={employeesQuery.data ?? []} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function EmployeesTab({
  query,
  onToggleActive,
  togglingId,
  editEmployeeId,
  editEmployeeName,
  editEmployeeEmail,
  onEditStart,
  onEditCancel,
  onEditNameChange,
  onEditEmailChange,
  onEditSave,
  editingEmployee,
  deleteEmployeeId,
  onDeleteStart,
  onDeleteCancel,
  onDeleteConfirm,
  deletingEmployee,
}: {
  query: {
    data?: {
      id: string;
      name: string;
      email: string;
      isActive: boolean;
      balance: number;
    }[];
    isPending: boolean;
    error: Error | null;
  };
  onToggleActive: (id: string) => void;
  togglingId: string | null;
  editEmployeeId: string | null;
  editEmployeeName: string;
  editEmployeeEmail: string;
  onEditStart: (id: string, name: string, email: string) => void;
  onEditCancel: () => void;
  onEditNameChange: (v: string) => void;
  onEditEmailChange: (v: string) => void;
  onEditSave: () => void;
  editingEmployee: boolean;
  deleteEmployeeId: string | null;
  onDeleteStart: (id: string | null) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  deletingEmployee: boolean;
}) {
  if (query.isPending)
    return (
      <ActivityIndicator
        size="large"
        color={colors.mossGreen}
        style={{ marginTop: 48 }}
      />
    );
  if (query.error)
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorText}>
          Nie udalo sie zaladowac pracownikow.
        </Text>
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
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Akcje</Text>
      </View>
      {query.data.map((e) => (
        <View key={e.id} style={styles.tableRow}>
          {editEmployeeId === e.id ? (
            <>
              <TextInput
                style={[styles.inputSmall, { flex: 2 }]}
                value={editEmployeeName}
                onChangeText={onEditNameChange}
                placeholderTextColor={colors.inputPlaceholder}
              />
              <TextInput
                style={[styles.inputSmall, { flex: 2 }]}
                value={editEmployeeEmail}
                onChangeText={onEditEmailChange}
                placeholderTextColor={colors.inputPlaceholder}
                autoCapitalize="none"
              />
              <Text style={[styles.tableCell, { flex: 1 }]}>{e.balance}</Text>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1, gap: 4, flexDirection: "row" }}>
                <Pressable
                  style={[
                    styles.actionBtn,
                    styles.actionBtnSuccess,
                    (editingEmployee || !editEmployeeName) && { opacity: 0.5 },
                  ]}
                  onPress={onEditSave}
                  disabled={editingEmployee || !editEmployeeName}
                >
                  <Text style={[styles.actionBtnText, { color: colors.success }]}>
                    Zapisz
                  </Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={onEditCancel}>
                  <Text style={styles.actionBtnText}>Anuluj</Text>
                </Pressable>
              </View>
            </>
          ) : deleteEmployeeId === e.id ? (
            <>
              <Text style={[styles.tableCell, { flex: 2 }]}>{e.name}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{e.email}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{e.balance}</Text>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1, gap: 4, flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.error,
                    fontWeight: "600",
                    alignSelf: "center",
                  }}
                >
                  Usunac?
                </Text>
                <Pressable
                  style={[
                    styles.actionBtn,
                    styles.actionBtnWarn,
                    deletingEmployee && { opacity: 0.5 },
                  ]}
                  onPress={onDeleteConfirm}
                  disabled={deletingEmployee}
                >
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>
                    {deletingEmployee ? "Usuwanie..." : "Tak"}
                  </Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={onDeleteCancel}>
                  <Text style={styles.actionBtnText}>Nie</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.tableCell, { flex: 2 }]}>{e.name}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{e.email}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{e.balance}</Text>
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: e.isActive ? colors.successBg : colors.errorBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: e.isActive ? colors.success : colors.error },
                    ]}
                  >
                    {e.isActive ? "Aktywny" : "Nieaktywny"}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1, gap: 4, flexDirection: "row" }}>
                <Pressable
                  style={[
                    styles.actionBtn,
                    { borderColor: colors.creamDark, backgroundColor: colors.inputBg },
                  ]}
                  onPress={() => onEditStart(e.id, e.name, e.email)}
                >
                  <Text
                    style={[styles.actionBtnText, { color: colors.slate600 }]}
                  >
                    Edytuj
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionBtn,
                    {
                      borderColor: e.isActive ? colors.errorBorder : colors.successBorder,
                      backgroundColor: e.isActive ? colors.errorBg : colors.successBg,
                    },
                    togglingId === e.id && { opacity: 0.5 },
                  ]}
                  onPress={() => onToggleActive(e.id)}
                  disabled={togglingId === e.id}
                >
                  <Text
                    style={[
                      styles.actionBtnText,
                      { color: e.isActive ? colors.error : colors.success },
                    ]}
                  >
                    {e.isActive ? "Dezaktywuj" : "Aktywuj"}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionBtn,
                    { borderColor: colors.errorBorder, backgroundColor: colors.errorBg },
                  ]}
                  onPress={() => onDeleteStart(e.id)}
                >
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>
                    Usun
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      ))}
    </>
  );
}

type CompanyAnalyticsSubTab = "steps" | "ranking" | "activity";

function IconSteps({ size = 18, color = "#535A3E" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="12" width="4" height="9" rx="1" fill={color} />
      <Rect x="10" y="7" width="4" height="14" rx="1" fill={color} />
      <Rect x="17" y="3" width="4" height="18" rx="1" fill={color} />
    </Svg>
  );
}

function IconTrophy({ size = 18, color = "#535A3E" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2h12v6a6 6 0 01-12 0V2z" fill={color} />
      <Path d="M6 4H3a1 1 0 00-1 1v2a4 4 0 004 4h0" stroke={color} strokeWidth="1.5" fill="none" />
      <Path d="M18 4h3a1 1 0 011 1v2a4 4 0 01-4 4h0" stroke={color} strokeWidth="1.5" fill="none" />
      <Path d="M10 18h4v2h-4z" fill={color} />
      <Path d="M8 20h8v2H8z" fill={color} />
    </Svg>
  );
}

function IconActivity({ size = 18, color = "#535A3E" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={color} />
    </Svg>
  );
}

function AnalyticsTab({
  query,
  slug,
}: {
  query: {
    data?:
      | {
          employees: { id: string; name: string; points: number }[];
          totalActivities: number;
          totalSteps: number;
          totalDeclarations: number;
          totalEarned: number;
          totalPoints: number;
          weeklySteps: { day: string; steps: number }[];
          weeklySteps9: { label: string; steps: number }[];
          monthlySteps12: { label: string; steps: number }[];
          recentActivity: {
            id: string;
            userName: string;
            type: string;
            points: number;
            createdAt: string;
          }[];
        }
      | undefined;
    isPending: boolean;
    error: Error | null;
  };
  slug: string;
}) {
  const [subTab, setSubTab] = useState<CompanyAnalyticsSubTab>("steps");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  if (query.isPending)
    return (
      <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />
    );
  if (query.error)
    return (
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
          <Pressable
            key={t.key}
            style={[styles.analyticsSidebarItem, subTab === t.key && styles.analyticsSidebarItemActive]}
            onPress={() => setSubTab(t.key)}
          >
            <View style={styles.analyticsSidebarIcon}>{t.icon}</View>
            <Text style={[styles.analyticsSidebarLabel, subTab === t.key && styles.analyticsSidebarLabelActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.analyticsMain}>
        <View style={{ minHeight: 500 }}>
          {subTab === "steps" && (
            <CompanyStepsView
              employees={d.employees}
              selectedEmployeeId={selectedEmployeeId}
              selectedEmployee={selectedEmployee}
              onSelectEmployee={setSelectedEmployeeId}
              slug={slug}
            />
          )}

          {subTab === "ranking" && (
            <CompanyRankingView employees={d.employees} />
          )}

          {subTab === "activity" && (
            <CompanyActivityView activities={d.recentActivity} />
          )}
        </View>
      </View>
    </View>
  );
}

type StepsPeriod = "day" | "week" | "month" | "custom";

function CompanyStepsView({
  employees, selectedEmployeeId, selectedEmployee, onSelectEmployee, slug,
}: {
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
            <Pressable
              key={emp.id}
              style={[styles.filterBtn, selectedEmployeeId === emp.id && styles.filterBtnActive]}
              onPress={() => onSelectEmployee(emp.id)}
            >
              <Text style={[styles.filterBtnText, selectedEmployeeId === emp.id && styles.filterBtnTextActive]}>
                {emp.name}
              </Text>
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
              <Pressable
                key={opt.key}
                style={[styles.periodBtn, period === opt.key && styles.periodBtnActive]}
                onPress={() => setPeriod(opt.key)}
              >
                <Text style={[styles.periodBtnText, period === opt.key && styles.periodBtnTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {period === "custom" && (
            <View style={styles.customDateRow}>
              <View style={styles.customDateField}>
                <Text style={styles.customDateLabel}>Od:</Text>
                <TextInput
                  style={styles.customDateInput}
                  placeholder="RRRR-MM-DD"
                  value={customFrom}
                  onChangeText={setCustomFrom}
                  placeholderTextColor={colors.inputPlaceholder}
                />
              </View>
              <View style={styles.customDateField}>
                <Text style={styles.customDateLabel}>Do:</Text>
                <TextInput
                  style={styles.customDateInput}
                  placeholder="RRRR-MM-DD"
                  value={customTo}
                  onChangeText={setCustomTo}
                  placeholderTextColor={colors.inputPlaceholder}
                />
              </View>
            </View>
          )}

          <CompanyBarChart
            data={data.map((s) => ({ label: formatLabel(s.label), steps: s.steps }))}
            emptyMsg="Brak danych krokow dla wybranego okresu."
          />
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

function CompanyRankingView({ employees }: {
  employees: { id: string; name: string; points: number }[];
}) {
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

function CompanyActivityView({ activities }: {
  activities: { id: string; userName: string; type: string; points: number; createdAt: string }[];
}) {
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
                <Text style={{ fontSize: 12, color: colors.slate500 }}>
                  {a.type} · {new Date(a.createdAt).toLocaleDateString("pl-PL")}
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.mossGreen }}>+{a.points}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}


function CompanyBarChart({ data, emptyMsg }: {
  data: { label: string; steps: number }[];
  emptyMsg: string;
}) {
  if (data.length === 0) return (
    <View style={styles.chartCard}>
      <Text style={{ fontSize: 14, color: colors.slate500, textAlign: "center", padding: 20 }}>{emptyMsg}</Text>
    </View>
  );

  const max = Math.max(...data.map((d) => d.steps), 1);
  const total = data.reduce((sum, d) => sum + d.steps, 0);
  const avg = Math.round(total / data.length);

  return (
    <View style={styles.chartCard}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-start", marginBottom: 16 }}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.mossGreen }}>{total.toLocaleString("pl-PL")}</Text>
            <Text style={{ fontSize: 11, color: colors.slate500 }}>Suma</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.mossGreen }}>{avg.toLocaleString("pl-PL")}</Text>
            <Text style={{ fontSize: 11, color: colors.slate500 }}>Srednia</Text>
          </View>
        </View>
      </View>
      <View style={styles.chartRow}>
        {data.map((d, i) => (
          <View key={`${d.label}-${i}`} style={styles.chartCol}>
            <Text style={styles.chartBarValue}>{d.steps > 0 ? d.steps.toLocaleString("pl-PL") : ""}</Text>
            <View style={[styles.chartBar, { height: Math.max((d.steps / max) * 140, 4) }]} />
            <Text style={styles.chartLabel}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ActivitiesTab({
  query,
  onCreate,
  creating,
  onDelete,
  deleting,
}: {
  query: { data?: EcoActivity[]; isPending: boolean; error: Error | null };
  onCreate: (input: {
    name: string;
    description?: string;
    icon: string;
    category: string;
    basePoints: number;
    activityType: string;
    expiresAt?: string;
  }) => void;
  creating: boolean;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("leaf");
  const [category, setCategory] = useState("MOBILITY");
  const [basePoints, setBasePoints] = useState("10");
  const [activityType, setActivityType] = useState<"one_time" | "cyclical">("cyclical");
  const [expiresAt, setExpiresAt] = useState("");

  if (query.isPending)
    return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error)
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorText}>Nie udalo sie zaladowac aktywnosci.</Text>
        <Text style={styles.errorDetail}>{query.error.message}</Text>
      </View>
    );

  const activities = query.data ?? [];

  const handleCreate = () => {
    if (!name || !basePoints) return;
    onCreate({
      name,
      description: description || undefined,
      icon,
      category,
      basePoints: parseInt(basePoints, 10),
      activityType,
      expiresAt: activityType === "cyclical" && expiresAt ? expiresAt : undefined,
    });
    setName("");
    setDescription("");
    setBasePoints("10");
    setActivityType("cyclical");
    setExpiresAt("");
    setShowForm(false);
  };

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>Aktywnosci pracownikow ({activities.length})</Text>
        <Pressable style={[styles.genBigBtn, showForm && { opacity: 0.7 }]} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.genBigBtnText}>{showForm ? "Anuluj" : "Dodaj aktywnosc"}</Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: 16, gap: 10, marginBottom: 16 }}>
          <TextInput style={styles.inputSmall} placeholder="Nazwa aktywnosci" value={name} onChangeText={setName} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder="Opis (opcjonalny)" value={description} onChangeText={setDescription} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder="Ikona (np. leaf, bike, run)" value={icon} onChangeText={setIcon} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder="Punkty bazowe" value={basePoints} onChangeText={setBasePoints} keyboardType="numeric" placeholderTextColor={colors.inputPlaceholder} />

          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.olive }}>Kategoria:</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {["MOBILITY", "CIRCULARITY", "LOCAL_CONSUMPTION", "NATURE_ACTIVITY"].map((c) => (
              <Pressable
                key={c}
                style={[styles.actionBtn, category === c && { backgroundColor: colors.greenDark, borderColor: colors.greenDark }]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.actionBtnText, category === c && { color: colors.creamLight }]}>
                  {{ MOBILITY: "Mobilnosc", CIRCULARITY: "Cykularnosc", LOCAL_CONSUMPTION: "Lokalne", NATURE_ACTIVITY: "Natura" }[c]}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.olive }}>Typ aktywnosci:</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              style={[styles.actionBtn, activityType === "one_time" && { backgroundColor: colors.greenDark, borderColor: colors.greenDark }]}
              onPress={() => setActivityType("one_time")}
            >
              <Text style={[styles.actionBtnText, activityType === "one_time" && { color: colors.creamLight }]}>Jednorazowa</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, activityType === "cyclical" && { backgroundColor: colors.greenDark, borderColor: colors.greenDark }]}
              onPress={() => setActivityType("cyclical")}
            >
              <Text style={[styles.actionBtnText, activityType === "cyclical" && { color: colors.creamLight }]}>Cykliczna (raz dziennie)</Text>
            </Pressable>
          </View>

          {activityType === "cyclical" && (
            <TextInput style={styles.inputSmall} placeholder="Data zakonczenia (RRRR-MM-DD)" value={expiresAt} onChangeText={setExpiresAt} placeholderTextColor={colors.inputPlaceholder} />
          )}

          <Pressable style={[styles.genBigBtn, (!name || !basePoints || creating) && { opacity: 0.5 }]} onPress={handleCreate} disabled={!name || !basePoints || creating}>
            <Text style={styles.genBigBtnText}>{creating ? "Tworzenie..." : "Utworz aktywnosc"}</Text>
          </Pressable>
        </View>
      )}

      {activities.length === 0 ? (
        <Text style={styles.emptyText}>Brak aktywnosci. Kliknij Dodaj aktywnosc, aby utworzyc pierwsza.</Text>
      ) : (
        <View style={{ gap: 4 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Nazwa</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Typ</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Punkty</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Wygasa</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>Akcje</Text>
          </View>
          {activities.map((a) => (
            <View key={a.id} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.tableCell, { fontWeight: "600" }]}>{a.name}</Text>
                {a.description && <Text style={{ fontSize: 12, color: colors.olive }}>{a.description}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={[styles.badge, { backgroundColor: a.activityType === "one_time" ? colors.creamMedium : colors.successBg }]}>
                  <Text style={[styles.badgeText, { color: a.activityType === "one_time" ? colors.warning : colors.success }]}>
                    {a.activityType === "one_time" ? "Jednorazowa" : "Cykliczna"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.tableCell, { flex: 1 }]}>{a.basePoints} pkt</Text>
              <Text style={[styles.tableCell, { flex: 1, fontSize: 12 }]}>
                {a.expiresAt ? new Date(a.expiresAt).toLocaleDateString("pl-PL") : "-"}
              </Text>
              <View style={{ flex: 0.7 }}>
                <Pressable
                  style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }, deleting && { opacity: 0.5 }]}
                  onPress={() => onDelete(a.id)}
                  disabled={deleting}
                >
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>Usun</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function TokensTab({
  query,
  onGenerate,
  generating,
}: {
  query: { data?: CompanyToken[]; isPending: boolean; error: Error | null };
  onGenerate: () => void;
  generating: boolean;
}) {
  if (query.isPending)
    return (
      <ActivityIndicator
        size="large"
        color={colors.mossGreen}
        style={{ marginTop: 48 }}
      />
    );
  if (query.error)
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorText}>Nie udalo sie zaladowac tokenow.</Text>
        <Text style={styles.errorDetail}>{query.error.message}</Text>
      </View>
    );

  const tokens = query.data ?? [];

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={styles.pageTitle}>Tokeny ({tokens.length})</Text>
        <Pressable
          style={[styles.genBigBtn, generating && { opacity: 0.5 }]}
          onPress={onGenerate}
          disabled={generating}
        >
          <Text style={styles.genBigBtnText}>
            {generating ? "Generowanie..." : "Generuj token"}
          </Text>
        </Pressable>
      </View>

      {tokens.length === 0 ? (
        <Text style={styles.emptyText}>
          Brak tokenow. Kliknij Generuj token, aby utworzyc pierwszy.
        </Text>
      ) : (
        <View style={styles.tokenListFull}>
          <View style={styles.tokenTableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Kod</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
              Utworzono
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
              Uzyty przez
            </Text>
          </View>
          {tokens.map((t) => (
            <View key={t.id} style={styles.tokenTableRow}>
              <Text
                style={[
                  styles.tokenCell,
                  { flex: 2, fontFamily: "monospace", fontWeight: "700" },
                ]}
              >
                {t.token}
              </Text>
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: t.used ? colors.errorBg : colors.successBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: t.used ? colors.error : colors.success },
                    ]}
                  >
                    {t.used ? "Uzyty" : "Aktywny"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.tokenCell, { flex: 1.5 }]}>
                {new Date(t.createdAt).toLocaleString()}
              </Text>
              <Text style={[styles.tokenCell, { flex: 1 }]}>
                {t.usedBy ?? "-"}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

// ── ESG Tab ──────────────────────────────────────────────────────────

function ESGTab({ slug, employees }: {
  slug: string;
  employees: { id: string; name: string; email: string; isActive: boolean; balance: number }[];
}) {
  const queryClient = useQueryClient();
  const [esgSubTab, setEsgSubTab] = useState<"reports" | "certificates">("reports");

  const reportsQuery = useQuery({
    queryKey: ["company", slug, "esg-reports"],
    queryFn: () => fetchESGReports(slug),
    enabled: !!slug,
  });

  const certsQuery = useQuery({
    queryKey: ["company", slug, "certificates"],
    queryFn: () => fetchCertificates(slug),
    enabled: !!slug,
  });

  const deleteReportMutation = useMutation({
    mutationFn: (reportId: string) => deleteESGReport(slug, reportId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "esg-reports"] }),
  });

  const publishReportMutation = useMutation({
    mutationFn: (reportId: string) => updateESGReport(slug, reportId, { status: "published" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "esg-reports"] }),
  });

  const deleteCertMutation = useMutation({
    mutationFn: (certId: string) => deleteCertificate(slug, certId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "certificates"] }),
  });

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <Pressable
          style={[styles.filterBtn, esgSubTab === "reports" && styles.filterBtnActive]}
          onPress={() => setEsgSubTab("reports")}
        >
          <Text style={[styles.filterBtnText, esgSubTab === "reports" && styles.filterBtnTextActive]}>
            Raporty ESG
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterBtn, esgSubTab === "certificates" && styles.filterBtnActive]}
          onPress={() => setEsgSubTab("certificates")}
        >
          <Text style={[styles.filterBtnText, esgSubTab === "certificates" && styles.filterBtnTextActive]}>
            Certyfikaty
          </Text>
        </Pressable>
      </View>

      {esgSubTab === "reports" && (
        <ESGReportsSubTab
          slug={slug}
          query={reportsQuery}
          onDelete={(id) => deleteReportMutation.mutate(id)}
          onPublish={(id) => publishReportMutation.mutate(id)}
        />
      )}

      {esgSubTab === "certificates" && (
        <CertificatesSubTab
          slug={slug}
          employees={employees}
          query={certsQuery}
          onDelete={(id) => deleteCertMutation.mutate(id)}
        />
      )}
    </View>
  );
}

function ESGReportsSubTab({ slug, query, onDelete, onPublish }: {
  slug: string;
  query: { data?: ESGReportListItem[]; isPending: boolean; error: Error | null };
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");

  const createMutation = useMutation({
    mutationFn: () => generateESGReport(slug, { title, description: description || undefined, periodFrom, periodTo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", slug, "esg-reports"] });
      setTitle("");
      setDescription("");
      setPeriodFrom("");
      setPeriodTo("");
      setShowForm(false);
    },
  });

  if (query.isPending)
    return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error)
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorText}>Nie udalo sie zaladowac raportow.</Text>
        <Text style={styles.errorDetail}>{query.error.message}</Text>
      </View>
    );

  const reports = query.data ?? [];

  const statusLabel = (s: string) => {
    if (s === "published") return "Opublikowany";
    if (s === "archived") return "Zarchiwizowany";
    return "Szkic";
  };

  const statusColor = (s: string) => {
    if (s === "published") return colors.success;
    if (s === "archived") return colors.slate500;
    return colors.warning;
  };

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>Raporty ESG ({reports.length})</Text>
        <Pressable style={[styles.genBigBtn, showForm && { opacity: 0.7 }]} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.genBigBtnText}>{showForm ? "Anuluj" : "Nowy raport"}</Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: 16, gap: 10, marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.slate900, marginBottom: 4 }}>Generuj raport ESG (CSRD/ESRS)</Text>
          <TextInput style={styles.inputSmall} placeholder="Tytul raportu" value={title} onChangeText={setTitle} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder="Opis (opcjonalny)" value={description} onChangeText={setDescription} placeholderTextColor={colors.inputPlaceholder} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate700, marginBottom: 4 }}>Od:</Text>
              <TextInput style={styles.inputSmall} placeholder="RRRR-MM-DD" value={periodFrom} onChangeText={setPeriodFrom} placeholderTextColor={colors.inputPlaceholder} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate700, marginBottom: 4 }}>Do:</Text>
              <TextInput style={styles.inputSmall} placeholder="RRRR-MM-DD" value={periodTo} onChangeText={setPeriodTo} placeholderTextColor={colors.inputPlaceholder} />
            </View>
          </View>
          <Pressable
            style={[styles.genBigBtn, (!title || !periodFrom || !periodTo || createMutation.isPending) && { opacity: 0.5 }]}
            onPress={() => createMutation.mutate()}
            disabled={!title || !periodFrom || !periodTo || createMutation.isPending}
          >
            <Text style={styles.genBigBtnText}>{createMutation.isPending ? "Generowanie..." : "Generuj raport"}</Text>
          </Pressable>
        </View>
      )}

      {reports.length === 0 ? (
        <Text style={styles.emptyText}>Brak raportow ESG. Kliknij "Nowy raport", aby wygenerowac pierwszy.</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {reports.map((r) => (
            <View key={r.id} style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.slate900 }}>{r.title}</Text>
                  {r.description && <Text style={{ fontSize: 13, color: colors.slate500, marginTop: 2 }}>{r.description}</Text>}
                </View>
                <View style={[styles.badge, { backgroundColor: r.status === "published" ? colors.successBg : r.status === "archived" ? colors.slate100 : colors.creamMedium }]}>
                  <Text style={[styles.badgeText, { color: statusColor(r.status) }]}>{statusLabel(r.status)}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: colors.slate500, marginBottom: 12 }}>
                Okres: {new Date(r.periodFrom).toLocaleDateString("pl-PL")} – {new Date(r.periodTo).toLocaleDateString("pl-PL")} | Wygenerowano: {new Date(r.generatedAt).toLocaleDateString("pl-PL")}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <Pressable style={[styles.actionBtn, { borderColor: colors.mossGreen, backgroundColor: colors.successBg }]} onPress={() => openESGReportHTML(slug, r.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.mossGreen }]}>Podglad HTML</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: colors.accentBlue, backgroundColor: "#e0f2fe" }]} onPress={() => downloadESGReportPDF(slug, r.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.accentBlue }]}>Pobierz PDF</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: "#8b5cf6", backgroundColor: "#ede9fe" }]} onPress={() => downloadESGReportDOCX(slug, r.id)}>
                  <Text style={[styles.actionBtnText, { color: "#8b5cf6" }]}>Pobierz DOCX</Text>
                </Pressable>
                {r.status === "draft" && (
                  <Pressable style={[styles.actionBtn, { borderColor: colors.successBorder, backgroundColor: colors.successBg }]} onPress={() => onPublish(r.id)}>
                    <Text style={[styles.actionBtnText, { color: colors.success }]}>Opublikuj</Text>
                  </Pressable>
                )}
                <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={() => onDelete(r.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>Usun</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function CertificatesSubTab({ slug, employees, query, onDelete }: {
  slug: string;
  employees: { id: string; name: string; email: string; isActive: boolean; balance: number }[];
  query: { data?: Certificate[]; isPending: boolean; error: Error | null };
  onDelete: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certDescription, setCertDescription] = useState("");
  const [certType, setCertType] = useState<"participation" | "achievement" | "completion">("participation");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const createBulkMutation = useMutation({
    mutationFn: () => generateBulkCertificates(slug, { userIds: selectedUserIds, type: certType, title: certTitle, description: certDescription || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", slug, "certificates"] });
      setCertTitle("");
      setCertDescription("");
      setCertType("participation");
      setSelectedUserIds([]);
      setShowForm(false);
    },
  });

  if (query.isPending)
    return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error)
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorText}>Nie udalo sie zaladowac certyfikatow.</Text>
        <Text style={styles.errorDetail}>{query.error.message}</Text>
      </View>
    );

  const certs = query.data ?? [];

  const typeLabels = { participation: "Uczestnictwo", achievement: "Osiagniecie", completion: "Ukonczenie" };
  const typeColors = { participation: colors.mossGreen, achievement: colors.accentBlue, completion: "#8b5cf6" };

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>Certyfikaty ({certs.length})</Text>
        <Pressable style={[styles.genBigBtn, showForm && { opacity: 0.7 }]} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.genBigBtnText}>{showForm ? "Anuluj" : "Generuj certyfikaty"}</Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: 16, gap: 10, marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.slate900, marginBottom: 4 }}>Generuj certyfikaty dla pracownikow</Text>
          <TextInput style={styles.inputSmall} placeholder="Tytul certyfikatu" value={certTitle} onChangeText={setCertTitle} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder="Opis (opcjonalny)" value={certDescription} onChangeText={setCertDescription} placeholderTextColor={colors.inputPlaceholder} />

          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate700 }}>Typ certyfikatu:</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["participation", "achievement", "completion"] as const).map((t) => (
              <Pressable
                key={t}
                style={[styles.actionBtn, certType === t && { backgroundColor: typeColors[t], borderColor: typeColors[t] }]}
                onPress={() => setCertType(t)}
              >
                <Text style={[styles.actionBtnText, certType === t && { color: colors.white }]}>{typeLabels[t]}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate700 }}>Wybierz pracownikow:</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Pressable
              style={[styles.filterBtn, selectedUserIds.length === employees.length && styles.filterBtnActive]}
              onPress={() => setSelectedUserIds(selectedUserIds.length === employees.length ? [] : employees.map((e) => e.id))}
            >
              <Text style={[styles.filterBtnText, selectedUserIds.length === employees.length && styles.filterBtnTextActive]}>
                {selectedUserIds.length === employees.length ? "Odznacz wszystkich" : "Zaznacz wszystkich"}
              </Text>
            </Pressable>
            {employees.map((e) => (
              <Pressable
                key={e.id}
                style={[styles.filterBtn, selectedUserIds.includes(e.id) && styles.filterBtnActive]}
                onPress={() => toggleUser(e.id)}
              >
                <Text style={[styles.filterBtnText, selectedUserIds.includes(e.id) && styles.filterBtnTextActive]}>{e.name}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.genBigBtn, (!certTitle || selectedUserIds.length === 0 || createBulkMutation.isPending) && { opacity: 0.5 }]}
            onPress={() => createBulkMutation.mutate()}
            disabled={!certTitle || selectedUserIds.length === 0 || createBulkMutation.isPending}
          >
            <Text style={styles.genBigBtnText}>
              {createBulkMutation.isPending ? "Generowanie..." : `Generuj ${selectedUserIds.length} certyfikatow`}
            </Text>
          </Pressable>
        </View>
      )}

      {certs.length === 0 ? (
        <Text style={styles.emptyText}>Brak certyfikatow. Kliknij "Generuj certyfikaty", aby utworzyc pierwsze.</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {certs.map((c) => (
            <View key={c.id} style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.slate900 }}>{c.title}</Text>
                  <Text style={{ fontSize: 13, color: colors.slate500, marginTop: 2 }}>
                    Dla: {c.user?.name ?? "Nieznany"} ({c.user?.email ?? ""})
                  </Text>
                  {c.description && <Text style={{ fontSize: 13, color: colors.slate500, marginTop: 2 }}>{c.description}</Text>}
                </View>
                <View style={[styles.badge, { backgroundColor: typeColors[c.type] + "20" }]}>
                  <Text style={[styles.badgeText, { color: typeColors[c.type] }]}>{typeLabels[c.type]}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: colors.slate500, marginBottom: 12 }}>
                Wystawiono: {new Date(c.issuedAt).toLocaleDateString("pl-PL")}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable style={[styles.actionBtn, { borderColor: colors.mossGreen, backgroundColor: colors.successBg }]} onPress={() => openCertificateHTML(slug, c.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.mossGreen }]}>Podglad HTML</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: colors.accentBlue, backgroundColor: "#e0f2fe" }]} onPress={() => downloadCertificatePDF(slug, c.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.accentBlue }]}>Pobierz PDF</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={() => onDelete(c.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>Usun</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  fallbackRoot: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.slate900,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 15,
    color: colors.slate500,
    textAlign: "center",
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate200,
  },
  topbarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
  },
  topbarRight: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  backLink: {
    fontSize: 14,
    color: colors.mossGreen,
    fontWeight: "600",
  },
  navTabs: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate200,
    paddingHorizontal: 16,
  },
  navTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  navTabActive: {
    borderBottomColor: colors.mossGreen,
  },
  navTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.slate500,
  },
  navTabTextActive: {
    color: colors.mossGreen,
  },
  body: {
    padding: 24,
  },
  bodyInner: {
    maxWidth: 960,
    width: "100%",
    alignSelf: "center",
  },
  welcome: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.slate500,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.slate700,
    marginBottom: 8,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.slate500,
    textAlign: "center",
    marginTop: 24,
  },
  errorCard: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: radius.sm,
    padding: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.error,
  },
  errorDetail: {
    fontSize: 13,
    color: colors.error,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.slate500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  tableCell: {
    fontSize: 14,
    color: colors.slate900,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate700,
  },
  actionBtnSuccess: {
    borderColor: colors.successBorder,
    backgroundColor: colors.successBg,
  },
  actionBtnWarn: {
    borderColor: colors.errorBorder,
    backgroundColor: colors.errorBg,
  },
  inputSmall: {
    fontSize: 13,
    color: colors.slate900,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  statCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    padding: 16,
    minWidth: 120,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.mossGreen,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate500,
    marginTop: 4,
  },
  genBigBtn: {
    backgroundColor: colors.mossGreen,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  genBigBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  tokenCell: {
    fontSize: 13,
    color: colors.slate900,
  },
  tokenListFull: {
    gap: 4,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 24,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
  },
  chartRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-end",
    minHeight: 180,
  },
  chartCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  chartBarValue: {
    fontSize: 10,
    color: colors.slate500,
    fontWeight: "600",
  },
  chartBar: {
    width: "100%",
    maxWidth: 48,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.sm,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: colors.slate500,
  },
  analyticsUserInfo: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  analyticsUserName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
  },
  analyticsUserPoints: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mossGreen,
  },
  analyticsPlaceholder: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    padding: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  analyticsPlaceholderText: {
    fontSize: 15,
    color: colors.slate500,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
  },
  filterBtnActive: {
    backgroundColor: colors.mossGreen,
    borderColor: colors.mossGreen,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate600,
  },
  filterBtnTextActive: {
    color: colors.white,
  },
  analyticsLayout: { flexDirection: "row", gap: 24, minHeight: 600 },
  analyticsSidebar: { width: 220, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 16, alignSelf: "flex-start" },
  analyticsSidebarItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: radius.sm, marginBottom: 4 },
  analyticsSidebarItemActive: { backgroundColor: colors.slate100 },
  analyticsSidebarIcon: { width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  analyticsSidebarLabel: { fontSize: 14, fontWeight: "500", color: colors.slate600 },
  analyticsSidebarLabelActive: { color: colors.mossGreen, fontWeight: "700" },
  analyticsMain: { flex: 1 },
  periodSelector: { flexDirection: "row", gap: 8, marginBottom: 16 },
  periodBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.slate200, backgroundColor: colors.white },
  periodBtnActive: { backgroundColor: colors.mossGreen, borderColor: colors.mossGreen },
  periodBtnText: { fontSize: 13, fontWeight: "600", color: colors.slate600 },
  periodBtnTextActive: { color: colors.white },
  customDateRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  customDateField: { flex: 1 },
  customDateLabel: { fontSize: 13, fontWeight: "600", color: colors.slate700, marginBottom: 4 },
  customDateInput: { borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, padding: 10, fontSize: 14, color: colors.slate900, backgroundColor: colors.white },
  tokenTableHeader: {
    flexDirection: "row",
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  tokenTableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
});
