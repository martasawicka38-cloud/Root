-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('company_registration', 'employer_registration');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'employer';
ALTER TYPE "UserRole" ADD VALUE 'superadmin';

-- AlterTable
ALTER TABLE "CompanyToken" ADD COLUMN     "type" "TokenType" NOT NULL DEFAULT 'employer_registration',
ALTER COLUMN "companyId" DROP NOT NULL;
