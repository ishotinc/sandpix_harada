import type { StyleGuide } from '@/lib/design/style-guide-generator';

/**
 * Convert a StyleGuide to concise, actionable prompt instructions (Japanese).
 * Accepts partial StyleGuide to support tests that pass minimal structures.
 */
export function styleGuideToPrompt(styleGuide: Partial<StyleGuide>): string {
  const lines: string[] = [];

  lines.push('デザイン指示（スタイルガイドに基づく）');

  // Colors
  if (styleGuide.colors) {
    const { primary, secondary, accent } = styleGuide.colors as any;
    if (primary) lines.push(`プライマリカラー: ${primary}`);
    if (secondary) lines.push(`セカンダリカラー: ${secondary}`);
    if (accent) lines.push(`アクセントカラー: ${accent}`);
  }

  // Typography
  if (styleGuide.typography) {
    const { headingFont, bodyFont, accentFont } = styleGuide.typography as any;
    if (headingFont) lines.push(`見出しフォント: ${headingFont}`);
    if (bodyFont) lines.push(`本文フォント: ${bodyFont}`);
    if (accentFont) lines.push(`アクセントフォント: ${accentFont}`);
  }

  // Spacing → Emit explicit CSS guidance using baseUnit
  if (styleGuide.spacing?.baseUnit) {
    const unit = styleGuide.spacing.baseUnit;
    lines.push('レイアウト（CSS 指示）:');
    lines.push(`- margin: ${unit}px の倍数を使用`);
    lines.push(`- padding: ${unit}px の倍数を使用`);
    lines.push(`- gap: ${unit}px の倍数を使用`);
  }

  // Components (optional hints)
  if (styleGuide.components) {
    const { button, card, input } = styleGuide.components;
    if (button?.borderRadius !== undefined)
      lines.push(`ボタン角丸: ${button.borderRadius}px`);
    if (card?.borderRadius !== undefined)
      lines.push(`カード角丸: ${card.borderRadius}px`);
    if (input?.borderRadius !== undefined)
      lines.push(`入力欄角丸: ${input.borderRadius}px`);
  }

  return lines.join('\n');
}

export default styleGuideToPrompt;


