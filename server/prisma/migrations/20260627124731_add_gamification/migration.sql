-- CreateEnum
CREATE TYPE "EcoCategory" AS ENUM ('MOBILITY', 'CIRCULARITY', 'LOCAL_CONSUMPTION', 'NATURE_ACTIVITY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canTransform" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rootStageId" TEXT,
ADD COLUMN     "totalExp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "RootStage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "expRequired" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "RootStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EcoActivity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT '🌱',
    "category" "EcoCategory" NOT NULL,
    "basePoints" INTEGER NOT NULL DEFAULT 10,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EcoActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEcoActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ecoActivityId" TEXT NOT NULL,
    "basePoints" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "leaderboardPts" INTEGER NOT NULL DEFAULT 0,
    "expPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserEcoActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RootStage_level_key" ON "RootStage"("level");

-- CreateIndex
CREATE UNIQUE INDEX "EcoActivity_name_key" ON "EcoActivity"("name");

-- CreateIndex
CREATE INDEX "UserEcoActivityLog_userId_createdAt_idx" ON "UserEcoActivityLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserEcoActivityLog_ecoActivityId_userId_createdAt_idx" ON "UserEcoActivityLog"("ecoActivityId", "userId", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rootStageId_fkey" FOREIGN KEY ("rootStageId") REFERENCES "RootStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEcoActivityLog" ADD CONSTRAINT "UserEcoActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEcoActivityLog" ADD CONSTRAINT "UserEcoActivityLog_ecoActivityId_fkey" FOREIGN KEY ("ecoActivityId") REFERENCES "EcoActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
