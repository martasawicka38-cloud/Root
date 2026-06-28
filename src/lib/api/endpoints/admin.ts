import { api } from "../client";
import type { AdminDashboard, AdminUser, AnalyticsUser, Company, CompanyGlobalPermissionItem, CompanyToken, ChallengeItem, UserStepsPayload } from "../../types/api";

export async function fetchAdminDashboard() {
  const { data } = await api.get<AdminDashboard>("/admin/dashboard");
  return data;
}

export async function fetchAdminUsers() {
  const { data } = await api.get<AdminUser[]>("/admin/users");
  return data;
}

export async function fetchUnassignedUsers() {
  const { data } = await api.get<AdminUser[]>("/admin/users/unassigned");
  return data;
}

export async function toggleUserActive(id: string) {
  const { data } = await api.patch<{ id: string; isActive: boolean }>(`/admin/users/${id}/toggle-active`);
  return data;
}

export async function assignUserToCompany(userId: string, companyId: string) {
  const { data } = await api.patch(`/admin/users/${userId}/assign-company`, { companyId });
  return data;
}

export async function removeUserFromCompany(userId: string) {
  const { data } = await api.patch(`/admin/users/${userId}/remove-company`);
  return data;
}

export async function fetchCompanies() {
  const { data } = await api.get<Company[]>("/admin/companies");
  return data;
}

export async function createCompany(input: { name: string; slug: string }) {
  const { data } = await api.post<Company>("/admin/companies", input);
  return data;
}

export async function generateCompanyToken() {
  const { data } = await api.post<CompanyToken>("/admin/generate-company-token");
  return data;
}

export async function fetchCompanyTokens() {
  const { data } = await api.get<CompanyToken[]>("/admin/company-tokens");
  return data;
}

export async function generateEmployerToken(companyId: string) {
  const { data } = await api.post<CompanyToken>(`/admin/companies/${companyId}/generate-employer-token`);
  return data;
}

export async function fetchEmployerTokens(companyId: string) {
  const { data } = await api.get<CompanyToken[]>(`/admin/companies/${companyId}/tokens`);
  return data;
}

export async function fetchCompanyUsers(companyId: string) {
  const { data } = await api.get<AdminUser[]>(`/admin/companies/${companyId}/users`);
  return data;
}

export async function adminCreateUser(input: { name: string; email: string; password: string; role: "user" | "company" }) {
  const { data } = await api.post("/admin/users", input);
  return data;
}

export async function adminEditUser(id: string, input: { name?: string; email?: string; stepGoal?: number }) {
  const { data } = await api.patch(`/admin/users/${id}`, input);
  return data;
}

export async function adminDeleteUser(id: string) {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
}

export async function fetchAnalyticsUsers() {
  const { data } = await api.get<AnalyticsUser[]>("/admin/analytics/users");
  return data;
}

export async function fetchUserSteps(userId: string, period: "day" | "week" | "month", from?: string, to?: string) {
  const { data } = await api.get<UserStepsPayload>(`/admin/user-steps/${userId}`, { params: { period, from, to } });
  return data;
}

export async function fetchGlobalPermissions() {
  const { data } = await api.get<CompanyGlobalPermissionItem[]>("/admin/global-permissions");
  return data;
}

export async function grantGlobalPermission(companyId: string) {
  const { data } = await api.post<CompanyGlobalPermissionItem>("/admin/global-permissions", { companyId });
  return data;
}

export async function revokeGlobalPermission(id: string) {
  const { data } = await api.delete<{ ok: boolean }>(`/admin/global-permissions/${id}`);
  return data;
}

export async function fetchAdminChallenges() {
  const { data } = await api.get<(ChallengeItem & { company: { id: string; name: string; slug: string } | null; _count: { participations: number } })[]>("/admin/challenges");
  return data;
}

export async function adminCreateChallenge(input: { title: string; description?: string; points: number; startsAt?: string; endsAt?: string }) {
  const { data } = await api.post<ChallengeItem>("/admin/challenges", input);
  return data;
}
