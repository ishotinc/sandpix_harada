import { DEFAULT_PROMPT_TEMPLATE } from './default-prompt.ts';
import { PromptBuilder } from './prompt-builder.ts';

// Define types inline to avoid import issues
type ProjectData = {
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
};

type Profile = {
  company_name?: string;
  company_achievements?: string;
  contact_info?: string;
  personal_name?: string;
  personal_bio?: string;
  achievements?: string;
};

type SwipeScores = {
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
};

type PlanType = 'free' | 'plus';
type Language = 'ja' | 'en';
type Purpose = 'product' | 'lead' | 'service' | 'brand' | 'event';

export function generateFinalPrompt(
  projectData: ProjectData,
  profileData: Profile,
  swipeScores: SwipeScores,
  planType: PlanType = 'free',
  language: Language,
  purpose: Purpose = 'product'
): string {
  const builder = new PromptBuilder(DEFAULT_PROMPT_TEMPLATE);
  return builder.build(
    projectData,
    profileData,
    swipeScores,
    planType,
    language,
    purpose
  );
}

// 新しい関数: スワイプデータから直接プロンプトを生成
export function generateFinalPromptFromSwipeData(
  projectData: ProjectData,
  profileData: Profile,
  swipeData: Array<{ imageId: number; liked: boolean }>,
  planType: PlanType = 'free',
  language: Language,
  purpose: Purpose = 'product'
): string {
  const builder = new PromptBuilder(DEFAULT_PROMPT_TEMPLATE);
  return builder.buildFromSwipeData(
    projectData,
    profileData,
    swipeData,
    planType,
    language,
    purpose
  );
}