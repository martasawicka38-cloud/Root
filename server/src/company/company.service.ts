import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { PrismaService } from "../prisma.service";

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getBySlug(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
      include: { _count: { select: { users: true, tokens: true } } },
    });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);
    return company;
  }

  async getEmployees(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    return this.prisma.user.findMany({
      where: { companyId: company.id, role: "employer" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        balance: true,
        stepGoal: true,
        createdAt: true,
      },
    });
  }

  async getAnalytics(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employees = await this.prisma.user.findMany({
      where: { companyId: company.id, role: "employer" },
      select: { id: true, name: true, balance: true },
    });

    const employeeIds = employees.map((e) => e.id);

    const totalActivities = await this.prisma.activity.count({
      where: { userId: { in: employeeIds } },
    });

    const stepsAgg = await this.prisma.activity.aggregate({
      where: { userId: { in: employeeIds } },
      _sum: { steps: true },
    });

    const totalDeclarations = await this.prisma.declaration.count({
      where: { userId: { in: employeeIds } },
    });

    const totalEarned = await this.prisma.transaction.aggregate({
      where: { userId: { in: employeeIds }, type: "earned" },
      _sum: { points: true },
    });

    const totalPoints = employees.reduce((s, e) => s + e.balance, 0);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRaw = await this.prisma.activity.findMany({
      where: { userId: { in: employeeIds }, createdAt: { gte: weekAgo } },
      select: { steps: true, createdAt: true, user: { select: { name: true } } },
    });

    const dayMap: Record<string, number> = {};
    for (const a of weeklyRaw) {
      const day = a.createdAt.toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] ?? 0) + a.steps;
    }
    const weeklySteps = Object.entries(dayMap)
      .map(([day, steps]) => ({ day, steps }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const recentActivity = await this.prisma.activity.findMany({
      where: { userId: { in: employeeIds } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true } } },
    });

    return {
      employees: employees.map((e) => ({ id: e.id, name: e.name, points: e.balance })),
      totalActivities,
      totalSteps: stepsAgg._sum.steps ?? 0,
      totalDeclarations,
      totalEarned: totalEarned._sum.points ?? 0,
      totalPoints,
      weeklySteps,
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        userName: a.user.name,
        type: a.type,
        points: a.points,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  }

  async getTokens(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    return this.prisma.companyToken.findMany({
      where: { companyId: company.id, type: "employer_registration" },
      orderBy: { createdAt: "desc" },
    });
  }

  async generateEmployerToken(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const { randomBytes } = await import("crypto");
    const token = randomBytes(20).toString("hex").toUpperCase();

    return this.prisma.companyToken.create({
      data: { companyId: company.id, token, type: "employer_registration" },
    });
  }

  private async verifyOwnership(slug: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, company: { select: { slug: true } } },
    });

    if (!user) throw new UnauthorizedException("User not found");
    if (user.role === "superadmin") return;
    if (user.role !== "company") throw new UnauthorizedException("Access denied");
    if (user.company?.slug !== slug) throw new UnauthorizedException("You do not own this company");
  }
}
