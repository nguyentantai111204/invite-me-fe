import { createTheme } from "@mui/material/styles";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";

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
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    button: {
      textTransform: "none",
      fontWeight: 600,
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
        containedPrimary: {
          background: COLOR.btnGradient,
          "&:hover": {
            background: COLOR.btnHoverGradient,
          },
        },
      },
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
