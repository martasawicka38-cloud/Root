export type TxType = "earned" | "spent";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  team: { name: string; points: number }[];
  individual: { name: string; points: number }[];
};

export type ChallengePayload = {
  title: string;
  team: string;
  progress: number;
  daysDone: number;
  daysTotal: number;
  reward: number;
};

export type AdminDashboard = {
  users: {
    total: number;
    regularUsers: number;
    companyAccounts: number;
    totalEmployees: number;
    activeDeclarations: number;
    participationRate: number;
  };
  companies: {
    id: string;
    name: string;
    slug: string;
    employeeCount: number;
  }[];
  economy: {
    totalEcInCirculation: number;
    totalEarned: number;
    totalSpent: number;
  };
  activity: {
    totalActivities: number;
    totalSteps: number;
    avgStepsPerActivity: number;
    weeklySteps: { day: string; steps: number }[];
  };
  recentActivity: {
    id: string;
    userName: string;
    type: string;
    points: number;
    createdAt: string;
  }[];
};

export type UserRole = "user" | "employer" | "company" | "superadmin";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  partner: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count?: { users: number; tokens: number };
};

export type CompanyToken = {
  id: string;
  companyId: string | null;
  type: "company_registration" | "employer_registration";
  token: string;
  used: boolean;
  usedAt: string | null;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  partner: string;
  balance: number;
  createdAt: string;
  companyId: string | null;
  company: { id: string; name: string } | null;
};
