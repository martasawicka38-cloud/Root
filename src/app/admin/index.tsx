import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  adminCreateUser,
  adminDeleteUser,
  adminEditUser,
  createCompany,
  fetchAdminDashboard,
  fetchAdminUsers,
  fetchCompanies,
  fetchUnassignedUsers,
  fetchEmployerTokens,
  generateEmployerToken,
  generateCompanyToken,
  fetchCompanyTokens,
  toggleUserActive,
  assignUserToCompany,
  removeUserFromCompany,
} from "../../lib/api/endpoints";
import type { Tab } from "../../lib/types/admin";

import { DashboardTab } from "../../features/admin/tabs/DashboardTab";
import { UsersTab } from "../../features/admin/tabs/UsersTab";
import { CompaniesTab } from "../../features/admin/tabs/CompaniesTab";
import { ActivitiesTab } from "../../features/admin/tabs/ActivitiesTab";
import { AnalyticsTab } from "../../features/admin/tabs/AnalyticsTab";
import { CompanyTokensTab } from "../../features/admin/tabs/CompanyTokensTab";
import { AppLogo } from "../../features/common/AppLogo";
import { styles } from "../../features/admin/admin.styles";
import { colors } from "../../styles/tokens";

const TABS: { key: Tab; labelKey: string }[] = [
  { key: "dashboard", labelKey: "admin.tabs.dashboard" },
  { key: "users", labelKey: "admin.tabs.users" },
  { key: "companies", labelKey: "admin.tabs.companies" },
  { key: "tokens", labelKey: "admin.tabs.tokens" },
  { key: "activities", labelKey: "admin.tabs.activities" },
  { key: "analytics", labelKey: "admin.tabs.analytics" },
];

export default function AdminScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanySlug, setNewCompanySlug] = useState("");
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);

  const dashboardQuery = useQuery({ queryKey: ["admin", "dashboard"], queryFn: fetchAdminDashboard });
  const usersQuery = useQuery({ queryKey: ["admin", "users"], queryFn: fetchAdminUsers });
  const unassignedQuery = useQuery({ queryKey: ["admin", "unassigned"], queryFn: fetchUnassignedUsers });
  const companiesQuery = useQuery({ queryKey: ["admin", "companies"], queryFn: fetchCompanies });
  const companyTokensQuery = useQuery({ queryKey: ["admin", "company-tokens"], queryFn: fetchCompanyTokens });
  const tokensQuery = useQuery({ queryKey: ["admin", "employer-tokens", expandedCompanyId], queryFn: () => fetchEmployerTokens(expandedCompanyId!), enabled: !!expandedCompanyId });

  const toggleActiveMutation = useMutation({ mutationFn: toggleUserActive, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }) });
  const createCompanyMutation = useMutation({ mutationFn: () => createCompany({ name: newCompanyName, slug: newCompanySlug }), onSuccess: () => { setNewCompanyName(""); setNewCompanySlug(""); queryClient.invalidateQueries({ queryKey: ["admin", "companies"] }); } });
  const generateEmployerTokenMutation = useMutation({ mutationFn: generateEmployerToken, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "employer-tokens", expandedCompanyId] }); queryClient.invalidateQueries({ queryKey: ["admin", "companies"] }); } });
  const generateCompanyTokenMutation = useMutation({ mutationFn: generateCompanyToken, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "company-tokens"] }) });
  const assignMutation = useMutation({ mutationFn: ({ userId, companyId }: { userId: string; companyId: string }) => assignUserToCompany(userId, companyId), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); queryClient.invalidateQueries({ queryKey: ["admin", "unassigned"] }); } });
  const removeMutation = useMutation({ mutationFn: removeUserFromCompany, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); queryClient.invalidateQueries({ queryKey: ["admin", "unassigned"] }); } });
  const createUserMutation = useMutation({ mutationFn: adminCreateUser, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); queryClient.invalidateQueries({ queryKey: ["admin", "unassigned"] }); } });
  const editUserMutation = useMutation({ mutationFn: ({ id, input }: { id: string; input: { name?: string; email?: string } }) => adminEditUser(id, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }) });
  const deleteUserMutation = useMutation({ mutationFn: adminDeleteUser, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); queryClient.invalidateQueries({ queryKey: ["admin", "unassigned"] }); } });

  if (Platform.OS !== "web") {
    return (
      <View style={styles.fallbackRoot}>
        <Text style={styles.fallbackTitle}>{t("admin.title")}</Text>
        <Text style={styles.fallbackText}>{t("admin.webOnly")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <AppLogo size={32} />
        <View style={styles.topbarRight}>
          <Text style={{ fontSize: 14, color: colors.slate500 }}>admin@eco-pulse.app</Text>
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
        {tab === "dashboard" && <DashboardTab data={dashboardQuery.data} />}
        {tab === "users" && (
          <UsersTab
            usersQuery={usersQuery}
            unassignedQuery={unassignedQuery}
            onToggleActive={toggleActiveMutation.mutate}
            togglingId={toggleActiveMutation.isPending ? (toggleActiveMutation.variables as string) ?? null : null}
            onAssign={(userId, companyId) => assignMutation.mutate({ userId, companyId })}
            assigning={assignMutation.isPending}
            onRemove={removeMutation.mutate}
            onCreateUser={createUserMutation.mutate}
            creatingUser={createUserMutation.isPending}
            onEditUser={(id, input) => editUserMutation.mutate({ id, input })}
            editingUser={editUserMutation.isPending}
            onDeleteUser={deleteUserMutation.mutate}
            deletingUser={deleteUserMutation.isPending}
          />
        )}
        {tab === "companies" && (
          <CompaniesTab
            companiesQuery={companiesQuery}
            tokensQuery={tokensQuery}
            expandedCompanyId={expandedCompanyId}
            onToggleExpand={setExpandedCompanyId}
            newName={newCompanyName}
            newSlug={newCompanySlug}
            onNameChange={setNewCompanyName}
            onSlugChange={setNewCompanySlug}
            onCreateCompany={createCompanyMutation.mutate}
            creating={createCompanyMutation.isPending}
            onGenerateToken={generateEmployerTokenMutation.mutate}
            generating={generateEmployerTokenMutation.isPending}
          />
        )}
        {tab === "tokens" && (
          <CompanyTokensTab
            tokensQuery={companyTokensQuery}
            onGenerate={generateCompanyTokenMutation.mutate}
            generating={generateCompanyTokenMutation.isPending}
          />
        )}
        {tab === "activities" && <ActivitiesTab companiesQuery={companiesQuery} />}
        {tab === "analytics" && <AnalyticsTab />}
      </ScrollView>
    </View>
  );
}
