import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { generateCertificateHTML } from "./templates/certificate.template";

@Injectable()
export class CertificateService {
  constructor(private readonly prisma: PrismaService) {}

  async generateCertificate(slug: string, userId: string, dto: { userId: string; type: "participation" | "achievement" | "completion"; title: string; description?: string; reportId?: string }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const user = await this.prisma.user.findFirst({ where: { id: dto.userId, companyId: company.id } });
    if (!user) throw new NotFoundException("User not found in this company");

    const [totalActivities, stepsAgg, totalDeclarations, ecoLogsCount, achievements] = await Promise.all([
      this.prisma.activity.count({ where: { userId: dto.userId } }),
      this.prisma.activity.aggregate({ where: { userId: dto.userId }, _sum: { steps: true } }),
      this.prisma.declaration.count({ where: { userId: dto.userId } }),
      this.prisma.userEcoActivityLog.count({ where: { userId: dto.userId } }),
      this.prisma.achievement.findMany({ where: { userId: dto.userId }, select: { title: true } }),
    ]);

    const certData = {
      user: { id: user.id, name: user.name, email: user.email, balance: user.balance, totalExp: user.totalExp },
      company: { id: company.id, name: company.name },
      type: dto.type, title: dto.title, description: dto.description,
      issuedAt: new Date().toISOString(),
      stats: { totalActivities, totalSteps: stepsAgg._sum.steps ?? 0, totalDeclarations, ecoActivities: ecoLogsCount, achievements: achievements.map((a) => a.title) },
    };

    const htmlContent = generateCertificateHTML(certData);

    return this.prisma.certificate.create({
      data: { userId: dto.userId, companyId: company.id, reportId: dto.reportId, type: dto.type, title: dto.title, description: dto.description, htmlContent },
    });
  }

  async generateBulkCertificates(slug: string, userId: string, dto: { userIds: string[]; type: "participation" | "achievement" | "completion"; title: string; description?: string; reportId?: string }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const certificates = [];
    for (const uid of dto.userIds) {
      const user = await this.prisma.user.findFirst({ where: { id: uid, companyId: company.id } });
      if (!user) continue;

      const [totalActivities, stepsAgg, totalDeclarations, ecoLogsCount, achievements] = await Promise.all([
        this.prisma.activity.count({ where: { userId: uid } }),
        this.prisma.activity.aggregate({ where: { userId: uid }, _sum: { steps: true } }),
        this.prisma.declaration.count({ where: { userId: uid } }),
        this.prisma.userEcoActivityLog.count({ where: { userId: uid } }),
        this.prisma.achievement.findMany({ where: { userId: uid }, select: { title: true } }),
      ]);

      const certData = {
        user: { id: user.id, name: user.name, email: user.email, balance: user.balance, totalExp: user.totalExp },
        company: { id: company.id, name: company.name },
        type: dto.type, title: dto.title, description: dto.description,
        issuedAt: new Date().toISOString(),
        stats: { totalActivities, totalSteps: stepsAgg._sum.steps ?? 0, totalDeclarations, ecoActivities: ecoLogsCount, achievements: achievements.map((a) => a.title) },
      };

      const htmlContent = generateCertificateHTML(certData);

      const certificate = await this.prisma.certificate.create({
        data: { userId: uid, companyId: company.id, reportId: dto.reportId, type: dto.type, title: dto.title, description: dto.description, htmlContent },
      });
      certificates.push(certificate);
    }
    return certificates;
  }

  async getCertificates(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    return this.prisma.certificate.findMany({
      where: { companyId: company.id },
      orderBy: { issuedAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async getCertificateHTML(slug: string, userId: string, certId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const cert = await this.prisma.certificate.findFirst({ where: { id: certId, companyId: company.id } });
    if (!cert) throw new NotFoundException("Certificate not found");
    return cert.htmlContent ?? "";
  }

  async generateCertificatePDF(slug: string, userId: string, certId: string): Promise<Buffer> {
    const html = await this.getCertificateHTML(slug, userId, certId);
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  async deleteCertificate(slug: string, userId: string, certId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const cert = await this.prisma.certificate.findFirst({ where: { id: certId, companyId: company.id } });
    if (!cert) throw new NotFoundException("Certificate not found");

    await this.prisma.certificate.delete({ where: { id: certId } });
    return { ok: true };
  }

  private async verifyOwnership(slug: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, company: { select: { slug: true } } },
    });
    if (!user) throw new NotFoundException("User not found");
    if (user.role === "superadmin") return;
    if (user.role !== "company") throw new NotFoundException("Access denied");
    if (user.company?.slug !== slug) throw new NotFoundException("You do not own this company");
  }
}
