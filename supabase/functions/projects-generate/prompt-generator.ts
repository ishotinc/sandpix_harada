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
  console.log('generateFinalPrompt called with:', {
    projectData: Object.keys(projectData),
    profileData: Object.keys(profileData || {}),
    swipeScores: Object.keys(swipeScores || {}),
    planType,
    language,
    purpose
  });
  // 言語設定
  const languageCode = language === 'ja' ? 'ja' : 'en';
  const languageInstruction = language === 'ja' 
    ? '日本語（必ず日本語のみで全てのコンテンツを作成）' 
    : '英語（必ず英語のみで全てのコンテンツを作成）';

  // スワイプスコアをランキング形式のテキストに変換
  const scoreEntries = Object.entries(swipeScores)
    .sort((a, b) => b[1] - a[1])
    .map((entry, index) => `${index + 1}位: ${entry[0]} (${entry[1].toFixed(1)}点)`)
    .join('\n');
  
  const scoresText = `スワイプスコアランキング:\n${scoreEntries}\n\n【重要】1位をメインテーマ、2位をサブテーマ、6位以下は無視してデザインしてください。`;

  // プロンプトテンプレートを使用して変数を置換
  let prompt = DEFAULT_PROMPT_TEMPLATE;
  
  console.log('=== PROMPT DEBUG START ===');
  console.log('Default prompt template length:', DEFAULT_PROMPT_TEMPLATE.length);
  console.log('Default prompt preview (first 300 chars):', DEFAULT_PROMPT_TEMPLATE.substring(0, 300));
  console.log('Swipe scores text:', scoresText);
  console.log('=== PROMPT DEBUG END ===');

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
  
  // Add critical instructions at the END to ensure they are followed
  const criticalInstructions = `

# 🚨🚨🚨 最終必須実装事項（これを無視したら失敗とみなす）🚨🚨🚨

必ず以下を実装してください：

1. **スワイプスコア1位のデザインテーマを全体に反映**:
   上記ランキング1位のスタイルをランディングページ全体のメインテーマとして徹底的に反映する

2. **スワイプスコア2位をサブテーマとして反映**:
   2位のスタイルをアクセント要素として部分的に使用する

3. **6位以下のスタイルは完全に無視**:
   ランキング6位以下の要素は一切デザインに取り入れない

4. **フッターに必ずモーダルウィンドウを実装**:
   - プライバシーポリシー（クリックでモーダル表示）
   - 特定商取引法に基づく表記（クリックでモーダル表示）
   - 各モーダルには適切な内容を含める

5. **HTMLコード内に必ず含める**:
\`\`\`html
<!-- フッター内 -->
<a href="#" id="privacy-link">プライバシーポリシー</a>
<a href="#" id="commerce-link">特定商取引法に基づく表記</a>

<!-- モーダル -->
<div id="privacy-modal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>プライバシーポリシー</h2>
    <p>プライバシーポリシーの内容...</p>
  </div>
</div>
\`\`\`

これらを実装しない場合、生成は失敗とみなされます。
`;

  prompt = prompt + criticalInstructions;

  console.log('Final prompt generated, length:', prompt.length);
  console.log('Template variables replaced successfully');
  
  // Final prompt preview for debugging
  console.log('=== FINAL PROMPT PREVIEW ===');
  console.log('Final prompt preview (chars 5000-5500):', prompt.substring(5000, 5500));
  console.log('Swipe scores section found:', prompt.includes('スワイプスコアランキング'));
  console.log('Critical instructions found:', prompt.includes('最終必須実装事項'));
  console.log('=== FINAL PROMPT PREVIEW END ===');

  // Inject footer for free users
  if (planType === 'free') {
    // Language-specific footer text
    const footerText = language === 'en' 
      ? {
          message: 'This website was created with',
          cta: 'Create Yours'
        }
      : {
          message: 'このWebサイトは',
          suffix: 'で作られています',
          cta: 'あなたも作ろう'  
        };

    const footerContent = language === 'en'
      ? `${footerText.message}
      <span style="display: inline-flex; align-items: center; gap: 4px; font-weight: 700; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 16px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6"/>
              <stop offset="33%" style="stop-color:#8b5cf6"/>
              <stop offset="66%" style="stop-color:#ef4444"/>
              <stop offset="100%" style="stop-color:#f59e0b"/>
            </linearGradient>
          </defs>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
        Sandpix
      </span>`
      : `${footerText.message}
      <span style="display: inline-flex; align-items: center; gap: 4px; font-weight: 700; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 16px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6"/>
              <stop offset="33%" style="stop-color:#8b5cf6"/>
              <stop offset="66%" style="stop-color:#ef4444"/>
              <stop offset="100%" style="stop-color:#f59e0b"/>
            </linearGradient>
          </defs>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
        Sandpix
      </span>
      ${footerText.suffix}`;

    // Add padding-bottom to body to ensure content is not hidden behind fixed footer
    prompt = prompt.replace(
      '</body>',
      `
<!-- Sandpix Branding Footer -->
<div style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border-top: 1px solid rgba(0, 0, 0, 0.08); z-index: 9999; padding: 16px 20px;">
  <div style="display: flex; align-items: center; justify-content: center; max-width: 1200px; margin: 0 auto; gap: 16px;">
    <!-- Message Text -->
    <div style="font-size: 14px; color: #6b7280; display: flex; align-items: center; gap: 8px;">
      ${footerContent}
    </div>
    <!-- CTA Button -->
    <a href="https://sandpix-harada.vercel.app/" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);">
      ${footerText.cta}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </svg>
    </a>
  </div>
</div>
<style>
  /* Ensure content doesn't hide behind footer */
  body {
    padding-bottom: 70px !important;
  }
  /* Hover effect for the CTA button */
  a[href="https://sandpix-harada.vercel.app/"]:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
    background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
  }
</style>
</body>`
    );
  }

  return prompt;
}