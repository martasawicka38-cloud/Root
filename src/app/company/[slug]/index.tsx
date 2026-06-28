import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

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
import { EmptyState } from "../../../components/shared/EmptyState";
import { ErrorCard } from "../../../components/shared/ErrorCard";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { styles } from "../../../features/company/company.styles";
import { colors, spacing } from "../../../styles/tokens";
import { LoadingState } from "../../../components/shared/LoadingState";
import { useAppStore } from "../../../store/useAppStore";

type Tab = "employees" | "analytics" | "tokens" | "activities" | "esg";

const TABS: { key: Tab; labelKey: string }[] = [
  { key: "employees", labelKey: "company.tabs.employees" },
  { key: "analytics", labelKey: "company.tabs.analytics" },
  { key: "tokens", labelKey: "company.tabs.tokens" },
  { key: "activities", labelKey: "company.tabs.activities" },
  { key: "esg", labelKey: "company.tabs.esg" },
];

export default function CompanyPanelScreen() {
  const { t } = useTranslation();
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
        <Text style={styles.fallbackTitle}>{t("company.title")}</Text>
        <Text style={styles.fallbackText}>{t("company.webOnly")}</Text>
      </View>
    );
  }

  if (authQuery.isPending || companyQuery.isPending) return <LoadingState />;
  if (authQuery.error || companyQuery.error) return (
    <View style={styles.fallbackRoot}>
      <Text style={styles.fallbackTitle}>{t("common.error")}</Text>
      <Text style={styles.fallbackText}>{authQuery.error?.message ?? companyQuery.error?.message}</Text>
    </View>
  );

  const company = companyQuery.data;
  if (!company) return null;

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/(mobile)/home")}>
          <Text style={styles.backLink}>← {t("common.back")}</Text>
        </Pressable>
        <Text style={styles.topbarTitle}>{company.name}</Text>
        <View style={styles.topbarRight}>
          <Text style={{ fontSize: 13, color: colors.slate500 }}>{userRole}</Text>
        </View>
      </View>

      <View style={styles.navTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map((tabItem) => (
            <Pressable key={tabItem.key} style={[styles.navTab, tab === tabItem.key && styles.navTabActive]} onPress={() => setTab(tabItem.key)}>
              <Text style={[styles.navTabText, tab === tabItem.key && styles.navTabTextActive]}>{t(tabItem.labelKey)}</Text>
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
  const { t } = useTranslation();

  if (query.isPending) return <LoadingState />;
  if (query.error) return <ErrorCard title={t("common.errorLoading")} error={query.error} />;

  const employees = query.data ?? [];

  return (
    <>
      <Text style={styles.pageTitle}>{t("company.employees.title")} ({employees.length})</Text>
      {employees.length === 0 ? (
        <EmptyState message={t("company.employees.noEmployees")} />
      ) : (
        <View style={{ gap: spacing.x4s }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>{t("company.employees.table.name")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t("company.employees.table.email")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>{t("company.employees.table.balance")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>{t("company.employees.table.status")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>{t("common.actions")}</Text>
          </View>
          {employees.map((e) => (
            <View key={e.id} style={styles.tableRow}>
              {editEmployeeId === e.id ? (
                <>
                  <TextInput style={[styles.inputSmall, { flex: 1.5 }]} value={editEmployeeName} onChangeText={onEditNameChange} placeholderTextColor={colors.inputPlaceholder} />
                  <TextInput style={[styles.inputSmall, { flex: 2 }]} value={editEmployeeEmail} onChangeText={onEditEmailChange} placeholderTextColor={colors.inputPlaceholder} autoCapitalize="none" />
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{e.balance}</Text>
                  <View style={{ flex: 0.7 }} />
                  <View style={{ flex: 1.5, flexDirection: "row", gap: spacing.x4s }}>
                    <Pressable style={[styles.actionBtn, { borderColor: colors.successBorder, backgroundColor: colors.successBg }]} onPress={onSaveEdit}>
                      <Text style={[styles.actionBtnText, { color: colors.success }]}>{t("common.save")}</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={onCancelEdit}>
                      <Text style={styles.actionBtnText}>{t("common.cancel")}</Text>
                    </Pressable>
                  </View>
                </>
              ) : deleteEmployeeId === e.id ? (
                <>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{e.name}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{e.email}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{e.balance}</Text>
                  <View style={{ flex: 0.7 }} />
                  <View style={{ flex: 1.5, flexDirection: "row", gap: spacing.x4s }}>
                    <ConfirmDialog onConfirm={onConfirmDelete} onCancel={onCancelDelete} />
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{e.name}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{e.email}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{e.balance}</Text>
                  <View style={{ flex: 0.7 }}>
                    <StatusBadge type={e.isActive ? "active" : "inactive"} />
                  </View>
                  <View style={{ flex: 1.5, flexDirection: "row", gap: spacing.x4s }}>
                    <Pressable style={[styles.actionBtn, { borderColor: colors.creamDark, backgroundColor: colors.inputBg }]} onPress={() => onStartEdit(e.id, e.name, e.email)}>
                      <Text style={[styles.actionBtnText, { color: colors.slate600 }]}>{t("common.edit")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, e.isActive ? { borderColor: colors.errorBorder, backgroundColor: colors.errorBg } : { borderColor: colors.successBorder, backgroundColor: colors.successBg }]} onPress={() => onToggleActive(e.id)}>
                      <Text style={[styles.actionBtnText, { color: e.isActive ? colors.error : colors.success }]}>{e.isActive ? t("company.employees.deactivate") : t("company.employees.activate")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={() => onStartDelete(e.id)}>
                      <Text style={[styles.actionBtnText, { color: colors.error }]}>{t("common.delete")}</Text>
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
