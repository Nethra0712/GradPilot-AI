/**
 * context.types.ts
 *
 * Strongly-typed interfaces for the normalized AI Context Object.
 * This structure is provider-agnostic (OpenAI, Claude, Gemini, etc.) and
 * represents the core applicant metadata injected into LLM prompt templates.
 */

export interface StudentProfileContext {
  fullName?: string;
  nationality?: string;
  dob?: string;
  currentEducation?: string;
  institution?: string;
  graduationYear?: number;
  gpa?: string;
}

export interface TargetStudyContext {
  degree?: string;
  universities?: string[];
  fieldOfStudy?: string;
}

export interface CareerContext {
  goals?: string;
  dreamJob?: string;
}

export interface WorkExperienceContext {
  jobTitle: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ProjectContext {
  title: string;
  role?: string;
  description?: string;
  link?: string;
}

export interface AwardContext {
  title: string;
  issuer?: string;
  year?: number;
  description?: string;
}

export interface VolunteerContext {
  role: string;
  organization: string;
  description?: string;
}

export interface ExtracurricularContext {
  name: string;
  role?: string;
  description?: string;
}

export interface ExperienceContext {
  workExperience: WorkExperienceContext[];
  projects: ProjectContext[];
  awards: AwardContext[];
  volunteerWork: VolunteerContext[];
  extracurricularActivities: ExtracurricularContext[];
}

export interface LanguageContext {
  language: string;
  level: string;
}

export interface TechnicalSkillContext {
  name: string;
  level?: string;
}

export interface EnglishTestContext {
  testType: string;
  dateTaken?: string;
  score: string;
}

export interface SkillsContext {
  languages: LanguageContext[];
  technicalSkills: TechnicalSkillContext[];
  englishTests: EnglishTestContext[];
}

export interface AIContext {
  student: StudentProfileContext;
  targetStudy: TargetStudyContext;
  career: CareerContext;
  experience: ExperienceContext;
  skills: SkillsContext;
  additionalNotes?: string;
}
