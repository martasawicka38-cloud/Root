# Baza danych — Schemat Prisma

## Stack

- **ORM:** Prisma 7
- **Adapter:** @prisma/adapter-pg (pg Pool)
- **DB:** PostgreSQL 16
- **Konfiguracja:** server/prisma.config.ts (DATABASE_URL z env)

## Model danych

### User

```prisma
model User {
  id                  Int             @id @default(autoincrement())
  email               String          @unique
  name                String?
  passwordHash        String?
  stepGoal            Int             @default(10000)
  partner             String?
  avatarColor         String          @default("#22C55E")
  level               Int             @default(1)
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt

  activities          Activity[]
  declarations        Declaration[]
  transactions        Transaction[]
  notifications       Notification[]
  achievements        UserAchievement[]
}
```

### Reward

```prisma
model Reward {
  id          Int       @id @default(autoincrement())
  name        String
  description String
  price       Int
  category    String    @default("other")
  imageUrl    String?
  stock       Int       @default(10)
  active      Boolean   @default(true)
  createdAt   DateTime  @default(now())
}
```

### Activity

```prisma
model Activity {
  id        Int      @id @default(autoincrement())
  userId    Int
  type      String   // walking, running, cycling, swimming, yoga, gym
  value     Int      // steps or distance
  duration  Int?     // minutes
  ecoCoins  Int      // earned coins
  date      DateTime @default(now())
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}
```

### Declaration

```prisma
model Declaration {
  id          Int      @id @default(autoincrement())
  userId      Int
  title       String
  description String
  ecoCoins    Int      @default(5)
  date        DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}
```

### Transaction

```prisma
model Transaction {
  id          Int      @id @default(autoincrement())
  userId      Int
  type        String   // earned | spent
  amount      Int
  description String
  rewardId    Int?
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  reward      Reward?  @relation(fields: [rewardId], references: [id])
}
```

### Notification

```prisma
model Notification {
  id        Int      @id @default(autoincrement())
  userId    Int
  title     String
  message   String
  type      String   // achievement | reward | challenge | system
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}
```

### Achievement

```prisma
model Achievement {
  id          Int              @id @default(autoincrement())
  name        String
  description String
  icon        String           @default("trophy")
  criteria    String           // np. "steps:100000", "streak:7"
  createdAt   DateTime         @default(now())

  users       UserAchievement[]
}
```

### UserAchievement (junction)

```prisma
model UserAchievement {
  userId        Int
  achievementId Int
  unlockedAt    DateTime @default(now())
  progress      Int      @default(0)

  user          User          @relation(fields: [userId], references: [id])
  achievement   Achievement   @relation(fields: [achievementId], references: [id])

  @@id([userId, achievementId])
}
```

## Relacje

```
User ──1:N──> Activity
User ──1:N──> Declaration
User ──1:N──> Transaction
User ──1:N──> Notification
User ──N:M──> Achievement (via UserAchievement)
Reward ──1:N──> Transaction (optional)
```

## Seed

`server/prisma/seed.ts` tworzy:

- 1 user (jan@intel.com, cel 10000 krokow, partner Intel)
- 4 nagrody (kawa, karta sport, koszulka, sadzonka)
- 2 powiadomienia (powitalne + achievement)
- 2 achievementy ("Pierwsze kroki" + "Misternik tygodnia")

## Migracje

- Jedna migracja inicjalna: `20260626230653_00_migration`
- Kolejne: `npx prisma migrate dev --name opis_zmiany`
