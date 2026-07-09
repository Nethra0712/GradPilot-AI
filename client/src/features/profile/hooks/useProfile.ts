import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { ProfileResponse } from '../types/profile.types';

export const PROFILE_QUERY_KEY = ['profile'];

/**
 * Hook to retrieve student profile and completion scoring status.
 */
export const useProfile = () => {
  return useQuery<ProfileResponse, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileService.fetchProfile,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false, // If no profile exists, it returns null profile cleanly without retries
  });
};

export default useProfile;
