import { Profile } from '@prisma/client';

// ─── Input types for Profile CRUD ─────────────────────────────────────────────

export interface CreateProfileInput {
  userId: string;
  academicBackground?: string;
  achievements?: string[];
  careerGoals?: string;
  targetCountries?: string[];
  targetFields?: string[];
}

export interface UpdateProfileInput {
  academicBackground?: string;
  achievements?: string[];
  careerGoals?: string;
  targetCountries?: string[];
  targetFields?: string[];
}

export type ProfileWithUser = Profile & {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
};
