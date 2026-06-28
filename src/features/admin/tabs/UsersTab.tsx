import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { AdminUser } from "../../../lib/types/api";
import { Badge, getRoleBadge } from "../components/Badge";
import { styles } from "../admin.styles";
import { colors } from "../../../styles/tokens";

interface UsersTabProps {
  usersQuery: { data?: AdminUser[]; isPending: boolean; error: Error | null };
  unassignedQuery: { data?: AdminUser[]; isPending: boolean; error: Error | null };
  onToggleActive: (id: string) => void;
  togglingId: string | null;
  onAssign: (userId: string, companyId: string) => void;
  assigning: boolean;
  onRemove: (userId: string) => void;
  onCreateUser: (input: { name: string; email: string; password: string; role: "user" | "company" }) => void;
  creatingUser: boolean;
  onEditUser: (id: string, input: { name: string; email: string }) => void;
  editingUser: boolean;
  onDeleteUser: (id: string) => void;
  deletingUser: boolean;
}

export function UsersTab({
  usersQuery, unassignedQuery, onToggleActive, togglingId,
  onAssign, assigning, onRemove,
  onCreateUser, creatingUser, onEditUser, editingUser, onDeleteUser, deletingUser,
}: UsersTabProps) {
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

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>Zarzadzanie uzytkownikami</Text>
        <Pressable style={[styles.genBigBtn, createUserOpen && { opacity: 0.7 }]} onPress={() => { setCreateUserOpen(!createUserOpen); setNewUserName(""); setNewUserEmail(""); setNewUserPassword(""); }}>
          <Text style={styles.genBigBtnText}>{createUserOpen ? "Anuluj" : "Dodaj uzytkownika"}</Text>
        </Pressable>
      </View>

      {createUserOpen && (
        <View style={styles.formCard}>
          <TextInput style={styles.input} placeholder="Imie i nazwisko" value={newUserName} onChangeText={setNewUserName} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.input} placeholder="Email" value={newUserEmail} onChangeText={setNewUserEmail} autoCapitalize="none" placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.input} placeholder="Haslo" value={newUserPassword} onChangeText={setNewUserPassword} secureTextEntry placeholderTextColor={colors.inputPlaceholder} />
          <Text style={styles.formLabel}>Rola:</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["user", "company"] as const).map((r) => (
              <Pressable key={r} style={[styles.roleTab, newUserRole === r && styles.roleTabActive]} onPress={() => setNewUserRole(r)}>
                <Text style={[styles.roleTabText, newUserRole === r && styles.roleTabTextActive]}>{r === "user" ? "Uzytkownik" : "Firma"}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={[styles.primaryBtn, (!newUserName || !newUserEmail || !newUserPassword || creatingUser) && { opacity: 0.5 }]} onPress={() => onCreateUser({ name: newUserName, email: newUserEmail, password: newUserPassword, role: newUserRole })} disabled={!newUserName || !newUserEmail || !newUserPassword || creatingUser}>
            <Text style={styles.primaryBtnText}>{creatingUser ? "Tworzenie..." : "Utworz konto"}</Text>
          </Pressable>
        </View>
      )}

      {unassignedQuery.data && unassignedQuery.data.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Bez firmy ({unassignedQuery.data.length})</Text>
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
                <Badge {...getRoleBadge(u.role)} />
              </View>
              <View style={{ flex: 1.5, gap: 4 }}>
                {assignUserId === u.id ? (
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <View style={{ flex: 1 }}>
                      <TextInput style={styles.inputSmall} placeholder="companyId" value={assignCompanyId} onChangeText={setAssignCompanyId} placeholderTextColor={colors.inputPlaceholder} />
                    </View>
                    <Pressable style={[styles.actionBtn, styles.actionBtnSuccess, assigning && { opacity: 0.5 }]} onPress={() => { onAssign(u.id, assignCompanyId); setAssignUserId(null); setAssignCompanyId(""); }} disabled={assigning || !assignCompanyId}>
                      <Text style={[styles.actionBtnText, { color: colors.success }]}>Przypisz</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={() => { setAssignUserId(null); setAssignCompanyId(""); }}>
                      <Text style={styles.actionBtnText}>Anuluj</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable style={[styles.actionBtn, { borderColor: colors.successBorder, backgroundColor: colors.successBg }]} onPress={() => setAssignUserId(u.id)}>
                    <Text style={[styles.actionBtnText, { color: colors.success }]}>Przypisz do firmy</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </>
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
              <TextInput style={[styles.inputSmall, { flex: 1.5 }]} value={editName} onChangeText={setEditName} placeholderTextColor={colors.inputPlaceholder} />
              <TextInput style={[styles.inputSmall, { flex: 1.5 }]} value={editEmail} onChangeText={setEditEmail} placeholderTextColor={colors.inputPlaceholder} autoCapitalize="none" />
              <View style={{ flex: 0.8 }} />
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{u.company?.name ?? "-"}</Text>
              <View style={{ flex: 0.7 }} />
              <View style={{ flex: 1.5, gap: 4, flexDirection: "row" }}>
                <Pressable style={[styles.actionBtn, styles.actionBtnSuccess, (editingUser || !editName) && { opacity: 0.5 }]} onPress={() => onEditUser(editUserId!, { name: editName, email: editEmail })} disabled={editingUser || !editName}>
                  <Text style={[styles.actionBtnText, { color: colors.success }]}>Zapisz</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => setEditUserId(null)}>
                  <Text style={styles.actionBtnText}>Anuluj</Text>
                </Pressable>
              </View>
            </>
          ) : deleteConfirmId === u.id ? (
            <>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{u.name}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{u.email}</Text>
              <View style={{ flex: 0.8 }}><Badge {...getRoleBadge(u.role)} /></View>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{u.company?.name ?? "-"}</Text>
              <View style={{ flex: 0.7 }} />
              <View style={{ flex: 1.5, gap: 4, flexDirection: "row" }}>
                <Text style={{ fontSize: 13, color: colors.error, fontWeight: "600", alignSelf: "center" }}>Usunac?</Text>
                <Pressable style={[styles.actionBtn, styles.actionBtnWarn, deletingUser && { opacity: 0.5 }]} onPress={() => onDeleteUser(deleteConfirmId!)} disabled={deletingUser}>
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>{deletingUser ? "Usuwanie..." : "Tak"}</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => setDeleteConfirmId(null)}>
                  <Text style={styles.actionBtnText}>Nie</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{u.name}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{u.email}</Text>
              <View style={{ flex: 0.8 }}>
                <Badge {...getRoleBadge(u.role)} />
              </View>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{u.company?.name ?? "-"}</Text>
              <View style={{ flex: 0.7 }}>
                <Badge label={u.isActive ? "Aktywny" : "Nieaktywny"} color={u.isActive ? colors.success : colors.error} bg={u.isActive ? colors.successBg : colors.errorBg} />
              </View>
              <View style={{ flex: 1.5, gap: 4, flexDirection: "row" }}>
                <Pressable style={[styles.actionBtn, { borderColor: colors.creamDark, backgroundColor: colors.inputBg }]} onPress={() => { setEditUserId(u.id); setEditName(u.name); setEditEmail(u.email); }}>
                  <Text style={[styles.actionBtnText, { color: colors.slate600 }]}>Edytuj</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, u.isActive ? styles.actionBtnWarn : styles.actionBtnSuccess, togglingId === u.id && { opacity: 0.5 }]} onPress={() => onToggleActive(u.id)} disabled={togglingId === u.id}>
                  <Text style={[styles.actionBtnText, { color: u.isActive ? colors.error : colors.success }]}>{u.isActive ? "Dezaktywuj" : "Aktywuj"}</Text>
                </Pressable>
                {u.role !== "superadmin" && (
                  <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={() => setDeleteConfirmId(u.id)}>
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
