import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import { ACTIVITY_CONFIG } from "./activity.config";

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async listEcoActivities(userId?: string) {
    // Get user's companyId if logged in
    let companyId: string | null = null;
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true },
      });
      companyId = user?.companyId ?? null;
    }

    const activities = await this.prisma.ecoActivity.findMany({
      where: {
        active: true,
        OR: [
          { companyId: null }, // Global activities
          { companyId: companyId }, // Company-specific activities for user's company
        ],
      },
      orderBy: { category: "asc" },
    });

    // Filter out expired cyclical activities
    const now = new Date();
    const validActivities = activities.filter((a) => {
      if (a.activityType === "cyclical" && a.expiresAt && a.expiresAt < now) {
        return false;
      }
      return true;
    });

    if (!userId) return validActivities;

    const todayStart = this.getDayStart();
    const todayLogs = await this.prisma.userEcoActivityLog.findMany({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
      select: { ecoActivityId: true },
    });
    const todayIds = new Set(todayLogs.map((l) => l.ecoActivityId));

    // For one-time activities, check if user has ever completed them
    const oneTimeIds = new Set(
      validActivities
        .filter((a) => a.activityType === "one_time")
        .map((a) => a.id)
    );

    const completedOneTimeLogs = await this.prisma.userEcoActivityLog.findMany({
      where: {
        userId,
        ecoActivityId: { in: Array.from(oneTimeIds) },
      },
      select: { ecoActivityId: true },
    });
    const completedOneTimeIds = new Set(
      completedOneTimeLogs.map((l) => l.ecoActivityId)
    );

    return validActivities.map((a) => ({
      ...a,
      completedToday: todayIds.has(a.id),
      completedOneTime: a.activityType === "one_time" && completedOneTimeIds.has(a.id),
    }));
  }

  async getUserLogs(userId: string) {
    return this.prisma.userEcoActivityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        ecoActivity: {
          select: { name: true, icon: true, category: true, basePoints: true },
        },
      },
    });
  }

  private getWeekStart(date = new Date()): Date {
    const day = date.getUTCDay();
    const offset = (day + 6) % 7;
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - offset, 0, 0, 0, 0));
  }

  private getDayStart(date = new Date()): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
  }

  async submitActivity(userId: string, ecoActivityId: string) {
    const ecoActivity = await this.prisma.ecoActivity.findUnique({
      where: { id: ecoActivityId },
    });
    if (!ecoActivity) {
      return { ok: false, message: "Aktywnosc nie istnieje." };
    }

    // Check if activity is expired
    if (ecoActivity.activityType === "cyclical" && ecoActivity.expiresAt && ecoActivity.expiresAt < new Date()) {
      return { ok: false, message: "Ta aktywnosc juz wygasla." };
    }

    // Check if user has access to this activity
    if (ecoActivity.companyId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true },
      });
      if (user?.companyId !== ecoActivity.companyId) {
        return { ok: false, message: "Nie masz dostepu do tej aktywnosci." };
      }
    }

    // For one-time activities, check if already completed
    if (ecoActivity.activityType === "one_time") {
      const existingLog = await this.prisma.userEcoActivityLog.findFirst({
        where: { userId, ecoActivityId },
      });
      if (existingLog) {
        return { ok: false, message: "Ta aktywnosc jednorazowa zostala juz wykonana." };
      }
    }

    const todayStart = this.getDayStart();
    const alreadyDone = await this.prisma.userEcoActivityLog.count({
      where: { userId, ecoActivityId, createdAt: { gte: todayStart } },
    });
    if (alreadyDone > 0) {
      return { ok: false, message: "Tę aktywnosc mozesz wykonac tylko raz dziennie." };
    }

    return this.prisma.$transaction(async (tx) => {
      const now = new Date();

      const previousCount = await tx.userEcoActivityLog.count({
        where: { userId, ecoActivityId },
      });
      const isFirstTime = previousCount === 0;
      const firstTimeMultiplier = isFirstTime ? 2.0 : 1.0;

      const weekStart = this.getWeekStart(now);

      const weekCount = await tx.userEcoActivityLog.count({
        where: {
          userId,
          ecoActivityId,
          createdAt: { gte: weekStart },
        },
      });

      const diminishingMultiplier =
        weekCount < ACTIVITY_CONFIG.DIMINISHING_TIERS.length
          ? ACTIVITY_CONFIG.DIMINISHING_TIERS[weekCount]
          : 0.0;

      const todayCategoryAgg = await tx.userEcoActivityLog.aggregate({
        where: {
          userId,
          createdAt: { gte: todayStart },
          ecoActivity: { category: ecoActivity.category },
        },
        _sum: { leaderboardPts: true },
      });
      const todayCategoryPoints = todayCategoryAgg._sum.leaderboardPts ?? 0;

      const todayGlobalAgg = await tx.userEcoActivityLog.aggregate({
        where: { userId, createdAt: { gte: todayStart } },
        _sum: { leaderboardPts: true },
      });
      const todayGlobalPoints = todayGlobalAgg._sum.leaderboardPts ?? 0;

      const weekLogs = await tx.userEcoActivityLog.findMany({
        where: { userId, createdAt: { gte: weekStart } },
        select: { ecoActivity: { select: { category: true } } },
      });

      const weekCategories = new Set(weekLogs.map((l: any) => l.ecoActivity.category));
      weekCategories.add(ecoActivity.category);

      const hasFullSynergy = weekCategories.size >= 4;
      const synergyMultiplier = hasFullSynergy ? 1 + ACTIVITY_CONFIG.SYNERGY_BONUS_PCT : 1.0;

      const expPoints = Math.round(ecoActivity.basePoints * firstTimeMultiplier);

      const rawLBPoints = Math.round(
        ecoActivity.basePoints * firstTimeMultiplier * diminishingMultiplier * synergyMultiplier,
      );

      const remainingCategory = Math.max(0, ACTIVITY_CONFIG.CATEGORY_DAILY_CAP - todayCategoryPoints);
      const afterCategoryCap = Math.min(rawLBPoints, remainingCategory);

      const remainingGlobal = Math.max(0, ACTIVITY_CONFIG.GLOBAL_DAILY_CAP - todayGlobalPoints);
      const leaderboardPoints = Math.max(0, Math.min(afterCategoryCap, remainingGlobal));

      const log = await tx.userEcoActivityLog.create({
        data: {
          userId,
          ecoActivityId,
          basePoints: ecoActivity.basePoints,
          multiplier: firstTimeMultiplier,
          leaderboardPts: leaderboardPoints,
          expPoints,
        },
      });

      // For one-time activities, deactivate after use
      if (ecoActivity.activityType === "one_time") {
        await tx.ecoActivity.update({
          where: { id: ecoActivityId },
          data: { active: false },
        });
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { totalExp: true, rootStageId: true },
      });

      const newTotalExp = (user?.totalExp ?? 0) + expPoints;

      await tx.user.update({
        where: { id: userId },
        data: { totalExp: newTotalExp },
      });

      const { canTransform, nextStage } = await this.checkEvolution(
        tx,
        newTotalExp,
        user?.rootStageId ?? null,
      );

      if (canTransform) {
        await tx.user.update({
          where: { id: userId },
          data: { canTransform: true },
        });
      }

      const remainingCategoryCap = Math.max(0, ACTIVITY_CONFIG.CATEGORY_DAILY_CAP - todayCategoryPoints - leaderboardPoints);
      const remainingGlobalCap = Math.max(0, ACTIVITY_CONFIG.GLOBAL_DAILY_CAP - todayGlobalPoints - leaderboardPoints);

      return {
        ok: true,
        log,
        canTransform,
        nextStage,
        points: { exp: expPoints, leaderboard: leaderboardPoints },
        caps: {
          categoryRemaining: remainingCategoryCap,
          globalRemaining: remainingGlobalCap,
          diminishingMultiplier,
          firstTimeBonus: isFirstTime,
          synergyBonus: hasFullSynergy,
        },
        message: `+${expPoints} EXP, +${leaderboardPoints} pkt rankingowych${hasFullSynergy ? " Synergia!" : ""}${isFirstTime ? " First-time!" : ""}`,
      };
    });
  }

  async addExpFromDeclaration(
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const expPoints = ACTIVITY_CONFIG.EXP_PER_DECLARATION;
    const lbPoints = ACTIVITY_CONFIG.LEADERBOARD_PTS_PER_DECLARATION;

    const run = async (client: Prisma.TransactionClient) => {
      const user = await client.user.findUnique({
        where: { id: userId },
        select: { totalExp: true, rootStageId: true },
      });
      if (!user) return null;

      const newTotalExp = user.totalExp + expPoints;

      await client.user.update({
        where: { id: userId },
        data: { totalExp: newTotalExp },
      });

      const { canTransform } = await this.checkEvolution(
        client,
        newTotalExp,
        user.rootStageId,
      );

      if (canTransform) {
        await client.user.update({
          where: { id: userId },
          data: { canTransform: true },
        });
      }

      return { expPoints, lbPoints, canTransform };
    };

    if (tx) {
      return run(tx);
    }
    return this.prisma.$transaction(run);
  }

  async recalculateCanTransform(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { totalExp: true, rootStageId: true },
      });
      if (!user) return { canTransform: false };

      const { canTransform } = await this.checkEvolution(
        tx,
        user.totalExp,
        user.rootStageId,
      );

      await tx.user.update({
        where: { id: userId },
        data: { canTransform },
      });

      return { canTransform };
    });
  }

  async checkEvolution(
    tx: Prisma.TransactionClient,
    totalExp: number,
    currentRootStageId: string | null,
  ) {
    const nextStage = await tx.rootStage.findFirst({
      where: { expRequired: { lte: totalExp } },
      orderBy: { level: "desc" },
    });

    if (!nextStage) {
      return { canTransform: false, nextStage: null };
    }

    const canTransform = currentRootStageId
      ? nextStage.id !== currentRootStageId
      : nextStage.level > 1;

    return { canTransform, nextStage };
  }

  // Admin methods for reward activities
  async createRewardActivity(data: {
    name: string;
    description?: string;
    icon: string;
    category: string;
    basePoints: number;
    activityType: string;
    expiresAt?: string;
    companyId: string;
    createdByUserId: string;
  }) {
    return this.prisma.ecoActivity.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        category: data.category as any,
        basePoints: data.basePoints,
        activityType: data.activityType,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        companyId: data.companyId,
        createdByUserId: data.createdByUserId,
      },
    });
  }

  async deleteRewardActivity(id: string) {
    return this.prisma.ecoActivity.delete({
      where: { id },
    });
  }

  async listCompanyActivities(companyId: string) {
    return this.prisma.ecoActivity.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }
}
