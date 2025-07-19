import { SwipeScores } from '@/types/project';
import { Profile } from '@/types/profile';

interface ProjectData {
  serviceName: string;
  redirectUrl?: string;
  purpose: string;
  serviceDescription: string;
  mainCopy?: string;
  ctaText?: string;
  serviceAchievements?: string;
  customHead?: string;
  customBody?: string;
}

export function createDefaultPrompt(
  projectData: ProjectData,
  profileData: Profile,
  swipeScores: SwipeScores
): string {
  return `
# 🚨 ABSOLUTE COMPLIANCE ITEMS (Must check before implementation)

## 【STEP 1】Constraint Checklist - Must verify before starting implementation
- [ ] Header is position: absolute (fixed prohibited)
- [ ] Header is completely transparent (background: transparent)
- [ ] Service name placed in top left
- [ ] No external links (all button elements)
- [ ] Page transitions completely prohibited
- [ ] CTA buttons only for external URL guidance
- [ ] No form functionality implemented

## 【STEP 2】Required Output Format
<!DOCTYPE html>
<html>
<head>
[All CSS described within <style> tags]
</head>
<body>
[Complete HTML structure]
<script>
[All JavaScript described]
</script>
</body>
</html>

---

# 📋 Landing Page Creation Instructions

## Most Important Instructions
Create landing pages with beyond-limit design using three.js, framer motion equivalent animations, tailwind css, Heroicons CDN with high visibility
Make animations flashy, but prioritize usability. Ensure text is perfectly readable on all devices.

## Design Style Instructions (Swipe Score Based)
Determine design style based on following scores:
- Warm Score: ${swipeScores.warm_score}
- Cool Score: ${swipeScores.cool_score}
- Monochrome Score: ${swipeScores.mono_score}
- Vivid Score: ${swipeScores.vivid_score}
- Friendly Score: ${swipeScores.friendly_score}
- Professional Score: ${swipeScores.professional_score}
- Creative Score: ${swipeScores.creative_score}
- Minimal Score: ${swipeScores.minimal_score}
- Energetic Score: ${swipeScores.energetic_score}
- Trustworthy Score: ${swipeScores.trustworthy_score}
- Luxurious Score: ${swipeScores.luxurious_score}
- Approachable Score: ${swipeScores.approachable_score}

## Page Content Information
### Service Information
- Service name: ${projectData.serviceName}
- Service content: ${projectData.serviceDescription}
- Main copy: ${projectData.mainCopy || 'Generate impactful catchphrase'}
- CTA button text: ${projectData.ctaText || 'Get Started'}
- Redirect URL: ${projectData.redirectUrl || '#'}
- Service achievements: ${projectData.serviceAchievements || ''}

### Company/Individual Information
- Company name: ${profileData.company_name || ''}
- Company achievements: ${profileData.company_achievements || ''}
- Contact info: ${profileData.contact_info || ''}
- Individual name: ${profileData.personal_name || ''}
- Profile: ${profileData.personal_bio || ''}
- Achievements: ${profileData.achievements || ''}

### Custom Code
${projectData.customHead ? 'Custom head content: ' + projectData.customHead : ''}
${projectData.customBody ? 'Custom body content: ' + projectData.customBody : ''}

## Page Purpose-Based Structure
${projectData.purpose === 'product' ? 'Product sales page structure: Product introduction, pricing, features to increase purchase intent' : ''}
${projectData.purpose === 'service' ? 'Service introduction page structure: Service value, benefits, implementation cases' : ''}
${projectData.purpose === 'brand' ? 'Corporate brand LP structure: Corporate philosophy, achievements, reliability' : ''}
${projectData.purpose === 'lead' ? 'Document request page structure: Document value, reason for free provision' : ''}
${projectData.purpose === 'event' ? 'Event gathering page structure: Event details, participation benefits, date/time/location' : ''}

## Design Requirements
1. Use modern CSS with animations and transitions
2. Implement responsive design for all screen sizes
3. Include hero section with compelling headline
4. Add features/benefits section
5. Include testimonials or social proof
6. Add clear call-to-action buttons
7. Ensure fast loading and smooth animations
8. Use appropriate color scheme based on swipe scores
9. Include contact information if provided
10. Make all text highly readable with proper contrast

## Technical Requirements
- Single HTML file with embedded CSS and JavaScript
- No external dependencies except CDN resources
- Mobile-first responsive design
- Semantic HTML structure
- Accessibility considerations
- SEO-friendly markup
- Fast loading performance

Please create a stunning, professional landing page that converts visitors into customers.
`;
}