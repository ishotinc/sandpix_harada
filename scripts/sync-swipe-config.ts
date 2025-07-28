#!/usr/bin/env ts-node

/**
 * スワイプ設定同期スクリプト
 * 
 * このスクリプトは public/swipe-config.json の内容を
 * supabase/functions/_shared/swipe-config.ts に同期します。
 * 
 * 使用方法:
 * npm run sync-swipe-config
 */

import * as fs from 'fs';
import * as path from 'path';

interface SwipeImage {
  id: number;
  title: string;
  description: string;
  visual_hints: string;
  path: string;
  scores: {
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
  };
}

interface SwipeConfig {
  version: string;
  images: SwipeImage[];
}

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(PROJECT_ROOT, 'public', 'swipe-config.json');
const TARGET_PATH = path.join(PROJECT_ROOT, 'supabase', 'functions', '_shared', 'swipe-config.ts');

function generateTypeScriptContent(config: SwipeConfig): string {
  const imagesJson = JSON.stringify(config.images, null, 8);
  
  return `// スワイプ設定とスコア計算のエッジ関数版
// この設定はpublic/swipe-config.jsonと同期する必要があります
// Last updated: ${new Date().toISOString()}

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
  "version": "${config.version}",
  "images": ${imagesJson}
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
}`;
}

function syncSwipeConfig(): void {
  try {
    console.log('🔄 スワイプ設定を同期中...');
    
    // 1. ソースファイルを読み込み
    if (!fs.existsSync(SOURCE_PATH)) {
      throw new Error(`ソースファイルが見つかりません: ${SOURCE_PATH}`);
    }
    
    const sourceContent = fs.readFileSync(SOURCE_PATH, 'utf-8');
    const config: SwipeConfig = JSON.parse(sourceContent);
    
    console.log(`📖 ${config.images.length}個のスワイプ画像設定を読み込みました`);
    
    // 2. TypeScriptコンテンツを生成
    const tsContent = generateTypeScriptContent(config);
    
    // 3. ターゲットディレクトリが存在しない場合は作成
    const targetDir = path.dirname(TARGET_PATH);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 4. ターゲットファイルに書き込み
    fs.writeFileSync(TARGET_PATH, tsContent, 'utf-8');
    
    console.log('✅ スワイプ設定の同期が完了しました');
    console.log(`📝 更新されたファイル: ${TARGET_PATH}`);
    console.log('');
    console.log('🚀 次回のデプロイでエッジ関数に反映されます');
    
  } catch (error) {
    console.error('❌ スワイプ設定の同期に失敗しました:', error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  syncSwipeConfig();
}

export { syncSwipeConfig };