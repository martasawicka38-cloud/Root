import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ActivityType, TxType } from "@prisma/client";

import { AppService } from "./app.service";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("me")
  me() {
    return this.appService.me();
  }

  @Get("wallet")
  wallet() {
    return this.appService.wallet();
  }

  @Get("history")
  history(@Query("type") type?: TxType | "all") {
    return this.appService.history(type);
  }

  @Get("market")
  market() {
    return this.appService.market();
  }

  @Post("market/redeem")
  redeem(@Body() body: { rewardId: string }) {
    return this.appService.redeemReward(body.rewardId);
  }

  @Get("activity")
  activities() {
    return this.appService.activities();
  }

  @Post("activity")
  addActivity(@Body() body: { type: ActivityType; minutes: number }) {
    return this.appService.addActivity(body.type, body.minutes);
  }

  @Patch("activity/:id")
  updateActivity(@Param("id") id: string, @Body() body: { minutes: number }) {
    return this.appService.updateActivity(id, body.minutes);
  }

  @Delete("activity/:id")
  deleteActivity(@Param("id") id: string) {
    return this.appService.deleteActivity(id);
  }

  @Get("declarations")
  declarations() {
    return this.appService.declarations();
  }

  @Post("declarations")
  addDeclaration(@Body() body: { name: string; points: number }) {
    return this.appService.addDeclaration(body.name, body.points);
  }

  @Get("notifications")
  notifications() {
    return this.appService.notifications();
  }

  @Patch("notifications/:id/read")
  readNotification(@Param("id") id: string) {
    return this.appService.readNotification(id);
  }

  @Post("notifications/read-all")
  readAll() {
    return this.appService.readAllNotifications();
  }

  @Get("achievements")
  achievements() {
    return this.appService.achievements();
  }

  @Get("ranking")
  ranking() {
    return this.appService.ranking();
  }

  @Get("challenge/current")
  challenge() {
    return this.appService.challengeCurrent();
  }

  @Patch("profile")
  profile(@Body() body: { name: string; stepGoal: number; partner: string }) {
    return this.appService.updateProfile(
      body.name,
      body.stepGoal,
      body.partner,
    );
  }

  @Patch("settings")
  settings() {
    return this.appService.updateSettings();
  }
}
