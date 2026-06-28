import { api } from "../client";
import type { Certificate, CertificateType } from "../../types/api";

export async function generateCertificate(slug: string, input: { userId: string; type: CertificateType; title: string; description?: string; reportId?: string }) {
  const { data } = await api.post<Certificate>(`/company/${slug}/certificates`, input);
  return data;
}

export async function generateBulkCertificates(slug: string, input: { userIds: string[]; type: CertificateType; title: string; description?: string; reportId?: string }) {
  const { data } = await api.post<Certificate[]>(`/company/${slug}/certificates/bulk`, input);
  return data;
}

export async function fetchCertificates(slug: string) {
  const { data } = await api.get<Certificate[]>(`/company/${slug}/certificates`);
  return data;
}

export async function openCertificateHTML(slug: string, certId: string) {
  const { data } = await api.get(`/company/${slug}/certificates/${certId}/html`, { responseType: "text" });
  const win = window.open("", "_blank");
  if (win) { win.document.write(data); win.document.close(); }
}

export async function downloadCertificatePDF(slug: string, certId: string) {
  const { data } = await api.get(`/company/${slug}/certificates/${certId}/pdf`, { responseType: "blob" });
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `certyfikat-${certId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function deleteCertificate(slug: string, certId: string) {
  const { data } = await api.delete<{ ok: boolean }>(`/company/${slug}/certificates/${certId}`);
  return data;
}
