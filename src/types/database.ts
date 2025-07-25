export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        };
        Insert: {
          id?: string;
          email: string;
          plan_type?: 'free' | 'plus';
          is_admin?: boolean;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          regenerate_count?: number;
          regenerate_reset_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          plan_type?: 'free' | 'plus';
          is_admin?: boolean;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          regenerate_count?: number;
          regenerate_reset_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name?: string;
          company_achievements?: string;
          contact_info?: string;
          personal_name?: string;
          personal_bio?: string;
          achievements?: string;
          plan_type?: 'free' | 'plus';
          daily_generation_count?: number;
          daily_generation_reset_at?: string | null;
          project_count?: number;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          company_achievements?: string;
          contact_info?: string;
          personal_name?: string;
          personal_bio?: string;
          achievements?: string;
          plan_type?: 'free' | 'plus';
          daily_generation_count?: number;
          daily_generation_reset_at?: string | null;
          project_count?: number;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          service_name: string;
          redirect_url: string;
          purpose: 'product' | 'service' | 'brand' | 'lead' | 'event';
          language: 'ja' | 'en';
          service_description: string;
          main_copy: string;
          cta_text: string;
          service_achievements: string;
          custom_head: string;
          custom_body: string;
          generated_html: string;
          is_published: boolean;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_name: string;
          redirect_url?: string;
          purpose?: 'product' | 'service' | 'brand' | 'lead' | 'event';
          language?: 'ja' | 'en';
          service_description?: string;
          main_copy?: string;
          cta_text?: string;
          service_achievements?: string;
          custom_head?: string;
          custom_body?: string;
          generated_html?: string;
          is_published?: boolean;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_name?: string;
          redirect_url?: string;
          purpose?: 'product' | 'service' | 'brand' | 'lead' | 'event';
          language?: 'ja' | 'en';
          service_description?: string;
          main_copy?: string;
          cta_text?: string;
          service_achievements?: string;
          custom_head?: string;
          custom_body?: string;
          generated_html?: string;
          is_published?: boolean;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      swipe_results: {
        Row: {
          id: string;
          project_id: string;
          warm_score: number;
          cool_score: number;
          mono_score: number;
          vivid_score: number;
          friendly_score: number;
          professional_score: number;
          creative_score: number;
          minimal_score: number;
          energetic_score: number;
          trustworthy_score: number;
          luxurious_score: number;
          approachable_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          warm_score?: number;
          cool_score?: number;
          mono_score?: number;
          vivid_score?: number;
          friendly_score?: number;
          professional_score?: number;
          creative_score?: number;
          minimal_score?: number;
          energetic_score?: number;
          trustworthy_score?: number;
          luxurious_score?: number;
          approachable_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          warm_score?: number;
          cool_score?: number;
          mono_score?: number;
          vivid_score?: number;
          friendly_score?: number;
          professional_score?: number;
          creative_score?: number;
          minimal_score?: number;
          energetic_score?: number;
          trustworthy_score?: number;
          luxurious_score?: number;
          approachable_score?: number;
          created_at?: string;
        };
      };
    };
  };
}