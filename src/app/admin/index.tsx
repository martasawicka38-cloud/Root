import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

import {
  adminCreateUser,
  adminDeleteUser,
  adminEditUser,
  createCompany,
  fetchAdminDashboard,
  fetchAdminUsers,
  fetchAnalyticsUsers,
  fetchCompanies,
  fetchUnassignedUsers,
  fetchEmployerTokens,
  generateEmployerToken,
  generateCompanyToken,
  fetchCompanyTokens,
  toggleUserActive,
  assignUserToCompany,
  removeUserFromCompany,
  fetchGlobalPermissions,
  grantGlobalPermission,
  revokeGlobalPermission,
  createRewardActivity,
  deleteRewardActivity,
  fetchCompanyActivities,
  fetchUserSteps,
} from "../../lib/api/endpoints";
import type { AdminDashboard, AdminUser, AnalyticsUser, Company, CompanyGlobalPermissionItem, CompanyToken, EcoActivity, UserStepsPayload } from "../../lib/types/api";
import { AppLogo } from "../../features/common/AppLogo";
import { colors, radius } from "../../styles/tokens";

type Tab = "dashboard" | "users" | "companies" | "tokens" | "activities" | "analytics";

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={[badgeStyles.badge, { backgroundColor: bg }]}>
      <Text style={[badgeStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  text: { fontSize: 12, fontWeight: "600" },
});

const ROLE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  user: { label: "Uzytkownik", color: colors.deepForest, bg: colors.successBg },
  company: { label: "Firma", color: colors.roleCompany, bg: colors.roleCompanyBg },
  superadmin: { label: "Superadmin", color: colors.roleSuperadmin, bg: colors.roleSuperadminBg },
};

export default function AdminScreen() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanySlug, setNewCompanySlug] = useState("");
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);
  const [assignUserId, setAssignUserId] = useState<string | null>(null);
  const [assignCompanyId, setAssignCompanyId] = useState("");
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"user" | "company">("user");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const dashboardQuery = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
  });

  const unassignedQuery = useQuery({
    queryKey: ["admin", "unassigned"],
    queryFn: fetchUnassignedUsers,
  });

  const companiesQuery = useQuery({
    queryKey: ["admin", "companies"],
    queryFn: fetchCompanies,
  });

  const companyTokensQuery = useQuery({
    queryKey: ["admin", "company-tokens"],
    queryFn: fetchCompanyTokens,
  });

  const tokensQuery = useQuery({
    queryKey: ["admin", "employer-tokens", expandedCompanyId],
    queryFn: () => fetchEmployerTokens(expandedCompanyId!),
    enabled: !!expandedCompanyId,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleUserActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const createCompanyMutation = useMutation({
    mutationFn: () => createCompany({ name: newCompanyName, slug: newCompanySlug }),
    onSuccess: () => {
      setNewCompanyName("");
      setNewCompanySlug("");
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
  });

  const generateEmployerTokenMutation = useMutation({
    mutationFn: generateEmployerToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "employer-tokens", expandedCompanyId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
  });

  const generateCompanyTokenMutation = useMutation({
    mutationFn: generateCompanyToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "company-tokens"] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: () => assignUserToCompany(assignUserId!, assignCompanyId),
    onSuccess: () => {
      setAssignUserId(null);
      setAssignCompanyId("");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "unassigned"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeUserFromCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "unassigned"] });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: () => adminCreateUser({ name: newUserName, email: newUserEmail, password: newUserPassword, role: newUserRole }),
    onSuccess: () => {
      setCreateUserOpen(false);
      setNewUserName(""); setNewUserEmail(""); setNewUserPassword("");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "unassigned"] });
    },
  });

  const editUserMutation = useMutation({
    mutationFn: () => adminEditUser(editUserId!, { name: editName, email: editEmail }),
    onSuccess: () => {
      setEditUserId(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => adminDeleteUser(deleteConfirmId!),
    onSuccess: () => {
      setDeleteConfirmId(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "unassigned"] });
    },
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
        <AppLogo size={60} />
        <View style={styles.topbarRight}>
          <View style={adminBadgeStyles.badge}>
            <Text style={adminBadgeStyles.text}>Superadmin</Text>
          </View>
        </View>
      </View>

      <View style={styles.navTabs}>
        {[
          { key: "dashboard" as Tab, label: "Dashboard" },
          { key: "users" as Tab, label: "Uzytkownicy" },
          { key: "companies" as Tab, label: "Firmy" },
          { key: "activities" as Tab, label: "Aktywnosci" },
          { key: "analytics" as Tab, label: "Analityka" },
          { key: "tokens" as Tab, label: "Tokeny firmowe" },
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
          {tab === "dashboard" && <DashboardTab data={dashboardQuery} />}
          {tab === "users" && (
            <UsersTab
              usersQuery={usersQuery}
              unassignedQuery={unassignedQuery}
              companiesQuery={companiesQuery}
              onToggleActive={(id) => toggleActiveMutation.mutate(id)}
              togglingId={toggleActiveMutation.isPending ? toggleActiveMutation.variables : null}
              assignUserId={assignUserId}
              assignCompanyId={assignCompanyId}
              onStartAssign={setAssignUserId}
              onAssignCompanyIdChange={setAssignCompanyId}
              onAssign={() => assignMutation.mutate()}
              assigning={assignMutation.isPending}
              onRemove={(id) => removeMutation.mutate(id)}
              removing={removeMutation.isPending}
              createUserOpen={createUserOpen}
              onCreateUserToggle={() => setCreateUserOpen(!createUserOpen)}
              newUserName={newUserName}
              newUserEmail={newUserEmail}
              newUserPassword={newUserPassword}
              newUserRole={newUserRole}
              onNewUserNameChange={setNewUserName}
              onNewUserEmailChange={setNewUserEmail}
              onNewUserPasswordChange={setNewUserPassword}
              onNewUserRoleChange={setNewUserRole}
              onCreateUser={() => createUserMutation.mutate()}
              creatingUser={createUserMutation.isPending}
              editUserId={editUserId}
              editName={editName}
              editEmail={editEmail}
              onEditStart={(id, name, email) => { setEditUserId(id); setEditName(name); setEditEmail(email); }}
              onEditCancel={() => setEditUserId(null)}
              onEditNameChange={setEditName}
              onEditEmailChange={setEditEmail}
              onEditSave={() => editUserMutation.mutate()}
              editingUser={editUserMutation.isPending}
              deleteConfirmId={deleteConfirmId}
              onDeleteStart={setDeleteConfirmId}
              onDeleteCancel={() => setDeleteConfirmId(null)}
              onDeleteConfirm={() => deleteUserMutation.mutate()}
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
              onCreateCompany={() => createCompanyMutation.mutate()}
              creating={createCompanyMutation.isPending}
              onGenerateToken={(id) => generateEmployerTokenMutation.mutate(id)}
              generating={generateEmployerTokenMutation.isPending}
            />
          )}
          {tab === "tokens" && (
            <CompanyTokensTab
              tokensQuery={companyTokensQuery}
              onGenerate={() => generateCompanyTokenMutation.mutate()}
              generating={generateCompanyTokenMutation.isPending}
            />
          )}
          {tab === "activities" && (
            <ActivitiesTab
              companiesQuery={companiesQuery}
            />
          )}
          {tab === "analytics" && <AnalyticsTab />}
        </View>
      </ScrollView>
    </View>
  );
}

function DashboardTab({ data }: {
  data: {
    data?: {
      users: { total: number; regularUsers: number; companyAccounts: number; totalEmployees: number; activeDeclarations: number; participationRate: number };
      economy: { totalEcInCirculation: number; totalEarned: number; totalSpent: number };
      activity: { totalActivities: number; totalSteps: number; avgStepsPerActivity: number; weeklySteps: { day: string; steps: number }[] };
      recentActivity: { id: string; userName: string; type: string; points: number; createdAt: string }[];
      companies: { id: string; name: string; slug: string; employeeCount: number }[];
    };
    isPending: boolean;
    error: Error | null;
  };
}) {
  if (data.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (data.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac danych.</Text>
      <Text style={styles.errorDetail}>{data.error.message}</Text>
    </View>
  );

  const d = data.data!;
  return (
    <>
      <Text style={styles.pageTitle}>Dashboard</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.users.regularUsers}</Text>
          <Text style={styles.statLabel}>Zwykli uzytkownicy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.users.companyAccounts}</Text>
          <Text style={styles.statLabel}>Konta firmowe</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.users.totalEmployees}</Text>
          <Text style={styles.statLabel}>Pracownicy firm</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.companies.length}</Text>
          <Text style={styles.statLabel}>Firmy</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.users.activeDeclarations}</Text>
          <Text style={styles.statLabel}>Aktywnych deklaracji</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.economy.totalEcInCirculation.toLocaleString("pl-PL")}</Text>
          <Text style={styles.statLabel}>EC w obiegu</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.users.participationRate}%</Text>
          <Text style={styles.statLabel}>Udzial w programie</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.activity.totalActivities}</Text>
          <Text style={styles.statLabel}>Lacznie aktywnosci</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.activity.totalSteps.toLocaleString("pl-PL")}</Text>
          <Text style={styles.statLabel}>Lacznie krokow</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.activity.avgStepsPerActivity.toLocaleString("pl-PL")}</Text>
          <Text style={styles.statLabel}>Srednio krokow</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.economy.totalEarned.toLocaleString("pl-PL")}</Text>
          <Text style={styles.statLabel}>EC zarobione</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Firmy</Text>
      {d.companies.length === 0 ? (
        <Text style={styles.emptyText}>Brak firm.</Text>
      ) : (
        <View style={styles.companyMinList}>
          {d.companies.map((c) => (
            <View key={c.id} style={styles.companyMinRow}>
              <Text style={styles.companyMinName}>{c.name}</Text>
              <Text style={styles.companyMinCount}>{c.employeeCount} pracownikow</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Kroki w ostatnim tygodniu</Text>
      <View style={styles.chartRow}>
        {d.activity.weeklySteps.map((day) => {
          const max = Math.max(...d.activity.weeklySteps.map((d) => d.steps), 1);
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

function UsersTab({
  usersQuery, unassignedQuery, companiesQuery, onToggleActive, togglingId,
  assignUserId, assignCompanyId, onStartAssign, onAssignCompanyIdChange,
  onAssign, assigning, onRemove, removing,
  createUserOpen, onCreateUserToggle,
  newUserName, newUserEmail, newUserPassword, newUserRole,
  onNewUserNameChange, onNewUserEmailChange, onNewUserPasswordChange, onNewUserRoleChange,
  onCreateUser, creatingUser,
  editUserId, editName, editEmail,
  onEditStart, onEditCancel, onEditNameChange, onEditEmailChange, onEditSave, editingUser,
  deleteConfirmId, onDeleteStart, onDeleteCancel, onDeleteConfirm, deletingUser,
}: {
  usersQuery: { data?: AdminUser[]; isPending: boolean; error: Error | null };
  unassignedQuery: { data?: AdminUser[]; isPending: boolean; error: Error | null };
  companiesQuery: { data?: Company[]; isPending: boolean };
  onToggleActive: (id: string) => void;
  togglingId: string | null;
  assignUserId: string | null;
  assignCompanyId: string;
  onStartAssign: (id: string | null) => void;
  onAssignCompanyIdChange: (v: string) => void;
  onAssign: () => void;
  assigning: boolean;
  onRemove: (id: string) => void;
  removing: boolean;
  createUserOpen: boolean;
  onCreateUserToggle: () => void;
  newUserName: string; newUserEmail: string; newUserPassword: string;
  newUserRole: "user" | "company";
  onNewUserNameChange: (v: string) => void;
  onNewUserEmailChange: (v: string) => void;
  onNewUserPasswordChange: (v: string) => void;
  onNewUserRoleChange: (v: "user" | "company") => void;
  onCreateUser: () => void;
  creatingUser: boolean;
  editUserId: string | null;
  editName: string; editEmail: string;
  onEditStart: (id: string, name: string, email: string) => void;
  onEditCancel: () => void;
  onEditNameChange: (v: string) => void;
  onEditEmailChange: (v: string) => void;
  onEditSave: () => void;
  editingUser: boolean;
  deleteConfirmId: string | null;
  onDeleteStart: (id: string | null) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  deletingUser: boolean;
}) {
  const pending = usersQuery.isPending;
  const error = usersQuery.error;

  if (pending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac uzytkownikow.</Text>
      <Text style={styles.errorDetail}>{error.message}</Text>
    </View>
  );

  const companies = companiesQuery.data ?? [];

  return (
    <>
      <Text style={styles.pageTitle}>Zarzadzanie uzytkownikami</Text>

      <View style={styles.createCard}>
        <Pressable onPress={onCreateUserToggle} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.createTitle}>Dodaj uzytkownika</Text>
          <Text style={{ fontSize: 18, color: colors.slate500 }}>{createUserOpen ? "▲" : "▼"}</Text>
        </Pressable>
        {createUserOpen && (
          <View style={{ gap: 10 }}>
            <TextInput style={styles.input} placeholder="Nazwa" value={newUserName} onChangeText={onNewUserNameChange} placeholderTextColor={colors.inputPlaceholder} />
            <TextInput style={styles.input} placeholder="Email" value={newUserEmail} onChangeText={onNewUserEmailChange} placeholderTextColor={colors.inputPlaceholder} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Haslo" value={newUserPassword} onChangeText={onNewUserPasswordChange} placeholderTextColor={colors.inputPlaceholder} secureTextEntry />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable style={[styles.roleTab, newUserRole === "user" && styles.roleTabActive, { flex: 1 }]} onPress={() => onNewUserRoleChange("user")}>
                <Text style={[styles.roleTabText, newUserRole === "user" && styles.roleTabTextActive]}>Uzytkownik</Text>
              </Pressable>
              <Pressable style={[styles.roleTab, newUserRole === "company" && styles.roleTabActive, { flex: 1 }]} onPress={() => onNewUserRoleChange("company")}>
                <Text style={[styles.roleTabText, newUserRole === "company" && styles.roleTabTextActive]}>Firma</Text>
              </Pressable>
            </View>
            <Pressable
              style={[styles.createBtn, (!newUserName || !newUserEmail || !newUserPassword || creatingUser) && { opacity: 0.5 }]}
              onPress={onCreateUser}
              disabled={!newUserName || !newUserEmail || !newUserPassword || creatingUser}
            >
              <Text style={styles.createBtnText}>{creatingUser ? "Tworzenie..." : "Utworz uzytkownika"}</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Uzytkownicy bez firmy</Text>
      {unassignedQuery.data && unassignedQuery.data.length > 0 ? (
        <View style={{ gap: 4, marginBottom: 20 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Nazwa</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Email</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Rola</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Akcje</Text>
          </View>
          {unassignedQuery.data.map((u) => (
            <View key={u.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{u.name}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{u.email}</Text>
              <View style={{ flex: 1 }}>
                <Badge {...ROLE_BADGE[u.role] ?? { label: u.role, color: colors.olive, bg: colors.creamLight }} />
              </View>
              <View style={{ flex: 1.5, gap: 4 }}>
                {assignUserId === u.id ? (
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={styles.inputSmall}
                        placeholder="companyId"
                        value={assignCompanyId}
                        onChangeText={onAssignCompanyIdChange}
                        placeholderTextColor={colors.inputPlaceholder}
                      />
                    </View>
                    <Pressable
                      style={[styles.actionBtn, styles.actionBtnSuccess, assigning && { opacity: 0.5 }]}
                      onPress={onAssign}
                      disabled={assigning || !assignCompanyId}
                    >
                      <Text style={[styles.actionBtnText, { color: colors.success }]}>Przypisz</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={() => onStartAssign(null)}>
                      <Text style={styles.actionBtnText}>Anuluj</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    style={[styles.actionBtn, { borderColor: colors.successBorder, backgroundColor: colors.successBg }]}
                    onPress={() => onStartAssign(u.id)}
                  >
                    <Text style={[styles.actionBtnText, { color: colors.success }]}>Przypisz do firmy</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Brak uzytkownikow bez firmy.</Text>
      )}

      <Text style={styles.sectionTitle}>Wszyscy uzytkownicy (bez pracownikow)</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Nazwa</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Email</Text>
        <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Rola</Text>
        <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Firma</Text>
        <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>Status</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Akcje</Text>
      </View>

      {usersQuery.data?.map((u) => (
        <View key={u.id} style={styles.tableRow}>
          {editUserId === u.id ? (
            <>
              <TextInput style={[styles.inputSmall, { flex: 1.5 }]} value={editName} onChangeText={onEditNameChange} placeholderTextColor={colors.inputPlaceholder} />
              <TextInput style={[styles.inputSmall, { flex: 1.5 }]} value={editEmail} onChangeText={onEditEmailChange} placeholderTextColor={colors.inputPlaceholder} autoCapitalize="none" />
              <View style={{ flex: 0.8 }} />
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{u.company?.name ?? "-"}</Text>
              <View style={{ flex: 0.7 }} />
              <View style={{ flex: 1.5, gap: 4, flexDirection: "row" }}>
                <Pressable style={[styles.actionBtn, styles.actionBtnSuccess, (editingUser || !editName) && { opacity: 0.5 }]} onPress={onEditSave} disabled={editingUser || !editName}>
                  <Text style={[styles.actionBtnText, { color: colors.success }]}>Zapisz</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={onEditCancel}>
                  <Text style={styles.actionBtnText}>Anuluj</Text>
                </Pressable>
              </View>
            </>
          ) : deleteConfirmId === u.id ? (
            <>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{u.name}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{u.email}</Text>
              <View style={{ flex: 0.8 }}><Badge {...ROLE_BADGE[u.role] ?? { label: u.role, color: colors.olive, bg: colors.creamLight }} /></View>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{u.company?.name ?? "-"}</Text>
              <View style={{ flex: 0.7 }} />
              <View style={{ flex: 1.5, gap: 4, flexDirection: "row" }}>
                <Text style={{ fontSize: 13, color: colors.error, fontWeight: "600", alignSelf: "center" }}>Usunac?</Text>
                <Pressable style={[styles.actionBtn, styles.actionBtnWarn, deletingUser && { opacity: 0.5 }]} onPress={onDeleteConfirm} disabled={deletingUser}>
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>{deletingUser ? "Usuwanie..." : "Tak"}</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={onDeleteCancel}>
                  <Text style={styles.actionBtnText}>Nie</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{u.name}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{u.email}</Text>
              <View style={{ flex: 0.8 }}>
                <Badge {...ROLE_BADGE[u.role] ?? { label: u.role, color: colors.olive, bg: colors.creamLight }} />
              </View>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{u.company?.name ?? "-"}</Text>
              <View style={{ flex: 0.7 }}>
                <Badge label={u.isActive ? "Aktywny" : "Nieaktywny"} color={u.isActive ? colors.success : colors.error} bg={u.isActive ? colors.successBg : colors.errorBg} />
              </View>
              <View style={{ flex: 1.5, gap: 4, flexDirection: "row" }}>
                <Pressable style={[styles.actionBtn, { borderColor: colors.creamDark, backgroundColor: colors.inputBg }]} onPress={() => onEditStart(u.id, u.name, u.email)}>
                  <Text style={[styles.actionBtnText, { color: colors.slate600 }]}>Edytuj</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, u.isActive ? styles.actionBtnWarn : styles.actionBtnSuccess, togglingId === u.id && { opacity: 0.5 }]} onPress={() => onToggleActive(u.id)} disabled={togglingId === u.id}>
                  <Text style={[styles.actionBtnText, { color: u.isActive ? colors.error : colors.success }]}>{u.isActive ? "Dezaktywuj" : "Aktywuj"}</Text>
                </Pressable>
                {u.role !== "superadmin" && (
                  <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={() => onDeleteStart(u.id)}>
                    <Text style={[styles.actionBtnText, { color: colors.error }]}>Usun</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}
        </View>
      ))}
    </>
  );
}

function CompaniesTab({
  companiesQuery, tokensQuery, expandedCompanyId, onToggleExpand,
  newName, newSlug, onNameChange, onSlugChange, onCreateCompany,
  creating, onGenerateToken, generating,
}: {
  companiesQuery: { data?: Company[]; isPending: boolean; error: Error | null };
  tokensQuery: { data?: CompanyToken[]; isPending: boolean };
  expandedCompanyId: string | null;
  onToggleExpand: (id: string | null) => void;
  newName: string; newSlug: string;
  onNameChange: (v: string) => void; onSlugChange: (v: string) => void;
  onCreateCompany: () => void; creating: boolean;
  onGenerateToken: (id: string) => void; generating: boolean;
}) {
  return (
    <>
      <Text style={styles.pageTitle}>Zarzadzanie firmami</Text>

      <View style={styles.createCard}>
        <Text style={styles.createTitle}>Dodaj nowa firme</Text>
        <View style={styles.createRow}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Nazwa firmy" value={newName} onChangeText={onNameChange} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={[styles.input, { flex: 0.5 }]} placeholder="slug" value={newSlug} onChangeText={onSlugChange} placeholderTextColor={colors.inputPlaceholder} autoCapitalize="none" />
          <Pressable style={[styles.createBtn, (!newName || !newSlug || creating) && { opacity: 0.5 }]} onPress={onCreateCompany} disabled={!newName || !newSlug || creating}>
            <Text style={styles.createBtnText}>Dodaj</Text>
          </Pressable>
        </View>
      </View>

      {companiesQuery.isPending ? (
        <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 32 }} />
      ) : companiesQuery.error ? (
        <View style={styles.errorCard}><Text style={styles.errorText}>Nie udalo sie zaladowac firm.</Text><Text style={styles.errorDetail}>{companiesQuery.error.message}</Text></View>
      ) : (
        <View style={{ gap: 8, marginTop: 16 }}>
          {companiesQuery.data?.map((c) => (
            <View key={c.id} style={styles.companyCard}>
              <Pressable style={styles.companyCardHeader} onPress={() => onToggleExpand(expandedCompanyId === c.id ? null : c.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.companyName}>{c.name}</Text>
                  <Text style={styles.companyMeta}>ID: {c.id} | {c._count?.users ?? 0} uzytkownikow | {c._count?.tokens ?? 0} tokenow</Text>
                </View>
                <Text style={styles.expandIcon}>{expandedCompanyId === c.id ? "▼" : "▶"}</Text>
              </Pressable>

              {expandedCompanyId === c.id && (
                <View style={styles.companyDetails}>
                  <View style={styles.tokenActions}>
                    <Pressable style={[styles.genTokenBtn, generating && { opacity: 0.5 }]} onPress={() => onGenerateToken(c.id)} disabled={generating}>
                      <Text style={styles.genTokenBtnText}>{generating ? "Generowanie..." : "Generuj token pracowniczy"}</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.tokensTitle}>Tokeny ({tokensQuery.data?.length ?? 0})</Text>
                  {tokensQuery.isPending ? (
                    <ActivityIndicator size="small" color={colors.mossGreen} />
                  ) : tokensQuery.data?.length === 0 ? (
                    <Text style={styles.emptyText}>Brak tokenow dla tej firmy.</Text>
                  ) : (
                    <View style={styles.tokenList}>
                      <View style={styles.tokenHeader}>
                        <Text style={[styles.tokenHeaderCell, { flex: 2 }]}>Token</Text>
                        <Text style={[styles.tokenHeaderCell, { flex: 0.7 }]}>Status</Text>
                        <Text style={[styles.tokenHeaderCell, { flex: 1 }]}>Data</Text>
                      </View>
                      {tokensQuery.data?.map((t) => (
                        <View key={t.id} style={styles.tokenRow}>
                          <Text style={[styles.tokenCell, { flex: 2, fontFamily: "monospace", fontSize: 12 }]}>{t.token}</Text>
                          <View style={{ flex: 0.7 }}>
                            <Badge label={t.used ? "Uzyty" : "Dostepny"} color={t.used ? colors.error : colors.success} bg={t.used ? colors.errorBg : colors.successBg} />
                          </View>
                          <Text style={[styles.tokenCell, { flex: 1 }]}>{new Date(t.createdAt).toLocaleDateString("pl-PL")}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function ActivitiesTab({
  companiesQuery,
}: {
  companiesQuery: { data?: Company[]; isPending: boolean; error: Error | null };
}) {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("leaf");
  const [category, setCategory] = useState("MOBILITY");
  const [basePoints, setBasePoints] = useState("10");
  const [activityType, setActivityType] = useState<"one_time" | "cyclical">("cyclical");
  const [expiresAt, setExpiresAt] = useState("");

  const queryClient = useQueryClient();

  const { data: activities = [], isPending: activitiesPending } = useQuery({
    queryKey: ["admin-activities", selectedCompany],
    queryFn: () => fetchCompanyActivities(selectedCompany),
    enabled: !!selectedCompany,
  });

  const createMutation = useMutation({
    mutationFn: createRewardActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-activities", selectedCompany] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRewardActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-activities", selectedCompany] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setName("");
    setDescription("");
    setIcon("leaf");
    setCategory("MOBILITY");
    setBasePoints("10");
    setActivityType("cyclical");
    setExpiresAt("");
  };

  const handleSubmit = () => {
    if (!selectedCompany || !name || !basePoints) return;
    createMutation.mutate({
      name,
      description: description || undefined,
      icon,
      category,
      basePoints: parseInt(basePoints, 10),
      activityType,
      expiresAt: activityType === "cyclical" && expiresAt ? expiresAt : undefined,
      companyId: selectedCompany,
    });
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Zarzadzanie aktywnosciami</Text>

      {/* Company selector */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Firma:</Text>
        <View style={styles.filterButtons}>
          {companiesQuery.data?.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.filterBtn, selectedCompany === c.id && styles.filterBtnActive]}
              onPress={() => setSelectedCompany(c.id)}
            >
              <Text style={[styles.filterBtnText, selectedCompany === c.id && styles.filterBtnTextActive]}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedCompany && (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={styles.pageTitle}>Aktywnosci firmy ({activities.length})</Text>
            <Pressable style={[styles.genBigBtn, showForm && { opacity: 0.7 }]} onPress={() => showForm ? resetForm() : setShowForm(true)}>
              <Text style={styles.genBigBtnText}>{showForm ? "Anuluj" : "Dodaj aktywnosc"}</Text>
            </Pressable>
          </View>

          {showForm && (
            <View style={styles.formCard}>
              <TextInput style={styles.input} placeholder="Nazwa aktywnosci" value={name} onChangeText={setName} placeholderTextColor={colors.inputPlaceholder} />
              <TextInput style={styles.input} placeholder="Opis (opcjonalny)" value={description} onChangeText={setDescription} placeholderTextColor={colors.inputPlaceholder} />
              <TextInput style={styles.input} placeholder="Ikona (np. leaf, bike, run)" value={icon} onChangeText={setIcon} placeholderTextColor={colors.inputPlaceholder} />
              <TextInput style={styles.input} placeholder="Punkty bazowe" value={basePoints} onChangeText={setBasePoints} keyboardType="numeric" placeholderTextColor={colors.inputPlaceholder} />

              <Text style={styles.formLabel}>Kategoria:</Text>
              <View style={styles.filterButtons}>
                {["MOBILITY", "CIRCULARITY", "LOCAL_CONSUMPTION", "NATURE_ACTIVITY"].map((c) => (
                  <Pressable
                    key={c}
                    style={[styles.filterBtn, category === c && styles.filterBtnActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.filterBtnText, category === c && styles.filterBtnTextActive]}>
                      {{ MOBILITY: "Mobilnosc", CIRCULARITY: "Cykularnosc", LOCAL_CONSUMPTION: "Lokalne", NATURE_ACTIVITY: "Natura" }[c]}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.formLabel}>Typ aktywnosci:</Text>
              <View style={styles.filterButtons}>
                <Pressable
                  style={[styles.filterBtn, activityType === "one_time" && styles.filterBtnActive]}
                  onPress={() => setActivityType("one_time")}
                >
                  <Text style={[styles.filterBtnText, activityType === "one_time" && styles.filterBtnTextActive]}>Jednorazowa</Text>
                </Pressable>
                <Pressable
                  style={[styles.filterBtn, activityType === "cyclical" && styles.filterBtnActive]}
                  onPress={() => setActivityType("cyclical")}
                >
                  <Text style={[styles.filterBtnText, activityType === "cyclical" && styles.filterBtnTextActive]}>Cykliczna (raz dziennie)</Text>
                </Pressable>
              </View>

              {activityType === "cyclical" && (
                <TextInput style={styles.input} placeholder="Data zakonczenia (RRRR-MM-DD)" value={expiresAt} onChangeText={setExpiresAt} placeholderTextColor={colors.inputPlaceholder} />
              )}

              <Pressable style={[styles.primaryBtn, (!name || !basePoints || createMutation.isPending) && { opacity: 0.5 }]} onPress={handleSubmit} disabled={!name || !basePoints || createMutation.isPending}>
                <Text style={styles.primaryBtnText}>{createMutation.isPending ? "Tworzenie..." : "Utworz aktywnosc"}</Text>
              </Pressable>
            </View>
          )}

          {activitiesPending ? (
            <ActivityIndicator />
          ) : activities.length === 0 ? (
            <Text style={styles.emptyText}>Brak aktywnosci dla tej firmy.</Text>
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
                    {a.description && <Text style={{ fontSize: 12, color: colors.slate500 }}>{a.description}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={[styles.badge, { backgroundColor: a.activityType === "one_time" ? colors.warningBg : colors.successBg }]}>
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
                      style={[styles.dangerBtn, deleteMutation.isPending && { opacity: 0.5 }]}
                      onPress={() => deleteMutation.mutate(a.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Text style={styles.dangerBtnText}>Usun</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </>
  );
}

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

type AnalyticsSubTab = "steps" | "ranking" | "activity";

function AnalyticsTab() {
  const [subTab, setSubTab] = useState<AnalyticsSubTab>("steps");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const usersQuery = useQuery({
    queryKey: ["admin", "analytics-users"],
    queryFn: fetchAnalyticsUsers,
  });

  const dashboardQuery = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
  });

  if (usersQuery.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (usersQuery.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>Nie udalo sie zaladowac uzytkownikow.</Text>
      <Text style={styles.errorDetail}>{usersQuery.error.message}</Text>
    </View>
  );

  const users = usersQuery.data ?? [];
  const dashboard = dashboardQuery.data;

  if (users.length === 0) return (
    <View>
      <Text style={styles.pageTitle}>Analityka</Text>
      <View style={styles.analyticsPlaceholder}>
        <Text style={styles.analyticsPlaceholderText}>Brak uzytkownikow w systemie.</Text>
      </View>
    </View>
  );

  if (!selectedUserId && users.length > 0) {
    setSelectedUserId(users[0].id);
  }

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? users[0];

  const SUB_TABS: { key: AnalyticsSubTab; label: string; icon: React.ReactNode }[] = [
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
          <AnalyticsStepsView
            users={users}
            selectedUserId={selectedUserId}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUserId}
          />
        )}

        {subTab === "ranking" && (
          <AnalyticsRankingView dashboard={dashboard} isLoading={dashboardQuery.isPending} />
        )}

        {subTab === "activity" && (
          <AnalyticsActivityView dashboard={dashboard} isLoading={dashboardQuery.isPending} />
        )}
        </View>
      </View>
    </View>
  );
}

type StepsPeriod = "day" | "week" | "month" | "custom";

function AnalyticsStepsView({
  users, selectedUserId, selectedUser, onSelectUser,
}: {
  users: AnalyticsUser[];
  selectedUserId: string;
  selectedUser: AnalyticsUser;
  onSelectUser: (id: string) => void;
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
    queryKey: ["admin", "user-steps", selectedUserId, effectivePeriod, from, to],
    queryFn: () => fetchUserSteps(selectedUserId, effectivePeriod, from, to),
    enabled: selectedUserId.length > 0 && (period !== "custom" || (!!customFrom && !!customTo)),
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

  return (
    <>
      <View style={styles.analyticsSelector}>
        <Text style={styles.analyticsSelectorLabel}>Wybierz uzytkownika:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View style={styles.analyticsUserList}>
            {users.map((u) => (
              <Pressable
                key={u.id}
                style={[styles.analyticsUserBtn, selectedUserId === u.id && styles.analyticsUserBtnActive]}
                onPress={() => onSelectUser(u.id)}
              >
                <Text style={[styles.analyticsUserBtnText, selectedUserId === u.id && styles.analyticsUserBtnTextActive]}>
                  {u.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.analyticsUserInfo}>
        <Text style={styles.analyticsUserName}>{selectedUser.name}</Text>
        {selectedUser.rootStage && (
          <Text style={styles.analyticsUserStage}>
            {selectedUser.rootStage.name} (lvl {selectedUser.rootStage.level})
          </Text>
        )}
        <Text style={styles.analyticsUserExp}>{selectedUser.totalExp} XP</Text>
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

      <BarChartSection
        query={stepsQuery}
        formatLabel={formatLabel}
        emptyMsg="Brak danych krokow dla wybranego okresu."
      />
    </>
  );
}

function AnalyticsRankingView({ dashboard, isLoading }: {
  dashboard?: AdminDashboard;
  isLoading: boolean;
}) {
  if (isLoading) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (!dashboard) return <Text style={styles.emptyText}>Brak danych.</Text>;

  const companies = dashboard.companies ?? [];

  return (
    <>
      <Text style={styles.sectionTitle}>Ranking firm</Text>
      {companies.length === 0 ? (
        <Text style={styles.emptyText}>Brak firm w systemie.</Text>
      ) : (
        <View style={{ gap: 4 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Firma</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Pracownicy</Text>
          </View>
          {companies.map((c, i) => (
            <View key={c.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5, fontWeight: "700", color: colors.mossGreen }]}>{i + 1}</Text>
              <Text style={[styles.tableCell, { flex: 2, fontWeight: "600" }]}>{c.name}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{c.employeeCount}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function AnalyticsActivityView({ dashboard, isLoading }: {
  dashboard?: AdminDashboard;
  isLoading: boolean;
}) {
  if (isLoading) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (!dashboard) return <Text style={styles.emptyText}>Brak danych.</Text>;

  const activities = dashboard.recentActivity ?? [];

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
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.mossGreen }}>+{a.points} EC</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function BarChartSection({
  query,
  formatLabel,
  emptyMsg,
}: {
  query: { data?: UserStepsPayload; isPending: boolean; error: Error | null };
  formatLabel: (label: string) => string;
  emptyMsg: string;
}) {
  if (query.isPending) return (
    <View style={styles.analyticsChartCard}>
      <ActivityIndicator size="small" color={colors.mossGreen} style={{ marginTop: 20 }} />
    </View>
  );

  if (query.error) return (
    <View style={styles.analyticsChartCard}>
      <View style={[styles.errorCard, { marginTop: 12 }]}>
        <Text style={styles.errorText}>Blad ladowania danych.</Text>
        <Text style={styles.errorDetail}>{query.error.message}</Text>
      </View>
    </View>
  );

  const data = query.data?.data ?? [];

  if (data.length === 0) return (
    <View style={styles.analyticsChartCard}>
      <Text style={styles.emptyText}>{emptyMsg}</Text>
    </View>
  );

  const max = Math.max(...data.map((d) => d.steps), 1);
  const total = data.reduce((sum, d) => sum + d.steps, 0);
  const avg = Math.round(total / data.length);

  return (
    <View style={styles.analyticsChartCard}>
      <View style={styles.analyticsChartHeader}>
        <View style={styles.analyticsChartStats}>
          <View style={styles.analyticsChartStat}>
            <Text style={styles.analyticsChartStatValue}>{total.toLocaleString("pl-PL")}</Text>
            <Text style={styles.analyticsChartStatLabel}>Suma</Text>
          </View>
          <View style={styles.analyticsChartStat}>
            <Text style={styles.analyticsChartStatValue}>{avg.toLocaleString("pl-PL")}</Text>
            <Text style={styles.analyticsChartStatLabel}>Srednia</Text>
          </View>
        </View>
      </View>

      <View style={styles.analyticsChartRow}>
        {data.map((d) => (
          <View key={d.label} style={styles.analyticsChartCol}>
            <Text style={styles.analyticsChartBarValue}>
              {d.steps > 0 ? d.steps.toLocaleString("pl-PL") : ""}
            </Text>
            <View
              style={[
                styles.analyticsChartBar,
                { height: Math.max((d.steps / max) * 140, 4) },
              ]}
            />
            <Text style={styles.analyticsChartLabel}>{formatLabel(d.label)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CompanyTokensTab({
  tokensQuery, onGenerate, generating,
}: {
  tokensQuery: { data?: CompanyToken[]; isPending: boolean; error: Error | null };
  onGenerate: () => void; generating: boolean;
}) {
  return (
    <>
      <Text style={styles.pageTitle}>Tokeny rejestracyjne dla firm</Text>
      <Text style={styles.hintText}>
        Tokeny umozliwiaja firmom rejestracje konta firmowego. Kazdy token jest jednorazowy.
      </Text>

      <Pressable
        style={[styles.genBigBtn, generating && { opacity: 0.5 }]}
        onPress={onGenerate}
        disabled={generating}
      >
        <Text style={styles.genBigBtnText}>
          {generating ? "Generowanie..." : "Generuj nowy token dla firmy"}
        </Text>
      </Pressable>

      {tokensQuery.isPending ? (
        <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 32 }} />
      ) : tokensQuery.error ? (
        <View style={styles.errorCard}><Text style={styles.errorText}>Blad ladowania tokenow.</Text></View>
      ) : (
        <View style={styles.tokenListFull}>
          <View style={styles.tokenTableHeader}>
            <Text style={[styles.tokenHeaderCell, { flex: 3 }]}>Token</Text>
            <Text style={[styles.tokenHeaderCell, { flex: 0.7 }]}>Status</Text>
            <Text style={[styles.tokenHeaderCell, { flex: 1 }]}>Data utworzenia</Text>
          </View>
          {tokensQuery.data?.map((t) => (
            <View key={t.id} style={styles.tokenTableRow}>
              <Text style={[styles.tokenCell, { flex: 3, fontFamily: "monospace", fontSize: 13 }]}>{t.token}</Text>
              <View style={{ flex: 0.7 }}>
                <Badge label={t.used ? "Uzyty" : "Dostepny"} color={t.used ? colors.error : colors.success} bg={t.used ? colors.errorBg : colors.successBg} />
              </View>
              <Text style={[styles.tokenCell, { flex: 1 }]}>{new Date(t.createdAt).toLocaleDateString("pl-PL")}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const adminBadgeStyles = StyleSheet.create({
  badge: { backgroundColor: colors.roleSuperadminBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  text: { fontSize: 13, fontWeight: "600", color: colors.roleSuperadmin },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.inputBg },
  fallbackRoot: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  fallbackTitle: { fontSize: 22, fontWeight: "700", color: colors.deepForest, textAlign: "center" },
  fallbackText: { fontSize: 15, color: colors.slate500, textAlign: "center", marginTop: 8 },
  topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 32, paddingVertical: 14, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate200 },

  topbarRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  navTabs: { flexDirection: "row", backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate200, paddingHorizontal: 32 },
  navTab: { paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: "transparent" },
  navTabActive: { borderBottomColor: colors.mossGreen },
  navTabText: { fontSize: 14, fontWeight: "600", color: colors.slate500 },
  navTabTextActive: { color: colors.mossGreen },
  body: { paddingHorizontal: 32, paddingTop: 28, paddingBottom: 48 },
  bodyInner: { maxWidth: 1100, width: "100%", alignSelf: "center" },
  pageTitle: { fontSize: 28, fontWeight: "700", color: colors.slate900, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.slate900, marginBottom: 14, marginTop: 8 },
  errorCard: { backgroundColor: colors.errorBg, borderWidth: 1, borderColor: colors.errorBorder, borderRadius: radius.md, padding: 20, gap: 8 },
  errorText: { fontSize: 16, fontWeight: "600", color: colors.error },
  errorDetail: { fontSize: 14, color: colors.deepForest },
  hintText: { fontSize: 14, color: colors.slate500, marginBottom: 16 },
  statsRow: { flexDirection: "row", gap: 16, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.slate200, padding: 20, gap: 4 },
  statValue: { fontSize: 32, fontWeight: "800", color: colors.deepForest },
  statLabel: { fontSize: 14, color: colors.slate500, fontWeight: "500" },

  companyMinList: { gap: 4, marginBottom: 16 },
  companyMinRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12 },
  companyMinName: { fontSize: 15, fontWeight: "600", color: colors.slate900 },
  companyMinCount: { fontSize: 13, color: colors.slate500 },

  chartRow: { flexDirection: "row", gap: 8, marginBottom: 24, alignItems: "flex-end" },
  chartCol: { flex: 1, alignItems: "center", gap: 4 },
  chartBarValue: { fontSize: 11, color: colors.slate500, fontWeight: "600" },
  chartBar: { width: "100%", maxWidth: 40, backgroundColor: colors.mossGreen, borderRadius: radius.sm, minHeight: 4 },
  chartLabel: { fontSize: 11, color: colors.slate500, textTransform: "capitalize" },
  activityList: { gap: 8 },
  activityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 14 },
  activityLeft: { gap: 2 },
  activityName: { fontSize: 15, fontWeight: "600", color: colors.slate900 },
  activityType: { fontSize: 13, color: colors.slate500, textTransform: "capitalize" },
  activityPoints: { fontSize: 16, fontWeight: "700", color: colors.mossGreen },
  tableHeader: { flexDirection: "row", backgroundColor: colors.slate100, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  tableHeaderCell: { fontSize: 12, fontWeight: "700", color: colors.slate500, textTransform: "uppercase" },
  tableRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 4, gap: 4 },
  tableCell: { fontSize: 14, color: colors.slate900 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, borderWidth: 1, alignItems: "center" },
  actionBtnWarn: { borderColor: colors.errorBorder, backgroundColor: colors.errorBg },
  actionBtnSuccess: { borderColor: colors.successBorder, backgroundColor: colors.successBg },
  actionBtnText: { fontSize: 12, fontWeight: "600" },
  inputSmall: { borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, padding: 6, fontSize: 12, color: colors.slate900, backgroundColor: colors.inputBg },
  createCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 20, gap: 12, marginBottom: 8 },
  createTitle: { fontSize: 16, fontWeight: "700", color: colors.slate900 },
  createRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: { borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, padding: 10, fontSize: 14, color: colors.slate900, backgroundColor: colors.inputBg },
  createBtn: { backgroundColor: colors.mossGreen, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 20 },
  createBtnText: { color: colors.white, fontSize: 14, fontWeight: "700" },
  companyCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, overflow: "hidden" },
  companyCardHeader: { flexDirection: "row", alignItems: "center", padding: 16 },
  companyName: { fontSize: 16, fontWeight: "700", color: colors.slate900 },
  companyMeta: { fontSize: 13, color: colors.slate500, marginTop: 2 },
  expandIcon: { fontSize: 14, color: colors.slate500, marginLeft: 12 },
  companyDetails: { borderTopWidth: 1, borderTopColor: colors.slate200, padding: 16, gap: 12 },
  tokenActions: { flexDirection: "row", justifyContent: "flex-end" },
  genTokenBtn: { backgroundColor: colors.roleCompany, borderRadius: radius.sm, paddingVertical: 8, paddingHorizontal: 16 },
  genTokenBtnText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  genBigBtn: { backgroundColor: colors.roleCompany, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 24, alignItems: "center", marginBottom: 20, alignSelf: "flex-start" },
  genBigBtnText: { color: colors.white, fontSize: 15, fontWeight: "700" },
  tokensTitle: { fontSize: 14, fontWeight: "700", color: colors.slate700 },
  tokenList: { gap: 4 },
  tokenHeader: { flexDirection: "row", backgroundColor: colors.slate100, borderRadius: radius.sm, paddingVertical: 6, paddingHorizontal: 8 },
  tokenHeaderCell: { fontSize: 11, fontWeight: "700", color: colors.slate500, textTransform: "uppercase" },
  tokenRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  tokenCell: { fontSize: 13, color: colors.slate900 },
  tokenListFull: { gap: 4 },
  tokenTableHeader: { flexDirection: "row", backgroundColor: colors.slate100, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  tokenTableRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 4 },
  roleTab: { paddingVertical: 10, borderRadius: radius.sm, alignItems: "center", backgroundColor: colors.slate100 },
  roleTabActive: { backgroundColor: colors.white, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  roleTabText: { fontSize: 14, fontWeight: "600", color: colors.slate500 },
  roleTabTextActive: { color: colors.slate900 },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  filterLabel: { fontSize: 14, fontWeight: "600", color: colors.slate700 },
  filterButtons: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.slate200, backgroundColor: colors.white },
  filterBtnActive: { backgroundColor: colors.mossGreen, borderColor: colors.mossGreen },
  filterBtnText: { fontSize: 13, fontWeight: "600", color: colors.slate600 },
  filterBtnTextActive: { color: colors.white },
  primaryBtn: { backgroundColor: colors.mossGreen, borderRadius: 8, paddingVertical: 12, alignItems: "center", marginBottom: 16 },
  primaryBtnText: { color: colors.white, fontSize: 14, fontWeight: "700" },
  formCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.slate200 },
  formLabel: { fontSize: 13, fontWeight: "600", color: colors.slate700, marginBottom: 4, marginTop: 8 },
  emptyText: { fontSize: 14, color: colors.slate500, textAlign: "center", padding: 20 },
  dangerBtn: { backgroundColor: colors.errorBg, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  dangerBtnText: { color: colors.error, fontSize: 12, fontWeight: "600" },
  listRow: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: colors.white, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: colors.slate200 },
  listName: { fontSize: 14, fontWeight: "600", color: colors.slate900 },
  listEmail: { fontSize: 12, color: colors.slate500, marginTop: 2 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  // Analytics styles
  analyticsSelector: { marginBottom: 24 },
  analyticsSelectorLabel: { fontSize: 15, fontWeight: "600", color: colors.slate700, marginBottom: 12 },
  analyticsUserList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  analyticsUserBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.slate200, backgroundColor: colors.white },
  analyticsUserBtnActive: { backgroundColor: colors.mossGreen, borderColor: colors.mossGreen },
  analyticsUserBtnText: { fontSize: 14, fontWeight: "600", color: colors.slate700 },
  analyticsUserBtnTextActive: { color: colors.white },
  analyticsUserBtnEmail: { fontSize: 11, color: colors.slate500, marginTop: 2 },
  analyticsUserBtnEmailActive: { color: colors.creamLight },
  analyticsUserInfo: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 20, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 16 },
  analyticsUserName: { fontSize: 20, fontWeight: "700", color: colors.slate900 },
  analyticsUserStage: { fontSize: 14, color: colors.mossGreen, fontWeight: "600" },
  analyticsUserExp: { fontSize: 14, color: colors.slate500, marginLeft: "auto" },
  analyticsPlaceholder: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 48, alignItems: "center" },
  analyticsPlaceholderText: { fontSize: 15, color: colors.slate500 },
  analyticsChartCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 24, marginBottom: 20 },
  analyticsChartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  analyticsChartTitle: { fontSize: 18, fontWeight: "700", color: colors.slate900 },
  analyticsChartStats: { flexDirection: "row", gap: 24 },
  analyticsChartStat: { alignItems: "flex-end" },
  analyticsChartStatValue: { fontSize: 20, fontWeight: "700", color: colors.mossGreen },
  analyticsChartStatLabel: { fontSize: 12, color: colors.slate500, fontWeight: "500" },
  analyticsChartRow: { flexDirection: "row", gap: 6, alignItems: "flex-end", minHeight: 180 },
  analyticsChartCol: { flex: 1, alignItems: "center", gap: 4 },
  analyticsChartBarValue: { fontSize: 10, color: colors.slate500, fontWeight: "600" },
  analyticsChartBar: { width: "100%", maxWidth: 48, backgroundColor: colors.mossGreen, borderRadius: radius.sm, minHeight: 4 },
  analyticsChartLabel: { fontSize: 10, color: colors.slate500, textTransform: "capitalize" },
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
});

