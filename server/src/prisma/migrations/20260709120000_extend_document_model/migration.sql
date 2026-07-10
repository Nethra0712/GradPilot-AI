-- AlterEnum
ALTER TYPE "DocumentStatus" ADD VALUE 'PENDING';
ALTER TYPE "DocumentStatus" ADD VALUE 'GENERATING';
ALTER TYPE "DocumentStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "DocumentStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "documents"
  ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Untitled Document',
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "generatedBy" TEXT DEFAULT 'AI',
  ADD COLUMN "promptVersion" TEXT,
  ADD COLUMN "provider" TEXT,
  ADD COLUMN "model" TEXT,
  ADD COLUMN "requestId" TEXT,
  ADD COLUMN "parentId" UUID;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
