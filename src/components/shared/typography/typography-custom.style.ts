import { SxProps, Theme } from "@mui/material";
import {
  COLOR,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  LETTER_SPACING,
  FONT_FAMILY,
} from "@/constants/style.constant";
import {
  ITypographyCustomProps,
  TypographyColorVariant,
  TypographySize,
} from "./typography-custom.interface";

const COLOR_VARIANT_MAP: Record<TypographyColorVariant, string> = {
  primary: COLOR.textPrimary,
  secondary: COLOR.textSecondary,
  tertiary: COLOR.textTertiary,
  gold: COLOR.textGold,
  rose: COLOR.rose.main,
  error: COLOR.status.error.main,
  warning: COLOR.status.warning.main,
  info: COLOR.status.info.main,
  success: COLOR.status.success.main,
  white: COLOR.textWhite,
  muted: COLOR.textMutedWhite,
  inverse: COLOR.textInverse,
};

const GRADIENT_MAP: Record<string, string> = {
  gold: COLOR.gold.gradient,
  rose: COLOR.rose.gradient,
};

export const getTypographyStyles = (props: ITypographyCustomProps): SxProps<Theme> => {
  const {
    size,
    weight,
    colorVariant,
    color,
    fontFamilyType,
    lineHeightType,
    letterSpacingType,
    gradient,
    truncate,
    italic,
    underline,
  } = props;

  const sx: Record<string, unknown> = {};

  if (size) {
    sx.fontSize = FONT_SIZE[size as TypographySize] || size;
  }

  if (weight !== undefined) {
    sx.fontWeight = typeof weight === "string" && weight in FONT_WEIGHT
      ? FONT_WEIGHT[weight as keyof typeof FONT_WEIGHT]
      : weight;
  }

  if (fontFamilyType) {
    sx.fontFamily = (fontFamilyType in FONT_FAMILY
      ? FONT_FAMILY[fontFamilyType as keyof typeof FONT_FAMILY]
      : fontFamilyType) as string;
  }

  if (lineHeightType !== undefined) {
    sx.lineHeight = typeof lineHeightType === "string" && lineHeightType in LINE_HEIGHT
      ? LINE_HEIGHT[lineHeightType as keyof typeof LINE_HEIGHT]
      : lineHeightType;
  }

  if (letterSpacingType !== undefined) {
    sx.letterSpacing = typeof letterSpacingType === "string" && letterSpacingType in LETTER_SPACING
      ? LETTER_SPACING[letterSpacingType as keyof typeof LETTER_SPACING]
      : letterSpacingType;
  }

  if (color) {
    sx.color = color;
  } else if (colorVariant) {
    sx.color = COLOR_VARIANT_MAP[colorVariant];
  }

  if (gradient) {
    let gradientStyle: string = COLOR.gold.gradient;
    if (typeof gradient === "string") {
      gradientStyle = GRADIENT_MAP[gradient] || gradient;
    }
    sx.backgroundImage = gradientStyle;
    sx.WebkitBackgroundClip = "text";
    sx.WebkitTextFillColor = "transparent";
    sx.display = "inline-block";
  }

  if (truncate === true) {
    sx.overflow = "hidden";
    sx.textOverflow = "ellipsis";
    sx.whiteSpace = "nowrap";
  } else if (typeof truncate === "number" && truncate > 0) {
    sx.overflow = "hidden";
    sx.display = "-webkit-box";
    sx.WebkitBoxOrient = "vertical";
    sx.WebkitLineClamp = truncate;
  }

  if (italic) {
    sx.fontStyle = "italic";
  }
  if (underline) {
    sx.textDecoration = "underline";
  }

  return sx as SxProps<Theme>;
};
