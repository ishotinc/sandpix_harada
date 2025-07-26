import { DEFAULT_PROMPT_TEMPLATE } from './default-prompt.ts';
import { PromptBuilder } from './prompt-builder.ts';
import { ProjectData, Profile, SwipeScores, PlanType, Language, Purpose } from '../_shared/types.ts';

export function generateFinalPrompt(
  projectData: ProjectData,
  profileData: Profile,
  swipeScores: SwipeScores,
  planType: PlanType = 'free',
  language: Language = 'en',
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