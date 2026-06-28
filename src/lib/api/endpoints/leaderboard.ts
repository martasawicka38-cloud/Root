import { api } from "../client";
import type { CompanyLeaderboardEntry, LeaderboardEntry, LeaderboardPeriod, UserRank } from "../../types/api";

export async function fetchLeaderboard(period: LeaderboardPeriod) {
  const { data } = await api.get<LeaderboardEntry[]>(`/leaderboard/${period}`);
  return data;
}

export async function fetchMyRank(period: LeaderboardPeriod) {
  const { data } = await api.get<UserRank>(`/leaderboard/me/${period}`);
  return data;
}

export async function fetchCompanyLeaderboard(period: LeaderboardPeriod) {
  const { data } = await api.get<CompanyLeaderboardEntry[]>(`/leaderboard/${period}`, { params: { scope: "company" } });
  return data;
}
