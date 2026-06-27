import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ChallengeService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, companyId: true, company: { select: { slug: true } } },
    });
    if (!user) throw new NotFoundException("User not found");

    if (user.role === "company") {
      if (!user.companyId) {
        return { company: [], canCreateGlobal: false };
      }
      const cid: string = user.companyId;
      const globalPermissions = await this.prisma.companyGlobalPermission.findMany({
        where: { companyId: cid, used: false },
      });
      return {
        company: await this.prisma.challenge.findMany({
          where: { companyId: cid, scope: "company" },
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { participations: true } } },
        }),
        canCreateGlobal: globalPermissions.length > 0,
      };
    }

    if (user.role === "superadmin") {
      return {
        global: await this.prisma.challenge.findMany({
          where: { scope: "global" },
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { participations: true } } },
        }),
      };
    }

    const companyId = user.companyId;
    const where: Record<string, unknown>[] = [{ scope: "global", active: true }];
    if (companyId) {
      where.push({ companyId, scope: "company", active: true });
    }
    return {
      available: await this.prisma.challenge.findMany({
        where: { OR: where },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { participations: true } },
          participations: { where: { userId }, select: { id: true, progress: true, completed: true } },
        },
      }),
      joined: await this.prisma.challengeParticipation.findMany({
        where: { userId },
        include: { challenge: true },
        orderBy: { createdAt: "desc" },
      }),
    };
  }

  async create(
    dto: { title: string; description?: string; points: number; scope: "company" | "global"; startsAt?: string; endsAt?: string },
    userId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, companyId: true, company: { select: { slug: true } } },
    });
    if (!user) throw new NotFoundException("User not found");

    if (dto.scope === "company") {
      if (user.role !== "company" && user.role !== "superadmin") {
        throw new UnauthorizedException("Only company accounts can create company challenges");
      }
      if (user.role === "company" && !user.companyId) {
        throw new UnauthorizedException("You must be assigned to a company");
      }
    }

    if (dto.scope === "global") {
      if (user.role === "superadmin") {
        // superadmin can always create global challenges
      } else if (user.role === "company") {
        if (!user.companyId) throw new UnauthorizedException("Not assigned to a company");
        const permission = await this.prisma.companyGlobalPermission.findFirst({
          where: { companyId: user.companyId, used: false },
        });
        if (!permission) {
          throw new UnauthorizedException("Your company does not have permission to create global challenges");
        }
        await this.prisma.companyGlobalPermission.update({
          where: { id: permission.id },
          data: { used: true, usedAt: new Date(), grantedById: permission.grantedById },
        });
      } else {
        throw new UnauthorizedException("Only superadmin or permitted companies can create global challenges");
      }
    }

    const data: Record<string, unknown> = {
      title: dto.title,
      description: dto.description ?? null,
      points: dto.points,
      scope: dto.scope,
      createdByUserId: userId,
    };

    if (dto.scope === "company" && user.companyId) {
      data.companyId = user.companyId;
    }

    if (dto.startsAt) data.startsAt = new Date(dto.startsAt);
    if (dto.endsAt) data.endsAt = new Date(dto.endsAt);

    return this.prisma.challenge.create({ data: data as any });
  }

  async update(
    id: string,
    dto: { title?: string; description?: string; points?: number; active?: boolean; startsAt?: string; endsAt?: string },
    userId: string,
  ) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundException("Challenge not found");

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, companyId: true },
    });
    if (!user) throw new NotFoundException("User not found");

    if (user.role !== "superadmin") {
      if (user.role !== "company" || user.companyId !== challenge.companyId) {
        throw new UnauthorizedException("Not authorized to update this challenge");
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.points !== undefined) data.points = dto.points;
    if (dto.active !== undefined) data.active = dto.active;
    if (dto.startsAt !== undefined) data.startsAt = dto.startsAt ? new Date(dto.startsAt) : null;
    if (dto.endsAt !== undefined) data.endsAt = dto.endsAt ? new Date(dto.endsAt) : null;

    return this.prisma.challenge.update({ where: { id }, data: data as any });
  }

  async delete(id: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundException("Challenge not found");

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, companyId: true },
    });
    if (!user) throw new NotFoundException("User not found");

    if (user.role !== "superadmin") {
      if (user.role !== "company" || user.companyId !== challenge.companyId) {
        throw new UnauthorizedException("Not authorized to delete this challenge");
      }
    }

    await this.prisma.challenge.delete({ where: { id } });
    return { ok: true };
  }

  async join(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { id: true, scope: true, companyId: true, active: true },
    });
    if (!challenge) throw new NotFoundException("Challenge not found");
    if (!challenge.active) throw new ConflictException("Challenge is not active");

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, companyId: true },
    });
    if (!user) throw new NotFoundException("User not found");

    if (challenge.scope === "company") {
      if (user.role === "user" || user.role === "employer") {
        if (user.companyId !== challenge.companyId) {
          throw new UnauthorizedException("Not a member of the owning company");
        }
      }
    }

    const existing = await this.prisma.challengeParticipation.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (existing) throw new ConflictException("Already joined");

    return this.prisma.challengeParticipation.create({
      data: { challengeId, userId },
      include: { challenge: true },
    });
  }

  async updateProgress(challengeId: string, userId: string, progress: number) {
    const participation = await this.prisma.challengeParticipation.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
      include: { challenge: true },
    });
    if (!participation) throw new NotFoundException("Not a participant");

    const completed = progress >= 100;

    return this.prisma.challengeParticipation.update({
      where: { id: participation.id },
      data: {
        progress: Math.min(100, Math.max(0, progress)),
        completed,
        completedAt: completed ? new Date() : null,
      },
      include: { challenge: true },
    });
  }

  async getParticipants(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException("Challenge not found");

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, companyId: true },
    });
    if (!user) throw new NotFoundException("User not found");

    if (user.role !== "superadmin" && challenge.scope === "company" && user.companyId !== challenge.companyId) {
      throw new UnauthorizedException("Not authorized");
    }

    return this.prisma.challengeParticipation.findMany({
      where: { challengeId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { progress: "desc" },
    });
  }
}
