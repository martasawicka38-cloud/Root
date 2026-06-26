import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "jan@intel.com" },
    update: {},
    create: {
      email: "jan@intel.com",
      name: "Jan Kowalski",
      partner: "intel",
      balance: 450,
      declarationsToday: 0,
      stepGoal: 8000,
    },
  });

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
