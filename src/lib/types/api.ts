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
  totalExp: number;
  canTransform: boolean;
  rootStageId: string | null;
  rootStage: RootStage | null;
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

export type RankingPayload = LeaderboardEntry[];

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
  usedBy: string | null;
  createdAt: string;
};

export type ChallengeItem = {
  id: string;
  title: string;
  description: string | null;
  points: number;
  scope: "company" | "global";
  companyId: string | null;
  createdByUserId: string | null;
  grantedById: string | null;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  company?: { id: string; name: string; slug: string } | null;
  _count?: { participations: number };
  participations?: { id: string; progress: number; completed: boolean }[];
};

export type ChallengeParticipationItem = {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  challenge: ChallengeItem;
};

export type CompanyGlobalPermissionItem = {
  id: string;
  companyId: string;
  company: { id: string; name: string; slug: string };
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

// --- Gamification Types ---

export type EcoCategory = "MOBILITY" | "CIRCULARITY" | "LOCAL_CONSUMPTION" | "NATURE_ACTIVITY";

export type EcoActivity = {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: EcoCategory;
  basePoints: number;
  active: boolean;
  createdAt: string;
};

export type UserEcoActivityLog = {
  id: string;
  userId: string;
  ecoActivityId: string;
  basePoints: number;
  multiplier: number;
  leaderboardPts: number;
  expPoints: number;
  createdAt: string;
  ecoActivity: {
    name: string;
    icon: string;
    category: EcoCategory;
    basePoints: number;
  };
};

export type SubmitActivityResponse = {
  ok: boolean;
  log: UserEcoActivityLog;
  canTransform: boolean;
  nextStage: RootStage | null;
  points: { exp: number; leaderboard: number };
  caps: {
    categoryRemaining: number;
    globalRemaining: number;
    diminishingMultiplier: number;
    firstTimeBonus: boolean;
    synergyBonus: boolean;
  };
  message: string;
};

export type RootStage = {
  id: string;
  name: string;
  level: number;
  expRequired: number;
  description: string | null;
};

export type RootStatus = {
  totalExp: number;
  currentStage: RootStage | null;
  nextStage: RootStage | null;
  canTransform: boolean;
};

export type TransformResponse = {
  ok: boolean;
  stage?: RootStage;
  message?: string;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  points: number;
  rootStage: { name: string; level: number } | null;
};

export type CompanyLeaderboardEntry = {
  rank: number;
  slug: string;
  name: string;
  points: number;
  memberCount: number;
};

export type UserRank = {
  userId: string;
  points: number;
  rank: number | null;
  totalParticipants: number;
};

export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
