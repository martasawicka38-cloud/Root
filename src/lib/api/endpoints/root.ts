import { api } from "../client";
import type { RootStatus, TransformResponse } from "../../types/api";

export async function fetchRootStatus() {
  const { data } = await api.get<RootStatus>("/root/status");
  return data;
}

export async function transformRoot() {
  const { data } = await api.post<TransformResponse>("/root/transform");
  return data;
}
