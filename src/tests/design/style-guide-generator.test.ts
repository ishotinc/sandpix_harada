import { describe, test, expect } from 'vitest';
import { generateStyleGuide } from '@/lib/design/style-guide-generator';
import type { SwipeScores } from '@/lib/design/principles-matrix';

function getMockSwipeScores(): SwipeScores {
  return {
    luxurious_score: 80,
    minimal_score: 70,
    warm_score: 60,
  };
}

describe('Style Guide Generator', () => {
  test('should generate complete style guide from swipe scores', () => {
    const styleGuide = generateStyleGuide(getMockSwipeScores());
    expect(styleGuide).toHaveProperty('colors');
    expect(styleGuide).toHaveProperty('typography');
    expect(styleGuide).toHaveProperty('spacing');
    expect(styleGuide).toHaveProperty('components');
    expect(styleGuide).toHaveProperty('animations');
  });

  test('style guide should be JSON serializable', () => {
    const styleGuide = generateStyleGuide(getMockSwipeScores());
    const json = JSON.stringify(styleGuide);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(styleGuide);
  });
});


