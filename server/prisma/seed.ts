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
      companyId: intel.id,
      partner: "intel",
    },
    create: {
      email: "jan@intel.com",
      name: "Jan Kowalski",
      passwordHash: hash,
      role: "user",
      partner: "intel",
      companyId: intel.id,
      balance: 450,
      declarationsToday: 0,
      stepGoal: 8000,
    },
  });

  // Seed a company_registration token for testing
  await prisma.companyToken.upsert({
    where: { token: "ECO-PULSE-COMPANY-001" },
    update: { used: false },
    create: {
      token: "ECO-PULSE-COMPANY-001",
      type: "company_registration",
    },
  });
  console.log("Company token: ECO-PULSE-COMPANY-001");

  // Seed an employer_registration token for Intel
  await prisma.companyToken.upsert({
    where: { token: "INTEL-EMPLOYEE-001" },
    update: { companyId: intel.id, used: false },
    create: {
      companyId: intel.id,
      token: "INTEL-EMPLOYEE-001",
      type: "employer_registration",
    },
  });
  console.log("Intel employer token: INTEL-EMPLOYEE-001");

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

  // Seed Root stages
  const rootStages = [
    { name: "Ziarenko", level: 1, expRequired: 0, description: "Początek drogi – małe ziarenko pełne potencjału." },
    { name: "Pęd", level: 2, expRequired: 1000, description: "Pierwszy zielony pęd wybija się ku słońcu." },
    { name: "Sadzonka", level: 3, expRequired: 2500, description: "Młoda sadzonka zapuszcza korzenie coraz głębiej." },
    { name: "Drzewo", level: 4, expRequired: 5000, description: "Silne drzewo dające cień i tlen." },
    { name: "Ekosystem", level: 5, expRequired: 10000, description: "Pełen ekosystem – inspiracja dla innych." },
  ];

  const ziarenkoId: string[] = [];

  for (const stage of rootStages) {
    const created = await prisma.rootStage.upsert({
      where: { level: stage.level },
      update: stage,
      create: stage,
    });
    if (stage.level === 1) ziarenkoId.push(created.id);
  }

  // Assign Ziarenko to test user if they don't have a stage
  const firstUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (firstUser && !firstUser.rootStageId && ziarenkoId.length > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { rootStageId: ziarenkoId[0] },
    });
  }

  // Seed Eco-activities
  const ecoActivities = [
    // MOBILITY
    { name: "Rower zamiast samochodu", description: "Dojazd do pracy rowerem zamiast auta.", icon: "🚲", category: "MOBILITY" as const, basePoints: 30 },
    { name: "Korzystanie z komunikacji miejskiej", description: "Przejazd autobusem/tramwajem zamiast samochodu.", icon: "🚌", category: "MOBILITY" as const, basePoints: 20 },
    { name: "Miesiąc bez auta (dzień)", description: "Codzienna aktywność w ramach wyzwania 'Miesiąc bez auta'.", icon: "🚶", category: "MOBILITY" as const, basePoints: 40 },
    { name: "Car-sharing / ride-sharing", description: "Wspólny przejazd z innymi osobami.", icon: "🚗", category: "MOBILITY" as const, basePoints: 25 },
    // CIRCULARITY
    { name: "Bookcrossing", description: "Uwolnij książkę – zostaw ją w publicznym miejscu.", icon: "📚", category: "CIRCULARITY" as const, basePoints: 20 },
    { name: "Segregacja odpadów", description: "Prawidłowe segregowanie śmieci.", icon: "♻️", category: "CIRCULARITY" as const, basePoints: 15 },
    { name: "Naprawa zamiast wyrzucania", description: "Naprawa zepsutego przedmiotu zamiast kupna nowego.", icon: "🔧", category: "CIRCULARITY" as const, basePoints: 35 },
    { name: "Oddanie ubrań do second-handu", description: "Przekazanie nieużywanych ubrań do ponownego obiegu.", icon: "👕", category: "CIRCULARITY" as const, basePoints: 25 },
    { name: "Kompostowanie", description: "Kompostowanie odpadków organicznych.", icon: "🌱", category: "CIRCULARITY" as const, basePoints: 30 },
    // LOCAL_CONSUMPTION
    { name: "Zakupy na targu", description: "Zakupy na lokalnym targu zamiast w supermarkecie.", icon: "🛍️", category: "LOCAL_CONSUMPTION" as const, basePoints: 30 },
    { name: "Korzystanie z wielorazowych opakowań", description: "Zakupy z własną torbą i pojemnikami.", icon: "👜", category: "LOCAL_CONSUMPTION" as const, basePoints: 20 },
    { name: "Kupno lokalnych produktów", description: "Wybór produktów od lokalnych dostawców.", icon: "🧀", category: "LOCAL_CONSUMPTION" as const, basePoints: 25 },
    { name: "Domowy posiłek zamiast jedzenia na wynos", description: "Przygotowanie posiłku w domu z lokalnych składników.", icon: "🍳", category: "LOCAL_CONSUMPTION" as const, basePoints: 20 },
    // NATURE_ACTIVITY
    { name: "Eko-wycieczka", description: "Spacer/wycieczka po lesie lub parku.", icon: "🌲", category: "NATURE_ACTIVITY" as const, basePoints: 50 },
    { name: "Sprzątanie lasu/plaży", description: "Wolontariat sprzątania dzikich wysypisk.", icon: "🧹", category: "NATURE_ACTIVITY" as const, basePoints: 60 },
    { name: "Sadzenie drzew", description: "Udział w akcji sadzenia drzew.", icon: "🌳", category: "NATURE_ACTIVITY" as const, basePoints: 80 },
    { name: "Obserwacja ptaków", description: "Spacer z lornetką i identyfikacja gatunków.", icon: "🐦", category: "NATURE_ACTIVITY" as const, basePoints: 25 },
    { name: "Joga na świeżym powietrzu", description: "Sesja jogi w plenerze.", icon: "🧘", category: "NATURE_ACTIVITY" as const, basePoints: 35 },
    { name: "Bieganie w terenie", description: "Bieg po leśnych ścieżkach zamiast po mieście.", icon: "🏃", category: "NATURE_ACTIVITY" as const, basePoints: 40 },
  ];

  for (const activity of ecoActivities) {
    await prisma.ecoActivity.upsert({
      where: { name: activity.name },
      update: activity,
      create: activity,
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
