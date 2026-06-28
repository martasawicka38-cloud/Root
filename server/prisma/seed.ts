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

const STEPS_DATA: [string, number][] = [
  ["2025-06-28",10860],["2025-06-29",11363],["2025-06-30",11267],["2025-07-01",11301],["2025-07-02",11913],
  ["2025-07-03",12512],["2025-07-04",10877],["2025-07-05",11716],["2025-07-06",10875],["2025-07-07",12093],
  ["2025-07-08",12811],["2025-07-09",13660],["2025-07-10",10935],["2025-07-11",12552],["2025-07-12",11698],
  ["2025-07-13",13381],["2025-07-14",12564],["2025-07-15",13960],["2025-07-16",13597],["2025-07-17",12434],
  ["2025-07-18",12228],["2025-07-19",13650],["2025-07-20",12561],["2025-07-21",11885],["2025-07-22",11494],
  ["2025-07-23",13819],["2025-07-24",12310],["2025-07-25",14509],["2025-07-26",12119],["2025-07-27",12766],
  ["2025-07-28",14278],["2025-07-29",13801],["2025-07-30",14533],["2025-07-31",12791],["2025-08-01",13650],
  ["2025-08-02",12059],["2025-08-03",14627],["2025-08-04",12476],["2025-08-05",13832],["2025-08-06",13216],
  ["2025-08-07",14843],["2025-08-08",13503],["2025-08-09",12631],["2025-08-10",14060],["2025-08-11",14885],
  ["2025-08-12",14213],["2025-08-13",13296],["2025-08-14",14432],["2025-08-15",12592],["2025-08-16",14348],
  ["2025-08-17",14036],["2025-08-18",12205],["2025-08-19",13990],["2025-08-20",14757],["2025-08-21",14526],
  ["2025-08-22",14838],["2025-08-23",13233],["2025-08-24",13983],["2025-08-25",13206],["2025-08-26",13264],
  ["2025-08-27",14310],["2025-08-28",12495],["2025-08-29",11718],["2025-08-30",13898],["2025-08-31",13560],
  ["2025-09-01",13148],["2025-09-02",12540],["2025-09-03",14086],["2025-09-04",12555],["2025-09-05",12877],
  ["2025-09-06",12028],["2025-09-07",13722],["2025-09-08",13996],["2025-09-09",12743],["2025-09-10",11268],
  ["2025-09-11",11250],["2025-09-12",12971],["2025-09-13",11924],["2025-09-14",13184],["2025-09-15",11620],
  ["2025-09-16",11196],["2025-09-17",11951],["2025-09-18",11627],["2025-09-19",12888],["2025-09-20",13245],
  ["2025-09-21",10748],["2025-09-22",11221],["2025-09-23",11351],["2025-09-24",10997],["2025-09-25",12401],
  ["2025-09-26",10832],["2025-09-27",12235],["2025-09-28",10309],["2025-09-29",10354],["2025-09-30",10973],
  ["2025-10-01",11786],["2025-10-02",9720],["2025-10-03",12156],["2025-10-04",10888],["2025-10-05",10606],
  ["2025-10-06",11415],["2025-10-07",12018],["2025-10-08",10753],["2025-10-09",10356],["2025-10-10",10654],
  ["2025-10-11",11710],["2025-10-12",9400],["2025-10-13",10648],["2025-10-14",9310],["2025-10-15",11171],
  ["2025-10-16",9158],["2025-10-17",10522],["2025-10-18",10951],["2025-10-19",10710],["2025-10-20",10755],
  ["2025-10-21",8726],["2025-10-22",10343],["2025-10-23",9215],["2025-10-24",11371],["2025-10-25",8856],
  ["2025-10-26",10769],["2025-10-27",10030],["2025-10-28",9049],["2025-10-29",10359],["2025-10-30",10914],
  ["2025-10-31",10050],["2025-11-01",10902],["2025-11-02",9676],["2025-11-03",9045],["2025-11-04",10726],
  ["2025-11-05",9535],["2025-11-06",10725],["2025-11-07",9052],["2025-11-08",8516],["2025-11-09",10821],
  ["2025-11-10",8399],["2025-11-11",8870],["2025-11-12",10842],["2025-11-13",8394],["2025-11-14",8213],
  ["2025-11-15",9052],["2025-11-16",9905],["2025-11-17",10974],["2025-11-18",9534],["2025-11-19",8929],
  ["2025-11-20",10875],["2025-11-21",8669],["2025-11-22",9149],["2025-11-23",8250],["2025-11-24",10106],
  ["2025-11-25",9970],["2025-11-26",10777],["2025-11-27",10557],["2025-11-28",11111],["2025-11-29",10032],
  ["2025-11-30",8934],["2025-12-01",9495],["2025-12-02",11052],["2025-12-03",9709],["2025-12-04",10295],
  ["2025-12-05",10441],["2025-12-06",11298],["2025-12-07",11455],["2025-12-08",11384],["2025-12-09",10432],
  ["2025-12-10",11585],["2025-12-11",9745],["2025-12-12",10060],["2025-12-13",10713],["2025-12-14",10495],
  ["2025-12-15",11175],["2025-12-16",10612],["2025-12-17",10986],["2025-12-18",10917],["2025-12-19",11492],
  ["2025-12-20",11017],["2025-12-21",11825],["2025-12-22",11064],["2025-12-23",11124],["2025-12-24",11099],
  ["2025-12-25",12542],["2025-12-26",12605],["2025-12-27",10972],["2025-12-28",11837],["2025-12-29",11419],
  ["2025-12-30",10915],["2025-12-31",11754],["2026-01-01",11777],["2026-01-02",11059],["2026-01-03",10795],
  ["2026-01-04",11802],["2026-01-05",11294],["2026-01-06",11339],["2026-01-07",12739],["2026-01-08",12436],
  ["2026-01-09",12362],["2026-01-10",12065],["2026-01-11",12843],["2026-01-12",12569],["2026-01-13",13596],
  ["2026-01-14",11727],["2026-01-15",12510],["2026-01-16",12909],["2026-01-17",14325],["2026-01-18",12075],
  ["2026-01-19",13586],["2026-01-20",11474],["2026-01-21",12160],["2026-01-22",13830],["2026-01-23",13194],
  ["2026-01-24",12499],["2026-01-25",13443],["2026-01-26",14152],["2026-01-27",13415],["2026-01-28",12939],
  ["2026-01-29",12892],["2026-01-30",13551],["2026-01-31",14647],["2026-02-01",13588],["2026-02-02",13647],
  ["2026-02-03",13372],["2026-02-04",14243],["2026-02-05",12799],["2026-02-06",12177],["2026-02-07",12107],
  ["2026-02-08",12392],["2026-02-09",12763],["2026-02-10",12292],["2026-02-11",14326],["2026-02-12",14928],
  ["2026-02-13",12189],["2026-02-14",13915],["2026-02-15",14774],["2026-02-16",14155],["2026-02-17",12557],
  ["2026-02-18",13080],["2026-02-19",12100],["2026-02-20",14404],["2026-02-21",13664],["2026-02-22",12503],
  ["2026-02-23",14627],["2026-02-24",13741],["2026-02-25",14204],["2026-02-26",13089],["2026-02-27",13670],
  ["2026-02-28",13179],["2026-03-01",11751],["2026-03-02",14474],["2026-03-03",13253],["2026-03-04",13316],
  ["2026-03-05",11914],["2026-03-06",14353],["2026-03-07",13285],["2026-03-08",12936],["2026-03-09",13817],
  ["2026-03-10",13549],["2026-03-11",14026],["2026-03-12",11689],["2026-03-13",12792],["2026-03-14",13449],
  ["2026-03-15",12836],["2026-03-16",13003],["2026-03-17",12179],["2026-03-18",12310],["2026-03-19",10873],
  ["2026-03-20",12332],["2026-03-21",12669],["2026-03-22",12804],["2026-03-23",10966],["2026-03-24",11291],
  ["2026-03-25",11086],["2026-03-26",12186],["2026-03-27",13013],["2026-03-28",11327],["2026-03-29",12231],
  ["2026-03-30",10314],["2026-03-31",10976],["2026-04-01",11780],["2026-04-02",11338],["2026-04-03",12451],
  ["2026-04-04",11776],["2026-04-05",10608],["2026-04-06",9791],["2026-04-07",11522],["2026-04-08",11359],
  ["2026-04-09",10890],["2026-04-10",9759],["2026-04-11",9656],["2026-04-12",10657],["2026-04-13",10393],
  ["2026-04-14",10337],["2026-04-15",8938],["2026-04-16",9033],["2026-04-17",11283],["2026-04-18",10169],
  ["2026-04-19",8720],["2026-04-20",10773],["2026-04-21",10410],["2026-04-22",11441],["2026-04-23",10355],
  ["2026-04-24",9271],["2026-04-25",8691],["2026-04-26",11184],["2026-04-27",9235],["2026-04-28",9949],
  ["2026-04-29",8373],["2026-04-30",9786],["2026-05-01",11003],["2026-05-02",8526],["2026-05-03",9406],
  ["2026-05-04",8900],["2026-05-05",9593],["2026-05-06",9969],["2026-05-07",9450],["2026-05-08",9182],
  ["2026-05-09",9232],["2026-05-10",8407],["2026-05-11",8641],["2026-05-12",10735],["2026-05-13",8459],
  ["2026-05-14",8956],["2026-05-15",8476],["2026-05-16",9059],["2026-05-17",10821],["2026-05-18",9728],
  ["2026-05-19",10135],["2026-05-20",10343],["2026-05-21",8647],["2026-05-22",10591],["2026-05-23",9928],
  ["2026-05-24",10229],["2026-05-25",8408],["2026-05-26",9010],["2026-05-27",10576],["2026-05-28",11205],
  ["2026-05-29",9274],["2026-05-30",9858],["2026-05-31",8846],["2026-06-01",9251],["2026-06-02",9138],
  ["2026-06-03",9072],["2026-06-04",9788],["2026-06-05",8638],["2026-06-06",9916],["2026-06-07",10931],
  ["2026-06-08",11304],["2026-06-09",9904],["2026-06-10",11457],["2026-06-11",11096],["2026-06-12",10777],
  ["2026-06-13",10130],["2026-06-14",11459],["2026-06-15",11738],["2026-06-16",9559],["2026-06-17",9503],
  ["2026-06-18",9994],["2026-06-19",10153],["2026-06-20",10513],["2026-06-21",10727],["2026-06-22",9846],
  ["2026-06-23",12024],["2026-06-24",10773],["2026-06-25",12837],["2026-06-26",11936],["2026-06-27",11183],
];

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
      icon: "coffee",
      title: "Kawa w sieciowce",
      merchant: "American Cafe",
      category: "food" as const,
      cost: 200,
      code: "K4W4-2B8X",
      description: "Darmowa kawa w punktach American Cafe.",
    },
    {
      icon: "yoga",
      title: "Joga w Centrum",
      merchant: "Centrum Jogi Sopot",
      category: "wellness" as const,
      cost: 350,
      code: "J0G4-9C2D",
      description: "Jednorazowe wejscie na zajecia jogi.",
    },
    {
      icon: "swim",
      title: "Karnet na basen",
      merchant: "Aquapark Sopot",
      category: "sport" as const,
      cost: 500,
      code: "B4S3-7X9M",
      description: "Miesieczny karnet na basen.",
    },
    {
      icon: "leaf",
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
  const allStages: { id: string; name: string; level: number; expRequired: number }[] = [];

  for (const stage of rootStages) {
    const created = await prisma.rootStage.upsert({
      where: { level: stage.level },
      update: stage,
      create: stage,
    });
    if (stage.level === 1) ziarenkoId.push(created.id);
    allStages.push(created);
  }

  // Assign Ziarenko to test user if they don't have a stage
  const firstUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (firstUser && !firstUser.rootStageId && ziarenkoId.length > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { rootStageId: ziarenkoId[0] },
    });
  }

  // --- Seed Adam Zagórski with 365 days of step data ---
  const adamHash = await bcrypt.hash("haslo123", 10);

  const adam = await prisma.user.upsert({
    where: { email: "adam@zagorski.com" },
    update: { passwordHash: adamHash },
    create: {
      email: "adam@zagorski.com",
      name: "Adam Zagórski",
      passwordHash: adamHash,
      role: "user",
      partner: "intel",
      companyId: intel.id,
      balance: 0,
      stepGoal: 10000,
    },
  });
  console.log("Adam Zagórski: adam@zagorski.com / haslo123");

  // Delete existing activities for Adam to avoid duplicates on re-seed
  await prisma.activity.deleteMany({ where: { userId: adam.id } });

  // Create 365 Activity records from CSV
  const walkingRate = 120; // steps per minute for walking
  const activityRecords = STEPS_DATA.map(([dateStr, steps]) => ({
    userId: adam.id,
    type: "walking" as const,
    minutes: Math.floor(steps / walkingRate),
    steps,
    points: Math.min(40, Math.floor(steps / 200)),
    createdAt: new Date(dateStr + "T12:00:00.000Z"),
  }));

  await prisma.activity.createMany({ data: activityRecords });
  console.log(`Seeded ${activityRecords.length} step activities for Adam Zagórski`);

  // Calculate total EXP and assign root stage
  const totalExp = activityRecords.reduce((sum, a) => sum + a.points, 0);
  const totalSteps = activityRecords.reduce((sum, a) => sum + a.steps, 0);

  // Find the highest stage Adam qualifies for
  const adamStage = [...allStages]
    .sort((a, b) => b.expRequired - a.expRequired)
    .find((s) => totalExp >= s.expRequired);

  await prisma.user.update({
    where: { id: adam.id },
    data: {
      totalExp,
      rootStageId: adamStage?.id ?? null,
    },
  });
  console.log(`Adam Zagórski: ${totalSteps.toLocaleString()} steps, ${totalExp} EXP, Level ${adamStage?.level ?? 1} (${adamStage?.name ?? "Ziarenko"})`);

  // Seed Eco-activities
  const ecoActivities = [
    // MOBILITY
    { name: "Rower zamiast samochodu", description: "Dojazd do pracy rowerem zamiast auta.", icon: "bike", category: "MOBILITY" as const, basePoints: 30 },
    { name: "Korzystanie z komunikacji miejskiej", description: "Przejazd autobusem/tramwajem zamiast samochodu.", icon: "bus", category: "MOBILITY" as const, basePoints: 20 },
    { name: "Miesiąc bez auta (dzień)", description: "Codzienna aktywność w ramach wyzwania 'Miesiąc bez auta'.", icon: "walk", category: "MOBILITY" as const, basePoints: 40 },
    { name: "Car-sharing / ride-sharing", description: "Wspólny przejazd z innymi osobami.", icon: "car", category: "MOBILITY" as const, basePoints: 25 },
    // CIRCULARITY
    { name: "Bookcrossing", description: "Uwolnij książkę – zostaw ją w publicznym miejscu.", icon: "book", category: "CIRCULARITY" as const, basePoints: 20 },
    { name: "Segregacja odpadów", description: "Prawidłowe segregowanie śmieci.", icon: "recycle", category: "CIRCULARITY" as const, basePoints: 15 },
    { name: "Naprawa zamiast wyrzucania", description: "Naprawa zepsutego przedmiotu zamiast kupna nowego.", icon: "tool", category: "CIRCULARITY" as const, basePoints: 35 },
    { name: "Oddanie ubrań do second-handu", description: "Przekazanie nieużywanych ubrań do ponownego obiegu.", icon: "clothes", category: "CIRCULARITY" as const, basePoints: 25 },
    { name: "Kompostowanie", description: "Kompostowanie odpadków organicznych.", icon: "leaf", category: "CIRCULARITY" as const, basePoints: 30 },
    // LOCAL_CONSUMPTION
    { name: "Zakupy na targu", description: "Zakupy na lokalnym targu zamiast w supermarkecie.", icon: "shopping", category: "LOCAL_CONSUMPTION" as const, basePoints: 30 },
    { name: "Korzystanie z wielorazowych opakowań", description: "Zakupy z własną torbą i pojemnikami.", icon: "bag", category: "LOCAL_CONSUMPTION" as const, basePoints: 20 },
    { name: "Kupno lokalnych produktów", description: "Wybór produktów od lokalnych dostawców.", icon: "cheese", category: "LOCAL_CONSUMPTION" as const, basePoints: 25 },
    { name: "Domowy posiłek zamiast jedzenia na wynos", description: "Przygotowanie posiłku w domu z lokalnych składników.", icon: "cook", category: "LOCAL_CONSUMPTION" as const, basePoints: 20 },
    // NATURE_ACTIVITY
    { name: "Eko-wycieczka", description: "Spacer/wycieczka po lesie lub parku.", icon: "nature", category: "NATURE_ACTIVITY" as const, basePoints: 50 },
    { name: "Sprzątanie lasu/plaży", description: "Wolontariat sprzątania dzikich wysypisk.", icon: "clean", category: "NATURE_ACTIVITY" as const, basePoints: 60 },
    { name: "Sadzenie drzew", description: "Udział w akcji sadzenia drzew.", icon: "tree", category: "NATURE_ACTIVITY" as const, basePoints: 80 },
    { name: "Obserwacja ptaków", description: "Spacer z lornetką i identyfikacja gatunków.", icon: "bird", category: "NATURE_ACTIVITY" as const, basePoints: 25 },
    { name: "Joga na świeżym powietrzu", description: "Sesja jogi w plenerze.", icon: "yoga", category: "NATURE_ACTIVITY" as const, basePoints: 35 },
    { name: "Bieganie w terenie", description: "Bieg po leśnych ścieżkach zamiast po mieście.", icon: "run", category: "NATURE_ACTIVITY" as const, basePoints: 40 },
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
