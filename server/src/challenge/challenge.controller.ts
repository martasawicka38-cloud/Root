import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { CurrentUser } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ChallengeService } from "./challenge.service";

@Controller("api/challenges")
@UseGuards(JwtAuthGuard)
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.challengeService.list(user.userId);
  }

  @Post()
  create(
    @Body() dto: { title: string; description?: string; points: number; scope: "company" | "global"; startsAt?: string; endsAt?: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.challengeService.create(dto, user.userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: { title?: string; description?: string; points?: number; active?: boolean; startsAt?: string; endsAt?: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.challengeService.update(id, dto, user.userId);
  }

  @Delete(":id")
  delete(@Param("id") id: string, @CurrentUser() user: { userId: string }) {
    return this.challengeService.delete(id, user.userId);
  }

  @Post(":id/join")
  join(@Param("id") id: string, @CurrentUser() user: { userId: string }) {
    return this.challengeService.join(id, user.userId);
  }

  @Post(":id/progress")
  updateProgress(
    @Param("id") id: string,
    @Body() dto: { progress: number },
    @CurrentUser() user: { userId: string },
  ) {
    return this.challengeService.updateProgress(id, user.userId, dto.progress);
  }

  @Get(":id/participants")
  getParticipants(@Param("id") id: string, @CurrentUser() user: { userId: string }) {
    return this.challengeService.getParticipants(id, user.userId);
  }
}
