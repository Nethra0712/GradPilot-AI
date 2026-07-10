-- AlterEnum
ALTER TYPE "DocumentStatus" ADD VALUE 'REVIEW';
ALTER TYPE "DocumentStatus" ADD VALUE 'ARCHIVED';

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATED', 'GENERATED', 'EDITED', 'REGENERATED', 'RESTORED', 'FINALIZED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "folders" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_activities" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_activities_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "documents"
    ADD COLUMN "isPinned" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN "folderId" UUID;

-- CreateIndex
CREATE INDEX "folders_userId_idx" ON "folders"("userId");

-- CreateIndex
CREATE INDEX "document_activities_documentId_idx" ON "document_activities"("documentId");
CREATE INDEX "document_activities_createdAt_idx" ON "document_activities"("createdAt");

-- CreateIndex
CREATE INDEX "documents_folderId_idx" ON "documents"("folderId");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_activities" ADD CONSTRAINT "document_activities_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
