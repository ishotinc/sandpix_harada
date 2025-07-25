import { useState, useEffect } from 'react';
import { apiEndpoints, getAuthHeaders } from '@/lib/api/client';
import { Profile } from '@/types/profile';

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const headers = await getAuthHeaders();
      const response = await fetch(apiEndpoints.profile, {
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { 
    profile, 
    isLoading, 
    error, 
    refetch: fetchProfile 
  };
}