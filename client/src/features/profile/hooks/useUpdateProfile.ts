import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { StudentProfile, ProfileResponse } from '../types/profile.types';
import { PROFILE_QUERY_KEY } from './useProfile';

/**
 * Mutation hook to update the student profile.
 * Implements optimistic updates and invalidates cache query to keep components in sync.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProfileResponse,
    Error,
    Partial<StudentProfile>,
    { previousData: ProfileResponse | undefined }
  >({
    mutationFn: profileService.updateProfile,
    // Optimistic Update UI sync
    onMutate: async (newProfile) => {
      // Cancel outgoing refetches so they don't overwrite optimistic updates
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ProfileResponse>(PROFILE_QUERY_KEY);

      // Optimistically update cache values
      if (previousData) {
        queryClient.setQueryData<ProfileResponse>(PROFILE_QUERY_KEY, {
          ...previousData,
          profile: {
            ...previousData.profile,
            ...newProfile,
          } as StudentProfile,
        });
      }

      return { previousData };
    },
    // If mutation fails, rollback cache snapshot
    onError: (_err, _newProfile, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(PROFILE_QUERY_KEY, context.previousData);
      }
    },
    // Always refetch / invalidate query to guarantee accuracy
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};

export default useUpdateProfile;
