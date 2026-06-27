import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { AdminService } from "./admin.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { AssignCompanyDto } from "./dto/assign-company.dto";

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
}
