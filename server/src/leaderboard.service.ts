import { Injectable } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  private getPeriodStart(period: string): Date {
    const now = new Date();

    switch (period) {
      case "daily":
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
      case "weekly": {
        const day = now.getUTCDay();
        const offset = (day + 6) % 7;
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset, 0, 0, 0, 0));
      }
      case "monthly":
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
      case "quarterly": {
        const q = Math.floor(now.getUTCMonth() / 3);
        return new Date(Date.UTC(now.getUTCFullYear(), q * 3, 1, 0, 0, 0, 0));
      }
      case "yearly":
        return new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
      default:
        return new Date(0);
    }
  }

  async getLeaderboard(period: string) {
    const startDate = this.getPeriodStart(period);

    const results = await this.prisma.userEcoActivityLog.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: startDate } },
      _sum: { leaderboardPts: true },
      orderBy: { _sum: { leaderboardPts: "desc" } },
      take: 50,
    });

    const userIds = results.map((r) => r.userId);
    const users = userIds.length > 0
      ? await this.prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, rootStage: { select: { name: true, level: true } } },
        })
      : [];

    const userMap = new Map(users.map((u) => [u.id, u]));

    return results
      .filter((r) => (r._sum.leaderboardPts ?? 0) > 0)
      .map((r, index) => {
        const u = userMap.get(r.userId);
        return {
          rank: index + 1,
          userId: r.userId,
          name: u?.name ?? "Nieznany",
          points: r._sum.leaderboardPts ?? 0,
          rootStage: u?.rootStage ?? null,
        };
      });
  }

  async getUserRank(userId: string, period: string) {
    const startDate = this.getPeriodStart(period);

    const allScores = await this.prisma.userEcoActivityLog.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: startDate } },
      _sum: { leaderboardPts: true },
      orderBy: { _sum: { leaderboardPts: "desc" } },
    });

    const userPoints =
      allScores.find((s) => s.userId === userId)?._sum.leaderboardPts ?? 0;
    const rank =
      allScores.findIndex((s) => s.userId === userId) + 1;

    return {
      userId,
      points: userPoints,
      rank: rank > 0 ? rank : null,
      totalParticipants: allScores.filter(
        (s) => (s._sum.leaderboardPts ?? 0) > 0,
      ).length,
    };
  }

  async getCompanyLeaderboard(period: string) {
    const startDate = this.getPeriodStart(period);

    const logs = await this.prisma.userEcoActivityLog.findMany({
      where: { createdAt: { gte: startDate } },
      select: {
        leaderboardPts: true,
        userId: true,
        user: { select: { companyId: true } },
      },
    });

    const companyPoints = new Map<string, number>();
    const companyMembers = new Map<string, Set<string>>();
    for (const log of logs) {
      const companyId = log.user.companyId;
      if (!companyId) continue;
      companyPoints.set(companyId, (companyPoints.get(companyId) ?? 0) + log.leaderboardPts);
      if (!companyMembers.has(companyId)) companyMembers.set(companyId, new Set());
      companyMembers.get(companyId)!.add(log.userId);
    }

    const companyIds = Array.from(companyPoints.keys());
    const companies = companyIds.length > 0
      ? await this.prisma.company.findMany({
          where: { id: { in: companyIds } },
          select: { id: true, slug: true, name: true },
        })
      : [];
    const companyMap = new Map(companies.map((c) => [c.id, c]));

    return Array.from(companyPoints.entries())
      .filter(([_, points]) => points > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([companyId, points], index) => {
        const company = companyMap.get(companyId);
        return {
          rank: index + 1,
          slug: company?.slug ?? companyId,
          name: company?.name ?? "Nieznana firma",
          points,
          memberCount: companyMembers.get(companyId)?.size ?? 0,
        };
      });
  }
}
