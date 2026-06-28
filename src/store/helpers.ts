import type { ActivityType } from "./types";

export const activityRates: Record<ActivityType, number> = {
  walking: 120,
  running: 200,
  cycling: 150,
  swimming: 180,
  yoga: 50,
  gym: 100,
};

export const nowIso = () => new Date().toISOString();
