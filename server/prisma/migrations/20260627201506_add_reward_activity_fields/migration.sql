-- AlterTable
ALTER TABLE "EcoActivity" ADD COLUMN     "activityType" TEXT NOT NULL DEFAULT 'permanent',
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ALTER COLUMN "icon" SET DEFAULT 'leaf';

-- AddForeignKey
ALTER TABLE "EcoActivity" ADD CONSTRAINT "EcoActivity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
