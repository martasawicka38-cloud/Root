import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { CompanyService } from "./company.service";

@Controller("api/company")
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(":slug")
  getBySlug(@Param("slug") slug: string, @CurrentUser() user: { userId: string }) {
    return this.companyService.getBySlug(slug, user.userId);
  }

  @Get(":slug/employees")
  getEmployees(@Param("slug") slug: string, @CurrentUser() user: { userId: string }) {
    return this.companyService.getEmployees(slug, user.userId);
  }

  @Get(":slug/analytics")
  getAnalytics(@Param("slug") slug: string, @CurrentUser() user: { userId: string }) {
    return this.companyService.getAnalytics(slug, user.userId);
  }

  @Get(":slug/employee-steps/:employeeId")
  getEmployeeSteps(
    @Param("slug") slug: string,
    @Param("employeeId") employeeId: string,
    @Query("period") period: "day" | "week" | "month",
    @CurrentUser() user: { userId: string },
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    return this.companyService.getEmployeeSteps(slug, employeeId, period, user.userId, from, to);
  }

  @Get(":slug/tokens")
  getTokens(@Param("slug") slug: string, @CurrentUser() user: { userId: string }) {
    return this.companyService.getTokens(slug, user.userId);
  }

  @Post(":slug/generate-token")
  generateToken(@Param("slug") slug: string, @CurrentUser() user: { userId: string }) {
    return this.companyService.generateEmployerToken(slug, user.userId);
  }

  @Patch(":slug/employees/:id")
  editEmployee(@Param("slug") slug: string, @Param("id") id: string, @Body() dto: { name?: string; email?: string }, @CurrentUser() user: { userId: string }) {
    return this.companyService.editEmployee(slug, id, user.userId, dto);
  }

  @Delete(":slug/employees/:id")
  removeEmployee(@Param("slug") slug: string, @Param("id") id: string, @CurrentUser() user: { userId: string }) {
    return this.companyService.removeEmployee(slug, id, user.userId);
  }
}
