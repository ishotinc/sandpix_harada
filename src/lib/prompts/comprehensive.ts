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

const DEFAULT_PROMPT = `# 🌐 CRITICAL: OUTPUT LANGUAGE REQUIREMENT
**ALL generated content MUST be in ENGLISH. This includes:**
- All text content, headings, and paragraphs
- Button labels and UI elements  
- Legal notices (Privacy Policy, Terms of Service)
- Meta tags and HTML attributes (use lang="en")
- Comments in code
- Alt text for images
- Error messages
- ANY text that will be visible to users

**The instructions below are in Japanese for internal use only. The OUTPUT must be 100% English.**

---

# 🚨 ABSOLUTE COMPLIANCE ITEMS (Must check before implementation)

## 【STEP 1】Constraint Checklist - Must verify before starting implementation
- [ ] ヘッダーは position: absolute である（fixed禁止）
- [ ] ヘッダーは完全に透明である（background: transparent）
- [ ] サービス名は左上配置
- [ ] 外部リンクは一切ない（全てbutton要素）
- [ ] ページ遷移は完全に禁止
- [ ] CTAボタンは外部URL誘導のみ
- [ ] フォーム機能は実装されていない

## 【STEP 2】必須の出力形式
<!DOCTYPE html>
<html lang="en">
<head>
[CSS全てを<style>タグ内に記述]
</head>
<body>
[完全なHTML構造]
<script>
[JavaScriptを全て記述]
</script>
</body>
</html>

---

# 📋 ランディングページ作成指示書

## 最重要指示  
three.js, framer motion相当のアニメーション, tailwind css, Heroicons CDNで限界を超えたデザインで視認性の高いランディングページを作成してください
アニメーションは派手に、でもユーザビリティは最優先。全デバイスで文字が完璧に読めるように工夫してください。

**IMPORTANT: Generate the entire landing page in ENGLISH for English-speaking users.**

## デザインスタイル指示（スワイプスコアベース）
以下のスコアに基づいてデザインスタイルを決定してください：
\${swipeScores}

## ページ内掲載情報
### サービス情報
- サービス名: \${projectData.serviceName}
- サービス内容: \${projectData.serviceDescription}
- メインコピー: \${projectData.mainCopy || 'インパクトのあるキャッチコピーを生成'}
- CTAボタンテキスト: \${projectData.ctaText || 'Get Started'}
- 遷移先URL: \${projectData.redirectUrl}
- サービス実績: \${projectData.serviceAchievements || ''}

### 会社・個人情報
- 会社名: \${profileData.companyName || ''}
- 会社実績: \${profileData.companyAchievements || ''}
- 連絡先: \${profileData.contactInfo || ''}
- 個人名: \${profileData.personalName || ''}
- プロフィール: \${profileData.personalBio || ''}
- 実績: \${profileData.achievements || ''}

### カスタムコード
\${projectData.customHead ? 'カスタムhead内容: ' + projectData.customHead : ''}
\${projectData.customBody ? 'カスタムbody内容: ' + projectData.customBody : ''}

## ページ目的別構成
\${projectData.purpose === 'product' ? '商品販売ページ構成：購買意欲を高める商品紹介、価格、特徴' : ''}
\${projectData.purpose === 'service' ? 'サービス紹介ページ構成：サービスの価値、メリット、導入事例' : ''}
\${projectData.purpose === 'brand' ? '企業ブランドLP構成：企業理念、実績、信頼性' : ''}
\${projectData.purpose === 'lead' ? '資料請求ページ構成：資料の価値、無料提供の理由' : ''}
\${projectData.purpose === 'event' ? 'イベント集客ページ構成：イベント詳細、参加メリット、日時場所' : ''}

---

# 🎨 デザイン仕様書

## ファーストビュー仕様
### 🔴 重要制約（再確認）
- **ヘッダー**: position: absolute + 完全透明
- **サービス名**: 左上配置
- **CTA**: PC・SP共にファーストビューで必ず表示
- **アニメーション**: 背景のみ（コンテンツは静的）

### 画像マスキング
- 半透明オーバーレイ（透明度50%〜70%）
- 文字視認性を最優先

## 背景アニメーション
- JavaScript実装
- ページ全体対応

## レスポンシブタイポグラフィ
### Fluid Typography採用（clamp()関数必須）

#### メインキャッチコピー（h1）
\`\`\`css
font-size: clamp(48px, 8vw, 72px); /* PC */
font-size: clamp(28px, 8vw, 44px); /* SP */
line-height: 1.05;
font-weight: 600;
letter-spacing: -0.02em;
background: linear-gradient(90deg, #0066CC 0%, #8A2BE2 50%, #FF6600 100%);
\`\`\`

#### サブキャッチコピー（h2）
\`\`\`css
font-size: clamp(16px, 3vw, 22px); /* PC */
font-size: clamp(14px, 4vw, 18px); /* SP */
line-height: 1.3;
color: #A1A1A6;
font-weight: 400;
\`\`\`

#### 本文・説明文（p）
\`\`\`css
font-size: clamp(18px, 2.5vw, 24px); /* PC */
font-size: clamp(16px, 3.5vw, 20px); /* SP */
line-height: 1.5;
color: #F2F2F7;
max-width: 600px; /* 中央寄せ */
\`\`\`

#### キャプション・注釈
\`\`\`css
font-size: clamp(14px, 2vw, 16px); /* PC */
font-size: clamp(12px, 3vw, 14px); /* SP */
line-height: 1.4;
color: #8E8E93;
\`\`\`

#### CTAボタンテキスト
\`\`\`css
font-size: clamp(16px, 2vw, 18px); /* PC */
font-size: clamp(16px, 3vw, 18px); /* SP */
font-weight: 600;
white-space: nowrap; /* 必ず1行表示 */
\`\`\`

## レスポンシブルール
### ブレークポイント
- 320px-768px: モバイル最適化
- 769px-1024px: タブレット最適化
- 1025px以上: デスクトップ最適化

### テキスト処理
- 全てのテキストで \`overflow-wrap: break-word\` 適用

#### 視覚的バランスと行長
- 各行の文字数をできる限り均等に
- 短すぎる行や極端に長い行の連続を避ける
- 全角2文字以下の単語や助詞が単独で1行になることを極力避ける

#### 実装上の優先順位
1. CSS \`word-break: keep-all\` + \`overflow-wrap: break-word\` の組み合わせ
2. 不自然な改行が発生する場合は \`<br>\` タグを明示的に挿入（乱用は避ける）
3. 特定の単語やフレーズが分割されないよう \`white-space: nowrap\` を適用

### 行の長さ
- 各テキストブロックの行長は可読性を最大化する範囲（半角50〜75文字程度）
- 必要に応じて \`max-width\` を設定

### アクセシビリティ
- モバイルでの最小フォントサイズは14px以上（アクセシビリティガイドライン遵守）

## パディング
### モバイル表示時
- サイド（左右）のパディングを最小値（16px または 4vw 程度）
- 文字や画像がスマホ画面で最大限大きく表示

### セクション間
- 垂直方向のパディングで情報グループの視覚的な区切りを明確に

## クリック可能要素と非クリック可能要素の視覚的分離
### クリック可能な要素（CTAボタンなど）のみ
- 影（box-shadow）
- 明確な背景色
- 明確なボーダー
- 大きな角丸（border-radiusが50%に近い）
- 上記の組み合わせ

### クリックできないテキストブロックや情報表示要素
- 上記の「ボタン的」なデザインを一切使用しない
- 背景色はセクションの背景色に統合するか透明

---

# 🔗 CTAボタン・リンク仕様

## 🚨 重要制約（三度目の確認）
- **全てのCTAボタンは外部URL誘導のみ**
- **同一タブで開く設定**
- **フォーム機能は一切実装しない**
- **別ページへのリンクは一切設定しない**
- **全ての情報を1ページ内で完結**
- **CTAボタンは一つのみ**

---

# 📄 フッター仕様

## 必須要素
- Privacy Policy（モーダルウィンドウ表示）- Display in English
- Terms of Service（モーダルウィンドウ表示）- Display in English  
- ©[動的更新著作権表示][company name] All Rights Reserved.

---

# 🎯 その他デザインルール

## 基本ルール
- LP内のいかなる要素も幅をはみ出してはならない（水平スクロール発生禁止）
- クリックできないブロック要素には枠に影をつけない
- CTAボタンで使われる色は、LP内でCTAボタン以外では利用しない
- FAQセクションはアコーディオン形式で実装
- テキストと背景のコントラスト比はWCAG基準を満たす
- 構造化マークアップでの記述

---

# 🎨 アイコン・ビジュアル要素の選択ルール

## 基本方針
- サイトのトーン&マナー、ターゲット層、業界特性に完全に合致したビジュアル要素のみを使用
- Unicode絵文字は使用禁止

## 業界・サービス別アイコン指針
### BtoB・コンサル・金融・法律・医療系
- SVGアイコン（Heroicons、Feather Icons等のミニマルデザイン）
- アウトラインスタイル、モノトーン基調
- Font Awesome Proのビジネスアイコン
- 絵文字は一切使用しない

### BtoC・小売・サービス系
- 適度にカラフルなSVGアイコン
- ソリッドスタイル可
- ブランドカラーに合わせたアイコン

### エンタメ・クリエイティブ系
- カラフルなアイコン、イラスト可
- 絵文字使用可（ただし統一感を保つ）

## 実装方法の優先順位
1. SVGマスク（mask-image）でのカスタムアイコン
2. Font Awesomeなどのアイコンフォント
3. インラインSVG
4. 絵文字（カジュアル系のみ）

---

# 🔍 SEO×AIO最適化実装

## 基本SEO要素（必須）
- titleタグは「[サービス名] | [価値提案キーワード]」形式で32文字以内、検索意図を明確に反映
- meta descriptionは120-160文字で「[課題] → [解決策] → [成果]」の流れで行動喚起
- H1は1つのみでサービス名+主要価値を含む、H2-H6は検索意図に沿った階層構造
- canonical URLを設定し重複コンテンツを防止
- 全画像にalt属性（商品画像は「[商品名]の[特徴]を示す画像」形式）

## 構造化データ実装（AI理解促進）
- WebPageスキーマ+LP種類別スキーマ（Product/Service/Event/Organization）をJSON-LDで実装
- FAQはmicrodataで構造化、質問と回答を明確に区別
- HowToスキーマで手順・プロセスを構造化（ステップ数、所要時間含む）
- Statisticスキーマで数値データを構造化（出典、更新日付含む）
- DefinedTermスキーマで専門用語を定義
- お問い合わせ先は構造化データで記述

## 技術的SEO実装
### Core Web Vitals対応
- 画像はWebP形式で配信、width/height属性必須
- loading="lazy"で画像遅延読み込み
- 重要リソースのpreload/preconnect設定

---

# ✅ 実装完了前の最終チェックリスト

## 【必須確認項目】
- [ ] ヘッダーは position: absolute で透明か？
- [ ] サービス名は左上に配置されているか？
- [ ] 外部リンクは一切ないか？（全てbutton要素か？）
- [ ] CTAボタンは外部URL誘導のみか？
- [ ] フォーム機能は実装されていないか？
- [ ] 別ページ遷移は完全に禁止されているか？
- [ ] 必須のHTML構造（head内CSS、body内HTML、script内JS）になっているか？
- [ ] レスポンシブタイポグラフィが正しく実装されているか？
- [ ] 水平スクロールが発生しない設計か？
- [ ] アクセシビリティガイドラインに準拠しているか？
- [ ] Unicode絵文字は一切使用していないか？
- [ ] 業界特性や制約事項を最優先で確認しているか？
- [ ] ALL content is in ENGLISH (no Japanese text in output)?
- [ ] HTML lang attribute is set to "en"?
`;

export function generateFinalPrompt(
  projectData: ProjectData,
  profileData: Profile,
  swipeResults: SwipeScores
): string {
  // スワイプスコアをテキスト形式に変換
  const scoresText = Object.entries(swipeResults)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
  
  // プロファイルデータのマッピング
  const mappedProfileData = {
    companyName: profileData.company_name || '',
    companyAchievements: profileData.company_achievements || '',
    contactInfo: profileData.contact_info || '',
    personalName: profileData.personal_name || '',
    personalBio: profileData.personal_bio || '',
    achievements: profileData.achievements || ''
  };
  
  // テンプレートに変数を埋め込み
  let prompt = DEFAULT_PROMPT
    .replace(/\${swipeScores}/g, scoresText);
    
  // projectDataの置換
  Object.entries(projectData).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{projectData\\.${key}(\\s*\\|\\|\\s*'[^']*')?\\}`, 'g');
    prompt = prompt.replace(regex, (match, defaultValue) => {
      if (value) return value;
      if (defaultValue) {
        const defaultStr = defaultValue.match(/'([^']*)'/)?.[1] || '';
        return defaultStr;
      }
      return '';
    });
  });
  
  // profileDataの置換
  Object.entries(mappedProfileData).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{profileData\\.${key}(\\s*\\|\\|\\s*'[^']*')?\\}`, 'g');
    prompt = prompt.replace(regex, value || '');
  });
  
  return prompt;
}