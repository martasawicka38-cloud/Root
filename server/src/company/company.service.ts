import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { PrismaService } from "../prisma.service";
import { generateESGReportHTML } from "./templates/esg-report.template";
import { generateCertificateHTML } from "./templates/certificate.template";

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getBySlug(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
      include: { _count: { select: { users: true, tokens: true } } },
    });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);
    return company;
  }

  async getEmployees(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    return this.prisma.user.findMany({
      where: { companyId: company.id, role: { in: ["employer", "user"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        balance: true,
        stepGoal: true,
        createdAt: true,
      },
    });
  }

  async getAnalytics(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employees = await this.prisma.user.findMany({
      where: { companyId: company.id, role: { in: ["employer", "user"] } },
      select: { id: true, name: true, balance: true },
    });

    const employeeIds = employees.map((e) => e.id);

    const totalActivities = await this.prisma.activity.count({
      where: { userId: { in: employeeIds } },
    });

    const stepsAgg = await this.prisma.activity.aggregate({
      where: { userId: { in: employeeIds } },
      _sum: { steps: true },
    });

    const totalDeclarations = await this.prisma.declaration.count({
      where: { userId: { in: employeeIds } },
    });

    const totalEarned = await this.prisma.transaction.aggregate({
      where: { userId: { in: employeeIds }, type: "earned" },
      _sum: { points: true },
    });

    const totalPoints = employees.reduce((s, e) => s + e.balance, 0);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const nineWeeksAgo = new Date(now.getTime() - 9 * 7 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const [weeklyRaw, nineWeeksRaw, yearRaw] = await Promise.all([
      this.prisma.activity.findMany({
        where: { userId: { in: employeeIds }, createdAt: { gte: weekAgo } },
        select: { steps: true, createdAt: true },
      }),
      this.prisma.activity.findMany({
        where: { userId: { in: employeeIds }, createdAt: { gte: nineWeeksAgo } },
        select: { steps: true, createdAt: true },
      }),
      this.prisma.activity.findMany({
        where: { userId: { in: employeeIds }, createdAt: { gte: yearAgo } },
        select: { steps: true, createdAt: true },
      }),
    ]);

    const dayMap: Record<string, number> = {};
    for (const a of weeklyRaw) {
      const day = a.createdAt.toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] ?? 0) + a.steps;
    }
    const weeklySteps = Object.entries(dayMap)
      .map(([day, steps]) => ({ day, steps }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const weekBucket: Record<string, number> = {};
    for (const a of nineWeeksRaw) {
      const d = new Date(a.createdAt);
      const onejan = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
      const key = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
      weekBucket[key] = (weekBucket[key] ?? 0) + a.steps;
    }
    const weeklySteps9 = Object.entries(weekBucket)
      .map(([label, steps]) => ({ label, steps }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const monthBucket: Record<string, number> = {};
    for (const a of yearRaw) {
      const d = new Date(a.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthBucket[key] = (monthBucket[key] ?? 0) + a.steps;
    }
    const monthlySteps12 = Object.entries(monthBucket)
      .map(([label, steps]) => ({ label, steps }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const recentActivity = await this.prisma.activity.findMany({
      where: { userId: { in: employeeIds } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true } } },
    });

    return {
      employees: employees.map((e) => ({ id: e.id, name: e.name, points: e.balance })),
      totalActivities,
      totalSteps: stepsAgg._sum.steps ?? 0,
      totalDeclarations,
      totalEarned: totalEarned._sum.points ?? 0,
      totalPoints,
      weeklySteps,
      weeklySteps9,
      monthlySteps12,
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        userName: a.user.name,
        type: a.type,
        points: a.points,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  }

  async getEmployeeSteps(slug: string, employeeId: string, period: "day" | "week" | "month", userId: string, from?: string, to?: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employee = await this.prisma.user.findFirst({
      where: { id: employeeId, companyId: company.id },
      select: { id: true, name: true, email: true, balance: true },
    });
    if (!employee) throw new NotFoundException("Employee not found");

    const now = new Date();
    let since: Date;
    let until: Date = now;
    if (from && to) {
      since = new Date(from);
      until = new Date(to);
    } else if (period === "day") {
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "week") {
      since = new Date(now.getTime() - 9 * 7 * 24 * 60 * 60 * 1000);
    } else {
      since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    const activities = await this.prisma.activity.findMany({
      where: { userId: employeeId, createdAt: { gte: since, lte: until } },
      select: { steps: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const bucketMap: Record<string, number> = {};
    for (const a of activities) {
      const d = new Date(a.createdAt);
      let key: string;
      if (period === "day") {
        key = d.toISOString().slice(0, 10);
      } else if (period === "week") {
        const onejan = new Date(d.getFullYear(), 0, 1);
        const weekNum = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
        key = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
      bucketMap[key] = (bucketMap[key] ?? 0) + a.steps;
    }

    const data = Object.entries(bucketMap)
      .map(([label, steps]) => ({ label, steps }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return { employee, data };
  }

  async getTokens(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    return this.prisma.companyToken.findMany({
      where: { companyId: company.id, type: "employer_registration" },
      orderBy: { createdAt: "desc" },
    });
  }

  async generateEmployerToken(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const { randomBytes } = await import("crypto");
    const token = randomBytes(20).toString("hex").toUpperCase();

    return this.prisma.companyToken.create({
      data: { companyId: company.id, token, type: "employer_registration" },
    });
  }

  async editEmployee(slug: string, employeeId: string, userId: string, dto: { name?: string; email?: string }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employee = await this.prisma.user.findFirst({
      where: { id: employeeId, companyId: company.id, role: "employer" },
    });
    if (!employee) throw new NotFoundException("Employee not found");

    if (dto.email && dto.email !== employee.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new Error("Email already in use");
    }

    return this.prisma.user.update({
      where: { id: employeeId },
      data: dto,
      select: { id: true, email: true, name: true, isActive: true, balance: true, createdAt: true },
    });
  }

  async removeEmployee(slug: string, employeeId: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const employee = await this.prisma.user.findFirst({
      where: { id: employeeId, companyId: company.id, role: "employer" },
    });
    if (!employee) throw new NotFoundException("Employee not found");

    return this.prisma.user.update({
      where: { id: employeeId },
      data: { companyId: null },
      select: { id: true, email: true, name: true },
    });
  }

  private async verifyOwnership(slug: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, company: { select: { slug: true } } },
    });

    if (!user) throw new UnauthorizedException("User not found");
    if (user.role === "superadmin") return;
    if (user.role !== "company") throw new UnauthorizedException("Access denied");
    if (user.company?.slug !== slug) throw new UnauthorizedException("You do not own this company");
  }

  // ── ESG Report methods ──────────────────────────────────────────────

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
      this.prisma.activity.findMany({
        where: { userId: { in: employeeIds }, createdAt: { gte: periodFrom, lte: periodTo } },
        include: { user: { select: { name: true } } },
      }),
      this.prisma.declaration.findMany({
        where: { userId: { in: employeeIds }, createdAt: { gte: periodFrom, lte: periodTo } },
        include: { user: { select: { name: true } } },
      }),
      this.prisma.userEcoActivityLog.findMany({
        where: { userId: { in: employeeIds }, createdAt: { gte: periodFrom, lte: periodTo } },
        include: { user: { select: { name: true } }, ecoActivity: true },
      }),
      this.prisma.transaction.findMany({
        where: { userId: { in: employeeIds }, createdAt: { gte: periodFrom, lte: periodTo } },
      }),
    ]);

    const totalSteps = activities.reduce((sum, a) => sum + a.steps, 0);
    const totalMinutes = activities.reduce((sum, a) => sum + a.minutes, 0);
    const totalPointsEarned = transactions.filter((t) => t.type === "earned").reduce((sum, t) => sum + t.points, 0);
    const totalPointsSpent = transactions.filter((t) => t.type === "spent").reduce((sum, t) => sum + t.points, 0);

    const activityBreakdown: Record<string, number> = {};
    for (const a of activities) {
      activityBreakdown[a.type] = (activityBreakdown[a.type] ?? 0) + 1;
    }

    const ecoBreakdown: Record<string, number> = {};
    for (const log of ecoLogs) {
      ecoBreakdown[log.ecoActivity.category] = (ecoBreakdown[log.ecoActivity.category] ?? 0) + 1;
    }

    const reportData = {
      company: { id: company.id, name: company.name, slug: company.slug },
      period: { from: dto.periodFrom, to: dto.periodTo },
      employees: {
        total: employees.length,
        active: employees.filter((e) => e.balance > 0).length,
      },
      activities: {
        total: activities.length,
        totalSteps,
        totalMinutes,
        breakdown: activityBreakdown,
      },
      declarations: {
        total: declarations.length,
        items: declarations.map((d) => ({ name: d.name, points: d.points, userName: d.user.name })),
      },
      ecoActivities: {
        total: ecoLogs.length,
        breakdown: ecoBreakdown,
        totalPoints: ecoLogs.reduce((sum, l) => sum + l.basePoints, 0),
      },
      transactions: {
        totalEarned: totalPointsEarned,
        totalSpent: totalPointsSpent,
        netBalance: totalPointsEarned - totalPointsSpent,
      },
      generatedAt: new Date().toISOString(),
    };

    const htmlContent = generateESGReportHTML(reportData);

    const report = await this.prisma.eSGReport.create({
      data: {
        companyId: company.id,
        title: dto.title,
        description: dto.description,
        periodFrom,
        periodTo,
        htmlContent,
        jsonData: JSON.stringify(reportData, null, 2),
      },
    });

    return report;
  }

  async getESGReports(slug: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    return this.prisma.eSGReport.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        periodFrom: true,
        periodTo: true,
        generatedAt: true,
        publishedAt: true,
        createdAt: true,
      },
    });
  }

  async getESGReportById(slug: string, userId: string, reportId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const report = await this.prisma.eSGReport.findFirst({
      where: { id: reportId, companyId: company.id },
    });
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
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Raport ESG", bold: true, size: 48 })],
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: data.company?.name ?? "", size: 28 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: `Okres: ${data.period?.from} \u2013 ${data.period?.to}`, size: 24 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "1. Informacje og\u00f3lne (ESRS 2)", bold: true, size: 32 })],
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ children: [new TextRun({ text: `Pracownicy \u0142\u0105cznie: ${data.employees?.total ?? 0}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Aktywni uczestnicy: ${data.employees?.active ?? 0}` })] }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "2. \u015arodowisko (ESRS E)", bold: true, size: 32 })],
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ children: [new TextRun({ text: `\u0141\u0105czna liczba krok\u00f3w: ${(data.activities?.totalSteps ?? 0).toLocaleString("pl-PL")}` })] }),
            new Paragraph({ children: [new TextRun({ text: `\u0141\u0105czny czas aktywno\u015bci: ${data.activities?.totalMinutes ?? 0} min` })] }),
            new Paragraph({ children: [new TextRun({ text: `Aktywno\u015bci ekologiczne: ${data.ecoActivities?.total ?? 0}` })] }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "3. Kwestie spo\u0142eczne (ESRS S)", bold: true, size: 32 })],
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ children: [new TextRun({ text: `\u0141\u0105czne aktywno\u015bci: ${data.activities?.total ?? 0}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Deklaracje: ${data.declarations?.total ?? 0}` })] }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "4. Zarz\u0105dzanie (ESRS G)", bold: true, size: 32 })],
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ children: [new TextRun({ text: `Punkty zdobyte: ${data.transactions?.totalEarned ?? 0}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Punkty wydane: ${data.transactions?.totalSpent ?? 0}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Bilans netto: ${data.transactions?.netBalance ?? 0}` })] }),
          ],
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  async updateESGReport(slug: string, userId: string, reportId: string, dto: { status?: "draft" | "published" | "archived" }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const report = await this.prisma.eSGReport.findFirst({
      where: { id: reportId, companyId: company.id },
    });
    if (!report) throw new NotFoundException("Report not found");

    return this.prisma.eSGReport.update({
      where: { id: reportId },
      data: {
        status: dto.status,
        publishedAt: dto.status === "published" ? new Date() : report.publishedAt,
      },
    });
  }

  async deleteESGReport(slug: string, userId: string, reportId: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const report = await this.prisma.eSGReport.findFirst({
      where: { id: reportId, companyId: company.id },
    });
    if (!report) throw new NotFoundException("Report not found");

    await this.prisma.eSGReport.delete({ where: { id: reportId } });
    return { ok: true };
  }

  // ── Certificate methods ─────────────────────────────────────────────

  async generateCertificate(slug: string, userId: string, dto: { userId: string; type: "participation" | "achievement" | "completion"; title: string; description?: string; reportId?: string }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, companyId: company.id },
    });
    if (!user) throw new NotFoundException("User not found in this company");

    // Fetch user stats
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
      type: dto.type,
      title: dto.title,
      description: dto.description,
      issuedAt: new Date().toISOString(),
      stats: {
        totalActivities,
        totalSteps: stepsAgg._sum.steps ?? 0,
        totalDeclarations,
        ecoActivities: ecoLogsCount,
        achievements: achievements.map((a) => a.title),
      },
    };

    const htmlContent = generateCertificateHTML(certData);

    const certificate = await this.prisma.certificate.create({
      data: {
        userId: dto.userId,
        companyId: company.id,
        reportId: dto.reportId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        htmlContent,
      },
    });

    return certificate;
  }

  async generateBulkCertificates(slug: string, userId: string, dto: { userIds: string[]; type: "participation" | "achievement" | "completion"; title: string; description?: string; reportId?: string }) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException("Company not found");
    await this.verifyOwnership(slug, userId);

    const certificates = [];
    for (const uid of dto.userIds) {
      const user = await this.prisma.user.findFirst({
        where: { id: uid, companyId: company.id },
      });
      if (!user) continue;

      // Fetch user stats
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
        type: dto.type,
        title: dto.title,
        description: dto.description,
        issuedAt: new Date().toISOString(),
        stats: {
          totalActivities,
          totalSteps: stepsAgg._sum.steps ?? 0,
          totalDeclarations,
          ecoActivities: ecoLogsCount,
          achievements: achievements.map((a) => a.title),
        },
      };

      const htmlContent = generateCertificateHTML(certData);

      const certificate = await this.prisma.certificate.create({
        data: {
          userId: uid,
          companyId: company.id,
          reportId: dto.reportId,
          type: dto.type,
          title: dto.title,
          description: dto.description,
          htmlContent,
        },
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

    const cert = await this.prisma.certificate.findFirst({
      where: { id: certId, companyId: company.id },
    });
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

    const cert = await this.prisma.certificate.findFirst({
      where: { id: certId, companyId: company.id },
    });
    if (!cert) throw new NotFoundException("Certificate not found");

    await this.prisma.certificate.delete({ where: { id: certId } });
    return { ok: true };
  }
}
