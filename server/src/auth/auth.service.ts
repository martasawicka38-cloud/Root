import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma.service";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    if (dto.role === "employer") {
      if (!dto.companyToken) {
        throw new UnauthorizedException(
          "Employer registration requires a company token",
        );
      }

      const token = await this.prisma.companyToken.findUnique({
        where: { token: dto.companyToken },
        include: { company: true },
      });

      if (!token || token.used) {
        throw new UnauthorizedException("Invalid or already used token");
      }
      if (token.type !== "employer_registration") {
        throw new UnauthorizedException("Invalid token type for employer registration");
      }
      if (!token.companyId) {
        throw new UnauthorizedException("Token is not associated with any company");
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash,
          role: "employer",
          partner: token.company!.slug,
          companyId: token.companyId,
          usedTokenId: token.id,
        },
      });

      await this.prisma.companyToken.update({
        where: { id: token.id },
        data: { used: true, usedAt: new Date() },
      });

      return { id: user.id, email: user.email, role: user.role };
    }

    if (dto.role === "company") {
      if (!dto.companyToken) {
        throw new UnauthorizedException(
          "Company registration requires a valid token",
        );
      }

      const token = await this.prisma.companyToken.findUnique({
        where: { token: dto.companyToken },
      });

      if (!token || token.used) {
        throw new UnauthorizedException("Invalid or already used token");
      }
      if (token.type !== "company_registration") {
        throw new UnauthorizedException("Invalid token type for company registration");
      }
      if (!dto.companyName || !dto.companySlug) {
        throw new UnauthorizedException(
          "Company name and slug are required for company registration",
        );
      }

      const existingCompany = await this.prisma.company.findUnique({
        where: { slug: dto.companySlug },
      });
      if (existingCompany) {
        throw new ConflictException("Company with this slug already exists");
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);

      const company = await this.prisma.company.create({
        data: { name: dto.companyName, slug: dto.companySlug },
      });

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash,
          role: "company",
          partner: dto.companySlug,
          companyId: company.id,
          usedTokenId: token.id,
        },
      });

      await this.prisma.companyToken.update({
        where: { id: token.id },
        data: { used: true, usedAt: new Date(), companyId: company.id },
      });

      return { id: user.id, email: user.email, role: user.role };
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const seedStage = await this.prisma.rootStage.findUnique({
      where: { level: 1 },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: "user",
        rootStageId: seedStage?.id,
      },
    });

    return { id: user.id, email: user.email, role: user.role };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Twoje konto jest nieaktywne");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      partner: user.partner,
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        partner: true,
        stepGoal: true,
        balance: true,
        declarationsToday: true,
        totalExp: true,
        canTransform: true,
        rootStageId: true,
        companyId: true,
        createdAt: true,
        rootStage: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
