import { api } from "./client";
import type {
  AchievementItem,
  Activity,
  AdminDashboard,
  ChallengePayload,
  Declaration,
  NotificationItem,
  RankingPayload,
  Reward,
  TxItem,
  TxType,
  UserProfile,
} from "../types/api";

export async function fetchMe() {
  const { data } = await api.get<UserProfile>("/me");
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
