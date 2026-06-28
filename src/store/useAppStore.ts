import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AppState } from "./types";
import { txSeed } from "./seeds";
import { activityRates, nowIso } from "./helpers";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      userRole: null,
      onboardingStep: 0,
      partner: "intel",
      balance: 450,
      declarationsToday: 0,
      declarationLimit: 3,
      txHistory: txSeed,
      activityLog: [],
      selectedReward: null,
      redeemedCode: null,
      unreadNotifications: 3,
      achievedIds: ["first-step", "streak-3"],
      marketFilter: "all",
      historyFilter: "all",
      profileName: "Jan Kowalski",
      profileEmail: "jan@intel.com",
      stepGoal: 8000,

      login: (token, role, name, email) => {
        if (typeof window !== "undefined") localStorage.setItem("auth-token", token);
        set({ isAuthenticated: true, accessToken: token, userRole: role, profileName: name, profileEmail: email, balance: 0, declarationsToday: 0, txHistory: [], activityLog: [], unreadNotifications: 0, achievedIds: [], selectedReward: null, redeemedCode: null });
      },

      logout: () => {
        if (typeof window !== "undefined") localStorage.removeItem("auth-token");
        set({ isAuthenticated: false, accessToken: null, userRole: null, onboardingStep: 0, selectedReward: null, redeemedCode: null });
      },

      setPartner: (partner) => set({ partner, profileEmail: partner === "intel" ? "jan@intel.com" : "jan@hestia.pl" }),
      nextOnboarding: () => set((s) => ({ onboardingStep: Math.min(2, s.onboardingStep + 1) })),
      finishOnboarding: () => set({ onboardingStep: 2 }),
      canDeclare: () => get().declarationsToday < get().declarationLimit,

      addDeclaration: (name, points) => {
        if (!get().canDeclare()) return;
        set((s) => ({
          declarationsToday: s.declarationsToday + 1,
          balance: s.balance + points,
          txHistory: [{ id: `tx-${Date.now()}`, name, points, type: "earned", createdAt: nowIso() }, ...s.txHistory],
        }));
      },

      addActivity: (type, minutes) => {
        const steps = Math.max(0, Math.floor(minutes * activityRates[type]));
        const points = Math.min(40, Math.floor(steps / 200));
        set((s) => ({
          activityLog: [{ id: `act-${Date.now()}`, type, minutes, steps, points, createdAt: nowIso() }, ...s.activityLog],
          balance: s.balance + points,
          txHistory: [{ id: `tx-${Date.now()}`, name: `Aktywnosc ${type} (${minutes} min)`, points, type: "earned", createdAt: nowIso() }, ...s.txHistory],
        }));
      },

      updateActivity: (id, minutes) => {
        const found = get().activityLog.find((a) => a.id === id);
        if (!found) return;
        const steps = Math.max(0, Math.floor(minutes * activityRates[found.type]));
        const points = Math.min(40, Math.floor(steps / 200));
        const delta = points - found.points;
        set((s) => ({
          activityLog: s.activityLog.map((a) => a.id === id ? { ...a, minutes, steps, points } : a),
          balance: s.balance + delta,
        }));
      },

      deleteActivity: (id) => {
        const found = get().activityLog.find((a) => a.id === id);
        if (!found) return;
        set((s) => ({ activityLog: s.activityLog.filter((a) => a.id !== id), balance: Math.max(0, s.balance - found.points) }));
      },

      selectReward: (reward) => set({ selectedReward: reward, redeemedCode: null }),

      redeemReward: () => {
        const reward = get().selectedReward;
        if (!reward) return { ok: false, message: "Brak wybranej nagrody." };
        if (get().balance < reward.cost) return { ok: false, message: "Za malo EC." };
        set((s) => ({
          balance: s.balance - reward.cost,
          redeemedCode: reward.code,
          txHistory: [{ id: `tx-${Date.now()}`, name: reward.title, points: -reward.cost, type: "spent", createdAt: nowIso() }, ...s.txHistory],
        }));
        return { ok: true, message: "Nagroda wymieniona." };
      },

      setMarketFilter: (filter) => set({ marketFilter: filter }),
      setHistoryFilter: (filter) => set({ historyFilter: filter }),
      readAllNotifications: () => set({ unreadNotifications: 0 }),
      saveProfile: (name, stepGoal) => set({ profileName: name, stepGoal }),
    }),
    {
      name: "root-app-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        userRole: state.userRole,
        onboardingStep: state.onboardingStep,
        partner: state.partner,
        balance: state.balance,
        declarationsToday: state.declarationsToday,
        txHistory: state.txHistory,
        activityLog: state.activityLog,
        unreadNotifications: state.unreadNotifications,
        achievedIds: state.achievedIds,
        profileName: state.profileName,
        profileEmail: state.profileEmail,
        stepGoal: state.stepGoal,
      }),
    },
  ),
);

export type { ActivityLog, Reward, TxItem } from "./types";
