export interface SwipeScores {
  luxurious_score?: number;
  energetic_score?: number;
  minimal_score?: number;
  professional_score?: number;
  creative_score?: number;
  friendly_score?: number;
  warm_score?: number;
  vivid_score?: number;
  [key: string]: number | undefined;
}

export interface DesignPrinciples {
  colorScheme: ColorScheme;
  typography: Typography;
  spacing: SpacingSystem;
  borderRadius: number;
  shadows: ShadowSystem;
  animations: AnimationPreferences;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  temperature: 'warm' | 'cool' | 'neutral';
  vibrancy: number;
}

export interface Typography {
  fontFamily: string;
  weight: 'light' | 'normal' | 'bold';
  style: 'serif' | 'sans-serif' | 'display';
}

export interface SpacingSystem {
  baseUnit: number;
  scale: 'tight' | 'normal' | 'large';
}

export interface ShadowSystem {
  depth: 'none' | 'subtle' | 'pronounced';
  style: 'flat' | 'elevated';
}

export interface AnimationPreferences {
  speed: 'slow' | 'normal' | 'fast';
  style: 'subtle' | 'energetic' | 'none';
}

export interface CssProperties {
  fontFamily: string;
  spacing: 'tight' | 'normal' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
}

export const DESIGN_RULES = {
  // Luxurious → Serif fonts, large spacing, gold accents
  luxurious: {
    fontFamilyWeight: { serif: 0.8, 'sans-serif': 0.2 },
    colorAccents: ['gold', 'deep-purple', 'navy'],
    spacing: 'large',
    borderRadius: 0,
    shadows: 'pronounced'
  },
  // Energetic → Sans-serif, bright colors, fast animations
  energetic: {
    fontFamilyWeight: { 'sans-serif': 0.9, display: 0.1 },
    colorAccents: ['orange', 'red', 'yellow'],
    spacing: 'tight',
    borderRadius: 8,
    shadows: 'subtle',
    animationSpeed: 'fast'
  },
  // Minimal → Clean fonts, large spacing, subtle colors
  minimal: {
    fontFamilyWeight: { 'sans-serif': 0.9, serif: 0.1 },
    colorAccents: ['gray', 'white', 'black'],
    spacing: 'large',
    borderRadius: 4,
    shadows: 'none'
  },
  // Professional → Sans-serif, conservative colors
  professional: {
    fontFamilyWeight: { 'sans-serif': 0.8, serif: 0.2 },
    colorAccents: ['blue', 'gray', 'white'],
    spacing: 'normal',
    borderRadius: 2,
    shadows: 'subtle'
  },
  // Creative → Display fonts, vibrant colors
  creative: {
    fontFamilyWeight: { display: 0.7, 'sans-serif': 0.3 },
    colorAccents: ['purple', 'pink', 'green'],
    spacing: 'normal',
    borderRadius: 12,
    shadows: 'pronounced'
  },
  // Friendly → Rounded fonts, warm colors
  friendly: {
    fontFamilyWeight: { 'sans-serif': 0.6, serif: 0.4 },
    colorAccents: ['orange', 'yellow', 'green'],
    spacing: 'normal',
    borderRadius: 16,
    shadows: 'subtle'
  }
};

export function convertScoresToCSS(scores: SwipeScores): CssProperties {
  const css: CssProperties = {
    fontFamily: 'sans-serif',
    spacing: 'normal',
    animationSpeed: 'normal'
  };
  
  // Determine font family
  if ((scores.luxurious_score ?? 0) >= 70) {
    css.fontFamily = 'serif';
  } else if ((scores.creative_score ?? 0) >= 70) {
    css.fontFamily = 'display';
  } else {
    css.fontFamily = 'sans-serif';
  }
  
  // Determine spacing
  if ((scores.minimal_score ?? 0) >= 70) {
    css.spacing = 'large';
  } else if ((scores.energetic_score ?? 0)> 70) {
    css.spacing = 'tight';
  } else {
    css.spacing = 'normal';
  }
  
  // Determine animation speed
  if ((scores.energetic_score ?? 0) >= 70) {
    css.animationSpeed = 'fast';
  } else if ((scores.minimal_score ?? 0) >= 70) {
    css.animationSpeed = 'slow';
  } else {
    css.animationSpeed = 'normal';
  }
  
  return css;
}

export function generateColorScheme(scores: SwipeScores): ColorScheme {
  const isWarm = (scores.warm_score || 0) > 50;
  const isVivid = (scores.vivid_score || 0) > 50;
  const isLuxurious = (scores.luxurious_score || 0) > 70;
  
  let primary = '#3B82F6'; // Default blue
  
  if (isLuxurious) {
    primary = '#D4AF37'; // Gold
  } else if (isWarm && isVivid) {
    primary = '#F59E0B'; // Orange
  } else if (isWarm) {
    primary = '#EF4444'; // Red
  }
  
  return {
    primary,
    secondary: '#6B7280',
    accent: '#10B981',
    temperature: isWarm ? 'warm' : 'cool',
    vibrancy: isVivid ? 80 : 40
  };
}

export function getFontFamily(scores: SwipeScores): string {
  if (scores.professional_score && scores.professional_score > 70) {
    return 'Inter, system-ui, sans-serif';
  } else if (scores.creative_score && scores.creative_score > 70) {
    return 'Poppins, display, sans-serif';
  } else {
    return 'Inter, system-ui, sans-serif';
  }
}

// Dynamic Spacing System
export function generateSpacingSystem(scores: SwipeScores): SpacingSystem {
  const minimalScore = scores.minimal_score ?? 0;
  const energeticScore = scores.energetic_score ?? 0;
  const luxuriousScore = scores.luxurious_score ?? 0;
  
  // Determine base unit based on scores
  let baseUnit: number;
  let scale: 'tight' | 'normal' | 'large';
  
  if (minimalScore >= 70 || luxuriousScore >= 70) {
    // Minimal/Luxurious = generous spacing
    baseUnit = 16;
    scale = 'large';
  } else if (energeticScore >= 70) {
    // Energetic = tight spacing
    baseUnit = 4;
    scale = 'tight';
  } else {
    // Default = balanced spacing
    baseUnit = 8;
    scale = 'normal';
  }
  
  return {
    baseUnit,
    scale
  };
}

// Dynamic Component Styles
export interface ComponentStyles {
  button: {
    borderRadius: number;
    shadow: 'none' | 'subtle' | 'pronounced';
  };
  card: {
    borderRadius: number;
    shadow: 'none' | 'subtle' | 'pronounced';
  };
  input: {
    borderRadius: number;
    shadow: 'none' | 'subtle' | 'pronounced';
  };
}

export function generateComponentStyles(scores: SwipeScores): ComponentStyles {
  const luxuriousScore = scores.luxurious_score ?? 0;
  const friendlyScore = scores.friendly_score ?? 0;
  const minimalScore = scores.minimal_score ?? 0;
  const energeticScore = scores.energetic_score ?? 0;
  const creativeScore = scores.creative_score ?? 0;
  
  // Determine border radius based on scores
  let buttonRadius: number;
  let cardRadius: number;
  let inputRadius: number;
  
  if (luxuriousScore >= 70) {
    // Luxurious = sharp, elegant corners
    buttonRadius = 0;
    cardRadius = 2;
    inputRadius = 0;
  } else if (friendlyScore >= 70) {
    // Friendly = very rounded, playful
    buttonRadius = 20;
    cardRadius = 24;
    inputRadius = 16;
  } else if (creativeScore >= 70) {
    // Creative = moderately rounded, dynamic
    buttonRadius = 12;
    cardRadius = 16;
    inputRadius = 8;
  } else if (energeticScore >= 70) {
    // Energetic = slightly rounded, modern
    buttonRadius = 8;
    cardRadius = 12;
    inputRadius = 6;
  } else if (minimalScore >= 70) {
    // Minimal = subtle rounding
    buttonRadius = 4;
    cardRadius = 6;
    inputRadius = 4;
  } else {
    // Default = balanced
    buttonRadius = 8;
    cardRadius = 12;
    inputRadius = 8;
  }
  
  // Determine shadow style
  let shadowStyle: 'none' | 'subtle' | 'pronounced';
  
  if (luxuriousScore >= 70 || creativeScore >= 70) {
    shadowStyle = 'pronounced';
  } else if (minimalScore >= 70) {
    shadowStyle = 'none';
  } else {
    shadowStyle = 'subtle';
  }
  
  return {
    button: { borderRadius: buttonRadius, shadow: shadowStyle },
    card: { borderRadius: cardRadius, shadow: shadowStyle },
    input: { borderRadius: inputRadius, shadow: 'none' } // Inputs typically have no shadow
  };
}

// Dynamic Animation Preferences
export function generateAnimationPreferences(scores: SwipeScores): AnimationPreferences {
  const energeticScore = scores.energetic_score ?? 0;
  const minimalScore = scores.minimal_score ?? 0;
  const friendlyScore = scores.friendly_score ?? 0;
  const creativeScore = scores.creative_score ?? 0;
  
  // Determine animation speed
  let speed: 'slow' | 'normal' | 'fast';
  let style: 'subtle' | 'energetic' | 'none';
  
  if (energeticScore >= 70) {
    speed = 'fast';
    style = 'energetic';
  } else if (minimalScore >= 70 || scores.professional_score && scores.professional_score >= 70) {
    speed = 'slow';
    style = 'subtle';
  } else {
    speed = 'normal';
    style = 'subtle';
  }
  
  // Override style for creative/friendly
  if (creativeScore >= 70) {
    style = 'energetic';
  } else if (friendlyScore >= 70) {
    style = 'subtle';
  }
  
  return {
    speed,
    style
  };
}

// Helper function to get animation durations based on preferences
export function getAnimationDurations(preferences: AnimationPreferences): { fast: string; normal: string; slow: string } {
  switch (preferences.speed) {
    case 'fast':
      return {
        fast: '100ms',
        normal: '200ms',
        slow: '400ms'
      };
    case 'slow':
      return {
        fast: '300ms',
        normal: '600ms',
        slow: '1200ms'
      };
    default: // normal
      return {
        fast: '150ms',
        normal: '300ms',
        slow: '600ms'
      };
  }
}