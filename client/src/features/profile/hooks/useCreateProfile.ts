import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { StudentProfile, ProfileResponse } from '../types/profile.types';
import { PROFILE_QUERY_KEY } from './useProfile';

/**
 * Mutation hook to initialize a student profile.
 */
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, Error, Partial<StudentProfile>>({
    mutationFn: profileService.createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};

export default useCreateProfile;
