import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { AdminService } from "./admin.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { AssignCompanyDto } from "./dto/assign-company.dto";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";

@Controller("api/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("users")
  listUsers() {
    return this.adminService.listUsers();
  }

  @Get("users/unassigned")
  listUnassigned() {
    return this.adminService.listUnassignedUsers();
  }

  @Patch("users/:id/toggle-active")
  toggleActive(@Param("id") id: string) {
    return this.adminService.toggleUserActive(id);
  }

  @Patch("users/:id/assign-company")
  assignCompany(
    @Param("id") id: string,
    @Body() dto: AssignCompanyDto,
  ) {
    return this.adminService.assignUserToCompany(id, dto.companyId);
  }

  @Patch("users/:id/remove-company")
  removeCompany(@Param("id") id: string) {
    return this.adminService.removeUserFromCompany(id);
  }

  @Get("companies")
  listCompanies() {
    return this.adminService.listCompanies();
  }

  @Post("companies")
  createCompany(@Body() dto: CreateCompanyDto) {
    return this.adminService.createCompany(dto);
  }

  @Get("companies/:id/users")
  listCompanyUsers(@Param("id") id: string) {
    return this.adminService.listCompanyUsers(id);
  }

  @Post("companies/:id/generate-employer-token")
  generateEmployerToken(@Param("id") id: string) {
    return this.adminService.generateEmployerToken(id);
  }

  @Get("companies/:id/tokens")
  listEmployerTokens(@Param("id") id: string) {
    return this.adminService.listEmployerTokens(id);
  }

  @Post("generate-company-token")
  generateCompanyToken() {
    return this.adminService.generateCompanyToken();
  }

  @Get("company-tokens")
  listCompanyTokens() {
    return this.adminService.listCompanyRegistrationTokens();
  }

  @Post("users")
  createUser(@Body() dto: { name: string; email: string; password: string; role: "user" | "company" }) {
    return this.adminService.createUser(dto);
  }

  @Patch("users/:id")
  editUser(@Param("id") id: string, @Body() dto: { name?: string; email?: string; stepGoal?: number }) {
    return this.adminService.editUser(id, dto);
  }

  @Delete("users/:id")
  deleteUser(@Param("id") id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get("challenges")
  @UseGuards(JwtAuthGuard)
  listAdminChallenges(@CurrentUser() user: { userId: string }) {
    return this.adminService.listAllChallenges(user.userId);
  }

  @Post("challenges")
  @UseGuards(JwtAuthGuard)
  createAdminChallenge(
    @Body() dto: { title: string; description?: string; points: number; startsAt?: string; endsAt?: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.adminService.createGlobalChallenge(dto, user.userId);
  }

  @Get("global-permissions")
  @UseGuards(JwtAuthGuard)
  listPermissions(@CurrentUser() user: { userId: string }) {
    return this.adminService.listGlobalPermissions(user.userId);
  }

  @Post("global-permissions")
  @UseGuards(JwtAuthGuard)
  grantPermission(
    @Body() dto: { companyId: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.adminService.grantGlobalPermission(dto.companyId, user.userId);
  }

  @Delete("global-permissions/:id")
  @UseGuards(JwtAuthGuard)
  revokePermission(@Param("id") id: string, @CurrentUser() user: { userId: string }) {
    return this.adminService.revokeGlobalPermission(id, user.userId);
  }
}
