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

import {
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
import type { AdminUser, Company, CompanyToken } from "../../lib/types/api";
import { colors, radius } from "../../styles/tokens";

type Tab = "dashboard" | "users" | "companies" | "tokens";

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
  user: { label: "Uzytkownik", color: "#1B4332", bg: "#D8F3DC" },
  company: { label: "Firma", color: "#7B2D8B", bg: "#F3E8FF" },
  superadmin: { label: "Superadmin", color: "#B22222", bg: "#FFE4E1" },
};

export default function AdminScreen() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanySlug, setNewCompanySlug] = useState("");
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);
  const [assignUserId, setAssignUserId] = useState<string | null>(null);
  const [assignCompanyId, setAssignCompanyId] = useState("");

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
                <Badge {...ROLE_BADGE[u.role] ?? { label: u.role, color: "#333", bg: "#eee" }} />
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
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                    <Pressable
                      style={[styles.actionBtn, styles.actionBtnSuccess, assigning && { opacity: 0.5 }]}
                      onPress={onAssign}
                      disabled={assigning || !assignCompanyId}
                    >
                      <Text style={[styles.actionBtnText, { color: "#40916C" }]}>Przypisz</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={() => onStartAssign(null)}>
                      <Text style={styles.actionBtnText}>Anuluj</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    style={[styles.actionBtn, { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }]}
                    onPress={() => onStartAssign(u.id)}
                  >
                    <Text style={[styles.actionBtnText, { color: "#40916C" }]}>Przypisz do firmy</Text>
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
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Nazwa</Text>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Email</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Rola</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Firma</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
        <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>Akcje</Text>
      </View>

      {usersQuery.data?.map((u) => (
        <View key={u.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>{u.name}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>{u.email}</Text>
          <View style={{ flex: 1 }}>
            <Badge {...ROLE_BADGE[u.role] ?? { label: u.role, color: "#333", bg: "#eee" }} />
          </View>
          <Text style={[styles.tableCell, { flex: 1 }]}>{u.company?.name ?? "-"}</Text>
          <View style={{ flex: 1 }}>
            <Badge
              label={u.isActive ? "Aktywny" : "Nieaktywny"}
              color={u.isActive ? "#40916C" : "#D62828"}
              bg={u.isActive ? "#D8F3DC" : "#FFE5E5"}
            />
          </View>
          <View style={{ flex: 0.7, gap: 4 }}>
            <Pressable
              style={[styles.actionBtn, u.isActive ? styles.actionBtnWarn : styles.actionBtnSuccess, togglingId === u.id && { opacity: 0.5 }]}
              onPress={() => onToggleActive(u.id)}
              disabled={togglingId === u.id}
            >
              <Text style={[styles.actionBtnText, { color: u.isActive ? "#D62828" : "#40916C" }]}>
                {u.isActive ? "Dezaktywuj" : "Aktywuj"}
              </Text>
            </Pressable>
          </View>
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
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Nazwa firmy" value={newName} onChangeText={onNameChange} placeholderTextColor="#94A3B8" />
          <TextInput style={[styles.input, { flex: 0.5 }]} placeholder="slug" value={newSlug} onChangeText={onSlugChange} placeholderTextColor="#94A3B8" autoCapitalize="none" />
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
                  <Text style={styles.companyMeta}>{c._count?.users ?? 0} uzytkownikow | {c._count?.tokens ?? 0} tokenow</Text>
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
                            <Badge label={t.used ? "Uzyty" : "Dostepny"} color={t.used ? "#D62828" : "#40916C"} bg={t.used ? "#FFE5E5" : "#D8F3DC"} />
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
                <Badge label={t.used ? "Uzyty" : "Dostepny"} color={t.used ? "#D62828" : "#40916C"} bg={t.used ? "#FFE5E5" : "#D8F3DC"} />
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
  badge: { backgroundColor: "#FFE4E1", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  text: { fontSize: 13, fontWeight: "600", color: "#B22222" },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F1F5F9" },
  fallbackRoot: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  fallbackTitle: { fontSize: 22, fontWeight: "700", color: colors.deepForest, textAlign: "center" },
  fallbackText: { fontSize: 15, color: colors.slate500, textAlign: "center", marginTop: 8 },
  topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 32, paddingVertical: 14, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate200 },
  topbarTitle: { fontSize: 18, fontWeight: "700", color: colors.deepForest },
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
  errorCard: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: radius.md, padding: 20, gap: 8 },
  errorText: { fontSize: 16, fontWeight: "600", color: "#991B1B" },
  errorDetail: { fontSize: 14, color: "#7F1D1D" },
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
  emptyText: { fontSize: 15, color: colors.slate500, textAlign: "center", marginTop: 24 },
  tableHeader: { flexDirection: "row", backgroundColor: colors.slate100, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  tableHeaderCell: { fontSize: 12, fontWeight: "700", color: colors.slate500, textTransform: "uppercase" },
  tableRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 4, gap: 4 },
  tableCell: { fontSize: 14, color: colors.slate900 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, borderWidth: 1, alignItems: "center" },
  actionBtnWarn: { borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  actionBtnSuccess: { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" },
  actionBtnText: { fontSize: 12, fontWeight: "600" },
  inputSmall: { borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, padding: 6, fontSize: 12, color: colors.slate900, backgroundColor: "#F8FAFC" },
  createCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 20, gap: 12, marginBottom: 8 },
  createTitle: { fontSize: 16, fontWeight: "700", color: colors.slate900 },
  createRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: { borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, padding: 10, fontSize: 14, color: colors.slate900, backgroundColor: "#F8FAFC" },
  createBtn: { backgroundColor: colors.mossGreen, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 20 },
  createBtnText: { color: colors.white, fontSize: 14, fontWeight: "700" },
  companyCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, overflow: "hidden" },
  companyCardHeader: { flexDirection: "row", alignItems: "center", padding: 16 },
  companyName: { fontSize: 16, fontWeight: "700", color: colors.slate900 },
  companyMeta: { fontSize: 13, color: colors.slate500, marginTop: 2 },
  expandIcon: { fontSize: 14, color: colors.slate500, marginLeft: 12 },
  companyDetails: { borderTopWidth: 1, borderTopColor: colors.slate200, padding: 16, gap: 12 },
  tokenActions: { flexDirection: "row", justifyContent: "flex-end" },
  genTokenBtn: { backgroundColor: "#7B2D8B", borderRadius: radius.sm, paddingVertical: 8, paddingHorizontal: 16 },
  genTokenBtnText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  genBigBtn: { backgroundColor: "#7B2D8B", borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 24, alignItems: "center", marginBottom: 20, alignSelf: "flex-start" },
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
});
