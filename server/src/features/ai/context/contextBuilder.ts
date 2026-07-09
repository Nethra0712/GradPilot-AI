import { Profile } from '@prisma/client';
import {
  AIContext,
  WorkExperienceContext,
  ProjectContext,
  AwardContext,
  VolunteerContext,
  ExtracurricularContext,
  LanguageContext,
  TechnicalSkillContext,
  EnglishTestContext,
} from './context.types';
import {
  sanitizeString,
  sanitizeNumber,
  cleanStringArray,
  cleanObjectArray,
} from '../utils/profileNormalizer';

/**
 * Builds a structured, normalized AI Context Object from raw DB profiles.
 *
 * Why Normalization is Performed:
 * ------------------------------
 * Raw user forms often contain leading/trailing whitespaces, empty strings, or arbitrary null keys.
 * Feeding raw data directly to LLMs increases token bloat and prompts model confusion.
 * This builder strips empty values, normalizes formats, and shapes lists, optimizing LLM execution.
 *
 * Why Context is Provider-Agnostic:
 * ---------------------------------
 * Provider specifications change rapidly. Direct integration of OpenAI, Claude, or Gemini schemas
 * inside application layers leads to hard dependencies and breaks scalability. This layout decouples
 * context collection from provider schemas, allowing the same object to feed any prompt builder.
 *
 * How Future Prompt Builders Should Consume It:
 * ---------------------------------------------
 * When generating documents, the AI provider service fetches this normalized context and maps
 * it into prompt templates using prompt formatting helpers (e.g. converting it to a markdown summary).
 */
export function buildAIContext(
  profile: Profile,
  user?: { fullName?: string; email?: string }
): AIContext {
  // ─── Student Profile Context ───
  const dobText = profile.dob ? profile.dob.toISOString().substring(0, 10) : undefined;

  const student = {
    fullName: sanitizeString(user?.fullName),
    nationality: sanitizeString(profile.nationality),
    dob: dobText,
    currentEducation: sanitizeString(profile.currentEducation),
    institution: sanitizeString(profile.institution),
    graduationYear: sanitizeNumber(profile.graduationYear),
    gpa: sanitizeString(profile.gpa),
  };

  // Remove empty keys from student metadata
  Object.keys(student).forEach((key) => {
    const k = key as keyof typeof student;
    if (student[k] === undefined) delete student[k];
  });

  // ─── Target Studies Context ───
  const targetStudy = {
    degree: sanitizeString(profile.targetDegree),
    universities: cleanStringArray(profile.targetUniversities),
    fieldOfStudy: sanitizeString(profile.academicBackground), // mapped from legacy field if populated
  };

  Object.keys(targetStudy).forEach((key) => {
    const k = key as keyof typeof targetStudy;
    if (
      targetStudy[k] === undefined ||
      (Array.isArray(targetStudy[k]) && (targetStudy[k] as unknown[]).length === 0)
    ) {
      delete targetStudy[k];
    }
  });

  // ─── Career Context ───
  const career = {
    goals: sanitizeString(profile.careerGoals),
    dreamJob: sanitizeString(profile.dreamJob),
  };

  Object.keys(career).forEach((key) => {
    const k = key as keyof typeof career;
    if (career[k] === undefined) delete career[k];
  });

  // ─── Experience, Projects, Volunteer & Awards ───
  const experience = {
    workExperience: cleanObjectArray<WorkExperienceContext>(profile.workExperience, 'jobTitle'),
    projects: cleanObjectArray<ProjectContext>(profile.projects, 'title'),
    awards: cleanObjectArray<AwardContext>(profile.awards, 'title'),
    volunteerWork: cleanObjectArray<VolunteerContext>(profile.volunteerWork, 'role'),
    extracurricularActivities: cleanObjectArray<ExtracurricularContext>(profile.activities, 'name'),
  };

  // ─── Skills, Languages & Tests ───
  const skills = {
    languages: cleanObjectArray<LanguageContext>(profile.languages, 'language'),
    technicalSkills: cleanObjectArray<TechnicalSkillContext>(profile.skills, 'name'),
    englishTests: cleanObjectArray<EnglishTestContext>(profile.englishTests, 'testType'),
  };

  // ─── Additional Notes ───
  const additionalNotes = sanitizeString(profile.additionalNotes);

  return {
    student,
    targetStudy,
    career,
    experience,
    skills,
    ...(additionalNotes ? { additionalNotes } : {}),
  };
}
