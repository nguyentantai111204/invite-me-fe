import { createTheme } from "@mui/material/styles";
import {
  COLOR,
  RADIUS,
  SHADOW,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  FONT_FAMILY,
} from "@/constants/style.constant";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: COLOR.gold.light,
      main: COLOR.gold.main,
      dark: COLOR.gold.dark,
      contrastText: COLOR.gold.contrastText,
    },
    secondary: {
      light: COLOR.rose.light,
      main: COLOR.rose.main,
      dark: COLOR.rose.dark,
      contrastText: COLOR.rose.contrastText,
    },
    background: {
      default: COLOR.bgPrimary,
      paper: COLOR.bgPaper,
    },
    text: {
      primary: COLOR.textPrimary,
      secondary: COLOR.textSecondary,
      disabled: COLOR.textDisabled,
    },
    error: {
      light: COLOR.status.error.light,
      main: COLOR.status.error.main,
      dark: COLOR.status.error.dark,
    },
    warning: {
      light: COLOR.status.warning.light,
      main: COLOR.status.warning.main,
      dark: COLOR.status.warning.dark,
    },
    info: {
      light: COLOR.status.info.light,
      main: COLOR.status.info.main,
      dark: COLOR.status.info.dark,
    },
    success: {
      light: COLOR.status.success.light,
      main: COLOR.status.success.main,
      dark: COLOR.status.success.dark,
    },
    divider: COLOR.divider,
  },
  shape: {
    borderRadius: RADIUS.md,
  },
  typography: {
    fontFamily: FONT_FAMILY.sans,
    h1: {
      fontSize: FONT_SIZE["5xl"],
      fontWeight: FONT_WEIGHT.extrabold,
      lineHeight: LINE_HEIGHT.tight,
      letterSpacing: LETTER_SPACING.tight,
    },
    h2: {
      fontSize: FONT_SIZE["4xl"],
      fontWeight: FONT_WEIGHT.extrabold,
      lineHeight: LINE_HEIGHT.tight,
      letterSpacing: LETTER_SPACING.tight,
    },
    h3: {
      fontSize: FONT_SIZE["3xl"],
      fontWeight: FONT_WEIGHT.bold,
      lineHeight: LINE_HEIGHT.snug,
    },
    h4: {
      fontSize: FONT_SIZE["2xl"],
      fontWeight: FONT_WEIGHT.bold,
      lineHeight: LINE_HEIGHT.snug,
    },
    h5: {
      fontSize: FONT_SIZE.xl,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: LINE_HEIGHT.normal,
    },
    h6: {
      fontSize: FONT_SIZE.lg,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: LINE_HEIGHT.normal,
    },
    subtitle1: {
      fontSize: FONT_SIZE.lg,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: LINE_HEIGHT.normal,
    },
    subtitle2: {
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: LINE_HEIGHT.normal,
    },
    body1: {
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.regular,
      lineHeight: LINE_HEIGHT.relaxed,
    },
    body2: {
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.regular,
      lineHeight: LINE_HEIGHT.relaxed,
    },
    button: {
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.semibold,
      textTransform: "none",
    },
    caption: {
      fontSize: FONT_SIZE.xs,
      fontWeight: FONT_WEIGHT.medium,
      lineHeight: LINE_HEIGHT.normal,
    },
    overline: {
      fontSize: FONT_SIZE.xs,
      fontWeight: FONT_WEIGHT.bold,
      letterSpacing: LETTER_SPACING.wider,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS.md,
          boxShadow: SHADOW.none,
          "&:hover": {
            boxShadow: SHADOW.sm,
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            background: COLOR.btnGradient,
            "&:hover": {
              background: COLOR.btnHoverGradient,
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS.md,
        },
      },
    },
  },
});

export default theme;
