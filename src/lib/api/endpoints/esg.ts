import { api } from "../client";
import type { ESGReport, ESGReportListItem } from "../../types/api";

export async function generateESGReport(slug: string, input: { title: string; description?: string; periodFrom: string; periodTo: string }) {
  const { data } = await api.post<ESGReport>(`/company/${slug}/esg-reports`, input);
  return data;
}

export async function fetchESGReports(slug: string) {
  const { data } = await api.get<ESGReportListItem[]>(`/company/${slug}/esg-reports`);
  return data;
}

export async function fetchESGReportById(slug: string, reportId: string) {
  const { data } = await api.get<ESGReport>(`/company/${slug}/esg-reports/${reportId}`);
  return data;
}

export async function updateESGReport(slug: string, reportId: string, input: { status?: "draft" | "published" | "archived" }) {
  const { data } = await api.patch<ESGReport>(`/company/${slug}/esg-reports/${reportId}`, input);
  return data;
}

export async function deleteESGReport(slug: string, reportId: string) {
  const { data } = await api.delete<{ ok: boolean }>(`/company/${slug}/esg-reports/${reportId}`);
  return data;
}

export async function openESGReportHTML(slug: string, reportId: string) {
  const { data } = await api.get(`/company/${slug}/esg-reports/${reportId}/html`, { responseType: "text" });
  const win = window.open("", "_blank");
  if (win) { win.document.write(data); win.document.close(); }
}

export async function downloadESGReportPDF(slug: string, reportId: string) {
  const { data } = await api.get(`/company/${slug}/esg-reports/${reportId}/pdf`, { responseType: "blob" });
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `raport-esg-${reportId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadESGReportDOCX(slug: string, reportId: string) {
  const { data } = await api.get(`/company/${slug}/esg-reports/${reportId}/docx`, { responseType: "blob" });
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `raport-esg-${reportId}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
