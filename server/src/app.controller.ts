import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ActivityType, TxType } from "@prisma/client";

import { CurrentUser } from "./common/current-user.decorator";
import { JwtAuthGuard } from "./common/jwt-auth.guard";
import { AppService } from "./app.service";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { userId: string }) {
    return this.appService.me(user.userId);
  }

  @Get("wallet")
  @UseGuards(JwtAuthGuard)
  wallet(@CurrentUser() user: { userId: string }) {
    return this.appService.wallet(user.userId);
  }

  @Get("admin/dashboard")
  @UseGuards(JwtAuthGuard)
  adminDashboard() {
    return this.appService.adminDashboard();
  }

  @Get("history")
  @UseGuards(JwtAuthGuard)
  history(@Query("type") type?: TxType | "all", @CurrentUser() user?: { userId: string }) {
    return this.appService.history(user?.userId ?? "", type);
  }

  @Get("market")
  @UseGuards(JwtAuthGuard)
  market() {
    return this.appService.market();
  }

  @Post("market/redeem")
  @UseGuards(JwtAuthGuard)
  redeem(@Body() body: { rewardId: string }, @CurrentUser() user: { userId: string }) {
    return this.appService.redeem(user.userId, body.rewardId);
  }

  @Get("activity")
  @UseGuards(JwtAuthGuard)
  activity(@CurrentUser() user: { userId: string }) {
    return this.appService.activity(user.userId);
  }

  @Post("activity")
  @UseGuards(JwtAuthGuard)
  addActivity(@Body() body: { type: ActivityType; minutes: number }, @CurrentUser() user: { userId: string }) {
    return this.appService.addActivity(user.userId, body.type, body.minutes);
  }

  @Patch("activity/:id")
  @UseGuards(JwtAuthGuard)
  updateActivity(@Param("id") id: string, @Body() body: { minutes: number }) {
    return this.appService.updateActivity(id, body.minutes);
  }

  @Delete("activity/:id")
  @UseGuards(JwtAuthGuard)
  deleteActivity(@Param("id") id: string) {
    return this.appService.deleteActivity(id);
  }

  @Get("declarations")
  @UseGuards(JwtAuthGuard)
  declarations(@CurrentUser() user: { userId: string }) {
    return this.appService.declarations(user.userId);
  }

  @Post("declarations")
  @UseGuards(JwtAuthGuard)
  addDeclaration(@Body() body: { name: string; points: number }, @CurrentUser() user: { userId: string }) {
    return this.appService.addDeclaration(user.userId, body.name, body.points);
  }

  @Get("notifications")
  @UseGuards(JwtAuthGuard)
  notifications(@CurrentUser() user: { userId: string }) {
    return this.appService.notifications(user.userId);
  }

  @Patch("notifications/:id/read")
  @UseGuards(JwtAuthGuard)
  readNotification(@Param("id") id: string) {
    return this.appService.readNotification(id);
  }

  @Post("notifications/read-all")
  @UseGuards(JwtAuthGuard)
  readAll(@CurrentUser() user: { userId: string }) {
    return this.appService.readAllNotifications(user.userId);
  }

  @Get("achievements")
  @UseGuards(JwtAuthGuard)
  achievements(@CurrentUser() user: { userId: string }) {
    return this.appService.achievements(user.userId);
  }

  @Get("ranking")
  ranking() {
    return this.appService.ranking();
  }

  @Get("companies")
  companies() {
    return this.appService.companies();
  }

  @Get("challenge/current")
  @UseGuards(JwtAuthGuard)
  challenge() {
    return this.appService.challenge();
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  profile(@Body() body: { name: string; stepGoal: number; partner: string }, @CurrentUser() user: { userId: string }) {
    return this.appService.patchProfile(user.userId, body);
  }

  @Patch("settings")
  @UseGuards(JwtAuthGuard)
  settings(@Body() body: { stepGoal?: number; partner?: string; name?: string }, @CurrentUser() user: { userId: string }) {
    return this.appService.settings(user.userId, body);
  }
}
