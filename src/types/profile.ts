export interface Profile {
  id: string;
  user_id: string;
  company_name: string;
  company_achievements: string;
  contact_info: string;
  personal_name: string;
  personal_bio: string;
  achievements: string;
  plan_type: 'free' | 'plus';
  daily_generation_count: number;
  daily_generation_reset_at: string | null;
  project_count: number;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  company_name?: string;
  company_achievements?: string;
  contact_info?: string;
  personal_name?: string;
  personal_bio?: string;
  achievements?: string;
}