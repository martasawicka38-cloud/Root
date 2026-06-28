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
      where: { companyId: company.id, role: { in: ["employer", "user"] } },
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, isActive: true, balance: true, stepGoal: true, createdAt: true },
    });
  }

  async getAnalytics(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employees = await this.prisma.user.findMany({
      where: { companyId: company.id, role: { in: ["employer", "user"] } },
      select: { id: true, name: true, balance: true },
    });

    const employeeIds = employees.map((e) => e.id);

    const totalActivities = await this.prisma.activity.count({ where: { userId: { in: employeeIds } } });
    const stepsAgg = await this.prisma.activity.aggregate({ where: { userId: { in: employeeIds } }, _sum: { steps: true } });
    const totalDeclarations = await this.prisma.declaration.count({ where: { userId: { in: employeeIds } } });
    const totalEarned = await this.prisma.transaction.aggregate({ where: { userId: { in: employeeIds }, type: "earned" }, _sum: { points: true } });
    const totalPoints = employees.reduce((s, e) => s + e.balance, 0);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const nineWeeksAgo = new Date(now.getTime() - 9 * 7 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const [weeklyRaw, nineWeeksRaw, yearRaw] = await Promise.all([
      this.prisma.activity.findMany({ where: { userId: { in: employeeIds }, createdAt: { gte: weekAgo } }, select: { steps: true, createdAt: true } }),
      this.prisma.activity.findMany({ where: { userId: { in: employeeIds }, createdAt: { gte: nineWeeksAgo } }, select: { steps: true, createdAt: true } }),
      this.prisma.activity.findMany({ where: { userId: { in: employeeIds }, createdAt: { gte: yearAgo } }, select: { steps: true, createdAt: true } }),
    ]);

    const dayMap: Record<string, number> = {};
    for (const a of weeklyRaw) {
      const day = a.createdAt.toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] ?? 0) + a.steps;
    }
    const weeklySteps = Object.entries(dayMap).map(([day, steps]) => ({ day, steps })).sort((a, b) => a.day.localeCompare(b.day));

    const weekBucket: Record<string, number> = {};
    for (const a of nineWeeksRaw) {
      const d = new Date(a.createdAt);
      const onejan = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
      const key = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
      weekBucket[key] = (weekBucket[key] ?? 0) + a.steps;
    }
    const weeklySteps9 = Object.entries(weekBucket).map(([label, steps]) => ({ label, steps })).sort((a, b) => a.label.localeCompare(b.label));

    const monthBucket: Record<string, number> = {};
    for (const a of yearRaw) {
      const d = new Date(a.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthBucket[key] = (monthBucket[key] ?? 0) + a.steps;
    }
    const monthlySteps12 = Object.entries(monthBucket).map(([label, steps]) => ({ label, steps })).sort((a, b) => a.label.localeCompare(b.label));

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
      weeklySteps9,
      monthlySteps12,
      recentActivity: recentActivity.map((a) => ({ id: a.id, userName: a.user.name, type: a.type, points: a.points, createdAt: a.createdAt.toISOString() })),
    };
  }

  async getEmployeeSteps(slug: string, employeeId: string, period: "day" | "week" | "month", userId: string, from?: string, to?: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employee = await this.prisma.user.findFirst({ where: { id: employeeId, companyId: company.id }, select: { id: true, name: true, email: true, balance: true } });
    if (!employee) throw new NotFoundException("Employee not found");

    const now = new Date();
    let since: Date;
    let until: Date = now;
    if (from && to) {
      since = new Date(from);
      until = new Date(to);
    } else if (period === "day") {
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "week") {
      since = new Date(now.getTime() - 9 * 7 * 24 * 60 * 60 * 1000);
    } else {
      since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    const activities = await this.prisma.activity.findMany({
      where: { userId: employeeId, createdAt: { gte: since, lte: until } },
      select: { steps: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const bucketMap: Record<string, number> = {};
    for (const a of activities) {
      const d = new Date(a.createdAt);
      let key: string;
      if (period === "day") {
        key = d.toISOString().slice(0, 10);
      } else if (period === "week") {
        const onejan = new Date(d.getFullYear(), 0, 1);
        const weekNum = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
        key = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
      bucketMap[key] = (bucketMap[key] ?? 0) + a.steps;
    }

    const data = Object.entries(bucketMap).map(([label, steps]) => ({ label, steps })).sort((a, b) => a.label.localeCompare(b.label));
    return { employee, data };
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

  async editEmployee(slug: string, employeeId: string, userId: string, dto: { name?: string; email?: string }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employee = await this.prisma.user.findFirst({ where: { id: employeeId, companyId: company.id, role: "employer" } });
    if (!employee) throw new NotFoundException("Employee not found");

    if (dto.email && dto.email !== employee.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new Error("Email already in use");
    }

    return this.prisma.user.update({
      where: { id: employeeId },
      data: dto,
      select: { id: true, email: true, name: true, isActive: true, balance: true, createdAt: true },
    });
  }

  async removeEmployee(slug: string, employeeId: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employee = await this.prisma.user.findFirst({ where: { id: employeeId, companyId: company.id, role: "employer" } });
    if (!employee) throw new NotFoundException("Employee not found");

    return this.prisma.user.update({
      where: { id: employeeId },
      data: { companyId: null },
      select: { id: true, email: true, name: true },
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
