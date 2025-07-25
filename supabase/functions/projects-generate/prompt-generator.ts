import { DEFAULT_PROMPT_TEMPLATE } from './default-prompt.ts';

interface ProjectData {
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

interface Profile {
  company_name?: string;
  company_achievements?: string;
  contact_info?: string;
  personal_name?: string;
  personal_bio?: string;
  achievements?: string;
}

interface SwipeScores {
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



export function generateFinalPrompt(
  projectData: ProjectData,
  profileData: Profile,
  swipeScores: SwipeScores,
  planType: 'free' | 'plus' = 'free',
  language: 'ja' | 'en' = 'en',
  purpose: string = 'product'
): string {
  // 言語設定
  const languageCode = language === 'ja' ? 'ja' : 'en';
  const languageInstruction = language === 'ja' 
    ? '日本語' 
    : '英語';

  // スワイプスコアをテキスト形式に変換
  const scoresText = Object.entries(swipeScores)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  // プロンプトテンプレートを使用して変数を置換
  let prompt = DEFAULT_PROMPT_TEMPLATE;

  // 言語関連の置換
  prompt = prompt.replace(/{language}/g, languageCode);
  prompt = prompt.replace(/{language_instruction}/g, languageInstruction);

  // プロジェクト情報の置換
  prompt = prompt.replace(/{service_name}/g, projectData.service_name || '');
  prompt = prompt.replace(/{service_description}/g, projectData.service_description || '');
  prompt = prompt.replace(/{main_copy}/g, projectData.main_copy || '');
  prompt = prompt.replace(/{cta_text}/g, projectData.cta_text || '');
  prompt = prompt.replace(/{redirect_url}/g, projectData.redirect_url || '');
  prompt = prompt.replace(/{service_achievements}/g, projectData.service_achievements || '');
  prompt = prompt.replace(/{purpose}/g, purpose || '');

  // プロフィール情報の置換
  prompt = prompt.replace(/{company_name}/g, profileData.company_name || '');
  prompt = prompt.replace(/{company_achievements}/g, profileData.company_achievements || '');
  prompt = prompt.replace(/{contact_info}/g, profileData.contact_info || '');
  prompt = prompt.replace(/{personal_name}/g, profileData.personal_name || '');
  prompt = prompt.replace(/{personal_bio}/g, profileData.personal_bio || '');
  prompt = prompt.replace(/{achievements}/g, profileData.achievements || '');

  // カスタムコードの置換（空の場合は行全体を削除）
  if (projectData.custom_head && projectData.custom_head.trim()) {
    prompt = prompt.replace(/カスタムhead内容: {custom_head}/g, `カスタムhead内容: ${projectData.custom_head}`);
  } else {
    prompt = prompt.replace(/カスタムhead内容: {custom_head}\n?/g, '');
  }
  
  if (projectData.custom_body && projectData.custom_body.trim()) {
    prompt = prompt.replace(/カスタムbody内容: {custom_body}/g, `カスタムbody内容: ${projectData.custom_body}`);
  } else {
    prompt = prompt.replace(/カスタムbody内容: {custom_body}\n?/g, '');
  }

  // スワイプスコアの置換
  prompt = prompt.replace(/{swipe_scores}/g, scoresText);

  // Inject footer for free users
  if (planType === 'free') {
    // Add padding-bottom to body to ensure content is not hidden behind fixed footer
    prompt = prompt.replace(
      '</body>',
      `
<!-- Footer for free users -->
<div style="position: fixed; bottom: 0; left: 0; right: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 0; text-align: center; z-index: 9999; box-shadow: 0 -4px 12px rgba(0,0,0,0.15);">
  <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
    <!-- Logo SVG -->
    <svg width="32" height="32" viewBox="0 0 100 100" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
      <circle cx="50" cy="50" r="45" fill="#fff" opacity="0.9"/>
      <path d="M30 70 Q50 20 70 70" stroke="#764ba2" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="8" fill="#667eea"/>
    </svg>
    <!-- Text with styled Sandpix name -->
    <div style="font-size: 18px; font-weight: 600; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
      Made with 
      <a href="https://sandpix-harada.vercel.app/" target="_blank" style="color: #fbbf24; text-decoration: none; font-weight: 700; background: rgba(251, 191, 36, 0.2); padding: 2px 8px; border-radius: 4px; margin: 0 4px; transition: all 0.3s ease;">
        SANDPIX
      </a>
    </div>
  </div>
</div>
<style>
  /* Ensure content doesn't hide behind footer */
  body {
    padding-bottom: 80px !important;
  }
  /* Hover effect for the link */
  a[href="https://sandpix-harada.vercel.app/"]:hover {
    background: rgba(251, 191, 36, 0.4) !important;
    transform: translateY(-1px);
  }
</style>
</body>`
    );
  }

  return prompt;
}