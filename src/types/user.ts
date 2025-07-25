export interface User {
  id: string;
  email: string;
  plan_type: 'free' | 'plus';
  is_admin: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  regenerate_count: number;
  regenerate_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile extends User {
  profile: {
    id: string;
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
  };
}