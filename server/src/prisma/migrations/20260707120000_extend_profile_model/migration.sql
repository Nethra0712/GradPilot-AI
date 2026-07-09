-- AlterTable
-- Adds detailed applicant profile fields and soft-delete column to the profiles table.
-- All columns are nullable to maintain backward compatibility with existing users.

ALTER TABLE "profiles" 
  ADD COLUMN "dob" TIMESTAMP(3),
  ADD COLUMN "nationality" TEXT,
  ADD COLUMN "currentEducation" TEXT,
  ADD COLUMN "institution" TEXT,
  ADD COLUMN "gpa" TEXT,
  ADD COLUMN "graduationYear" INTEGER,
  ADD COLUMN "targetDegree" TEXT,
  ADD COLUMN "targetUniversities" JSONB,
  ADD COLUMN "dreamJob" TEXT,
  ADD COLUMN "workExperience" JSONB,
  ADD COLUMN "projects" JSONB,
  ADD COLUMN "awards" JSONB,
  ADD COLUMN "activities" JSONB,
  ADD COLUMN "volunteerWork" JSONB,
  ADD COLUMN "languages" JSONB,
  ADD COLUMN "skills" JSONB,
  ADD COLUMN "englishTests" JSONB,
  ADD COLUMN "additionalNotes" TEXT,
  ADD COLUMN "deletedAt" TIMESTAMP(3);
