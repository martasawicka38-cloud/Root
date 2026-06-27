import axios from "axios";

import { useAppStore } from "../../store/useAppStore";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAppStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
