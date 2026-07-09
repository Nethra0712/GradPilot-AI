import { Profile } from '@prisma/client';

export interface CompletionSummary {
  percentage: number;
  completedSectionsCount: number;
  totalSectionsCount: number;
  completedSections: string[];
  remainingSections: string[];
  lastUpdated: Date | string;
}

/**
 * Validates whether a sections' value is considered completed.
 */
function isCompleted(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    // If it's a JSON stringified array or arbitrary object, check length
    const keys = Object.keys(value);
    return keys.length > 0;
  }
  return true;
}

/**
 * Utility service to calculate profile completeness score.
 * Used by dashboard, profile pages, and future onboarding widgets.
 */
export function calculateProfileCompletion(profile: Profile | null): CompletionSummary {
  const lastUpdated = profile ? profile.updatedAt : new Date();

  // Define 10 distinct sections with their field checks
  const SECTIONS = [
    {
      name: 'Personal Details',
      check: (p: Profile) => isCompleted(p.dob) && isCompleted(p.nationality),
      weight: 10,
    },
    {
      name: 'Education',
      check: (p: Profile) =>
        isCompleted(p.currentEducation) &&
        isCompleted(p.institution) &&
        isCompleted(p.graduationYear),
      weight: 20,
    },
    {
      name: 'Target Studies',
      check: (p: Profile) => isCompleted(p.targetDegree) && isCompleted(p.targetUniversities),
      weight: 20,
    },
    {
      name: 'Career Goals',
      check: (p: Profile) => isCompleted(p.careerGoals) || isCompleted(p.dreamJob),
      weight: 15,
    },
    {
      name: 'Work Experience',
      check: (p: Profile) => isCompleted(p.workExperience),
      weight: 10,
    },
    {
      name: 'Projects',
      check: (p: Profile) => isCompleted(p.projects),
      weight: 5,
    },
    {
      name: 'Achievements & Awards',
      check: (p: Profile) => isCompleted(p.awards),
      weight: 5,
    },
    {
      name: 'Extracurricular Activities',
      check: (p: Profile) => isCompleted(p.activities),
      weight: 5,
    },
    {
      name: 'Skills',
      check: (p: Profile) => isCompleted(p.skills),
      weight: 5,
    },
    {
      name: 'Languages',
      check: (p: Profile) => isCompleted(p.languages),
      weight: 5,
    },
  ];

  if (!profile) {
    return {
      percentage: 0,
      completedSectionsCount: 0,
      totalSectionsCount: SECTIONS.length,
      completedSections: [],
      remainingSections: SECTIONS.map((s) => s.name),
      lastUpdated,
    };
  }

  let totalWeight = 0;
  let earnedWeight = 0;
  const completedSections: string[] = [];
  const remainingSections: string[] = [];

  SECTIONS.forEach((sec) => {
    totalWeight += sec.weight;
    if (sec.check(profile)) {
      earnedWeight += sec.weight;
      completedSections.push(sec.name);
    } else {
      remainingSections.push(sec.name);
    }
  });

  // Calculate percentage based on weights
  const percentage = Math.round((earnedWeight / totalWeight) * 100);

  return {
    percentage,
    completedSectionsCount: completedSections.length,
    totalSectionsCount: SECTIONS.length,
    completedSections,
    remainingSections,
    lastUpdated,
  };
}
