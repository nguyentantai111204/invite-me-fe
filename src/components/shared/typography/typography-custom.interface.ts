import { TypographyProps } from "@mui/material";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  LETTER_SPACING,
  FONT_FAMILY,
} from "@/constants/style.constant";

export type TypographySize = keyof typeof FONT_SIZE;
export type TypographyWeight = keyof typeof FONT_WEIGHT | number;
export type TypographyLineHeight = keyof typeof LINE_HEIGHT | number;
export type TypographyLetterSpacing = keyof typeof LETTER_SPACING | string;
export type TypographyFontFamily = keyof typeof FONT_FAMILY | string;

export type TypographyColorVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "gold"
  | "rose"
  | "error"
  | "warning"
  | "info"
  | "success"
  | "white"
  | "muted"
  | "inverse";

export type TypographyGradient = boolean | "gold" | "rose" | string;

export interface ITypographyCustomProps extends Omit<TypographyProps, "color"> {
  size?: TypographySize;
  weight?: TypographyWeight;
  colorVariant?: TypographyColorVariant;
  color?: string;
  fontFamilyType?: TypographyFontFamily;
  lineHeightType?: TypographyLineHeight;
  letterSpacingType?: TypographyLetterSpacing;
  gradient?: TypographyGradient;
  truncate?: boolean | number;
  italic?: boolean;
  underline?: boolean;
}
