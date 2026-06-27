import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

import { CurrentUser } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ActivityService } from "./activity.service";

@Controller("api/eco-activities")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@CurrentUser() user: { userId: string }) {
    return this.activityService.listEcoActivities(user.userId);
  }

  @Post("submit")
  @UseGuards(JwtAuthGuard)
  submit(
    @Body() body: { ecoActivityId: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.activityService.submitActivity(
      user.userId,
      body.ecoActivityId,
    );
  }

  @Get("my-logs")
  @UseGuards(JwtAuthGuard)
  myLogs(@CurrentUser() user: { userId: string }) {
    return this.activityService.getUserLogs(user.userId);
  }

  // Admin endpoints for reward activities
  @Post("admin/create")
  @UseGuards(JwtAuthGuard)
  createRewardActivity(
    @Body() body: {
      name: string;
      description?: string;
      icon: string;
      category: string;
      basePoints: number;
      activityType: string;
      expiresAt?: string;
      companyId: string;
    },
    @CurrentUser() user: { userId: string },
  ) {
    return this.activityService.createRewardActivity({
      ...body,
      createdByUserId: user.userId,
    });
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard)
  deleteRewardActivity(@Param("id") id: string) {
    return this.activityService.deleteRewardActivity(id);
  }

  @Get("admin/company/:companyId")
  @UseGuards(JwtAuthGuard)
  listCompanyActivities(@Param("companyId") companyId: string) {
    return this.activityService.listCompanyActivities(companyId);
  }
}
