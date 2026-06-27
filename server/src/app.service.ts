import { Injectable } from "@nestjs/common";
import { ActivityType, RewardCategory, TxType } from "@prisma/client";

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
  constructor(private readonly prisma: PrismaService) {}

  private async getUser() {
    const existing = await this.prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (existing) return existing;
    return this.prisma.user.create({
      data: {
        email: "jan@intel.com",
        name: "Jan Kowalski",
        partner: "intel",
      },
    });
  }

  async me() {
    const user = await this.getUser();
    return user;
  }

  async adminDashboard() {
    const users = await this.prisma.user.findMany();
    const userCount = users.length;

    const declarationCount = await this.prisma.declaration.count();
    const activityCount = await this.prisma.activity.count();
    const usersWithActivity = await this.prisma.user.count({
      where: { activities: { some: {} } },
    });

    const totalEc =
      users.reduce((sum, u) => sum + u.balance, 0);

    const [earnedAgg, spentAgg] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { type: "earned" },
        _sum: { points: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: "spent" },
        _sum: { points: true },
      }),
    ]);

    const stepsAgg = await this.prisma.activity.aggregate({
      _sum: { steps: true },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivities = await this.prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true } } },
    });

    const weeklyActivities = await this.prisma.activity.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: "asc" },
    });

    const dayMap: Record<string, number> = {};
    for (const a of weeklyActivities) {
      const day = a.createdAt.toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + a.steps;
    }

    const weeklySteps = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i + 1);
      const key = d.toISOString().slice(0, 10);
      return { day: key, steps: dayMap[key] || 0 };
    });

    return {
      users: {
        total: userCount,
        activeDeclarations: declarationCount,
        participationRate:
          userCount > 0
            ? Math.round((usersWithActivity / userCount) * 100)
            : 0,
      },
      economy: {
        totalEcInCirculation: totalEc,
        totalEarned: earnedAgg._sum.points ?? 0,
        totalSpent: spentAgg._sum.points ?? 0,
      },
      activity: {
        totalActivities: activityCount,
        totalSteps: stepsAgg._sum.steps ?? 0,
        avgStepsPerActivity:
          activityCount > 0
            ? Math.round((stepsAgg._sum.steps ?? 0) / activityCount)
            : 0,
        weeklySteps,
      },
      recentActivity: recentActivities.map((a) => ({
        id: a.id,
        userName: a.user.name,
        type: a.type,
        points: a.points,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  }

  async wallet() {
    const user = await this.getUser();
    return { balance: user.balance };
  }

  async history(type?: TxType | "all") {
    const user = await this.getUser();
    return this.prisma.transaction.findMany({
      where: {
        userId: user.id,
        ...(type && type !== "all" ? { type } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async market() {
    return this.prisma.reward.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async redeemReward(rewardId: string) {
    const user = await this.getUser();
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });
    if (!reward) return { ok: false, message: "Reward not found" };
    if (user.balance < reward.cost)
      return { ok: false, message: "Insufficient balance" };

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

    return { ok: true, code: reward.code };
  }

  async activities() {
    const user = await this.getUser();
    return this.prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async addActivity(type: ActivityType, minutes: number) {
    const user = await this.getUser();
    const steps = Math.max(0, Math.floor(minutes * activityRates[type]));
    const points = Math.min(40, Math.floor(steps / 200));

    const [activity] = await this.prisma.$transaction([
      this.prisma.activity.create({
        data: { userId: user.id, type, minutes, steps, points },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: points } },
      }),
      this.prisma.transaction.create({
        data: {
          userId: user.id,
          name: `Aktywnosc ${type} (${minutes} min)`,
          points,
          type: "earned",
        },
      }),
    ]);

    return activity;
  }

  async updateActivity(id: string, minutes: number) {
    const user = await this.getUser();
    const old = await this.prisma.activity.findFirst({
      where: { id, userId: user.id },
    });
    if (!old) return null;
    const steps = Math.max(0, Math.floor(minutes * activityRates[old.type]));
    const points = Math.min(40, Math.floor(steps / 200));
    const delta = points - old.points;

    const [activity] = await this.prisma.$transaction([
      this.prisma.activity.update({
        where: { id },
        data: { minutes, steps, points },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: delta } },
      }),
    ]);

    return activity;
  }

  async deleteActivity(id: string) {
    const user = await this.getUser();
    const old = await this.prisma.activity.findFirst({
      where: { id, userId: user.id },
    });
    if (!old) return { ok: false };

    await this.prisma.$transaction([
      this.prisma.activity.delete({ where: { id } }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: Math.min(user.balance, old.points) } },
      }),
    ]);

    return { ok: true };
  }

  async declarations() {
    const user = await this.getUser();
    return this.prisma.declaration.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async addDeclaration(name: string, points: number) {
    const user = await this.getUser();
    if (user.declarationsToday >= 3) {
      return { ok: false, message: "Daily limit reached" };
    }

    const [declaration] = await this.prisma.$transaction([
      this.prisma.declaration.create({
        data: { userId: user.id, name, points },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: points },
          declarationsToday: { increment: 1 },
        },
      }),
      this.prisma.transaction.create({
        data: {
          userId: user.id,
          name,
          points,
          type: "earned",
        },
      }),
    ]);

    return { ok: true, declaration };
  }

  async notifications() {
    const user = await this.getUser();
    return this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async readNotification(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async readAllNotifications() {
    const user = await this.getUser();
    await this.prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return { ok: true };
  }

  async achievements() {
    const user = await this.getUser();
    return this.prisma.achievement.findMany({
      where: { userId: user.id },
      orderBy: { unlockedAt: "desc" },
    });
  }

  async ranking() {
    return {
      team: [
        { name: "Zespol B", points: 14200 },
        { name: "Zespol A", points: 12450 },
        { name: "Zespol C", points: 10800 },
      ],
      individual: [
        { name: "Piotr W.", points: 18500 },
        { name: "Anna K.", points: 15200 },
        { name: "Jan K.", points: 6200 },
      ],
    };
  }

  async challengeCurrent() {
    return {
      title: "10 000 krokow dziennie",
      team: "ERGO Hestia",
      progress: 71,
      daysDone: 5,
      daysTotal: 7,
      reward: 200,
    };
  }

  async updateProfile(name: string, stepGoal: number, partner: string) {
    const user = await this.getUser();
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        stepGoal,
        partner,
      },
    });
  }

  async updateSettings() {
    return { ok: true };
  }
}
