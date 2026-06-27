import { Injectable } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

@Injectable()
export class RootService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { rootStage: true },
    });

    if (!user) {
      return {
        totalExp: 0,
        currentStage: null,
        nextStage: null,
        canTransform: false,
      };
    }

    const allStages = await this.prisma.rootStage.findMany({
      orderBy: { level: "asc" },
    });

    const currentStage = user.rootStage ?? allStages[0] ?? null;
    const currentStageLevel = currentStage?.level ?? 0;

    const highestReachable = allStages
      .filter((s) => s.expRequired <= user.totalExp)
      .pop();

    const canTransform =
      highestReachable !== undefined &&
      highestReachable.level > currentStageLevel;

    const nextStage = allStages.find(
      (s) => s.level === currentStageLevel + 1,
    );

    return {
      totalExp: user.totalExp,
      currentStage,
      nextStage: nextStage ?? null,
      canTransform,
    };
  }

  async transform(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { rootStage: true },
    });

    if (!user) {
      return { ok: false, message: "Użytkownik nie istnieje." };
    }

    const currentLevel = user.rootStage?.level ?? 0;
    const nextStage = await this.prisma.rootStage.findUnique({
      where: { level: currentLevel + 1 },
    });

    if (!nextStage) {
      return { ok: false, message: "Osiągnięto maksymalny poziom ewolucji." };
    }

    if (user.totalExp < nextStage.expRequired) {
      return {
        ok: false,
        message: `Potrzebujesz ${nextStage.expRequired} EXP, masz ${user.totalExp}.`,
      };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        rootStageId: nextStage.id,
        canTransform: false,
      },
    });

    return { ok: true, stage: nextStage };
  }
}
