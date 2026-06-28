export type Partner = "intel" | "ergo";
export type UserRole = "user" | "employer" | "company" | "superadmin";
export type TxType = "earned" | "spent";

export type TxItem = {
  id: string;
  name: string;
  points: number;
  type: TxType;
  createdAt: string;
};

export type ActivityType = "walking" | "running" | "cycling" | "swimming" | "yoga" | "gym";

export type ActivityLog = {
  id: string;
  type: ActivityType;
  minutes: number;
  steps: number;
  points: number;
  createdAt: string;
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

export type AppState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  userRole: UserRole | null;
  onboardingStep: number;
  partner: Partner;
  balance: number;
  declarationsToday: number;
  declarationLimit: number;
  txHistory: TxItem[];
  activityLog: ActivityLog[];
  selectedReward: Reward | null;
  redeemedCode: string | null;
  unreadNotifications: number;
  achievedIds: string[];
  marketFilter: "all" | "food" | "wellness" | "sport" | "eco";
  historyFilter: "all" | TxType;
  profileName: string;
  profileEmail: string;
  stepGoal: number;
  login: (token: string, role: UserRole, name: string, email: string) => void;
  logout: () => void;
  setPartner: (partner: Partner) => void;
  nextOnboarding: () => void;
  finishOnboarding: () => void;
  addDeclaration: (name: string, points: number) => void;
  canDeclare: () => boolean;
  addActivity: (type: ActivityType, minutes: number) => void;
  updateActivity: (id: string, minutes: number) => void;
  deleteActivity: (id: string) => void;
  selectReward: (reward: Reward) => void;
  redeemReward: () => { ok: boolean; message: string };
  setMarketFilter: (filter: AppState["marketFilter"]) => void;
  setHistoryFilter: (filter: AppState["historyFilter"]) => void;
  readAllNotifications: () => void;
  saveProfile: (name: string, stepGoal: number) => void;
};
