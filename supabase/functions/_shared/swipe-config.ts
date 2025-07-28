// スワイプ設定とスコア計算のエッジ関数版
// この設定はpublic/swipe-config.jsonと同期する必要があります

export interface SwipeImage {
  id: number;
  title: string;
  description: string;
  visual_hints: string;
  path: string;
  scores: SwipeScores;
}

export interface SwipeScores {
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

export interface SwipeConfig {
  version: string;
  images: SwipeImage[];
}

// スワイプ設定データ
// Note: この設定はpublic/swipe-config.jsonと同期してください
export const SWIPE_CONFIG: SwipeConfig = {
  "version": "1.0.0",
  "images": [
    {
      "id": 1,
      "title": "Friendly & Approachable",
      "description": "Warm, welcoming design with soft elements and friendly messaging",
      "visual_hints": "Staff smiling photos, hand-drawn icons, soft rounded corners, warm expressions",
      "path": "/images/swipe-1.jpg",
      "scores": {
        "warm_score": 9,
        "cool_score": 2,
        "mono_score": 1,
        "vivid_score": 4,
        "friendly_score": 10,
        "professional_score": 3,
        "creative_score": 6,
        "minimal_score": 7,
        "energetic_score": 5,
        "trustworthy_score": 8,
        "luxurious_score": 2,
        "approachable_score": 10
      }
    },
    {
      "id": 2,
      "title": "Professional & Trustworthy",
      "description": "Clean, corporate design with emphasis on credibility and expertise",
      "visual_hints": "Suited professionals, data graphs, angular design, logical structure",
      "path": "/images/swipe-2.jpg",
      "scores": {
        "warm_score": 2,
        "cool_score": 1,
        "mono_score": 8,
        "vivid_score": 0,
        "friendly_score": 1,
        "professional_score": 9,
        "creative_score": 2,
        "minimal_score": 9,
        "energetic_score": 0,
        "trustworthy_score": 10,
        "luxurious_score": 10,
        "approachable_score": 1
      }
    },
    {
      "id": 3,
      "title": "Creative & Innovative",
      "description": "Bold, artistic design with unique layouts and creative elements",
      "visual_hints": "Abstract art, unconventional layouts, creative typography, artistic elements",
      "path": "/images/swipe-3.jpg",
      "scores": {
        "warm_score": 9,
        "cool_score": 9,
        "mono_score": 1,
        "vivid_score": 10,
        "friendly_score": 9,
        "professional_score": 6,
        "creative_score": 10,
        "minimal_score": 1,
        "energetic_score": 10,
        "trustworthy_score": 7,
        "luxurious_score": 2,
        "approachable_score": 10
      }
    },
    {
      "id": 4,
      "title": "Minimal & Clean",
      "description": "Simplified design with lots of white space and clean lines",
      "visual_hints": "Minimal elements, clean typography, white space, simple layouts",
      "path": "/images/swipe-4.jpg",
      "scores": {
        "warm_score": 0,
        "cool_score": 7,
        "mono_score": 10,
        "vivid_score": 0,
        "friendly_score": 0,
        "professional_score": 10,
        "creative_score": 3,
        "minimal_score": 8,
        "energetic_score": 0,
        "trustworthy_score": 10,
        "luxurious_score": 8,
        "approachable_score": 2
      }
    },
    {
      "id": 5,
      "title": "Energetic & Dynamic",
      "description": "High-energy design with vibrant colors and dynamic elements",
      "visual_hints": "Bright colors, action shots, dynamic layouts, energetic messaging",
      "path": "/images/swipe-5.jpg",
      "scores": {
        "warm_score": 10,
        "cool_score": 7,
        "mono_score": 9,
        "vivid_score": 5,
        "friendly_score": 10,
        "professional_score": 7,
        "creative_score": 9,
        "minimal_score": 5,
        "energetic_score": 7,
        "trustworthy_score": 9,
        "luxurious_score": 1,
        "approachable_score": 10
      }
    },
    {
      "id": 6,
      "title": "Luxurious & Premium",
      "description": "High-end, sophisticated design with premium materials and finishes",
      "visual_hints": "Gold accents, premium materials, sophisticated layouts, luxury branding",
      "path": "/images/swipe-6.jpg",
      "scores": {
        "warm_score": 0,
        "cool_score": 10,
        "mono_score": 2,
        "vivid_score": 6,
        "friendly_score": 2,
        "professional_score": 10,
        "creative_score": 7,
        "minimal_score": 6,
        "energetic_score": 4,
        "trustworthy_score": 10,
        "luxurious_score": 3,
        "approachable_score": 3
      }
    },
    {
      "id": 7,
      "title": "Warm & Inviting",
      "description": "Cozy, comfortable design with warm colors and inviting elements",
      "visual_hints": "Warm lighting, comfortable spaces, earth tones, inviting atmosphere",
      "path": "/images/swipe-7.jpg",
      "scores": {
        "warm_score": 0,
        "cool_score": 3,
        "mono_score": 10,
        "vivid_score": 0,
        "friendly_score": 0,
        "professional_score": 7,
        "creative_score": 5,
        "minimal_score": 10,
        "energetic_score": 2,
        "trustworthy_score": 6,
        "luxurious_score": 10,
        "approachable_score": 3
      }
    },
    {
      "id": 8,
      "title": "Cool & Modern",
      "description": "Contemporary design with cool colors and modern aesthetics",
      "visual_hints": "Cool blues, modern architecture, sleek designs, contemporary feel",
      "path": "/images/swipe-8.jpg",
      "scores": {
        "warm_score": 2,
        "cool_score": 3,
        "mono_score": 9,
        "vivid_score": 8,
        "friendly_score": 7,
        "professional_score": 8,
        "creative_score": 8,
        "minimal_score": 6,
        "energetic_score": 8,
        "trustworthy_score": 8,
        "luxurious_score": 2,
        "approachable_score": 9
      }
    },
    {
      "id": 9,
      "title": "Monochrome & Elegant",
      "description": "Black and white design with elegant typography and sophisticated layout",
      "visual_hints": "Black and white photography, elegant typography, sophisticated layouts",
      "path": "/images/swipe-9.jpg",
      "scores": {
        "warm_score": 3,
        "cool_score": 7,
        "mono_score": 8,
        "vivid_score": 2,
        "friendly_score": 2,
        "professional_score": 9,
        "creative_score": 4,
        "minimal_score": 10,
        "energetic_score": 1,
        "trustworthy_score": 10,
        "luxurious_score": 3,
        "approachable_score": 9
      }
    },
    {
      "id": 10,
      "title": "Vibrant & Colorful",
      "description": "Bold, colorful design with vibrant hues and playful elements",
      "visual_hints": "Bright colors, playful elements, vibrant photography, colorful graphics",
      "path": "/images/swipe-10.jpg",
      "scores": {
        "warm_score": 1,
        "cool_score": 2,
        "mono_score": 10,
        "vivid_score": 10,
        "friendly_score": 5,
        "professional_score": 6,
        "creative_score": 10,
        "minimal_score": 3,
        "energetic_score": 10,
        "trustworthy_score": 6,
        "luxurious_score": 1,
        "approachable_score": 7
      }
    },
    {
      "id": 11,
      "title": "Tech & Innovative",
      "description": "High-tech design with digital elements and innovative features",
      "visual_hints": "Digital interfaces, tech elements, innovative layouts, futuristic design",
      "path": "/images/swipe-11.jpg",
      "scores": {
        "warm_score": 8,
        "cool_score": 2,
        "mono_score": 9,
        "vivid_score": 0,
        "friendly_score": 2,
        "professional_score": 10,
        "creative_score": 1,
        "minimal_score": 10,
        "energetic_score": 0,
        "trustworthy_score": 10,
        "luxurious_score": 10,
        "approachable_score": 3
      }
    },
    {
      "id": 12,
      "title": "Natural & Organic",
      "description": "Nature-inspired design with organic shapes and natural elements",
      "visual_hints": "Natural photography, organic shapes, earth tones, nature elements",
      "path": "/images/swipe-12.jpg",
      "scores": {
        "warm_score": 8,
        "cool_score": 2,
        "mono_score": 3,
        "vivid_score": 9,
        "friendly_score": 7,
        "professional_score": 5,
        "creative_score": 4,
        "minimal_score": 2,
        "energetic_score": 10,
        "trustworthy_score": 8,
        "luxurious_score": 1,
        "approachable_score": 9
      }
    }
  ]
};

// スコア計算関数（クライアントのscoring.tsと同じロジック）
export function normalizeScores(rawScores: SwipeScores) {
  // 1. 最小値と最大値を取得
  const scores = Object.values(rawScores);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  
  // 2. Min-Max正規化（0-100の範囲に変換）
  const normalizedScores: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawScores)) {
    if (maxScore === minScore) {
      // すべて同じ値の場合は50にする
      normalizedScores[key] = '50.0';
    } else {
      const normalized = ((value - minScore) / (maxScore - minScore)) * 100;
      normalizedScores[key] = normalized.toFixed(1);
    }
  }
  
  // 3. ランキングを計算（降順）
  const scoreEntries = Object.entries(rawScores)
    .sort((a, b) => b[1] - a[1])
    .map((entry, index) => ({
      key: entry[0],
      value: entry[1],
      rank: index + 1
    }));
  
  return {
    normalized: normalizedScores,
    minValue: minScore,
    maxValue: maxScore,
    dominant: scoreEntries[0]?.key || null,
    ranking: scoreEntries
  };
}

export function calculateSwipeScores(swipes: Array<{ imageId: number; liked: boolean }>): SwipeScores {
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
  swipes.forEach(({ imageId, liked }) => {
    if (liked) {
      const image = SWIPE_CONFIG.images.find(img => img.id === imageId);
      if (image) {
        Object.keys(image.scores).forEach((key) => {
          const scoreKey = key as keyof SwipeScores;
          scores[scoreKey] += image.scores[scoreKey];
        });
      }
    }
  });

  // Normalize the scores to relative evaluation
  const normalizedResult = normalizeScores(scores);
  
  // Convert normalized scores back to SwipeScores format
  const normalizedScores: SwipeScores = {
    warm_score: parseFloat(normalizedResult.normalized.warm_score),
    cool_score: parseFloat(normalizedResult.normalized.cool_score),
    mono_score: parseFloat(normalizedResult.normalized.mono_score),
    vivid_score: parseFloat(normalizedResult.normalized.vivid_score),
    friendly_score: parseFloat(normalizedResult.normalized.friendly_score),
    professional_score: parseFloat(normalizedResult.normalized.professional_score),
    creative_score: parseFloat(normalizedResult.normalized.creative_score),
    minimal_score: parseFloat(normalizedResult.normalized.minimal_score),
    energetic_score: parseFloat(normalizedResult.normalized.energetic_score),
    trustworthy_score: parseFloat(normalizedResult.normalized.trustworthy_score),
    luxurious_score: parseFloat(normalizedResult.normalized.luxurious_score),
    approachable_score: parseFloat(normalizedResult.normalized.approachable_score),
  };

  return normalizedScores;
}

export function getStyleDescription(scores: SwipeScores): string {
  const descriptions: string[] = [];

  // Color preferences
  if (scores.warm_score > scores.cool_score) {
    descriptions.push('warm colors');
  } else if (scores.cool_score > scores.warm_score) {
    descriptions.push('cool colors');
  }

  const significant = 60; // threshold
  const strong = 75; // threshold
  
  if (scores.vivid_score > significant) {
    descriptions.push('vibrant and colorful');
  } else if (scores.mono_score > significant) {
    descriptions.push('monochrome and elegant');
  }

  // Atmosphere preferences (using strong threshold for strong preferences)
  if (scores.friendly_score > strong) {
    descriptions.push('friendly and approachable');
  }
  if (scores.professional_score > strong) {
    descriptions.push('professional and trustworthy');
  }
  if (scores.creative_score > strong) {
    descriptions.push('creative and innovative');
  }
  if (scores.minimal_score > strong) {
    descriptions.push('minimal and clean');
  }
  if (scores.energetic_score > strong) {
    descriptions.push('energetic and dynamic');
  }
  if (scores.luxurious_score > strong) {
    descriptions.push('luxurious and premium');
  }

  return descriptions.length > 0 
    ? descriptions.join(', ') 
    : 'balanced and versatile';
}