export const PROMPT_TEMPLATES = {
  ja: {
    product: `製品販売用のランディングページを生成してください。
    以下の要素を必ず含めてください：
    - ヒーローセクション（製品名、キャッチコピー、CTA）
    - 製品の特徴（最低6つ以上）
    - 価格プラン
    - お客様の声
    - FAQ
    - 問い合わせフォーム
    
    プロフィール情報：
    会社名: {companyName}
    サービス: {serviceName}
    説明: {description}
    
    重要：従来の2倍以上の充実したコンテンツを生成してください。`,
    
    brand: `ブランド・企業紹介用のランディングページを生成してください。
    以下の要素を必ず含めてください：
    - ヒーローセクション（企業名、ビジョン、CTA）
    - 企業理念とミッション
    - 企業の強み（最低5つ以上）
    - 実績と信頼性の証明
    - チームメンバー紹介
    - お問い合わせセクション
    
    プロフィール情報：
    会社名: {companyName}
    サービス: {serviceName}
    説明: {description}
    
    重要：企業の信頼性と専門性を強調する充実したコンテンツを生成してください。`,
    
    service: `サービス紹介用のランディングページを生成してください。
    以下の要素を必ず含めてください：
    - ヒーローセクション（サービス名、価値提案、CTA）
    - サービスの特徴と利点（最低6つ以上）
    - 導入事例またはケーススタディ
    - 料金プラン（該当する場合）
    - FAQ
    - 無料相談・デモの申し込みセクション
    
    プロフィール情報：
    会社名: {companyName}
    サービス: {serviceName}
    説明: {description}
    
    重要：サービスの価値と導入メリットを明確に伝える充実したコンテンツを生成してください。`,
    
    lead: `リード獲得用のランディングページを生成してください。
    以下の要素を必ず含めてください：
    - ヒーローセクション（提供価値、リード獲得フォーム）
    - 提供する資料・情報の価値（最低5つのポイント）
    - 資料の内容プレビュー
    - 読者の声・推薦文
    - よくある質問
    - プライバシーポリシーへのリンク
    
    プロフィール情報：
    会社名: {companyName}
    サービス: {serviceName}
    説明: {description}
    
    重要：個人情報提供への心理的ハードルを下げる信頼性の高いコンテンツを生成してください。`,
    
    event: `イベントプロモーション用のランディングページを生成してください。
    以下の要素を必ず含めてください：
    - ヒーローセクション（イベント名、日時、場所、CTA）
    - イベントの概要と目的
    - プログラム・スケジュール
    - 登壇者・講師紹介
    - 参加メリット（最低5つ）
    - 参加申し込みセクション
    - アクセス情報
    
    プロフィール情報：
    会社名: {companyName}
    サービス: {serviceName}
    説明: {description}
    
    重要：イベントへの参加意欲を高める魅力的で詳細なコンテンツを生成してください。`
  },
  en: {
    product: `Generate a product sales landing page.
    Include the following elements:
    - Hero section (product name, tagline, CTA)
    - Product features (at least 6)
    - Pricing plans
    - Customer testimonials
    - FAQ
    - Contact form
    
    Profile information:
    Company: {companyName}
    Service: {serviceName}
    Description: {description}
    
    Important: Generate content that is at least twice as comprehensive as before.`,
    
    brand: `Generate a brand/company landing page.
    Include the following elements:
    - Hero section (company name, vision, CTA)
    - Company mission and values
    - Company strengths (at least 5)
    - Achievements and credibility proof
    - Team member introduction
    - Contact section
    
    Profile information:
    Company: {companyName}
    Service: {serviceName}
    Description: {description}
    
    Important: Generate comprehensive content that emphasizes company credibility and expertise.`,
    
    service: `Generate a service introduction landing page.
    Include the following elements:
    - Hero section (service name, value proposition, CTA)
    - Service features and benefits (at least 6)
    - Case studies or success stories
    - Pricing plans (if applicable)
    - FAQ
    - Free consultation/demo request section
    
    Profile information:
    Company: {companyName}
    Service: {serviceName}
    Description: {description}
    
    Important: Generate comprehensive content that clearly communicates service value and implementation benefits.`,
    
    lead: `Generate a lead generation landing page.
    Include the following elements:
    - Hero section (offer value, lead capture form)
    - Value of provided materials/information (at least 5 points)
    - Material content preview
    - Reader testimonials
    - Frequently asked questions
    - Privacy policy link
    
    Profile information:
    Company: {companyName}
    Service: {serviceName}
    Description: {description}
    
    Important: Generate trustworthy content that reduces psychological barriers to providing personal information.`,
    
    event: `Generate an event promotion landing page.
    Include the following elements:
    - Hero section (event name, date, location, CTA)
    - Event overview and purpose
    - Program/schedule
    - Speaker/instructor introduction
    - Participation benefits (at least 5)
    - Registration section
    - Access information
    
    Profile information:
    Company: {companyName}
    Service: {serviceName}
    Description: {description}
    
    Important: Generate attractive and detailed content that increases motivation to participate in the event.`
  }
}