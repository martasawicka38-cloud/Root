import { api } from "../client";
import type { AuthUser, LoginResponse, UserProfile } from "../../types/api";

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
  const { data } = await api.post<{ id: string; email: string; role: string }>("/auth/register", input);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<UserProfile>("/auth/me");
  return data;
}

export async function fetchAuthMe() {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}

export async function patchProfile(input: { name: string; stepGoal: number; partner: string }) {
  const { data } = await api.patch<UserProfile>("/profile", input);
  return data;
}
