import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { generateESGReportHTML } from "./templates/esg-report.template";

@Injectable()
export class EsgReportService {
  constructor(private readonly prisma: PrismaService) {}

  async generateESGReport(slug: string, userId: string, dto: { title: string; description?: string; periodFrom: string; periodTo: string }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const periodFrom = new Date(dto.periodFrom);
    const periodTo = new Date(dto.periodTo);

    const employees = await this.prisma.user.findMany({
      where: { companyId: company.id, role: { in: ["employer", "user"] } },
      select: { id: true, name: true, email: true, balance: true, createdAt: true },
    });

    const employeeIds = employees.map((e) => e.id);

    const [activities, declarations, ecoLogs, transactions] = await Promise.all([
      this.prisma.activity.findMany({ where: { userId: { in: employeeIds }, createdAt: { gte: periodFrom, lte: periodTo } }, include: { user: { select: { name: true } } } }),
      this.prisma.declaration.findMany({ where: { userId: { in: employeeIds }, createdAt: { gte: periodFrom, lte: periodTo } }, include: { user: { select: { name: true } } } }),
      this.prisma.userEcoActivityLog.findMany({ where: { userId: { in: employeeIds }, createdAt: { gte: periodFrom, lte: periodTo } }, include: { user: { select: { name: true } }, ecoActivity: true } }),
      this.prisma.transaction.findMany({ where: { userId: { in: employeeIds }, createdAt: { gte: periodFrom, lte: periodTo } } }),
    ]);

    const totalSteps = activities.reduce((sum, a) => sum + a.steps, 0);
    const totalMinutes = activities.reduce((sum, a) => sum + a.minutes, 0);
    const totalPointsEarned = transactions.filter((t) => t.type === "earned").reduce((sum, t) => sum + t.points, 0);
    const totalPointsSpent = transactions.filter((t) => t.type === "spent").reduce((sum, t) => sum + t.points, 0);

    const activityBreakdown: Record<string, number> = {};
    for (const a of activities) activityBreakdown[a.type] = (activityBreakdown[a.type] ?? 0) + 1;

    const ecoBreakdown: Record<string, number> = {};
    for (const log of ecoLogs) ecoBreakdown[log.ecoActivity.category] = (ecoBreakdown[log.ecoActivity.category] ?? 0) + 1;

    const reportData = {
      company: { id: company.id, name: company.name, slug: company.slug },
      period: { from: dto.periodFrom, to: dto.periodTo },
      employees: { total: employees.length, active: employees.filter((e) => e.balance > 0).length },
      activities: { total: activities.length, totalSteps, totalMinutes, breakdown: activityBreakdown },
      declarations: { total: declarations.length, items: declarations.map((d) => ({ name: d.name, points: d.points, userName: d.user.name })) },
      ecoActivities: { total: ecoLogs.length, breakdown: ecoBreakdown, totalPoints: ecoLogs.reduce((sum, l) => sum + l.basePoints, 0) },
      transactions: { totalEarned: totalPointsEarned, totalSpent: totalPointsSpent, netBalance: totalPointsEarned - totalPointsSpent },
      generatedAt: new Date().toISOString(),
    };

    const htmlContent = generateESGReportHTML(reportData);

    return this.prisma.eSGReport.create({
      data: { companyId: company.id, title: dto.title, description: dto.description, periodFrom, periodTo, htmlContent, jsonData: JSON.stringify(reportData, null, 2) },
    });
  }

  async getESGReports(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    return this.prisma.eSGReport.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, description: true, status: true, periodFrom: true, periodTo: true, generatedAt: true, publishedAt: true, createdAt: true },
    });
  }

  async getESGReportById(slug: string, userId: string, reportId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const report = await this.prisma.eSGReport.findFirst({ where: { id: reportId, companyId: company.id } });
    if (!report) throw new NotFoundException("Report not found");
    return report;
  }

  async getESGReportHTML(slug: string, userId: string, reportId: string) {
    const report = await this.getESGReportById(slug, userId, reportId);
    return report.htmlContent ?? "";
  }

  async generateESGReportPDF(slug: string, userId: string, reportId: string): Promise<Buffer> {
    const html = await this.getESGReportHTML(slug, userId, reportId);
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

  async generateESGReportDOCX(slug: string, userId: string, reportId: string): Promise<Buffer> {
    const report = await this.getESGReportById(slug, userId, reportId);
    const data = JSON.parse(report.jsonData ?? "{}");

    const docx = await import("docx");
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ children: [new TextRun({ text: "Raport ESG", bold: true, size: 48 })], heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({ children: [new TextRun({ text: data.company?.name ?? "", size: 28 })], alignment: AlignmentType.CENTER }),
          new Paragraph({ children: [new TextRun({ text: `Okres: ${data.period?.from} \u2013 ${data.period?.to}`, size: 24 })], alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "1. Informacje og\u00f3lne (ESRS 2)", bold: true, size: 32 })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: `Pracownicy \u0142\u0105cznie: ${data.employees?.total ?? 0}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Aktywni uczestnicy: ${data.employees?.active ?? 0}` })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "2. \u015arodowisko (ESRS E)", bold: true, size: 32 })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: `\u0141\u0105czna liczba krok\u00f3w: ${(data.activities?.totalSteps ?? 0).toLocaleString("pl-PL")}` })] }),
          new Paragraph({ children: [new TextRun({ text: `\u0141\u0105czny czas aktywno\u015bci: ${data.activities?.totalMinutes ?? 0} min` })] }),
          new Paragraph({ children: [new TextRun({ text: `Aktywno\u015bci ekologiczne: ${data.ecoActivities?.total ?? 0}` })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "3. Kwestie spo\u0142eczne (ESRS S)", bold: true, size: 32 })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: `\u0141\u0105czne aktywno\u015bci: ${data.activities?.total ?? 0}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Deklaracje: ${data.declarations?.total ?? 0}` })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "4. Zarz\u0105dzanie (ESRS G)", bold: true, size: 32 })], heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: `Punkty zdobyte: ${data.transactions?.totalEarned ?? 0}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Punkty wydane: ${data.transactions?.totalSpent ?? 0}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Bilans netto: ${data.transactions?.netBalance ?? 0}` })] }),
        ],
      }],
    });

    return await Packer.toBuffer(doc);
  }

  async updateESGReport(slug: string, userId: string, reportId: string, dto: { status?: "draft" | "published" | "archived" }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const report = await this.prisma.eSGReport.findFirst({ where: { id: reportId, companyId: company.id } });
    if (!report) throw new NotFoundException("Report not found");

    return this.prisma.eSGReport.update({
      where: { id: reportId },
      data: { status: dto.status, publishedAt: dto.status === "published" ? new Date() : report.publishedAt },
    });
  }

  async deleteESGReport(slug: string, userId: string, reportId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const report = await this.prisma.eSGReport.findFirst({ where: { id: reportId, companyId: company.id } });
    if (!report) throw new NotFoundException("Report not found");

    await this.prisma.eSGReport.delete({ where: { id: reportId } });
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
