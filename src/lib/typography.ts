import type { CSSProperties } from "react";

export const FONT_FAMILIES = {
  "General Sans": "var(--font-general-sans)",
  Inter: "var(--font-inter)",
  "DM Sans": "var(--font-dm-sans)",
  Manrope: "var(--font-manrope)",
  "Space Grotesk": "var(--font-space-grotesk)",
  "IBM Plex Sans": "var(--font-ibm-plex-sans)",
  Fraunces: "var(--font-fraunces)",
  "Source Serif": "var(--font-source-serif)",
} as const;

export const FONT_WEIGHTS = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  Semibold: 600,
  Bold: 700,
} as const;

export const FONT_STYLES = {
  Normal: "normal",
  Italic: "italic",
} as const;

export type FontFamilyName = keyof typeof FONT_FAMILIES;
export type FontWeightName = keyof typeof FONT_WEIGHTS;
export type FontStyleName = keyof typeof FONT_STYLES;

export type FontSize = { desktopPx: number; mobilePx: number };

export const TEXT_STYLES = ["display", "headline", "title", "lede", "body"] as const;
export type TextStyleName = (typeof TEXT_STYLES)[number];

export type Typography = {
  headingFont: FontFamilyName;
  headingWeight: FontWeightName;
  headingStyle: FontStyleName;
  bodyFont: FontFamilyName;
  bodyWeight: FontWeightName;
  bodyStyle: FontStyleName;
  sizes: Record<TextStyleName, FontSize>;
};

export const DEFAULT_SIZES: Typography["sizes"] = {
  display: { desktopPx: 60, mobilePx: 36 },
  headline: { desktopPx: 50, mobilePx: 32 },
  title: { desktopPx: 30, mobilePx: 24 },
  lede: { desktopPx: 16, mobilePx: 14 },
  body: { desktopPx: 16, mobilePx: 14 },
};

export const DEFAULT_TYPOGRAPHY: Typography = {
  headingFont: "General Sans",
  headingWeight: "Medium",
  headingStyle: "Normal",
  bodyFont: "General Sans",
  bodyWeight: "Regular",
  bodyStyle: "Normal",
  sizes: DEFAULT_SIZES,
};

function px(value: unknown, fallback: number): string {
  const n = typeof value === "number" && Number.isFinite(value) && value >= 8 && value <= 200 ? value : fallback;
  return `${n}px`;
}

export const TEXT_STYLE_CLASSES = {
  Display: "text-display",
  Headline: "text-headline",
  Title: "text-title",
  Lede: "text-lede",
  Body: "text-body",
} as const;
export type TextStyleLabel = keyof typeof TEXT_STYLE_CLASSES;

export function textStyleClass(label: unknown, fallback: TextStyleLabel): string {
  return pick(TEXT_STYLE_CLASSES, label, fallback);
}

/** Inline custom properties for a block whose size can be overridden in the CMS; 0 keeps the style's size. */
export function fontSizeVars(size: Partial<FontSize> | undefined): CSSProperties | undefined {
  if (!size || (!size.desktopPx && !size.mobilePx)) return undefined;
  const vars: Record<string, string> = {};
  if (size.desktopPx) vars["--block-size"] = px(size.desktopPx, 16);
  if (size.mobilePx) vars["--block-size-sm"] = px(size.mobilePx, 16);
  return vars as CSSProperties;
}

/** Dropdown choices for CMS fields, keyed by the field's path inside its content file. */
export const FIELD_OPTIONS: Record<string, readonly string[]> = {
  "typography.headingFont": Object.keys(FONT_FAMILIES),
  "typography.bodyFont": Object.keys(FONT_FAMILIES),
  "typography.headingWeight": Object.keys(FONT_WEIGHTS),
  "typography.bodyWeight": Object.keys(FONT_WEIGHTS),
  "typography.headingStyle": Object.keys(FONT_STYLES),
  "typography.bodyStyle": Object.keys(FONT_STYLES),
  "intro.textStyle": Object.keys(TEXT_STYLE_CLASSES),
};

function pick<T extends Record<string, unknown>>(table: T, value: unknown, fallback: keyof T): T[keyof T] {
  return typeof value === "string" && value in table ? table[value as keyof T] : table[fallback];
}

export function typographyStyle(input: Partial<Typography> | undefined): CSSProperties {
  const t = { ...DEFAULT_TYPOGRAPHY, ...input };
  const sizes: Record<string, string> = {};
  for (const name of TEXT_STYLES) {
    const size = t.sizes?.[name];
    sizes[`--size-${name}`] = px(size?.desktopPx, DEFAULT_SIZES[name].desktopPx);
    sizes[`--size-${name}-sm`] = px(size?.mobilePx, DEFAULT_SIZES[name].mobilePx);
  }
  return {
    ...sizes,
    "--font-heading-choice": pick(FONT_FAMILIES, t.headingFont, DEFAULT_TYPOGRAPHY.headingFont),
    "--font-body-choice": pick(FONT_FAMILIES, t.bodyFont, DEFAULT_TYPOGRAPHY.bodyFont),
    "--heading-weight": pick(FONT_WEIGHTS, t.headingWeight, DEFAULT_TYPOGRAPHY.headingWeight),
    "--heading-style": pick(FONT_STYLES, t.headingStyle, DEFAULT_TYPOGRAPHY.headingStyle),
    "--body-weight": pick(FONT_WEIGHTS, t.bodyWeight, DEFAULT_TYPOGRAPHY.bodyWeight),
    "--body-style": pick(FONT_STYLES, t.bodyStyle, DEFAULT_TYPOGRAPHY.bodyStyle),
  } as CSSProperties;
}
