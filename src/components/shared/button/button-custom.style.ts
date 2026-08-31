import { SxProps, Theme } from "@mui/material";
import {
  COLOR,
  RADIUS,
  SHADOW,
  ANIMATION,
  FONT_WEIGHT,
  PADDING_GAP_ITEM,
} from "@/constants/style.constant";
import { ButtonVariant, ButtonRounded } from "./button-custom.interface";

const VARIANT_STYLES: Record<ButtonVariant, SxProps<Theme>> = {
  primary: {
    backgroundColor: COLOR.btnPrimary,
    color: COLOR.textInverse,
    boxShadow: SHADOW.sm,
    "&:hover": {
      backgroundColor: COLOR.btnPrimaryHover,
      boxShadow: SHADOW.md,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  gradient: {
    background: COLOR.btnGradient,
    color: COLOR.textInverse,
    boxShadow: SHADOW.md,
    "&:hover": {
      background: COLOR.btnHoverGradient,
      boxShadow: SHADOW.lg,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  secondary: {
    backgroundColor: COLOR.btnSecondary,
    color: COLOR.textInverse,
    boxShadow: SHADOW.sm,
    "&:hover": {
      backgroundColor: COLOR.btnSecondaryHover,
      boxShadow: SHADOW.md,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  outline: {
    backgroundColor: "transparent",
    color: COLOR.gold.dark,
    border: `1.5px solid ${COLOR.borderGold}`,
    boxShadow: SHADOW.none,
    "&:hover": {
      backgroundColor: COLOR.gold[50],
      borderColor: COLOR.gold.main,
      boxShadow: SHADOW.sm,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  ghost: {
    backgroundColor: "transparent",
    color: COLOR.textPrimary,
    boxShadow: SHADOW.none,
    "&:hover": {
      backgroundColor: "rgba(183, 134, 40, 0.08)",
      color: COLOR.gold.dark,
    },
  },
  dark: {
    backgroundColor: COLOR.btnDark,
    color: COLOR.textInverse,
    boxShadow: SHADOW.sm,
    "&:hover": {
      backgroundColor: "#2C2416",
      boxShadow: SHADOW.md,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  contained: {
    background: COLOR.btnGradient,
    color: COLOR.textInverse,
    boxShadow: SHADOW.sm,
    "&:hover": {
      boxShadow: SHADOW.md,
      transform: "translateY(-1px)",
    },
  },
  outlined: {
    backgroundColor: "transparent",
    color: COLOR.gold.dark,
    border: `1px solid ${COLOR.borderGold}`,
    "&:hover": {
      backgroundColor: "rgba(183, 134, 40, 0.04)",
      borderColor: COLOR.gold.main,
      transform: "translateY(-1px)",
    },
  },
  text: {
    backgroundColor: "transparent",
    color: COLOR.textPrimary,
    "&:hover": {
      backgroundColor: "rgba(183, 134, 40, 0.06)",
      color: COLOR.gold.dark,
    },
  },
};

export const getButtonStyles = (
  variant: ButtonVariant = "primary",
  rounded?: ButtonRounded
): SxProps<Theme> => {
  let borderRadiusVal: string | number = RADIUS.md;

  if (rounded === true) {
    borderRadiusVal = RADIUS.full;
  } else if (typeof rounded === "string" && rounded in RADIUS) {
    borderRadiusVal = RADIUS[rounded as keyof typeof RADIUS];
  }

  const baseStyle: SxProps<Theme> = {
    borderRadius: borderRadiusVal,
    textTransform: "none",
    fontWeight: FONT_WEIGHT.semibold,
    px: `${PADDING_GAP_ITEM.xl}px`,
    py: `${PADDING_GAP_ITEM.md}px`,
    transition: ANIMATION.sm,
    whiteSpace: "nowrap",
    ...VARIANT_STYLES[variant],
  };

  return baseStyle;
};
