import { SwipeScores, SwipeImage } from '@/types/project';
import { APP_CONFIG } from '@/lib/config';

function normalizeScores(rawScores: SwipeScores) {
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

  const { significant, strong } = APP_CONFIG.scoring.thresholds;
  
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

export function getPromptModifiers(scores: SwipeScores): string {
  const modifiers: string[] = [];
  
  // ランキングを計算
  const scoreEntries = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map((entry, index) => ({
      key: entry[0],
      value: entry[1],
      rank: index + 1
    }));
  
  // 1位（メインテーマ）
  const mainTheme = scoreEntries[0];
  if (mainTheme) {
    switch (mainTheme.key) {
      case 'warm_score':
        modifiers.push('【メインテーマ】暖色系カラーパレット（オレンジ、レッド、イエロー）を中心に構成');
        break;
      case 'cool_score':
        modifiers.push('【メインテーマ】寒色系カラーパレット（ブルー、グリーン、パープル）を中心に構成');
        break;
      case 'mono_score':
        modifiers.push('【メインテーマ】モノクローム配色で洗練されたデザイン');
        break;
      case 'vivid_score':
        modifiers.push('【メインテーマ】鮮やかで彩度の高い色使いのビビッドなデザイン');
        break;
      case 'friendly_score':
        modifiers.push('【メインテーマ】フレンドリーで親しみやすい、丸みのあるデザイン');
        break;
      case 'professional_score':
        modifiers.push('【メインテーマ】プロフェッショナルで信頼感のある、ビジネス向けデザイン');
        break;
      case 'creative_score':
        modifiers.push('【メインテーマ】クリエイティブで革新的な、独創的なレイアウト');
        break;
      case 'minimal_score':
        modifiers.push('【メインテーマ】ミニマルデザイン、大量の余白とシンプルな要素');
        break;
      case 'energetic_score':
        modifiers.push('【メインテーマ】エネルギッシュで動的な、ハイテンションなデザイン');
        break;
      case 'trustworthy_score':
        modifiers.push('【メインテーマ】信頼性と安心感を与える、堅実なデザイン');
        break;
      case 'luxurious_score':
        modifiers.push('【メインテーマ】高級感と洗練、プレミアムなデザイン');
        break;
      case 'approachable_score':
        modifiers.push('【メインテーマ】親近感があり話しかけやすい、オープンなデザイン');
        break;
    }
  }
  
  // 2位（サブテーマ）
  const subTheme = scoreEntries[1];
  if (subTheme) {
    switch (subTheme.key) {
      case 'warm_score':
        modifiers.push('【サブテーマ】暖かみのある色をアクセントに使用');
        break;
      case 'cool_score':
        modifiers.push('【サブテーマ】クールな色合いをアクセントに使用');
        break;
      case 'mono_score':
        modifiers.push('【サブテーマ】モノトーンの要素を部分的に取り入れる');
        break;
      case 'vivid_score':
        modifiers.push('【サブテーマ】鮮やかな色をポイントで使用');
        break;
      case 'friendly_score':
        modifiers.push('【サブテーマ】親しみやすい要素を随所に配置');
        break;
      case 'professional_score':
        modifiers.push('【サブテーマ】プロフェッショナルな要素で信頼性を補強');
        break;
      case 'creative_score':
        modifiers.push('【サブテーマ】創造的なアクセントを加える');
        break;
      case 'minimal_score':
        modifiers.push('【サブテーマ】ミニマルな要素でバランスを取る');
        break;
      case 'energetic_score':
        modifiers.push('【サブテーマ】活気のある要素でアクセントを加える');
        break;
      case 'trustworthy_score':
        modifiers.push('【サブテーマ】信頼感を高める要素を追加');
        break;
      case 'luxurious_score':
        modifiers.push('【サブテーマ】高級感のあるディテールを加える');
        break;
      case 'approachable_score':
        modifiers.push('【サブテーマ】親近感のある要素でバランスを取る');
        break;
    }
  }
  
  // 6位以下は完全に無視することを明記
  modifiers.push('\n【重要】ランキング6位以下の要素は一切デザインに反映しないこと');

  return modifiers.join('\n');
}