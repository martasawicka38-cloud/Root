export type TxType = "earned" | "spent";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  partner: string;
  stepGoal: number;
  balance: number;
  declarationsToday: number;
};

export type Reward = {
  id: string;
  icon: string;
  title: string;
  merchant: string;
  category: "food" | "wellness" | "sport" | "eco";
  cost: number;
  code: string;
  description: string;
};

export type Activity = {
  id: string;
  type: "walking" | "running" | "cycling" | "swimming" | "yoga" | "gym";
  minutes: number;
  steps: number;
  points: number;
  createdAt: string;
};

export type Declaration = {
  id: string;
  name: string;
  points: number;
  createdAt: string;
};

export type TxItem = {
  id: string;
  name: string;
  points: number;
  type: TxType;
  createdAt: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type AchievementItem = {
  id: string;
  key: string;
  title: string;
  unlockedAt: string;
};

export type RankingPayload = {
  team: Array<{ name: string; points: number }>;
  individual: Array<{ name: string; points: number }>;
};

export type ChallengePayload = {
  title: string;
  team: string;
  progress: number;
  daysDone: number;
  daysTotal: number;
  reward: number;
};
