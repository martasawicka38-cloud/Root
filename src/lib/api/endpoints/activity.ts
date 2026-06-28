import { api } from "../client";
import type { Activity, Declaration, EcoActivity, UserEcoActivityLog, SubmitActivityResponse } from "../../types/api";

export async function fetchActivities() {
  const { data } = await api.get<Activity[]>("/activity");
  return data;
}

export async function addActivity(input: { type: Activity["type"]; minutes: number }) {
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
  const { data } = await api.post<{ ok: boolean; message?: string; exp?: number; canTransform?: boolean }>("/declarations", input);
  return data;
}

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
