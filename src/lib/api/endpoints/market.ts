import { api } from "../client";
import type { Reward, TxItem, TxType } from "../../types/api";

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
  const { data } = await api.post<{ ok: boolean; code?: string; message?: string }>("/market/redeem", { rewardId });
  return data;
}
