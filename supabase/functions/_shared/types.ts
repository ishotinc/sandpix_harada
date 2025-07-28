// Shared types for Supabase functions

export interface ProjectData {
  service_name: string;
  redirect_url?: string;
  purpose: string;
  service_description: string;
  main_copy?: string;
  cta_text?: string;
  service_achievements?: string;
  custom_head?: string;
  custom_body?: string;
  language?: 'ja' | 'en';
}

export interface Profile {
  company_name?: string;
  company_achievements?: string;
  contact_info?: string;
  personal_name?: string;
  personal_bio?: string;
  achievements?: string;
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

export type PlanType = 'free' | 'plus';
export type Language = 'ja' | 'en';
export type Purpose = 'product' | 'lead' | 'service' | 'brand' | 'event';

export interface GenerationRequest {
  projectData: ProjectData;
  swipeScores: SwipeScores;
  language?: Language;
  purpose?: Purpose;
}

export interface GenerationResponse {
  html: string;
  usage: {
    current: number;
    limit: number;
    remaining: number;
    isAdmin: boolean;
  };
}

export interface GenerationError {
  error: string;
  usage?: {
    used: number;
    limit: number;
    resetsAt: string;
  };
}

// Logger utility type
export interface Logger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: unknown): void;
}