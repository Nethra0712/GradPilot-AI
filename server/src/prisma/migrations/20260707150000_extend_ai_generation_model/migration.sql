-- AlterTable
-- Adds auditing details to the ai_generations table: requestId, promptTokens, completionTokens, and latency.

ALTER TABLE "ai_generations" 
  ADD COLUMN "requestId" TEXT,
  ADD COLUMN "promptTokens" INTEGER,
  ADD COLUMN "completionTokens" INTEGER,
  ADD COLUMN "latency" INTEGER;
