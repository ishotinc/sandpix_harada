export interface Project {
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
}

export interface CreateProjectData {
  service_name: string;
  redirect_url?: string;
  purpose?: 'product' | 'service' | 'brand' | 'lead' | 'event';
  service_description?: string;
}

export interface UpdateProjectData {
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
}

export interface SwipeScores {
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
}

export interface SwipeImage {
  id: number;
  title: string;
  description: string;
  visual_hints: string;
  path: string;
  scores: SwipeScores;
}

export interface SwipeConfig {
  version: string;
  images: SwipeImage[];
}