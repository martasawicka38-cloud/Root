import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

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

  @Patch(":slug/employees/:id")
  editEmployee(
    @Param("slug") slug: string,
    @Param("id") id: string,
    @Body() dto: { name?: string; email?: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.editEmployee(slug, id, user.userId, dto);
  }

  @Delete(":slug/employees/:id")
  removeEmployee(
    @Param("slug") slug: string,
    @Param("id") id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.removeEmployee(slug, id, user.userId);
  }

  // ESG Report endpoints
  @Post(":slug/esg-reports")
  generateESGReport(
    @Param("slug") slug: string,
    @Body() dto: { title: string; description?: string; periodFrom: string; periodTo: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.generateESGReport(slug, user.userId, dto);
  }

  @Get(":slug/esg-reports")
  getESGReports(
    @Param("slug") slug: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.getESGReports(slug, user.userId);
  }

  @Get(":slug/esg-reports/:reportId")
  getESGReportById(
    @Param("slug") slug: string,
    @Param("reportId") reportId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.getESGReportById(slug, user.userId, reportId);
  }

  @Get(":slug/esg-reports/:reportId/html")
  async getESGReportHTML(
    @Param("slug") slug: string,
    @Param("reportId") reportId: string,
    @CurrentUser() user: { userId: string },
    @Res() res: Response,
  ) {
    const html = await this.companyService.getESGReportHTML(slug, user.userId, reportId);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  }

  @Get(":slug/esg-reports/:reportId/pdf")
  async downloadESGReportPDF(
    @Param("slug") slug: string,
    @Param("reportId") reportId: string,
    @CurrentUser() user: { userId: string },
    @Res() res: Response,
  ) {
    const buffer = await this.companyService.generateESGReportPDF(slug, user.userId, reportId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="raport-esg-${reportId}.pdf"`);
    res.send(buffer);
  }

  @Get(":slug/esg-reports/:reportId/docx")
  async downloadESGReportDOCX(
    @Param("slug") slug: string,
    @Param("reportId") reportId: string,
    @CurrentUser() user: { userId: string },
    @Res() res: Response,
  ) {
    const buffer = await this.companyService.generateESGReportDOCX(slug, user.userId, reportId);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="raport-esg-${reportId}.docx"`);
    res.send(buffer);
  }

  @Patch(":slug/esg-reports/:reportId")
  updateESGReport(
    @Param("slug") slug: string,
    @Param("reportId") reportId: string,
    @Body() dto: { status?: "draft" | "published" | "archived" },
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.updateESGReport(slug, user.userId, reportId, dto);
  }

  @Delete(":slug/esg-reports/:reportId")
  deleteESGReport(
    @Param("slug") slug: string,
    @Param("reportId") reportId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.deleteESGReport(slug, user.userId, reportId);
  }

  // Certificate endpoints
  @Post(":slug/certificates")
  generateCertificate(
    @Param("slug") slug: string,
    @Body() dto: { userId: string; type: "participation" | "achievement" | "completion"; title: string; description?: string; reportId?: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.generateCertificate(slug, user.userId, dto);
  }

  @Post(":slug/certificates/bulk")
  generateBulkCertificates(
    @Param("slug") slug: string,
    @Body() dto: { userIds: string[]; type: "participation" | "achievement" | "completion"; title: string; description?: string; reportId?: string },
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.generateBulkCertificates(slug, user.userId, dto);
  }

  @Get(":slug/certificates")
  getCertificates(
    @Param("slug") slug: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.getCertificates(slug, user.userId);
  }

  @Get(":slug/certificates/:certId/html")
  async getCertificateHTML(
    @Param("slug") slug: string,
    @Param("certId") certId: string,
    @CurrentUser() user: { userId: string },
    @Res() res: Response,
  ) {
    const html = await this.companyService.getCertificateHTML(slug, user.userId, certId);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  }

  @Get(":slug/certificates/:certId/pdf")
  async downloadCertificatePDF(
    @Param("slug") slug: string,
    @Param("certId") certId: string,
    @CurrentUser() user: { userId: string },
    @Res() res: Response,
  ) {
    const buffer = await this.companyService.generateCertificatePDF(slug, user.userId, certId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="certyfikat-${certId}.pdf"`);
    res.send(buffer);
  }

  @Delete(":slug/certificates/:certId")
  deleteCertificate(
    @Param("slug") slug: string,
    @Param("certId") certId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.companyService.deleteCertificate(slug, user.userId, certId);
  }
}
