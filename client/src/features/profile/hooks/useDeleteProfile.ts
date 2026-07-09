import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { PROFILE_QUERY_KEY } from './useProfile';

/**
 * Mutation hook to soft delete a student profile.
 */
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: profileService.deleteProfile,
    onSuccess: () => {
      // Invalidate the cache to trigger a query refetch showing null profile
      queryClient.setQueryData(PROFILE_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};

export default useDeleteProfile;
