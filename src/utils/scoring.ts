import { SwipeScores, SwipeImage } from '@/types/project';

export function calculateSwipeScores(swipes: Array<{ image: SwipeImage; liked: boolean }>): SwipeScores {
  const scores: SwipeScores = {
    warm_score: 0,
    cool_score: 0,
    mono_score: 0,
    vivid_score: 0,
    friendly_score: 0,
    professional_score: 0,
    creative_score: 0,
    minimal_score: 0,
    energetic_score: 0,
    trustworthy_score: 0,
    luxurious_score: 0,
    approachable_score: 0,
  };

  // Only count liked images
  swipes.forEach(({ image, liked }) => {
    if (liked) {
      Object.keys(image.scores).forEach((key) => {
        const scoreKey = key as keyof SwipeScores;
        scores[scoreKey] += image.scores[scoreKey];
      });
    }
  });

  return scores;
}

export function getStyleDescription(scores: SwipeScores): string {
  const descriptions: string[] = [];

  // Color preferences
  if (scores.warm_score > scores.cool_score) {
    descriptions.push('warm colors');
  } else if (scores.cool_score > scores.warm_score) {
    descriptions.push('cool colors');
  }

  if (scores.vivid_score > 2) {
    descriptions.push('vibrant and colorful');
  } else if (scores.mono_score > 2) {
    descriptions.push('monochrome and elegant');
  }

  // Atmosphere preferences
  if (scores.friendly_score > 2) {
    descriptions.push('friendly and approachable');
  }
  if (scores.professional_score > 2) {
    descriptions.push('professional and trustworthy');
  }
  if (scores.creative_score > 2) {
    descriptions.push('creative and innovative');
  }
  if (scores.minimal_score > 2) {
    descriptions.push('minimal and clean');
  }
  if (scores.energetic_score > 2) {
    descriptions.push('energetic and dynamic');
  }
  if (scores.luxurious_score > 2) {
    descriptions.push('luxurious and premium');
  }

  return descriptions.length > 0 
    ? descriptions.join(', ') 
    : 'balanced and versatile';
}

export function getPromptModifiers(scores: SwipeScores): string {
  const modifiers: string[] = [];

  // Color system modifiers
  if (scores.warm_score > scores.cool_score) {
    modifiers.push('Use warm color palette (oranges, reds, yellows)');
  } else if (scores.cool_score > scores.warm_score) {
    modifiers.push('Use cool color palette (blues, greens, purples)');
  }

  if (scores.vivid_score > scores.mono_score) {
    modifiers.push('Use vibrant, saturated colors');
  } else if (scores.mono_score > scores.vivid_score) {
    modifiers.push('Use monochrome or limited color palette');
  }

  // Atmosphere modifiers
  if (scores.friendly_score > 2) {
    modifiers.push('Create friendly, approachable design with rounded corners and soft elements');
  }
  if (scores.professional_score > 2) {
    modifiers.push('Maintain professional, business-oriented design with clean lines');
  }
  if (scores.creative_score > 2) {
    modifiers.push('Include creative, innovative design elements and unique layouts');
  }
  if (scores.minimal_score > 2) {
    modifiers.push('Focus on minimal design with lots of white space and simple elements');
  }
  if (scores.energetic_score > 2) {
    modifiers.push('Create dynamic, high-energy design with bold elements');
  }
  if (scores.luxurious_score > 2) {
    modifiers.push('Use premium, sophisticated design with elegant typography');
  }

  return modifiers.join('. ');
}