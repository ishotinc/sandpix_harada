import { describe, test, expect } from 'vitest';
import { 
  convertScoresToCSS, 
  generateColorScheme, 
  getFontFamily,
  generateSpacingSystem,
  generateComponentStyles,
  generateAnimationPreferences,
  getAnimationDurations
} from '@/lib/design/principles-matrix';

describe('Design Principles Matrix', () => {
  test('should convert swipe scores to CSS properties', () => {
    const swipeScores = {
      luxurious_score: 85,
      energetic_score: 30,
      minimal_score: 80
    };

    const cssProperties = convertScoresToCSS(swipeScores);

    expect(cssProperties.fontFamily).toMatch(/serif/i); // Luxurious
    expect(cssProperties.spacing).toBe('large'); // Minimal
    expect(cssProperties.animationSpeed).toBe('slow'); // Not energetic
  });

  test('should generate color scheme from swipe scores', () => {
    const scores = {
      warm_score: 80,
      vivid_score: 60,
      luxurious_score: 70
    };

    const colors = generateColorScheme(scores);

    expect(colors.primary).toMatch(/^#[A-F0-9]{6}$/); // Valid hex
    expect(colors.temperature).toBe('warm');
    expect(colors.vibrancy).toBeGreaterThan(50);
  });

  test('should map scores to font families', () => {
    const professional = { professional_score: 90 };
    const creative = { creative_score: 90 };

    expect(getFontFamily(professional)).toContain('sans-serif');
    expect(getFontFamily(creative)).toContain('display');
  });

  test('should generate dynamic spacing based on scores', () => {
    const minimal = { minimal_score: 90 };
    const energetic = { energetic_score: 90 };
    const defaultScores = { professional_score: 50 };

    const minimalSpacing = generateSpacingSystem(minimal);
    const energeticSpacing = generateSpacingSystem(energetic);
    const defaultSpacing = generateSpacingSystem(defaultScores);

    expect(minimalSpacing.baseUnit).toBe(16);
    expect(minimalSpacing.scale).toBe('large');
    expect(energeticSpacing.baseUnit).toBe(4);
    expect(energeticSpacing.scale).toBe('tight');
    expect(defaultSpacing.baseUnit).toBe(8);
    expect(defaultSpacing.scale).toBe('normal');
  });

  test('should generate component styles based on scores', () => {
    const friendly = { friendly_score: 90 };
    const luxurious = { luxurious_score: 90 };
    const minimal = { minimal_score: 90 };

    const friendlyComponents = generateComponentStyles(friendly);
    const luxuriousComponents = generateComponentStyles(luxurious);
    const minimalComponents = generateComponentStyles(minimal);

    // Friendly should have very rounded corners
    expect(friendlyComponents.button.borderRadius).toBe(20);
    expect(friendlyComponents.card.borderRadius).toBe(24);
    
    // Luxurious should have sharp corners and pronounced shadows
    expect(luxuriousComponents.button.borderRadius).toBe(0);
    expect(luxuriousComponents.card.borderRadius).toBe(2);
    expect(luxuriousComponents.button.shadow).toBe('pronounced');
    
    // Minimal should have subtle corners and no shadows
    expect(minimalComponents.button.borderRadius).toBe(4);
    expect(minimalComponents.button.shadow).toBe('none');
  });

  test('should generate animation preferences based on scores', () => {
    const energetic = { energetic_score: 90 };
    const minimal = { minimal_score: 90 };
    const creative = { creative_score: 90 };

    const energeticAnim = generateAnimationPreferences(energetic);
    const minimalAnim = generateAnimationPreferences(minimal);
    const creativeAnim = generateAnimationPreferences(creative);

    expect(energeticAnim.speed).toBe('fast');
    expect(energeticAnim.style).toBe('energetic');
    expect(minimalAnim.speed).toBe('slow');
    expect(minimalAnim.style).toBe('subtle');
    expect(creativeAnim.style).toBe('energetic');
  });

  test('should generate animation durations based on preferences', () => {
    const fastPrefs = { speed: 'fast' as const, style: 'energetic' as const };
    const slowPrefs = { speed: 'slow' as const, style: 'subtle' as const };

    const fastDurations = getAnimationDurations(fastPrefs);
    const slowDurations = getAnimationDurations(slowPrefs);

    expect(fastDurations.fast).toBe('100ms');
    expect(fastDurations.normal).toBe('200ms');
    expect(slowDurations.fast).toBe('300ms');
    expect(slowDurations.slow).toBe('1200ms');
  });
});