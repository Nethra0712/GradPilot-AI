import { z } from 'zod';

const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  role: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  link: z.string().url('Invalid link URL').or(z.literal('')).optional().nullable(),
});

const awardSchema = z.object({
  title: z.string().min(1, 'Award title is required'),
  issuer: z.string().optional().nullable(),
  year: z.coerce.number().int().min(1980).max(2060).optional().nullable(),
  description: z.string().optional().nullable(),
});

const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  role: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

const volunteerSchema = z.object({
  role: z.string().min(1, 'Volunteer role is required'),
  organization: z.string().min(1, 'Organization is required'),
  description: z.string().optional().nullable(),
});

const languageSchema = z.object({
  language: z.string().min(1, 'Language is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Native/Bilingual']),
});

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional().nullable(),
});

const englishTestSchema = z.object({
  testType: z.enum(['IELTS', 'TOEFL', 'PTE', 'Duolingo']),
  dateTaken: z.string().optional().nullable(),
  score: z.string().min(1, 'Test score is required'),
});

export const profileSchema = z.object({
  // Personal Details
  dob: z
    .string()
    .datetime({ precision: 3 })
    .or(z.string().date())
    .or(z.date())
    .optional()
    .nullable(),
  nationality: z.string().optional().nullable(),

  // Education Details
  currentEducation: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  gpa: z.string().optional().nullable(),
  graduationYear: z.coerce.number().int().min(1980).max(2060).optional().nullable(),

  // Target Studies Details
  targetDegree: z.string().optional().nullable(),
  targetUniversities: z.array(z.string()).optional().nullable(),

  // Career
  dreamJob: z.string().optional().nullable(),
  careerGoals: z.string().optional().nullable(),

  // Arrays/Lists
  workExperience: z.array(experienceSchema).optional().nullable(),
  projects: z.array(projectSchema).optional().nullable(),
  awards: z.array(awardSchema).optional().nullable(),
  activities: z.array(activitySchema).optional().nullable(),
  volunteerWork: z.array(volunteerSchema).optional().nullable(),
  languages: z.array(languageSchema).optional().nullable(),
  skills: z.array(skillSchema).optional().nullable(),
  englishTests: z.array(englishTestSchema).optional().nullable(),

  additionalNotes: z.string().optional().nullable(),
});
