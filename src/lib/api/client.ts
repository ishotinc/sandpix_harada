// API client configuration for Supabase Edge Functions
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;

export const apiEndpoints = {
  projects: `${API_BASE_URL}/projects`,
  projectsGenerate: `${API_BASE_URL}/projects-generate`,
  profile: `${API_BASE_URL}/profile`,
};

// Helper function to get auth headers
export async function getAuthHeaders() {
  try {
    const { supabase } = await import('@/lib/supabase/client');
    if (!supabase) {
      return {
        'Content-Type': 'application/json',
      };
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };
    }
    
    return {
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
}