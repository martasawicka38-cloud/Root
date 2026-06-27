import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { CompanyService } from "./company.service";

@Controller("api/company")
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(":slug")
  getBySlug(
    @Param("slug") slug: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.getBySlug(slug, user.userId);
  }

  @Get(":slug/employees")
  getEmployees(
    @Param("slug") slug: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.getEmployees(slug, user.userId);
  }

  @Get(":slug/analytics")
  getAnalytics(
    @Param("slug") slug: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.getAnalytics(slug, user.userId);
  }

  @Get(":slug/tokens")
  getTokens(
    @Param("slug") slug: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.getTokens(slug, user.userId);
  }

  @Post(":slug/generate-token")
  generateToken(
    @Param("slug") slug: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.generateEmployerToken(slug, user.userId);
  }
}
