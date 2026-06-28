import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { CertificateService } from "./certificate.service";

@Controller("api/company")
@UseGuards(JwtAuthGuard)
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post(":slug/certificates")
  generateCertificate(@Param("slug") slug: string, @CurrentUser() user: { userId: string }, @Body() dto: { userId: string; type: "participation" | "achievement" | "completion"; title: string; description?: string; reportId?: string }) {
    return this.certificateService.generateCertificate(slug, user.userId, dto);
  }

  @Post(":slug/certificates/bulk")
  generateBulkCertificates(@Param("slug") slug: string, @CurrentUser() user: { userId: string }, @Body() dto: { userIds: string[]; type: "participation" | "achievement" | "completion"; title: string; description?: string; reportId?: string }) {
    return this.certificateService.generateBulkCertificates(slug, user.userId, dto);
  }

  @Get(":slug/certificates")
  getCertificates(@Param("slug") slug: string, @CurrentUser() user: { userId: string }) {
    return this.certificateService.getCertificates(slug, user.userId);
  }

  @Get(":slug/certificates/:certId/html")
  async getCertificateHTML(@Param("slug") slug: string, @Param("certId") certId: string, @CurrentUser() user: { userId: string }, @Res() res: Response) {
    const html = await this.certificateService.getCertificateHTML(slug, user.userId, certId);
    res.setHeader("Content-Type", "text/html").send(html);
  }

  @Get(":slug/certificates/:certId/pdf")
  async downloadCertificatePDF(@Param("slug") slug: string, @Param("certId") certId: string, @CurrentUser() user: { userId: string }, @Res() res: Response) {
    const pdf = await this.certificateService.generateCertificatePDF(slug, user.userId, certId);
    res.setHeader("Content-Type", "application/pdf").setHeader("Content-Disposition", `attachment; filename=certyfikat-${certId}.pdf`).send(pdf);
  }

  @Delete(":slug/certificates/:certId")
  deleteCertificate(@Param("slug") slug: string, @Param("certId") certId: string, @CurrentUser() user: { userId: string }) {
    return this.certificateService.deleteCertificate(slug, user.userId, certId);
  }
}
