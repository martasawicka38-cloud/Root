import {
  Body,
  Controller,
  Get,
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
}
