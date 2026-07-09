import { StudentProfile, ProfileCompletionDetails } from '../types/profile.types';

function isCompleted(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  return true;
}

/**
 * Calculates academic profile completion stats on the client-side.
 */
export function calculateProfileCompletion(
  profile: StudentProfile | null
): ProfileCompletionDetails {
  const lastUpdated = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString()
    : 'Never';

  const SECTIONS = [
    {
      name: 'Personal Details',
      check: (p: StudentProfile) => isCompleted(p.dob) && isCompleted(p.nationality),
      weight: 10,
    },
    {
      name: 'Education',
      check: (p: StudentProfile) =>
        isCompleted(p.currentEducation) &&
        isCompleted(p.institution) &&
        isCompleted(p.graduationYear),
      weight: 20,
    },
    {
      name: 'Target Studies',
      check: (p: StudentProfile) =>
        isCompleted(p.targetDegree) && isCompleted(p.targetUniversities),
      weight: 20,
    },
    {
      name: 'Career Goals',
      check: (p: StudentProfile) => isCompleted(p.careerGoals) || isCompleted(p.dreamJob),
      weight: 15,
    },
    {
      name: 'Work Experience',
      check: (p: StudentProfile) => isCompleted(p.workExperience),
      weight: 10,
    },
    {
      name: 'Projects',
      check: (p: StudentProfile) => isCompleted(p.projects),
      weight: 5,
    },
    {
      name: 'Achievements & Awards',
      check: (p: StudentProfile) => isCompleted(p.awards),
      weight: 5,
    },
    {
      name: 'Extracurricular Activities',
      check: (p: StudentProfile) => isCompleted(p.activities),
      weight: 5,
    },
    {
      name: 'Skills',
      check: (p: StudentProfile) => isCompleted(p.skills),
      weight: 5,
    },
    {
      name: 'Languages',
      check: (p: StudentProfile) => isCompleted(p.languages),
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
