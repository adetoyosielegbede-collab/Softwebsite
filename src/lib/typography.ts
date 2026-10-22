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

export type Typography = {
  headingFont: FontFamilyName;
  headingWeight: FontWeightName;
  headingStyle: FontStyleName;
  bodyFont: FontFamilyName;
  bodyWeight: FontWeightName;
  bodyStyle: FontStyleName;
};

export const DEFAULT_TYPOGRAPHY: Typography = {
  headingFont: "General Sans",
  headingWeight: "Medium",
  headingStyle: "Normal",
  bodyFont: "General Sans",
  bodyWeight: "Regular",
  bodyStyle: "Normal",
};

/** Dropdown choices for CMS fields, keyed by the field's path inside its content file. */
export const FIELD_OPTIONS: Record<string, readonly string[]> = {
  "typography.headingFont": Object.keys(FONT_FAMILIES),
  "typography.bodyFont": Object.keys(FONT_FAMILIES),
  "typography.headingWeight": Object.keys(FONT_WEIGHTS),
  "typography.bodyWeight": Object.keys(FONT_WEIGHTS),
  "typography.headingStyle": Object.keys(FONT_STYLES),
  "typography.bodyStyle": Object.keys(FONT_STYLES),
};

function pick<T extends Record<string, unknown>>(table: T, value: unknown, fallback: keyof T): T[keyof T] {
  return typeof value === "string" && value in table ? table[value as keyof T] : table[fallback];
}

export function typographyStyle(input: Partial<Typography> | undefined): CSSProperties {
  const t = { ...DEFAULT_TYPOGRAPHY, ...input };
  return {
    "--font-heading-choice": pick(FONT_FAMILIES, t.headingFont, DEFAULT_TYPOGRAPHY.headingFont),
    "--font-body-choice": pick(FONT_FAMILIES, t.bodyFont, DEFAULT_TYPOGRAPHY.bodyFont),
    "--heading-weight": pick(FONT_WEIGHTS, t.headingWeight, DEFAULT_TYPOGRAPHY.headingWeight),
    "--heading-style": pick(FONT_STYLES, t.headingStyle, DEFAULT_TYPOGRAPHY.headingStyle),
    "--body-weight": pick(FONT_WEIGHTS, t.bodyWeight, DEFAULT_TYPOGRAPHY.bodyWeight),
    "--body-style": pick(FONT_STYLES, t.bodyStyle, DEFAULT_TYPOGRAPHY.bodyStyle),
  } as CSSProperties;
}
