import { styleGuideToPrompt } from '@/lib/generation/style-to-prompt';
import type { StyleGuide } from '@/lib/design/style-guide-generator';

function getMockStyleGuide(): StyleGuide {
  return {
    id: 'test-style-guide',
    version: '1.0.0',
    language: 'ja',
    description: 'テスト用スタイルガイド',
    keywords: ['テスト', 'スタイル'],
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#10B981',
      temperature: 'cool',
      vibrancy: 60
    },
    typography: {
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      accentFont: 'Inter, system-ui, sans-serif',
      scale: {
        h1: '2.25rem',
        h2: '1.875rem',
        h3: '1.5rem',
        body: '1rem',
        small: '0.875rem'
      }
    },
    spacing: {
      baseUnit: 8,
      scale: [1, 2, 3, 4, 6, 8]
    },
    components: {
      button: { borderRadius: 8, shadow: 'subtle' },
      card: { borderRadius: 12, shadow: 'subtle' },
      input: { borderRadius: 8, shadow: 'none' }
    },
    animations: {
      duration: { fast: '150ms', normal: '300ms', slow: '600ms' },
      easing: 'ease-out',
      preferences: []
    }
  };
}

describe('Style to Prompt Converter', () => {
  test('should convert style guide to AI prompt instructions', () => {
    const styleGuide = getMockStyleGuide();
    const promptInstructions = styleGuideToPrompt(styleGuide);

    expect(promptInstructions).toContain('プライマリカラー');
    expect(promptInstructions).toContain('アクセントカラー')
    expect(promptInstructions).toContain(styleGuide.colors.primary);
    expect(promptInstructions).toContain(styleGuide.typography.headingFont);
  });

  test('should include specific CSS rules in prompt', () => {
    const styleGuide = getMockStyleGuide();
    const prompt = styleGuideToPrompt(styleGuide);

    expect(prompt).toContain('margin');
    expect(prompt).toContain('padding');
    expect(prompt).toContain('8px');
  });

  test('should include the size of button', ()=>{
    const styleGuide = getMockStyleGuide();
    const prompt = styleGuideToPrompt(styleGuide);

    expect(prompt).toContain('ボタン角丸');
    expect(prompt).toContain('8px の倍数を使用')
    
  })
});