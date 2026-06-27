import { Controller, Get, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "./common/current-user.decorator";
import { JwtAuthGuard } from "./common/jwt-auth.guard";
import { RootService } from "./root.service";

@Controller("api/root")
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Get("status")
  @UseGuards(JwtAuthGuard)
  status(@CurrentUser() user: { userId: string }) {
    return this.rootService.getStatus(user.userId);
  }

  @Post("transform")
  @UseGuards(JwtAuthGuard)
  transform(@CurrentUser() user: { userId: string }) {
    return this.rootService.transform(user.userId);
  }
}
