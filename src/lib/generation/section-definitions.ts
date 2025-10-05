export interface SectionDefinition {
  id: string;
  name: string;
  htmlTemplate: string;
  requiredFields: string[];
  optionalFields: string[];
  defaultOrder: number;
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    htmlTemplate: '<section class="hero">...</section>',
    requiredFields: ['headline', 'subheadline', 'ctaText'],
    optionalFields: ['backgroundImage', 'supportingText'],
    defaultOrder: 1
  },
  {
    id: 'problem',
    name: 'Problem Section',
    htmlTemplate: '<section class="problem">...</section>',
    requiredFields: ['heading', 'description'],
    optionalFields: ['image', 'statistics'],
    defaultOrder: 2
  },
  {
    id: 'solution',
    name: 'Solution Section',
    htmlTemplate: '<section class="solution">...</section>',
    requiredFields: ['heading', 'description'],
    optionalFields: ['image', 'benefits'],
    defaultOrder: 3
  },
  {
    id: 'features',
    name: 'Features Section',
    htmlTemplate: '<section class="features">...</section>',
    requiredFields: ['heading', 'featureList'],
    optionalFields: ['icons', 'images'],
    defaultOrder: 4
  },
  {
    id: 'benefits',
    name: 'Benefits Section',
    htmlTemplate: '<section class="benefits">...</section>',
    requiredFields: ['heading', 'benefitList'],
    optionalFields: ['statistics', 'testimonials'],
    defaultOrder: 5
  },
  {
    id: 'testimonials',
    name: 'Testimonials Section',
    htmlTemplate: '<section class="testimonials">...</section>',
    requiredFields: ['heading', 'testimonialList'],
    optionalFields: ['photos', 'ratings'],
    defaultOrder: 6
  },
  
  {
    id: 'time',
    name: 'Time Section',
    htmlTemplate: '<section class="time">...</section>',
    requiredFields: ['eventDate', 'eventTime'],
    optionalFields: ['timezone', 'duration', 'location'],
    defaultOrder: 7
  },
   
  {
    id: 'cta',
    name: 'Call to Action Section',
    htmlTemplate: '<section class="cta">...</section>',
    requiredFields: ['heading', 'ctaText', 'ctaButton'],
    optionalFields: ['urgency', 'guarantee'],
    defaultOrder: 8
  },

  
  {
    id: 'footer',
    name: 'Footer Section',
    htmlTemplate: '<footer class="footer">...</footer>',
    requiredFields: ['copyright', 'contactInfo'],
    optionalFields: ['socialLinks', 'navigation'],
    defaultOrder: 9
  }
];

export function getSectionDefinitions(): SectionDefinition[] {
  return SECTION_DEFINITIONS;
}

export function getStructuralTemplate(sectionId: string): SectionDefinition {
  const section = SECTION_DEFINITIONS.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Section ${sectionId} not found`);
  }
  return section;
}