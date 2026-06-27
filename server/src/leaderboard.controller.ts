import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";

import { CurrentUser } from "./common/current-user.decorator";
import { JwtAuthGuard } from "./common/jwt-auth.guard";
import { LeaderboardService } from "./leaderboard.service";

@Controller("api/leaderboard")
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get(":period")
  @UseGuards(JwtAuthGuard)
  getLeaderboard(
    @Param("period") period: string,
    @Query("scope") scope?: string,
  ) {
    if (scope === "company") {
      return this.leaderboardService.getCompanyLeaderboard(period);
    }
    return this.leaderboardService.getLeaderboard(period);
  }

  @Get("me/:period")
  @UseGuards(JwtAuthGuard)
  getMyRank(
    @Param("period") period: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.leaderboardService.getUserRank(user.userId, period);
  }
}
