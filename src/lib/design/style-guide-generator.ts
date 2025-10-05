import type { SwipeScores, ColorScheme, ComponentStyles } from '@/lib/design/principles-matrix';
import { 
  generateColorScheme, 
  getFontFamily, 
  generateSpacingSystem, 
  generateComponentStyles, 
  generateAnimationPreferences,
  getAnimationDurations 
} from '@/lib/design/principles-matrix';

export interface ComponentStyle {
  borderRadius?: number;
  shadow?: 'none' | 'subtle' | 'pronounced';
}

export interface StyleGuide {
  id: string;
  version: string;
  language: 'ja' | 'en';
  description: string;
  keywords: string[];
  colors: ColorScheme;
  typography: {
    headingFont: string;
    bodyFont: string;
    accentFont: string;
    scale: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      small: string;
    };
  };
  spacing: {
    baseUnit: number;
    scale: number[];
  };
  components: {
    button: ComponentStyle;
    card: ComponentStyle;
    input: ComponentStyle;
  };
  animations: {
    duration: { fast: string; normal: string; slow: string };
    easing: string;
    preferences: string[];
  };
}

export function generateStyleGuide(swipeScores: SwipeScores, language: 'ja' | 'en' = 'ja'): StyleGuide {
  // Generate dynamic design elements based on user scores
  const colors: ColorScheme = generateColorScheme(swipeScores);
  const spacing = generateSpacingSystem(swipeScores);
  const componentStyles: ComponentStyles = generateComponentStyles(swipeScores);
  const animationPreferences = generateAnimationPreferences(swipeScores);
  const animationDurations = getAnimationDurations(animationPreferences);

  const headingFont = getFontFamily({ professional_score: 80, ...swipeScores });
  const bodyFont = getFontFamily(swipeScores);
  const accentFont = headingFont;

  return {
    id: 'style-guide-1',
    version: '1.0.0',
    language,
    description: language === 'ja' ? '自動生成スタイルガイド' : 'Auto-generated style guide',
    keywords: language === 'ja' ? ['スタイル', '配色', 'タイポグラフィ'] : ['style', 'colors', 'typography'],
    colors,
    typography: {
      headingFont,
      bodyFont,
      accentFont,
      scale: {
        h1: '2.25rem',
        h2: '1.875rem',
        h3: '1.5rem',
        body: '1rem',
        small: '0.875rem'
      }
    },
    spacing: {
      baseUnit: spacing.baseUnit,
      scale: spacing.scale === 'large' ? [1, 2, 4, 6, 8, 12, 16] :
             spacing.scale === 'tight' ? [0.5, 1, 1.5, 2, 3, 4] :
             [1, 2, 3, 4, 6, 8] // normal
    },
    components: {
      button: { borderRadius: componentStyles.button.borderRadius, shadow: componentStyles.button.shadow },
      card: { borderRadius: componentStyles.card.borderRadius, shadow: componentStyles.card.shadow },
      input: { borderRadius: componentStyles.input.borderRadius, shadow: componentStyles.input.shadow }
    },
    animations: {
      duration: animationDurations,
      easing: animationPreferences.style === 'energetic' ? 'ease-in-out' : 'ease-out',
      preferences: animationPreferences.style === 'none' ? [] : [animationPreferences.style]
    }
  };
}


