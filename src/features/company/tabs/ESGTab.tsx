import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Certificate, CertificateType, ESGReportListItem } from "../../../lib/types/api";
import { generateESGReport, fetchESGReports, deleteESGReport, updateESGReport, openESGReportHTML, downloadESGReportPDF, downloadESGReportDOCX, generateBulkCertificates, fetchCertificates, deleteCertificate, openCertificateHTML, downloadCertificatePDF } from "../../../lib/api/endpoints";
import { styles } from "../company.styles";
import { colors, radius } from "../../../styles/tokens";

export function ESGTab({ slug, employees }: {
  slug: string;
  employees: { id: string; name: string; email: string; isActive: boolean; balance: number }[];
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [esgSubTab, setEsgSubTab] = useState<"reports" | "certificates">("reports");

  const reportsQuery = useQuery({ queryKey: ["company", slug, "esg-reports"], queryFn: () => fetchESGReports(slug), enabled: !!slug });
  const certsQuery = useQuery({ queryKey: ["company", slug, "certificates"], queryFn: () => fetchCertificates(slug), enabled: !!slug });

  const deleteReportMutation = useMutation({ mutationFn: (reportId: string) => deleteESGReport(slug, reportId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "esg-reports"] }) });
  const publishReportMutation = useMutation({ mutationFn: (reportId: string) => updateESGReport(slug, reportId, { status: "published" }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "esg-reports"] }) });
  const deleteCertMutation = useMutation({ mutationFn: (certId: string) => deleteCertificate(slug, certId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company", slug, "certificates"] }) });

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <Pressable style={[styles.filterBtn, esgSubTab === "reports" && styles.filterBtnActive]} onPress={() => setEsgSubTab("reports")}>
          <Text style={[styles.filterBtnText, esgSubTab === "reports" && styles.filterBtnTextActive]}>{t("company.esg.reports")}</Text>
        </Pressable>
        <Pressable style={[styles.filterBtn, esgSubTab === "certificates" && styles.filterBtnActive]} onPress={() => setEsgSubTab("certificates")}>
          <Text style={[styles.filterBtnText, esgSubTab === "certificates" && styles.filterBtnTextActive]}>{t("company.esg.certificates")}</Text>
        </Pressable>
      </View>

      {esgSubTab === "reports" && <ESGReportsSubTab slug={slug} query={reportsQuery} onDelete={(id) => deleteReportMutation.mutate(id)} onPublish={(id) => publishReportMutation.mutate(id)} />}
      {esgSubTab === "certificates" && <CertificatesSubTab slug={slug} employees={employees} query={certsQuery} onDelete={(id) => deleteCertMutation.mutate(id)} />}
    </View>
  );
}

function ESGReportsSubTab({ slug, query, onDelete, onPublish }: {
  slug: string;
  query: { data?: ESGReportListItem[]; isPending: boolean; error: Error | null };
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");

  const createMutation = useMutation({
    mutationFn: () => generateESGReport(slug, { title, description: description || undefined, periodFrom, periodTo }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["company", slug, "esg-reports"] }); setTitle(""); setDescription(""); setPeriodFrom(""); setPeriodTo(""); setShowForm(false); },
  });

  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>{t("common.errorLoading")}</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  const reports = query.data ?? [];
  const statusLabel = (s: string) => s === "published" ? t("company.esg.status.published") : s === "archived" ? t("company.esg.status.archived") : t("company.esg.status.draft");
  const statusColor = (s: string) => s === "published" ? colors.success : s === "archived" ? colors.slate500 : colors.warning;

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>{t("company.esg.reports")} ({reports.length})</Text>
        <Pressable style={[styles.genBigBtn, showForm && { opacity: 0.7 }]} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.genBigBtnText}>{showForm ? t("common.cancel") : t("company.esg.newReport")}</Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: 16, gap: 10, marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.slate900, marginBottom: 4 }}>{t("company.esg.generateReport")}</Text>
          <TextInput style={styles.inputSmall} placeholder={t("company.esg.reportTitle")} value={title} onChangeText={setTitle} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder={t("company.esg.reportDescription")} value={description} onChangeText={setDescription} placeholderTextColor={colors.inputPlaceholder} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate700, marginBottom: 4 }}>{t("admin.analytics.from")}</Text>
              <TextInput style={styles.inputSmall} placeholder="RRRR-MM-DD" value={periodFrom} onChangeText={setPeriodFrom} placeholderTextColor={colors.inputPlaceholder} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate700, marginBottom: 4 }}>{t("admin.analytics.to")}</Text>
              <TextInput style={styles.inputSmall} placeholder="RRRR-MM-DD" value={periodTo} onChangeText={setPeriodTo} placeholderTextColor={colors.inputPlaceholder} />
            </View>
          </View>
          <Pressable style={[styles.genBigBtn, (!title || !periodFrom || !periodTo || createMutation.isPending) && { opacity: 0.5 }]} onPress={() => createMutation.mutate()} disabled={!title || !periodFrom || !periodTo || createMutation.isPending}>
            <Text style={styles.genBigBtnText}>{createMutation.isPending ? t("common.generating") : t("company.esg.generateReport")}</Text>
          </Pressable>
        </View>
      )}

      {reports.length === 0 ? (
        <Text style={styles.emptyText}>{t("company.esg.noReports")}</Text>
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
                {t("company.esg.period")} {new Date(r.periodFrom).toLocaleDateString("pl-PL")} – {new Date(r.periodTo).toLocaleDateString("pl-PL")} | {new Date(r.generatedAt).toLocaleDateString("pl-PL")}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <Pressable style={[styles.actionBtn, { borderColor: colors.mossGreen, backgroundColor: colors.successBg }]} onPress={() => openESGReportHTML(slug, r.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.mossGreen }]}>{t("company.esg.previewHTML")}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: colors.accentBlue, backgroundColor: "#e0f2fe" }]} onPress={() => downloadESGReportPDF(slug, r.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.accentBlue }]}>{t("company.esg.downloadPDF")}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: "#8b5cf6", backgroundColor: "#ede9fe" }]} onPress={() => downloadESGReportDOCX(slug, r.id)}>
                  <Text style={[styles.actionBtnText, { color: "#8b5cf6" }]}>{t("company.esg.downloadDOCX")}</Text>
                </Pressable>
                {r.status === "draft" && (
                  <Pressable style={[styles.actionBtn, { borderColor: colors.successBorder, backgroundColor: colors.successBg }]} onPress={() => onPublish(r.id)}>
                    <Text style={[styles.actionBtnText, { color: colors.success }]}>{t("common.publish")}</Text>
                  </Pressable>
                )}
                <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={() => onDelete(r.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>{t("common.delete")}</Text>
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certDescription, setCertDescription] = useState("");
  const [certType, setCertType] = useState<CertificateType>("participation");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const createBulkMutation = useMutation({
    mutationFn: () => generateBulkCertificates(slug, { userIds: selectedUserIds, type: certType, title: certTitle, description: certDescription || undefined }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["company", slug, "certificates"] }); setCertTitle(""); setCertDescription(""); setCertType("participation"); setSelectedUserIds([]); setShowForm(false); },
  });

  if (query.isPending) return <ActivityIndicator size="large" color={colors.mossGreen} style={{ marginTop: 48 }} />;
  if (query.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>{t("common.errorLoading")}</Text>
      <Text style={styles.errorDetail}>{query.error.message}</Text>
    </View>
  );

  const certs = query.data ?? [];
  const typeLabels: Record<string, string> = { participation: t("company.esg.certTypes.participation"), achievement: t("company.esg.certTypes.achievement"), completion: t("company.esg.certTypes.completion") };
  const typeColors: Record<string, string> = { participation: colors.mossGreen, achievement: colors.accentBlue, completion: "#8b5cf6" };
  const toggleUser = (id: string) => setSelectedUserIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Text style={styles.pageTitle}>{t("company.esg.certificates")} ({certs.length})</Text>
        <Pressable style={[styles.genBigBtn, showForm && { opacity: 0.7 }]} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.genBigBtnText}>{showForm ? t("common.cancel") : t("company.esg.generateCertificates")}</Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.creamDark, borderRadius: radius.md, padding: 16, gap: 10, marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.slate900, marginBottom: 4 }}>{t("company.esg.generateCertsForEmployees")}</Text>
          <TextInput style={styles.inputSmall} placeholder={t("company.esg.certTitle")} value={certTitle} onChangeText={setCertTitle} placeholderTextColor={colors.inputPlaceholder} />
          <TextInput style={styles.inputSmall} placeholder={t("company.esg.certDescription")} value={certDescription} onChangeText={setCertDescription} placeholderTextColor={colors.inputPlaceholder} />
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate700 }}>{t("company.esg.certType")}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["participation", "achievement", "completion"] as const).map((ct) => (
              <Pressable key={ct} style={[styles.actionBtn, certType === ct && { backgroundColor: typeColors[ct], borderColor: typeColors[ct] }]} onPress={() => setCertType(ct)}>
                <Text style={[styles.actionBtnText, certType === ct && { color: colors.white }]}>{typeLabels[ct]}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate700 }}>{t("company.esg.selectEmployees")}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Pressable style={[styles.filterBtn, selectedUserIds.length === employees.length && styles.filterBtnActive]} onPress={() => setSelectedUserIds(selectedUserIds.length === employees.length ? [] : employees.map((e) => e.id))}>
              <Text style={[styles.filterBtnText, selectedUserIds.length === employees.length && styles.filterBtnTextActive]}>{selectedUserIds.length === employees.length ? t("company.esg.deselectAll") : t("company.esg.selectAll")}</Text>
            </Pressable>
            {employees.map((e) => (
              <Pressable key={e.id} style={[styles.filterBtn, selectedUserIds.includes(e.id) && styles.filterBtnActive]} onPress={() => toggleUser(e.id)}>
                <Text style={[styles.filterBtnText, selectedUserIds.includes(e.id) && styles.filterBtnTextActive]}>{e.name}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={[styles.genBigBtn, (!certTitle || selectedUserIds.length === 0 || createBulkMutation.isPending) && { opacity: 0.5 }]} onPress={() => createBulkMutation.mutate()} disabled={!certTitle || selectedUserIds.length === 0 || createBulkMutation.isPending}>
            <Text style={styles.genBigBtnText}>{createBulkMutation.isPending ? t("common.generating") : t("company.esg.generateBulk", { count: selectedUserIds.length })}</Text>
          </Pressable>
        </View>
      )}

      {certs.length === 0 ? (
        <Text style={styles.emptyText}>{t("company.esg.noCertificates")}</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {certs.map((c) => (
            <View key={c.id} style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.md, padding: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.slate900 }}>{c.title}</Text>
                  <Text style={{ fontSize: 13, color: colors.slate500, marginTop: 2 }}>{t("company.esg.for")} {c.user?.name ?? t("common.unknown")} ({c.user?.email ?? ""})</Text>
                  {c.description && <Text style={{ fontSize: 13, color: colors.slate500, marginTop: 2 }}>{c.description}</Text>}
                </View>
                <View style={[styles.badge, { backgroundColor: typeColors[c.type] + "20" }]}>
                  <Text style={[styles.badgeText, { color: typeColors[c.type] }]}>{typeLabels[c.type]}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: colors.slate500, marginBottom: 12 }}>{t("company.esg.issuedAt")} {new Date(c.issuedAt).toLocaleDateString("pl-PL")}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable style={[styles.actionBtn, { borderColor: colors.mossGreen, backgroundColor: colors.successBg }]} onPress={() => openCertificateHTML(slug, c.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.mossGreen }]}>{t("company.esg.previewHTML")}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: colors.accentBlue, backgroundColor: "#e0f2fe" }]} onPress={() => downloadCertificatePDF(slug, c.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.accentBlue }]}>{t("company.esg.downloadPDF")}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: colors.errorBorder, backgroundColor: colors.errorBg }]} onPress={() => onDelete(c.id)}>
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>{t("common.delete")}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
