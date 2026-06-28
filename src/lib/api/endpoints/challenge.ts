import { api } from "../client";
import type { ChallengeItem, ChallengeParticipationItem } from "../../types/api";

export async function fetchChallenges() {
  type ChallengesResponse =
    | { company: ChallengeItem[]; canCreateGlobal: boolean }
    | { global: ChallengeItem[] }
    | { available: (ChallengeItem & { participations?: { id: string; progress: number; completed: boolean }[] })[]; joined: ChallengeParticipationItem[] };
  const { data } = await api.get<ChallengesResponse>("/challenges");
  return data;
}

export async function createChallenge(input: { title: string; description?: string; points: number; scope: "company" | "global"; startsAt?: string; endsAt?: string }) {
  const { data } = await api.post<ChallengeItem>("/challenges", input);
  return data;
}

export async function updateChallenge(id: string, input: { title?: string; description?: string; points?: number; active?: boolean; startsAt?: string; endsAt?: string }) {
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
