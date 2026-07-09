import api from '@/services/api';
import { StudentProfile, ProfileResponse } from '../types/profile.types';

/**
 * API Service for managing academic profiles.
 * Interacts with RESTful endpoints and returns normalized payloads.
 */
export const profileService = {
  /**
   * Fetch current authenticated user's profile and completeness stats.
   */
  async fetchProfile(): Promise<ProfileResponse> {
    const res = await api.get('/profile');
    return res.data.data;
  },

  /**
   * Initialize a new profile.
   */
  async createProfile(profile: Partial<StudentProfile>): Promise<ProfileResponse> {
    const res = await api.post('/profile', profile);
    return res.data.data;
  },

  /**
   * Update existing profile properties.
   */
  async updateProfile(profile: Partial<StudentProfile>): Promise<ProfileResponse> {
    const res = await api.put('/profile', profile);
    return res.data.data;
  },

  /**
   * Soft-delete student profile.
   */
  async deleteProfile(): Promise<void> {
    await api.delete('/profile');
  },
};
