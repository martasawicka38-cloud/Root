import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Company, EcoActivity } from "../../../lib/types/api";
import { createRewardActivity, deleteRewardActivity, fetchCompanyActivities } from "../../../lib/api/endpoints";
import { styles } from "../admin.styles";
import { colors } from "../../../styles/tokens";

export function ActivitiesTab({ companiesQuery }: { companiesQuery: { data?: Company[]; isPending: boolean; error: Error | null } }) {
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
