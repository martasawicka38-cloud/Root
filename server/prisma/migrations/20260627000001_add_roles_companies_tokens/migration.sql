-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('company', 'user');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyToken" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompanyToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyToken_token_key" ON "CompanyToken"("token");

-- AlterTable: add columns as nullable first, then backfill, then set NOT NULL
ALTER TABLE "User" ADD COLUMN "companyId" TEXT;
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'user';
ALTER TABLE "User" ADD COLUMN "usedTokenId" TEXT;

-- Backfill existing user with a default password hash (haslo123)
UPDATE "User" SET "passwordHash" = '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y' WHERE "passwordHash" IS NULL;

-- Make passwordHash NOT NULL after backfill
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;

-- CreateIndex (after columns exist)
CREATE UNIQUE INDEX "User_usedTokenId_key" ON "User"("usedTokenId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_usedTokenId_fkey" FOREIGN KEY ("usedTokenId") REFERENCES "CompanyToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyToken" ADD CONSTRAINT "CompanyToken_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
