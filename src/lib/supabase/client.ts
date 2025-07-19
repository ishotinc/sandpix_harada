import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase configuration
const hasValidConfig = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key';

if (!hasValidConfig) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
  console.warn('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

// Create a mock client if environment variables are missing or invalid
export const supabase = hasValidConfig
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;