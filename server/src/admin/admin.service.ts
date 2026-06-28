import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma.service";
import type { CreateCompanyDto } from "./dto/create-company.dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers() {
    return this.prisma.user.findMany({
      where: { role: { not: "employer" } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        partner: true,
        balance: true,
        createdAt: true,
        companyId: true,
        company: { select: { id: true, name: true } },
      },
    });
  }

  async listUnassignedUsers() {
    return this.prisma.user.findMany({
      where: { companyId: null, role: { notIn: ["superadmin", "employer"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async assignUserToCompany(userId: string, companyId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException("Company not found");

    return this.prisma.user.update({
      where: { id: userId },
      data: { companyId, partner: company.slug },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
        company: { select: { id: true, name: true } },
      },
    });
  }

  async removeUserFromCompany(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    return this.prisma.user.update({
      where: { id: userId },
      data: { companyId: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
      },
    });
  }

  async toggleUserActive(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  async listCompanies() {
    return this.prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { users: true, tokens: true } },
      },
    });
  }

  async createCompany(dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: { name: dto.name, slug: dto.slug },
    });
  }

  async generateCompanyToken() {
    const token = randomBytes(20).toString("hex").toUpperCase();

    return this.prisma.companyToken.create({
      data: {
        token,
        type: "company_registration",
      },
    });
  }

  async listCompanyRegistrationTokens() {
    return this.prisma.companyToken.findMany({
      where: { type: "company_registration" },
      orderBy: { createdAt: "desc" },
    });
  }

  async generateEmployerToken(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException("Company not found");

    const token = randomBytes(20).toString("hex").toUpperCase();

    return this.prisma.companyToken.create({
      data: { companyId, token, type: "employer_registration" },
    });
  }

  async listEmployerTokens(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException("Company not found");

    return this.prisma.companyToken.findMany({
      where: { companyId, type: "employer_registration" },
      orderBy: { createdAt: "desc" },
    });
  }

  async createUser(dto: { name: string; email: string; password: string; role: "user" | "company" }) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException("User with this email already exists");

    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: dto.role,
      },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });
  }

  async editUser(id: string, dto: { name?: string; email?: string; stepGoal?: number }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException("Email already in use");
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, name: true, role: true, isActive: true, stepGoal: true, createdAt: true },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    await this.prisma.$transaction([
      this.prisma.transaction.deleteMany({ where: { userId: id } }),
      this.prisma.activity.deleteMany({ where: { userId: id } }),
      this.prisma.declaration.deleteMany({ where: { userId: id } }),
      this.prisma.achievement.deleteMany({ where: { userId: id } }),
      this.prisma.notification.deleteMany({ where: { userId: id } }),
      this.prisma.user.delete({ where: { id } }),
    ]);

    return { ok: true };
  }

  async listAllChallenges(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "superadmin") throw new Error("Not authorized");

    return this.prisma.challenge.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        company: { select: { id: true, name: true, slug: true } },
        _count: { select: { participations: true } },
      },
    });
  }

  async createGlobalChallenge(
    dto: { title: string; description?: string; points: number; startsAt?: string; endsAt?: string },
    userId: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "superadmin") throw new Error("Not authorized");

    return this.prisma.challenge.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        points: dto.points,
        scope: "global",
        createdByUserId: userId,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      },
    });
  }

  async listGlobalPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "superadmin") throw new Error("Not authorized");

    return this.prisma.companyGlobalPermission.findMany({
      include: {
        company: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async grantGlobalPermission(companyId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "superadmin") throw new Error("Not authorized");

    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new Error("Company not found");

    const existing = await this.prisma.companyGlobalPermission.findUnique({
      where: { companyId },
    });
    if (existing) throw new Error("Company already has a permission");

    return this.prisma.companyGlobalPermission.create({
      data: { companyId, grantedById: userId },
      include: { company: { select: { id: true, name: true, slug: true } } },
    });
  }

  async revokeGlobalPermission(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "superadmin") throw new Error("Not authorized");

    const permission = await this.prisma.companyGlobalPermission.findUnique({ where: { id } });
    if (!permission) throw new Error("Permission not found");

    await this.prisma.companyGlobalPermission.delete({ where: { id } });
    return { ok: true };
  }

  async listCompanyUsers(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException("Company not found");

    return this.prisma.user.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async listUsersForAnalytics() {
    return this.prisma.user.findMany({
      where: { role: { not: "superadmin" } },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        rootStage: { select: { name: true, level: true } },
        totalExp: true,
      },
    });
  }

  async getUserSteps(userId: string, period: "day" | "week" | "month", from?: string, to?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { rootStage: true },
    });
    if (!user) throw new NotFoundException("User not found");

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
      where: { userId, createdAt: { gte: since, lte: until } },
      select: { steps: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const totalStepsAll = await this.prisma.activity.aggregate({
      where: { userId },
      _sum: { steps: true },
    });

    const bucketMap: Record<string, number> = {};

    for (const a of activities) {
      let key: string;
      const d = new Date(a.createdAt);
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

    const data = Object.entries(bucketMap)
      .map(([label, steps]) => ({ label, steps }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rootStage: user.rootStage,
        totalExp: user.totalExp,
        totalSteps: totalStepsAll._sum.steps ?? 0,
      },
      data,
    };
  }
}
