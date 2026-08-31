import { SvgIconProps } from "@mui/material";
import { ICON_MAP } from "./icon-map";

export type IconName = keyof typeof ICON_MAP;

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number | string;

export type IconColorVariant =
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

export interface IIconElementProps extends Omit<SvgIconProps, "color"> {
  name: IconName;
  size?: IconSize;
  colorVariant?: IconColorVariant;
  color?: string;
}
