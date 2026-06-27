import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const hash = await bcrypt.hash("haslo123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  // Seed superadmin
  const admin = await prisma.user.upsert({
    where: { email: "admin@eco-pulse.com" },
    update: { passwordHash: adminHash },
    create: {
      email: "admin@eco-pulse.com",
      name: "Super Admin",
      passwordHash: adminHash,
      role: "superadmin",
      partner: "eco-pulse",
      balance: 0,
    },
  });
  console.log("Superadmin: admin@eco-pulse.com / admin123");

  // Seed companies
  const intel = await prisma.company.upsert({
    where: { slug: "intel" },
    update: {},
    create: { name: "Intel Poland", slug: "intel" },
  });

  const ergo = await prisma.company.upsert({
    where: { slug: "ergo" },
    update: {},
    create: { name: "ERGO Hestia", slug: "ergo" },
  });

  // Seed test user (jan@intel.com)
  const user = await prisma.user.upsert({
    where: { email: "jan@intel.com" },
    update: {
      passwordHash: hash,
      name: "Jan Kowalski",
    },
    create: {
      email: "jan@intel.com",
      name: "Jan Kowalski",
      passwordHash: hash,
      role: "user",
      partner: "intel",
      balance: 450,
      declarationsToday: 0,
      stepGoal: 8000,
    },
  });

  // Seed a company_registration token for testing
  const existingCompanyToken = await prisma.companyToken.findFirst({
    where: { type: "company_registration", used: false },
  });
  if (!existingCompanyToken) {
    await prisma.companyToken.create({
      data: {
        token: "ECO-PULSE-COMPANY-001",
        type: "company_registration",
      },
    });
    console.log("Company token: ECO-PULSE-COMPANY-001");
  }

  // Seed an employer_registration token for Intel
  const existingEmployerToken = await prisma.companyToken.findFirst({
    where: { companyId: intel.id, type: "employer_registration", used: false },
  });
  if (!existingEmployerToken) {
    await prisma.companyToken.create({
      data: {
        companyId: intel.id,
        token: "INTEL-EMPLOYEE-001",
        type: "employer_registration",
      },
    });
    console.log("Intel employer token: INTEL-EMPLOYEE-001");
  }

  // Seed rewards
  const rewards = [
    {
      icon: "☕",
      title: "Kawa w sieciowce",
      merchant: "American Cafe",
      category: "food" as const,
      cost: 200,
      code: "K4W4-2B8X",
      description: "Darmowa kawa w punktach American Cafe.",
    },
    {
      icon: "🧘",
      title: "Joga w Centrum",
      merchant: "Centrum Jogi Sopot",
      category: "wellness" as const,
      cost: 350,
      code: "J0G4-9C2D",
      description: "Jednorazowe wejscie na zajecia jogi.",
    },
    {
      icon: "🏊",
      title: "Karnet na basen",
      merchant: "Aquapark Sopot",
      category: "sport" as const,
      cost: 500,
      code: "B4S3-7X9M",
      description: "Miesieczny karnet na basen.",
    },
    {
      icon: "🌱",
      title: "Zestaw roslinny",
      merchant: "Zielony Zakatek",
      category: "eco" as const,
      cost: 150,
      code: "R05T-4P2Q",
      description: "Zestaw sadzonek do domu lub biura.",
    },
  ];

  for (const reward of rewards) {
    await prisma.reward.upsert({
      where: { code: reward.code },
      update: reward,
      create: reward,
    });
  }

  // Seed notifications for test user
  const notifCount = await prisma.notification.count({
    where: { userId: user.id },
  });
  if (notifCount === 0) {
    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          title: "Nowe wyzwanie dostepne",
          body: "Dolacz do wyzwania 10 000 krokow dziennie.",
          read: false,
        },
        {
          userId: user.id,
          title: "Cel krokow osiagniety",
          body: "Swietna robota, zdobywasz kolejne Eco-Coins.",
          read: false,
        },
      ],
    });
  }

  // Seed achievements for test user
  const achCount = await prisma.achievement.count({
    where: { userId: user.id },
  });
  if (achCount === 0) {
    await prisma.achievement.createMany({
      data: [
        { userId: user.id, key: "first-step", title: "Pierwszy krok" },
        { userId: user.id, key: "streak-3", title: "Passa 3 dni" },
      ],
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
