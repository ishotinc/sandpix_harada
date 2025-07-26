import { PurposeType } from '@/lib/constants/purposes';

export interface ProjectGenerationData {
  service_name: string;
  service_description: string;
  purpose: PurposeType;
  language: 'ja' | 'en';
  main_copy?: string;
  cta_text?: string;
  redirect_url?: string;
  service_achievements?: string;
  custom_head?: string;
  custom_body?: string;
}

export interface SwipeResult {
  image: {
    id: number;
    path: string;
    category: string;
    tags: Record<string, number>;
  };
  liked: boolean;
}

export interface GenerationUsage {
  current: number;
  limit: number;
  remaining: number;
  resetsAt?: string;
  isAdmin?: boolean;
}

export interface GenerationResponse {
  html: string;
  usage?: GenerationUsage;
}

export interface GenerationError {
  error: string;
  message?: string;
  usage?: GenerationUsage;
}