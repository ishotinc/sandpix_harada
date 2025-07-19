export interface Profile {
  id: string;
  user_id: string;
  company_name: string;
  company_achievements: string;
  contact_info: string;
  personal_name: string;
  personal_bio: string;
  achievements: string;
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