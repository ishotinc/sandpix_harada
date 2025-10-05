import { describe, test, expect } from 'vitest';
import { getSectionDefinitions, getStructuralTemplate } from '@/lib/generation/section-definitions';

describe('Section Definition Architecture', () => {
  test('should define all required LP sections', () => {
    const sections = getSectionDefinitions().map(s => s.id);
    expect(sections).toContain('hero');
    expect(sections).toContain('problem');
    expect(sections).toContain('solution');
    expect(sections).toContain('features');
    expect(sections).toContain('benefits');
    expect(sections).toContain('testimonials');
    expect(sections).toContain('time');
    expect(sections).toContain('cta');
    expect(sections).toContain('footer');
  });

  test('each section should have structure template', () => {
    const heroSection = getStructuralTemplate('hero');
    expect(heroSection).toHaveProperty('htmlTemplate');
    expect(heroSection).toHaveProperty('requiredFields');
    expect(heroSection).toHaveProperty('optionalFields');
  });
});