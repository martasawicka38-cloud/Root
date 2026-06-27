import { Injectable } from "@nestjs/common";
import { ActivityType, TxType } from "@prisma/client";

import { ACTIVITY_CONFIG } from "./activity/activity.config";
import { ActivityService } from "./activity/activity.service";
import { LeaderboardService } from "./leaderboard.service";
import { PrismaService } from "./prisma.service";

const activityRates: Record<ActivityType, number> = {
  walking: 120,
  running: 200,
  cycling: 150,
  swimming: 180,
  yoga: 50,
  gym: 100,
};

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  private async getUser(userId?: string) {
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) return user;
    }
    const existing = await this.prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (existing) return existing;
    return this.prisma.user.create({
      data: {
        email: "jan@intel.com",
        name: "Jan Kowalski",
        passwordHash: "",
        partner: "intel",
      },
    });
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { rootStage: true },
    });
    if (user) return user;
    return this.getUser(userId);
  }

  async adminDashboard() {
    const allUsers = await this.prisma.user.findMany();
    const companies = await this.prisma.company.findMany({
      include: {
        _count: { select: { users: true } },
        users: {
          where: { role: "employer" },
          select: { id: true },
        },
      },
    });

    const regularUsers = allUsers.filter((u) => u.role === "user").length;
    const companyAccounts = allUsers.filter((u) => u.role === "company").length;
    const totalEmployees = allUsers.filter((u) => u.role === "employer").length;
    const userCount = allUsers.length;

    const totalDeclarations = await this.prisma.declaration.count();
    const totalEarnedTxs = await this.prisma.transaction.aggregate({
      where: { type: "earned" },
      _sum: { points: true },
    });
    const totalSpentTxs = await this.prisma.transaction.aggregate({
      where: { type: "spent" },
      _sum: { points: true },
    });

    const totalBalance = allUsers.reduce((s, u) => s + u.balance, 0);
    const totalEarned = totalEarnedTxs._sum.points ?? 0;
    const totalSpent = totalSpentTxs._sum.points ?? 0;

    const totalActivities = await this.prisma.activity.count();
    const stepsAgg = await this.prisma.activity.aggregate({
      _sum: { steps: true },
    });
    const totalSteps = stepsAgg._sum.steps ?? 0;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRaw = await this.prisma.activity.findMany({
      where: { createdAt: { gte: weekAgo } },
      select: { steps: true, createdAt: true, user: { select: { name: true, role: true } } },
    });

    const dayMap: Record<string, number> = {};
    for (const a of weeklyRaw) {
      const day = a.createdAt.toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] ?? 0) + a.steps;
    }
    const weeklySteps = Object.entries(dayMap)
      .map(([day, steps]) => ({ day, steps }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const recentActivities = await this.prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } },
    });

    const companyStats = companies.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      employeeCount: c._count.users,
    }));

    return {
      users: {
        total: userCount,
        regularUsers,
        companyAccounts,
        totalEmployees,
        activeDeclarations: totalDeclarations,
        participationRate: userCount > 0
          ? Math.round((totalDeclarations / userCount) * 100) : 0,
      },
      economy: {
        totalEcInCirculation: totalBalance,
        totalEarned,
        totalSpent,
      },
      activity: {
        totalActivities,
        totalSteps,
        avgStepsPerActivity: totalActivities > 0
          ? Math.round(totalSteps / totalActivities) : 0,
        weeklySteps,
      },
      recentActivity: recentActivities.map((a) => ({
        id: a.id,
        userName: a.user.name,
        type: a.type,
        points: a.points,
        createdAt: a.createdAt.toISOString(),
      })),
      companies: companyStats,
    };
  }

  async wallet(userId: string) {
    const user = await this.getUser(userId);
    return { balance: user.balance };
  }

  async history(userId: string, type?: string) {
    const user = await this.getUser(userId);
    const where: Record<string, unknown> = { userId: user.id };
    if (type && type !== "all") where.type = type;
    const txs = await this.prisma.transaction.findMany({ where, orderBy: { createdAt: "desc" } });
    return txs;
  }

  async market() {
    return this.prisma.reward.findMany({ where: { active: true } });
  }

  async redeem(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) return { ok: false, message: "Nagroda nie istnieje." };
    if (!reward.active) return { ok: false, message: "Nagroda jest nieaktywna." };
    const user = await this.getUser(userId);
    if (user.balance < reward.cost) return { ok: false, message: "Za mało Eco-Coins." };
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: reward.cost } },
      }),
      this.prisma.transaction.create({
        data: {
          userId: user.id,
          name: reward.title,
          points: -reward.cost,
          type: "spent",
        },
      }),
    ]);
    return { ok: true, code: reward.code, message: "Nagroda wykupiona." };
  }

  async activity(userId: string) {
    const user = await this.getUser(userId);
    return this.prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async addActivity(userId: string, type: string, minutes: number) {
    const user = await this.getUser(userId);
    const steps = Math.max(0, Math.floor(minutes * (activityRates[type as ActivityType] ?? 100)));
    const points = Math.min(40, Math.floor(steps / 200));
    await this.prisma.$transaction(async (tx) => {
      await tx.activity.create({
        data: { userId: user.id, type: type as ActivityType, minutes, steps, points },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { increment: points } },
      });
      await tx.transaction.create({
        data: { userId: user.id, name: `${type} ${minutes}min`, points, type: "earned" },
      });
    });
    return this.activity(userId);
  }

  async updateActivity(id: string, minutes: number) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) return { ok: false, message: "Activity not found" };
    const oldPoints = activity.points;
    const newSteps = Math.max(0, Math.floor(minutes * (activityRates[activity.type as ActivityType] ?? 100)));
    const newPoints = Math.min(40, Math.floor(newSteps / 200));
    const diff = newPoints - oldPoints;
    await this.prisma.$transaction(async (tx) => {
      await tx.activity.update({ where: { id }, data: { minutes, steps: newSteps, points: newPoints } });
      if (diff !== 0) {
        await tx.user.update({ where: { id: activity.userId }, data: { balance: { increment: diff } } });
      }
    });
    return { ok: true };
  }

  async deleteActivity(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) return { ok: false, message: "Activity not found" };
    await this.prisma.$transaction(async (tx) => {
      await tx.activity.delete({ where: { id } });
      await tx.user.update({
        where: { id: activity.userId },
        data: { balance: { decrement: activity.points } },
      });
    });
    return { ok: true };
  }

  async declarations(userId: string) {
    const user = await this.getUser(userId);
    return this.prisma.declaration.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  }

  async addDeclaration(userId: string, name: string, points: number) {
    const user = await this.getUser(userId);
    if (user.declarationsToday >= ACTIVITY_CONFIG.DECLARATIONS_DAILY_LIMIT) {
      return { ok: false, message: "Limit deklaracji wyczerpany." };
    }

    const expResult = await this.prisma.$transaction(async (tx) => {
      await tx.declaration.create({
        data: { userId: user.id, name, points },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { declarationsToday: { increment: 1 }, balance: { increment: points } },
      });
      await tx.transaction.create({
        data: { userId: user.id, name, points, type: "earned" },
      });

      return this.activityService.addExpFromDeclaration(user.id, tx);
    });

    return {
      ok: true,
      exp: expResult?.expPoints ?? 0,
      canTransform: expResult?.canTransform ?? false,
    };
  }

  async notifications(userId: string) {
    const user = await this.getUser(userId);
    return this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async readNotification(id: string) {
    await this.prisma.notification.update({ where: { id }, data: { read: true } });
    return { ok: true };
  }

  async readAllNotifications(userId: string) {
    const user = await this.getUser(userId);
    await this.prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return { ok: true };
  }

  async achievements(userId: string) {
    const user = await this.getUser(userId);
    return this.prisma.achievement.findMany({ where: { userId: user.id }, orderBy: { unlockedAt: "desc" } });
  }

  /** @deprecated Use GET /api/leaderboard/:period instead */
  async ranking() {
    return this.leaderboardService.getLeaderboard("weekly");
  }

  async companies() {
    return this.prisma.company.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
  }

  async challenge() {
    return {
      title: "10k krokow dziennie",
      team: "Intel",
      progress: 80,
      daysDone: 20,
      daysTotal: 30,
      reward: 150,
    };
  }

  async settings(userId: string, data: { stepGoal?: number; partner?: string; name?: string }) {
    const user = await this.getUser(userId);
    return this.prisma.user.update({ where: { id: user.id }, data });
  }

  async patchProfile(userId: string, data: { name?: string; stepGoal?: number; partner?: string }) {
    const user = await this.getUser(userId);
    return this.prisma.user.update({ where: { id: user.id }, data });
  }
}
