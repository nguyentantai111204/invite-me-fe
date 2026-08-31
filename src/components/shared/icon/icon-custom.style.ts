import { SxProps, Theme } from "@mui/material";
import { COLOR } from "@/constants/style.constant";
import {
  IconColorVariant,
  IconSize,
  IIconElementProps,
} from "./icon-custom.interface";

const ICON_SIZE_MAP: Record<string, string> = {
  xs: "14px",
  sm: "18px",
  md: "24px",
  lg: "32px",
  xl: "40px",
  "2xl": "48px",
};

const COLOR_VARIANT_MAP: Record<IconColorVariant, string> = {
  primary: COLOR.gold.main,
  secondary: COLOR.textSecondary,
  tertiary: COLOR.textTertiary,
  gold: COLOR.textGold,
  rose: COLOR.rose.main,
  error: COLOR.status.error.main,
  warning: COLOR.status.warning.main,
  info: COLOR.status.info.main,
  success: COLOR.status.success.main,
  white: COLOR.textWhite,
  muted: COLOR.textSecondary,
  inverse: COLOR.textInverse,
};

export const getIconStyles = (props: IIconElementProps): SxProps<Theme> => {
  const { size, colorVariant, color } = props;
  const sx: Record<string, unknown> = {};

  if (size) {
    if (typeof size === "string" && size in ICON_SIZE_MAP) {
      sx.fontSize = ICON_SIZE_MAP[size];
    } else if (typeof size === "number") {
      sx.fontSize = `${size}px`;
    } else {
      sx.fontSize = size;
    }
  }

  if (color) {
    sx.color = color;
  } else if (colorVariant) {
    sx.color = COLOR_VARIANT_MAP[colorVariant];
  }

  return sx as SxProps<Theme>;
};
