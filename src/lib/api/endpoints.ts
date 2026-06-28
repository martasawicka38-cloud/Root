import { api } from "./client";
import type {
  AchievementItem,
  Activity,
  AdminDashboard,
  AdminUser,
  AnalyticsUser,
  AuthUser,
  Certificate,
  CertificateType,
  ChallengeItem,
  ChallengeParticipationItem,
  ChallengePayload,
  Company,
  CompanyGlobalPermissionItem,
  CompanyLeaderboardEntry,
  CompanyToken,
  Declaration,
  ESGReport,
  ESGReportListItem,
  LoginResponse,
  NotificationItem,
  RankingPayload,
  Reward,
  TxItem,
  TxType,
  UserProfile,
  EcoActivity,
  UserEcoActivityLog,
  UserStepsPayload,
  SubmitActivityResponse,
  RootStatus,
  TransformResponse,
  LeaderboardEntry,
  UserRank,
  LeaderboardPeriod,
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
  const { data } = await api.post<{ ok: boolean; message?: string; exp?: number; canTransform?: boolean }>(
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

// Challenge endpoints
export async function fetchChallenges() {
  type ChallengesResponse =
    | { company: ChallengeItem[]; canCreateGlobal: boolean }
    | { global: ChallengeItem[] }
    | { available: (ChallengeItem & { participations?: { id: string; progress: number; completed: boolean }[] })[]; joined: ChallengeParticipationItem[] };
  const { data } = await api.get<ChallengesResponse>("/challenges");
  return data;
}

export async function createChallenge(input: {
  title: string;
  description?: string;
  points: number;
  scope: "company" | "global";
  startsAt?: string;
  endsAt?: string;
}) {
  const { data } = await api.post<ChallengeItem>("/challenges", input);
  return data;
}

export async function updateChallenge(id: string, input: {
  title?: string;
  description?: string;
  points?: number;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
}) {
  const { data } = await api.patch<ChallengeItem>(`/challenges/${id}`, input);
  return data;
}

export async function deleteChallenge(id: string) {
  const { data } = await api.delete<{ ok: boolean }>(`/challenges/${id}`);
  return data;
}

export async function joinChallenge(id: string) {
  const { data } = await api.post<ChallengeParticipationItem>(`/challenges/${id}/join`);
  return data;
}

export async function updateChallengeProgress(id: string, progress: number) {
  const { data } = await api.post<ChallengeParticipationItem>(`/challenges/${id}/progress`, { progress });
  return data;
}

export async function fetchChallengeParticipants(id: string) {
  const { data } = await api.get<{ id: string; user: { id: string; name: string; email: string }; progress: number; completed: boolean }[]>(`/challenges/${id}/participants`);
  return data;
}

// Admin challenge endpoints
export async function fetchAdminChallenges() {
  const { data } = await api.get<(ChallengeItem & { company: { id: string; name: string; slug: string } | null; _count: { participations: number } })[]>("/admin/challenges");
  return data;
}

export async function adminCreateChallenge(input: {
  title: string;
  description?: string;
  points: number;
  startsAt?: string;
  endsAt?: string;
}) {
  const { data } = await api.post<ChallengeItem>("/admin/challenges", input);
  return data;
}

// Global permission endpoints
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

// --- Gamification API ---

export async function fetchEcoActivities() {
  const { data } = await api.get<EcoActivity[]>("/eco-activities");
  return data;
}

export async function submitEcoActivity(ecoActivityId: string) {
  const { data } = await api.post<SubmitActivityResponse>("/eco-activities/submit", { ecoActivityId });
  return data;
}

export async function fetchEcoActivityLogs() {
  const { data } = await api.get<UserEcoActivityLog[]>("/eco-activities/my-logs");
  return data;
}

// Admin endpoints for reward activities
export async function createRewardActivity(input: {
  name: string;
  description?: string;
  icon: string;
  category: string;
  basePoints: number;
  activityType: string;
  expiresAt?: string;
  companyId: string;
}) {
  const { data } = await api.post<EcoActivity>("/eco-activities/admin/create", input);
  return data;
}

export async function deleteRewardActivity(id: string) {
  const { data } = await api.delete<{ ok: boolean }>(`/eco-activities/admin/${id}`);
  return data;
}

export async function fetchCompanyActivities(companyId: string) {
  const { data } = await api.get<EcoActivity[]>(`/eco-activities/admin/company/${companyId}`);
  return data;
}

export async function fetchLeaderboard(period: LeaderboardPeriod) {
  const { data } = await api.get<LeaderboardEntry[]>(`/leaderboard/${period}`);
  return data;
}

export async function fetchMyRank(period: LeaderboardPeriod) {
  const { data } = await api.get<UserRank>(`/leaderboard/me/${period}`);
  return data;
}

export async function fetchCompanyLeaderboard(period: LeaderboardPeriod) {
  const { data } = await api.get<CompanyLeaderboardEntry[]>(`/leaderboard/${period}`, {
    params: { scope: "company" },
  });
  return data;
}

export async function fetchRootStatus() {
  const { data } = await api.get<RootStatus>("/root/status");
  return data;
}

export async function transformRoot() {
  const { data } = await api.post<TransformResponse>("/root/transform");
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

// --- ESG Report API ---

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
  if (win) {
    win.document.write(data);
    win.document.close();
  }
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

// --- Certificate API ---

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
  if (win) {
    win.document.write(data);
    win.document.close();
  }
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
