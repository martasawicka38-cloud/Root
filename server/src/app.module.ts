import "dotenv/config";

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AdminController } from "./admin/admin.controller";
import { AdminService } from "./admin/admin.service";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { JwtStrategy } from "./common/jwt.strategy";
import { PrismaService } from "./prisma.service";
import { ChallengeController } from "./challenge/challenge.controller";
import { ChallengeService } from "./challenge/challenge.service";
import { CompanyController } from "./company/company.controller";
import { CompanyService } from "./company/company.service";
import { EsgReportController } from "./company/esg-report.controller";
import { EsgReportService } from "./company/esg-report.service";
import { CertificateController } from "./company/certificate.controller";
import { CertificateService } from "./company/certificate.service";
import { ActivityController } from "./activity/activity.controller";
import { ActivityService } from "./activity/activity.service";
import { LeaderboardController } from "./leaderboard.controller";
import { LeaderboardService } from "./leaderboard.service";
import { RootController } from "./root.controller";
import { RootService } from "./root.service";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("Missing JWT_SECRET environment variable");
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: "7d", algorithm: "HS256" },
    }),
  ],
  controllers: [AppController, AuthController, AdminController, CompanyController, EsgReportController, CertificateController, ChallengeController, ActivityController, LeaderboardController, RootController],
  providers: [AppService, AuthService, AdminService, CompanyService, EsgReportService, CertificateService, ChallengeService, ActivityService, LeaderboardService, RootService, PrismaService, JwtStrategy],
})
export class AppModule {}
