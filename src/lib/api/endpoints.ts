import { api } from "./client";
import type {
  AchievementItem,
  Activity,
  AdminDashboard,
  AdminUser,
  AuthUser,
  ChallengePayload,
  Company,
  CompanyToken,
  Declaration,
  LoginResponse,
  NotificationItem,
  RankingPayload,
  Reward,
  TxItem,
  TxType,
  UserProfile,
  UserRole,
} from "../types/api";

export async function fetchMe() {
  const { data } = await api.get<UserProfile>("/auth/me");
  return data;
}

export async function fetchWallet() {
  const { data } = await api.get<{ balance: number }>("/wallet");
  return data;
}

export async function fetchHistory(type: TxType | "all" = "all") {
  const { data } = await api.get<TxItem[]>("/history", { params: { type } });
  return data;
}

export async function fetchMarket() {
  const { data } = await api.get<Reward[]>("/market");
  return data;
}

export async function redeemReward(rewardId: string) {
  const { data } = await api.post<{
    ok: boolean;
    code?: string;
    message?: string;
  }>("/market/redeem", { rewardId });
  return data;
}

export async function fetchActivities() {
  const { data } = await api.get<Activity[]>("/activity");
  return data;
}

export async function addActivity(input: {
  type: Activity["type"];
  minutes: number;
}) {
  const { data } = await api.post<Activity>("/activity", input);
  return data;
}

export async function deleteActivity(id: string) {
  const { data } = await api.delete<{ ok: boolean }>(`/activity/${id}`);
  return data;
}

export async function fetchDeclarations() {
  const { data } = await api.get<Declaration[]>("/declarations");
  return data;
}

export async function addDeclaration(input: { name: string; points: number }) {
  const { data } = await api.post<{ ok: boolean; message?: string }>(
    "/declarations",
    input,
  );
  return data;
}

export async function fetchNotifications() {
  const { data } = await api.get<NotificationItem[]>("/notifications");
  return data;
}

export async function readAllNotifications() {
  const { data } = await api.post<{ ok: boolean }>("/notifications/read-all");
  return data;
}

export async function fetchAchievements() {
  const { data } = await api.get<AchievementItem[]>("/achievements");
  return data;
}

export async function fetchRanking() {
  const { data } = await api.get<RankingPayload>("/ranking");
  return data;
}

export async function fetchChallenge() {
  const { data } = await api.get<ChallengePayload>("/challenge/current");
  return data;
}

export async function patchProfile(input: {
  name: string;
  stepGoal: number;
  partner: string;
}) {
  const { data } = await api.patch<UserProfile>("/profile", input);
  return data;
}

export async function fetchAdminDashboard() {
  const { data } = await api.get<AdminDashboard>("/admin/dashboard");
  return data;
}

export async function loginUser(input: { email: string; password: string }) {
  const { data } = await api.post<LoginResponse>("/auth/login", input);
  return data;
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  role: "user" | "employer" | "company";
  partner?: string;
  companyToken?: string;
  companyName?: string;
  companySlug?: string;
}) {
  const { data } = await api.post<{ id: string; email: string; role: string }>(
    "/auth/register",
    input,
  );
  return data;
}

export async function fetchAuthMe() {
  const { data } = await api.get<AuthUser>("/auth/me");
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
  const { data } = await api.patch<{ id: string; isActive: boolean }>(
    `/admin/users/${id}/toggle-active`,
  );
  return data;
}

export async function assignUserToCompany(userId: string, companyId: string) {
  const { data } = await api.patch(
    `/admin/users/${userId}/assign-company`,
    { companyId },
  );
  return data;
}

export async function removeUserFromCompany(userId: string) {
  const { data } = await api.patch(
    `/admin/users/${userId}/remove-company`,
  );
  return data;
}

export async function fetchCompanies() {
  const { data } = await api.get<Company[]>("/admin/companies");
  return data;
}

export async function fetchPublicCompanies() {
  const { data } = await api.get<Pick<Company, "id" | "name" | "slug">[]>("/companies");
  return data;
}

export async function createCompany(input: { name: string; slug: string }) {
  const { data } = await api.post<Company>("/admin/companies", input);
  return data;
}

export async function generateCompanyToken() {
  const { data } = await api.post<CompanyToken>(
    "/admin/generate-company-token",
  );
  return data;
}

export async function fetchCompanyTokens() {
  const { data } = await api.get<CompanyToken[]>(
    "/admin/company-tokens",
  );
  return data;
}

export async function generateEmployerToken(companyId: string) {
  const { data } = await api.post<CompanyToken>(
    `/admin/companies/${companyId}/generate-employer-token`,
  );
  return data;
}

export async function fetchEmployerTokens(companyId: string) {
  const { data } = await api.get<CompanyToken[]>(
    `/admin/companies/${companyId}/tokens`,
  );
  return data;
}

export async function fetchCompanyUsers(companyId: string) {
  const { data } = await api.get<AdminUser[]>(
    `/admin/companies/${companyId}/users`,
  );
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
    recentActivity: { id: string; userName: string; type: string; points: number; createdAt: string }[];
  }>(`/company/${slug}/analytics`);
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

export async function companyEditEmployee(slug: string, id: string, input: { name?: string; email?: string }) {
  const { data } = await api.patch(`/company/${slug}/employees/${id}`, input);
  return data;
}

export async function companyRemoveEmployee(slug: string, id: string) {
  const { data } = await api.delete(`/company/${slug}/employees/${id}`);
  return data;
}
