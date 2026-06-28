import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { EsgReportService } from "./esg-report.service";

@Controller("api/company")
@UseGuards(JwtAuthGuard)
export class EsgReportController {
  constructor(private readonly esgReportService: EsgReportService) {}

  @Post(":slug/esg-reports")
  generateESGReport(@Param("slug") slug: string, @CurrentUser() user: { userId: string }, @Body() dto: { title: string; description?: string; periodFrom: string; periodTo: string }) {
    return this.esgReportService.generateESGReport(slug, user.userId, dto);
  }

  @Get(":slug/esg-reports")
  getESGReports(@Param("slug") slug: string, @CurrentUser() user: { userId: string }) {
    return this.esgReportService.getESGReports(slug, user.userId);
  }

  @Get(":slug/esg-reports/:reportId")
  getESGReportById(@Param("slug") slug: string, @Param("reportId") reportId: string, @CurrentUser() user: { userId: string }) {
    return this.esgReportService.getESGReportById(slug, user.userId, reportId);
  }

  @Get(":slug/esg-reports/:reportId/html")
  async getESGReportHTML(@Param("slug") slug: string, @Param("reportId") reportId: string, @CurrentUser() user: { userId: string }, @Res() res: Response) {
    const html = await this.esgReportService.getESGReportHTML(slug, user.userId, reportId);
    res.setHeader("Content-Type", "text/html").send(html);
  }

  @Get(":slug/esg-reports/:reportId/pdf")
  async downloadESGReportPDF(@Param("slug") slug: string, @Param("reportId") reportId: string, @CurrentUser() user: { userId: string }, @Res() res: Response) {
    const pdf = await this.esgReportService.generateESGReportPDF(slug, user.userId, reportId);
    res.setHeader("Content-Type", "application/pdf").setHeader("Content-Disposition", `attachment; filename=raport-esg-${reportId}.pdf`).send(pdf);
  }

  @Get(":slug/esg-reports/:reportId/docx")
  async downloadESGReportDOCX(@Param("slug") slug: string, @Param("reportId") reportId: string, @CurrentUser() user: { userId: string }, @Res() res: Response) {
    const docx = await this.esgReportService.generateESGReportDOCX(slug, user.userId, reportId);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document").setHeader("Content-Disposition", `attachment; filename=raport-esg-${reportId}.docx`).send(docx);
  }

  @Patch(":slug/esg-reports/:reportId")
  updateESGReport(@Param("slug") slug: string, @Param("reportId") reportId: string, @CurrentUser() user: { userId: string }, @Body() dto: { status?: "draft" | "published" | "archived" }) {
    return this.esgReportService.updateESGReport(slug, user.userId, reportId, dto);
  }

  @Delete(":slug/esg-reports/:reportId")
  deleteESGReport(@Param("slug") slug: string, @Param("reportId") reportId: string, @CurrentUser() user: { userId: string }) {
    return this.esgReportService.deleteESGReport(slug, user.userId, reportId);
  }
}
