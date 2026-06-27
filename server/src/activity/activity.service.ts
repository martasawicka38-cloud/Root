import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import { ACTIVITY_CONFIG } from "./activity.config";

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async listEcoActivities() {
    return this.prisma.ecoActivity.findMany({
      where: { active: true },
      orderBy: { category: "asc" },
    });
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
      return { ok: false, message: "Aktywność nie istnieje." };
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

      const todayStart = this.getDayStart(now);

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
        message: `+${expPoints} EXP, +${leaderboardPoints} pkt rankingowych${hasFullSynergy ? " 🔗 Synergia!" : ""}${isFirstTime ? " 🌟 First-time!" : ""}`,
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

    // Users without a stage are treated as being at level 0 (pre-seed).
    // The first stage (Ziarenko) should not trigger a transform.
    const canTransform = currentRootStageId
      ? nextStage.id !== currentRootStageId
      : nextStage.level > 1;

    return { canTransform, nextStage };
  }
}
