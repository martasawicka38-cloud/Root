import { api } from "../client";
import type { NotificationItem } from "../../types/api";

export async function fetchNotifications() {
  const { data } = await api.get<NotificationItem[]>("/notifications");
  return data;
}

export async function readAllNotifications() {
  const { data } = await api.post<{ ok: boolean }>("/notifications/read-all");
  return data;
}

export async function fetchAchievements() {
  const { data } = await api.get<import("../../types/api").AchievementItem[]>("/achievements");
  return data;
}

export async function fetchRanking() {
  const { data } = await api.get<import("../../types/api").RankingPayload>("/ranking");
  return data;
}

export async function fetchChallenge() {
  const { data } = await api.get<import("../../types/api").ChallengePayload>("/challenge/current");
  return data;
}
