import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import {
  fetchAuthMe,
  fetchCompanyAnalytics,
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
} from "../../../lib/api/endpoints";

import { AnalyticsTab } from "../../../features/company/tabs/AnalyticsTab";
import { ActivitiesTab } from "../../../features/company/tabs/ActivitiesTab";
import { TokensTab } from "../../../features/company/tabs/TokensTab";
import { ESGTab } from "../../../features/company/tabs/ESGTab";
import { styles } from "../../../features/company/company.styles";
import { colors } from "../../../styles/tokens";
import { useAppStore } from "../../../store/useAppStore";

type Tab = "employees" | "analytics" | "tokens" | "activities" | "esg";

const TABS: { key: Tab; label: string }[] = [
  { key: "employees", label: "Pracownicy" },
  { key: "analytics", label: "Analityka" },
  { key: "tokens", label: "Tokeny" },
  { key: "activities", label: "Aktywnosci" },
  { key: "esg", label: "ESG / Certyfikaty" },
];

export default function CompanyPanelScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const userRole = useAppStore((s) => s.userRole);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("employees");
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [editEmployeeName, setEditEmployeeName] = useState("");
  const [editEmployeeEmail, setEditEmployeeEmail] = useState("");
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);

  const authQuery = useQuery({ queryKey: ["auth", "me"], queryFn: fetchAuthMe });
  const companyQuery = useQuery({ queryKey: ["company", slug], queryFn: () => fetchCompanyBySlug(slug!), enabled: !!slug });
  const employeesQuery = useQuery({ queryKey: ["company", slug, "employees"], queryFn: () => fetchCompanyEmployees(slug!), enabled: !!slug });
  const analyticsQuery = useQuery({ queryKey: ["company", slug, "analytics"], queryFn: () => fetchCompanyAnalytics(slug!), enabled: !!slug });
  const tokensQuery = useQuery({ queryKey: ["company", slug, "tokens"], queryFn: () => fetchCompanyTokensBySlug(slug!), enabled: !!slug });
  const activitiesQuery = useQuery({ queryKey: ["company", slug, "activities"], queryFn: () => fetchCompanyActivities(companyQuery.data?.id ?? ""), enabled: !!companyQuery.data?.id });

  const generateTokenMutation = useMutation({ mutationFn: () => generateEmployerTokenBySlug(slug!), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "tokens"] }) });
  const toggleActiveMutation = useMutation({ mutationFn: toggleUserActive, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "employees"] }) });
  const editEmployeeMutation = useMutation({ mutationFn: ({ id, input }: { id: string; input: { name?: string; email?: string } }) => companyEditEmployee(slug!, id, input), onSuccess: () => { setEditEmployeeId(null); queryClient.invalidateQueries({ queryKey: ["company", slug, "employees"] }); } });
  const deleteEmployeeMutation = useMutation({ mutationFn: (id: string) => companyRemoveEmployee(slug!, id), onSuccess: () => { setDeleteEmployeeId(null); queryClient.invalidateQueries({ queryKey: ["company", slug, "employees"] }); } });
  const createActivityMutation = useMutation({ mutationFn: (input: Parameters<typeof createRewardActivity>[0]) => createRewardActivity({ ...input, companyId: companyQuery.data?.id ?? "" }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "activities"] }) });
  const deleteActivityMutation = useMutation({ mutationFn: deleteRewardActivity, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "activities"] }) });

  if (Platform.OS !== "web") {
    return (
      <View style={styles.fallbackRoot}>
        <Text style={styles.fallbackTitle}>Panel firmy</Text>
        <Text style={styles.fallbackText}>Panel firmowy jest dostepny tylko na platformie web.</Text>
      </View>
    );
  }

  if (authQuery.isPending || companyQuery.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ flex: 1 }} />;
  if (authQuery.error || companyQuery.error) return (
    <View style={styles.fallbackRoot}>
      <Text style={styles.fallbackTitle}>Blad</Text>
      <Text style={styles.fallbackText}>{authQuery.error?.message ?? companyQuery.error?.message}</Text>
    </View>
  );

  const company = companyQuery.data;
  if (!company) return null;

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/(mobile)/home")}>
          <Text style={styles.backLink}>← Powrot</Text>
        </Pressable>
        <Text style={styles.topbarTitle}>{company.name}</Text>
        <View style={styles.topbarRight}>
          <Text style={{ fontSize: 13, color: colors.slate500 }}>{userRole}</Text>
        </View>
      </View>

      <View style={styles.navTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map((t) => (
            <Pressable key={t.key} style={[styles.navTab, tab === t.key && styles.navTabActive]} onPress={() => setTab(t.key)}>
              <Text style={[styles.navTabText, tab === t.key && styles.navTabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyInner}>
        {tab === "employees" && (
          <EmployeesView
            query={employeesQuery}
            editEmployeeId={editEmployeeId}
            editEmployeeName={editEmployeeName}
            editEmployeeEmail={editEmployeeEmail}
            deleteEmployeeId={deleteEmployeeId}
            onStartEdit={(id, name, email) => { setEditEmployeeId(id); setEditEmployeeName(name); setEditEmployeeEmail(email); }}
            onCancelEdit={() => setEditEmployeeId(null)}
            onSaveEdit={() => editEmployeeMutation.mutate({ id: editEmployeeId!, input: { name: editEmployeeName, email: editEmployeeEmail } })}
            onStartDelete={setDeleteEmployeeId}
            onCancelDelete={() => setDeleteEmployeeId(null)}
            onConfirmDelete={() => deleteEmployeeMutation.mutate(deleteEmployeeId!)}
            onToggleActive={toggleActiveMutation.mutate}
            onEditNameChange={setEditEmployeeName}
            onEditEmailChange={setEditEmployeeEmail}
          />
        )}
        {tab === "analytics" && <AnalyticsTab query={analyticsQuery} slug={slug!} />}
        {tab === "tokens" && <TokensTab query={tokensQuery} onGenerate={generateTokenMutation.mutate} generating={generateTokenMutation.isPending} />}
        {tab === "activities" && <ActivitiesTab query={activitiesQuery} onCreate={(input) => createActivityMutation.mutate({ ...input, companyId: companyQuery.data?.id ?? "" })} creating={createActivityMutation.isPending} onDelete={deleteActivityMutation.mutate} deleting={deleteActivityMutation.isPending} />}
        {tab === "esg" && <ESGTab slug={slug!} employees={employeesQuery.data ?? []} />}
      </ScrollView>
    </View>
  );
}

function EmployeesView({ query, editEmployeeId, editEmployeeName, editEmployeeEmail, deleteEmployeeId, onStartEdit, onCancelEdit, onSaveEdit, onStartDelete, onCancelDelete, onConfirmDelete, onToggleActive, onEditNameChange, onEditEmailChange }: {
  query: { data?: { id: string; email: string; name: string; isActive: boolean; balance: number; stepGoal: number; createdAt: string }[]; isPending: boolean; error: Error | null };
  editEmployeeId: string | null;
  editEmployeeName: string;
  editEmployeeEmail: string;
  deleteEmployeeId: string | null;
  onStartEdit: (id: string, name: string, email: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStartDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onToggleActive: (id: string) => void;
  onEditNameChange: (v: string) => void;
  onEditEmailChange: (v: string) => void;
}) {
  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac pracownikow.</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  const employees = query.data ?? [];

  return (
    <>
      <Text style={styles.pageTitle}>Pracownicy ({employees.length})</Text>
      {employees.length === 0 ? (
        <Text style={styles.emptyText}>Brak pracownikow. Wygeneruj token i udostepnij go pracownikom.</Text>
      ) : (
        <View style={{ gap: 4 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Imie</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Email</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Balance</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>Status</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Akcje</Text>
          </View>
          {employees.map((e) => (
            <View key={e.id} style={styles.tableRow}>
              {editEmployeeId === e.id ? (
                <>
                  <TextInput style={[styles.inputSmall, { flex: 1.5 }]} value={editEmployeeName} onChangeText={onEditNameChange} placeholderTextColor={colors.inputPlaceholder} />
                  <TextInput style={[styles.inputSmall, { flex: 2 }]} value={editEmployeeEmail} onChangeText={onEditEmailChange} placeholderTextColor={colors.inputPlaceholder} autoCapitalize="none" />
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{e.balance}</Text>
                  <View style={{ flex: 0.7 }} />
                  <View style={{ flex: 1.5, flexDirection: "row", gap: 4 }}>
                    <Pressable style={[styles.actionBtn, { borderColor: colors.successBorder, backgroundColor: colors.successBg }]} onPress={onSaveEdit}>
                      <Text style={[styles.actionBtnText, { color: colors.success }]}>Zapisz</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={onCancelEdit}>
                      <Text style={styles.actionBtnText}>Anuluj</Text>
                    </Pressable>
                  </View>
                </>
              ) : deleteEmployeeId === e.id ? (
                <>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{e.name}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{e.email}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{e.balance}</Text>
                  <View style={{ flex: 0.7 }} />
                  <View style={{ flex: 1.5, flexDirection: "row", gap: 4 }}>
                    <Text style={{ fontSize: 13, color: colors.error, fontWeight: "600", alignSelf: "center" }}>Usunac?</Text>
                    <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={onConfirmDelete}>
                      <Text style={[styles.actionBtnText, { color: colors.error }]}>Tak</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={onCancelDelete}>
                      <Text style={styles.actionBtnText}>Nie</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{e.name}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{e.email}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{e.balance}</Text>
                  <View style={{ flex: 0.7 }}>
                    <View style={[styles.badge, { backgroundColor: e.isActive ? colors.successBg : colors.errorBg }]}>
                      <Text style={[styles.badgeText, { color: e.isActive ? colors.success : colors.error }]}>{e.isActive ? "Aktywny" : "Nieaktywny"}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1.5, flexDirection: "row", gap: 4 }}>
                    <Pressable style={[styles.actionBtn, { borderColor: colors.creamDark, backgroundColor: colors.inputBg }]} onPress={() => onStartEdit(e.id, e.name, e.email)}>
                      <Text style={[styles.actionBtnText, { color: colors.slate600 }]}>Edytuj</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, e.isActive ? { borderColor: colors.errorBorder, backgroundColor: colors.errorBg } : { borderColor: colors.successBorder, backgroundColor: colors.successBg }]} onPress={() => onToggleActive(e.id)}>
                      <Text style={[styles.actionBtnText, { color: e.isActive ? colors.error : colors.success }]}>{e.isActive ? "Dezaktywuj" : "Aktywuj"}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={() => onStartDelete(e.id)}>
                      <Text style={[styles.actionBtnText, { color: colors.error }]}>Usun</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          ))}
        </View>
      )}
    </>
  );
}
