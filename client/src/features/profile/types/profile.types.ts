export interface WorkExperienceItem {
  jobTitle: string;
  company: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

export interface ProjectItem {
  title: string;
  role?: string | null;
  description?: string | null;
  link?: string | null;
}

export interface AwardItem {
  title: string;
  issuer?: string | null;
  year?: number | null;
  description?: string | null;
}

export interface ActivityItem {
  name: string;
  role?: string | null;
  description?: string | null;
}

export interface VolunteerItem {
  role: string;
  organization: string;
  description?: string | null;
}

export interface LanguageItem {
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native/Bilingual';
}

export interface SkillItem {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | null;
}

export interface EnglishTestItem {
  testType: 'IELTS' | 'TOEFL' | 'PTE' | 'Duolingo';
  dateTaken?: string | null;
  score: string;
}

export interface StudentProfile {
  id?: string;
  userId?: string;

  // Personal
  dob?: string | null;
  nationality?: string | null;

  // Education
  currentEducation?: string | null;
  institution?: string | null;
  gpa?: string | null;
  graduationYear?: number | null;

  // Target Studies
  targetDegree?: string | null;
  targetUniversities?: string[] | null;

  // Career
  dreamJob?: string | null;
  careerGoals?: string | null;

  // Structured Arrays
  workExperience?: WorkExperienceItem[] | null;
  projects?: ProjectItem[] | null;
  awards?: AwardItem[] | null;
  activities?: ActivityItem[] | null;
  volunteerWork?: VolunteerItem[] | null;
  languages?: LanguageItem[] | null;
  skills?: SkillItem[] | null;
  englishTests?: EnglishTestItem[] | null;

  additionalNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileCompletionDetails {
  percentage: number;
  completedSectionsCount: number;
  totalSectionsCount: number;
  completedSections: string[];
  remainingSections: string[];
  lastUpdated: string;
}

export interface ProfileResponse {
  profile: StudentProfile | null;
  completion: ProfileCompletionDetails;
}
