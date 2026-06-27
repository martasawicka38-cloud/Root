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
  createChallenge,
  fetchChallenges,
  deleteChallenge,
} from "../../../lib/api/endpoints";
import type { CompanyToken } from "../../../lib/types/api";
import { colors, radius } from "../../../styles/tokens";
import { useAppStore } from "../../../store/useAppStore";

type Tab = "employees" | "analytics" | "tokens" | "challenges";

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

  const challengesQuery = useQuery({
    queryKey: ["company", slug, "challenges"],
    queryFn: () => fetchChallenges(),
    enabled: !!slug,
  });

  const createChallengeMutation = useMutation({
    mutationFn: (input: {
      title: string;
      description?: string;
      points: number;
      scope: "company" | "global";
      startsAt?: string;
      endsAt?: string;
    }) => createChallenge(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company", slug, "challenges"],
      });
    },
  });

  const deleteChallengeMutation = useMutation({
    mutationFn: (id: string) => deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company", slug, "challenges"],
      });
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
          { key: "challenges" as Tab, label: "Nagrody" },
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
          {authQuery.data && (
            <Text style={styles.welcome}>Witaj, {authQuery.data.name}</Text>
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
          {tab === "analytics" && <AnalyticsTab query={analyticsQuery} />}
          {tab === "tokens" && (
            <TokensTab
              query={tokensQuery}
              onGenerate={() => generateTokenMutation.mutate()}
              generating={generateTokenMutation.isPending}
            />
          )}
          {tab === "challenges" && (
            <ChallengesTab
              query={challengesQuery}
              companySlug={slug!}
              onCreate={(input) => createChallengeMutation.mutate(input)}
              creating={createChallengeMutation.isPending}
              onDelete={(id) => deleteChallengeMutation.mutate(id)}
              deleting={deleteChallengeMutation.isPending}
            />
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
                placeholderTextColor="#94A3B8"
              />
              <TextInput
                style={[styles.inputSmall, { flex: 2 }]}
                value={editEmployeeEmail}
                onChangeText={onEditEmailChange}
                placeholderTextColor="#94A3B8"
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
                  <Text style={[styles.actionBtnText, { color: "#40916C" }]}>
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
                    color: "#991B1B",
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
                  <Text style={[styles.actionBtnText, { color: "#D62828" }]}>
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
                    { backgroundColor: e.isActive ? "#D8F3DC" : "#FFE5E5" },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: e.isActive ? "#40916C" : "#D62828" },
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
                    { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
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
                      borderColor: e.isActive ? "#FECACA" : "#BBF7D0",
                      backgroundColor: e.isActive ? "#FEF2F2" : "#F0FDF4",
                    },
                    togglingId === e.id && { opacity: 0.5 },
                  ]}
                  onPress={() => onToggleActive(e.id)}
                  disabled={togglingId === e.id}
                >
                  <Text
                    style={[
                      styles.actionBtnText,
                      { color: e.isActive ? "#D62828" : "#40916C" },
                    ]}
                  >
                    {e.isActive ? "Dezaktywuj" : "Aktywuj"}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionBtn,
                    { borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
                  ]}
                  onPress={() => onDeleteStart(e.id)}
                >
                  <Text style={[styles.actionBtnText, { color: "#D62828" }]}>
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

function AnalyticsTab({
  query,
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
        <Text style={styles.errorText}>Nie udalo sie zaladowac analityki.</Text>
        <Text style={styles.errorDetail}>{query.error.message}</Text>
      </View>
    );

  const d = query.data;
  if (!d) return null;

  return (
    <>
      <Text style={styles.pageTitle}>Analityka</Text>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalActivities}</Text>
          <Text style={styles.statLabel}>Aktywnosci</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalSteps.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Krokow</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalDeclarations}</Text>
          <Text style={styles.statLabel}>Deklaracji</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{d.totalEarned}</Text>
          <Text style={styles.statLabel}>Zarobione EC</Text>
        </View>
      </View>

      {d.employees.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Ranking pracownikow</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Pracownik</Text>
            <Text
              style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}
            >
              PKT
            </Text>
          </View>
          {d.employees.map((emp, i) => (
            <View key={emp.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                {i + 1}. {emp.name}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {emp.points}
              </Text>
            </View>
          ))}
        </>
      )}

      {d.recentActivity.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Ostatnie aktywnosci</Text>
          {d.recentActivity.map((a) => (
            <View key={a.id} style={styles.tableRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.slate900,
                  }}
                >
                  {a.userName}
                </Text>
                <Text style={{ fontSize: 12, color: colors.slate500 }}>
                  {a.type} · {new Date(a.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: colors.mossGreen,
                }}
              >
                +{a.points}
              </Text>
            </View>
          ))}
        </>
      )}
    </>
  );
}

function ChallengesTab({
  query,
  companySlug,
  onCreate,
  creating,
  onDelete,
  deleting,
}: {
  query: {
    data?:
      | { company: any[]; canCreateGlobal: boolean }
      | { global: any[] }
      | { available: any[]; joined: any[] }
      | undefined;
    isPending: boolean;
    error: Error | null;
  };
  companySlug: string;
  onCreate: (input: {
    title: string;
    description?: string;
    points: number;
    scope: "company" | "global";
    startsAt?: string;
    endsAt?: string;
  }) => void;
  creating: boolean;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [scope, setScope] = useState<"company" | "global">("company");

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
        <Text style={styles.errorText}>Nie udalo sie zaladowac nagrod.</Text>
        <Text style={styles.errorDetail}>{query.error.message}</Text>
      </View>
    );

  const data = query.data as any;
  const challenges: any[] =
    data?.company ?? data?.global ?? data?.available ?? [];
  const canCreateGlobal = data?.canCreateGlobal ?? false;

  const handleCreate = () => {
    if (!title || !points) return;
    onCreate({
      title,
      description: description || undefined,
      points: parseInt(points, 10),
      scope,
    });
    setTitle("");
    setDescription("");
    setPoints("");
    setShowForm(false);
  };

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
        <Text style={styles.pageTitle}>Nagrody ({challenges.length})</Text>
        <Pressable
          style={[styles.genBigBtn, showForm && { opacity: 0.7 }]}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.genBigBtnText}>
            {showForm ? "Anuluj" : "Dodaj nagrode"}
          </Text>
        </Pressable>
      </View>

      {showForm && (
        <View
          style={{
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: colors.slate200,
            borderRadius: radius.md,
            padding: 16,
            gap: 10,
            marginBottom: 16,
          }}
        >
          <TextInput
            style={styles.inputSmall}
            placeholder="Tytul"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#94A3B8"
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="Opis (opcjonalny)"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#94A3B8"
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="Punkty EC"
            value={points}
            onChangeText={setPoints}
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
          />
          {canCreateGlobal && (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                style={[
                  {
                    paddingVertical: 10,
                    borderRadius: radius.sm,
                    alignItems: "center",
                    backgroundColor:
                      scope === "company" ? "#F8FAFC" : colors.slate100,
                  },
                  scope === "company" && {
                    backgroundColor: colors.white,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 3,
                    elevation: 2,
                  },
                  { flex: 1 },
                ]}
                onPress={() => setScope("company")}
              >
                <Text
                  style={[
                    {
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        scope === "company" ? colors.slate900 : colors.slate500,
                    },
                  ]}
                >
                  Firmowa
                </Text>
              </Pressable>
              <Pressable
                style={[
                  {
                    paddingVertical: 10,
                    borderRadius: radius.sm,
                    alignItems: "center",
                    backgroundColor:
                      scope === "global" ? "#F8FAFC" : colors.slate100,
                  },
                  scope === "global" && {
                    backgroundColor: colors.white,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 3,
                    elevation: 2,
                  },
                  { flex: 1 },
                ]}
                onPress={() => setScope("global")}
              >
                <Text
                  style={[
                    {
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        scope === "global" ? colors.slate900 : colors.slate500,
                    },
                  ]}
                >
                  Globalna
                </Text>
              </Pressable>
            </View>
          )}
          <Pressable
            style={[
              styles.genBigBtn,
              (!title || !points || creating) && { opacity: 0.5 },
            ]}
            onPress={handleCreate}
            disabled={!title || !points || creating}
          >
            <Text style={styles.genBigBtnText}>
              {creating ? "Tworzenie..." : "Utworz nagrode"}
            </Text>
          </Pressable>
        </View>
      )}

      {challenges.length === 0 ? (
        <Text style={styles.emptyText}>
          Brak nagrod. Kliknij Dodaj nagrodę, aby utworzyc pierwsza.
        </Text>
      ) : (
        <View style={{ gap: 4 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Tytul</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Punkty</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>Akcje</Text>
          </View>
          {challenges.map((c: any) => (
            <View key={c.id} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.tableCell, { fontWeight: "600" }]}>
                  {c.title}
                </Text>
                {c.description && (
                  <Text style={{ fontSize: 12, color: colors.slate500 }}>
                    {c.description}
                  </Text>
                )}
              </View>
              <Text style={[styles.tableCell, { flex: 1 }]}>{c.points} EC</Text>
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: c.active ? "#D8F3DC" : "#FFE5E5" },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: c.active ? "#40916C" : "#D62828" },
                    ]}
                  >
                    {c.active ? "Aktywny" : "Nieaktywny"}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 0.7 }}>
                <Pressable
                  style={[
                    styles.actionBtn,
                    { borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
                    deleting && { opacity: 0.5 },
                  ]}
                  onPress={() => onDelete(c.id)}
                  disabled={deleting}
                >
                  <Text style={[styles.actionBtnText, { color: "#D62828" }]}>
                    Usun
                  </Text>
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
                    { backgroundColor: t.used ? "#FFE5E5" : "#D8F3DC" },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: t.used ? "#D62828" : "#40916C" },
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
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: radius.sm,
    padding: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#991B1B",
  },
  errorDetail: {
    fontSize: 13,
    color: "#991B1B",
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
    borderColor: "#BBF7D0",
    backgroundColor: "#F0FDF4",
  },
  actionBtnWarn: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
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
