import prisma from '@/prisma/client';
import { CreateProfileInput, UpdateProfileInput } from '@/types/profile.types';
import { Profile, Prisma } from '@prisma/client';

/**
 * ProfileRepository
 *
 * Data-access layer for the Profile model.
 * Profile is a 1:1 extension of User — every user may have at most one active profile.
 * Excludes soft-deleted records (deletedAt !== null) from general retrievals.
 */
export class ProfileRepository {
  /**
   * Find a profile by the owning user's ID.
   * Excludes soft-deleted profile rows.
   */
  async findByUserId(userId: string): Promise<Profile | null> {
    return prisma.profile.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  /**
   * Create a new profile for a user.
   */
  async create(data: CreateProfileInput): Promise<Profile> {
    return prisma.profile.create({
      data: {
        userId: data.userId,
        dob: data.dob ? new Date(data.dob) : null,
        nationality: data.nationality || null,
        currentEducation: data.currentEducation || null,
        institution: data.institution || null,
        gpa: data.gpa || null,
        graduationYear: data.graduationYear || null,
        targetDegree: data.targetDegree || null,
        targetUniversities:
          (data.targetUniversities as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        dreamJob: data.dreamJob || null,
        careerGoals: data.careerGoals || null,
        workExperience: (data.workExperience as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        projects: (data.projects as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        awards: (data.awards as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        activities: (data.activities as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        volunteerWork: (data.volunteerWork as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        languages: (data.languages as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        skills: (data.skills as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        englishTests: (data.englishTests as unknown as Prisma.InputJsonValue) || Prisma.DbNull,
        additionalNotes: data.additionalNotes || null,
      },
    });
  }

  /**
   * Update an existing profile.
   */
  async update(userId: string, data: UpdateProfileInput): Promise<Profile> {
    const updateData = { ...data } as unknown as Prisma.ProfileUpdateInput;

    // Parse Dates if present
    if (data.dob) {
      updateData.dob = new Date(data.dob);
    }

    return prisma.profile.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * Create-or-update (upsert) a profile.
   */
  async upsert(data: CreateProfileInput): Promise<Profile> {
    const { userId, ...profileFields } = data;
    const dobValue = profileFields.dob ? new Date(profileFields.dob) : null;

    const updateFields = {
      ...profileFields,
      dob: dobValue,
      deletedAt: null,
    } as unknown as Prisma.ProfileUpdateInput;

    const createFields = {
      userId,
      ...profileFields,
      dob: dobValue,
    } as unknown as Prisma.ProfileCreateInput;

    return prisma.profile.upsert({
      where: { userId },
      update: updateFields,
      create: createFields,
    });
  }

  /**
   * Soft-delete a profile by user ID.
   */
  async softDelete(userId: string): Promise<Profile> {
    return prisma.profile.update({
      where: { userId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Hard-delete a profile.
   */
  async hardDelete(userId: string): Promise<void> {
    await prisma.profile.delete({
      where: { userId },
    });
  }
}

export const profileRepository = new ProfileRepository();
