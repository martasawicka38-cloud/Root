import { api } from "../client";
import type { Company, CompanyToken } from "../../types/api";

export async function fetchPublicCompanies() {
  const { data } = await api.get<Pick<Company, "id" | "name" | "slug">[]>("/companies");
  return data;
}

export async function fetchCompanyBySlug(slug: string) {
  const { data } = await api.get<Company & { _count: { users: number; tokens: number } }>(`/company/${slug}`);
  return data;
}

export async function fetchCompanyEmployees(slug: string) {
  const { data } = await api.get<{ id: string; email: string; name: string; isActive: boolean; balance: number; stepGoal: number; createdAt: string }[]>(`/company/${slug}/employees`);
  return data;
}

export async function fetchCompanyAnalytics(slug: string) {
  const { data } = await api.get<{
    employees: { id: string; name: string; points: number }[];
    totalActivities: number;
    totalSteps: number;
    totalDeclarations: number;
    totalEarned: number;
    totalPoints: number;
    weeklySteps: { day: string; steps: number }[];
    weeklySteps9: { label: string; steps: number }[];
    monthlySteps12: { label: string; steps: number }[];
    recentActivity: { id: string; userName: string; type: string; points: number; createdAt: string }[];
  }>(`/company/${slug}/analytics`);
  return data;
}

export async function fetchCompanyEmployeeSteps(slug: string, employeeId: string, period: "day" | "week" | "month", from?: string, to?: string) {
  const { data } = await api.get<{
    employee: { id: string; name: string; email: string; balance: number };
    data: { label: string; steps: number }[];
  }>(`/company/${slug}/employee-steps/${employeeId}`, { params: { period, from, to } });
  return data;
}

export async function fetchCompanyTokensBySlug(slug: string) {
  const { data } = await api.get<CompanyToken[]>(`/company/${slug}/tokens`);
  return data;
}

export async function generateEmployerTokenBySlug(slug: string) {
  const { data } = await api.post<CompanyToken>(`/company/${slug}/generate-token`);
  return data;
}

export async function companyEditEmployee(slug: string, id: string, input: { name?: string; email?: string }) {
  const { data } = await api.patch(`/company/${slug}/employees/${id}`, input);
  return data;
}

export async function companyRemoveEmployee(slug: string, id: string) {
  const { data } = await api.delete(`/company/${slug}/employees/${id}`);
  return data;
}
