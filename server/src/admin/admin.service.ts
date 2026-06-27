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
}
