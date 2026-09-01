export const SPACING = {
  px2:   0.25,   // 2px
  px4:   0.5,    // 4px
  px6:   0.75,   // 6px
  px8:   1,      // 8px
  px12:  1.5,    // 12px
  px16:  2,      // 16px
  px20:  2.5,    // 20px
  px24:  3,      // 24px
  px28:  3.5,    // 28px
  px32:  4,      // 32px
  px36:  4.5,    // 36px
  px40:  5,      // 40px
  px48:  6,      // 48px
  px56:  7,      // 56px
  px64:  8,      // 64px
  px80:  10,     // 80px
  px96:  12,     // 96px
  px104: 13,     // 104px (section py xs)
  px128: 16,     // 128px
} as const;

/** @deprecated Use SPACING instead */
export const PADDING_GAP_ITEM = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
};

export const RADIUS = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
} as const;

export const SHADOW = {
  sm: "0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)",
  md: "0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.10)",
  lg: "0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 4px 6px -4px rgba(0, 0, 0, 0.10)",
  xl: "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)",
  none: "none",
};

export const ANIMATION = {
  none: "none",
  sm: "all 0.2s ease-in-out",
  md: "all 0.3s ease-in-out",
  lg: "all 0.4s ease-in-out",
  xl: "all 0.5s ease-in-out",
};

export const FONT_WEIGHT = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export const FONT_SIZE = {
  xs: "0.75rem",    // 12px
  sm: "0.875rem",   // 14px
  md: "1rem",       // 16px (base)
  base: "1rem",     // 16px
  lg: "1.125rem",   // 18px
  xl: "1.25rem",    // 20px
  "2xl": "1.5rem",  // 24px
  "3xl": "1.875rem",// 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem",    // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem",  // 72px
  "8xl": "6rem",    // 96px
} as const;

export const LINE_HEIGHT = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const LETTER_SPACING = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
  mega: "0.2em",
} as const;

export const FONT_FAMILY = {
  sans: [
    "var(--font-inter, Inter)",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
  ].join(","),
  serif: "var(--font-playfair, 'Playfair Display'), Georgia, serif",
  script: "var(--font-great-vibes, 'Great Vibes'), cursive",
  vietnamese: "var(--font-be-vietnam-pro, 'Be Vietnam Pro'), sans-serif",
} as const;

export const COLOR = {
  // Background (Nền kem ấm Champagne, Trắng & Nâu tối hoàng gia)
  bgPrimary: "#FAF8F5",       // Nền kem sáng ấm
  bgSecondary: "#FDFBF7",     // Nền kem nhẹ
  bgTertiary: "#F5F2EB",      // Nền subtle
  bgPaper: "#FFFFFF",         // Trắng tinh khiết
  bgDark: "#1A1612",          // Nâu đen hoàng gia
  bgDarkPaper: "#241E18",     // Thẻ tối
  bgDarkFooter: "#1F1F1F",    // Chân trang tối

  // Text (Độ tương phản cao theo tone Deep Espresso)
  textPrimary: "#2C2416",     // Nâu đen đậm (Deep Espresso)
  textSecondary: "#6B5E4B",   // Nâu ấm
  textTertiary: "#A89C8A",    // Xám nâu nhạt
  textDisabled: "#A89C8A",
  textGold: "#B78628",        // Chữ vàng hoàng kim
  textInverse: "#FFFFFF",
  textWhite: "#FFFFFF",
  textMutedWhite: "rgba(255, 255, 255, 0.7)",

  // Border & Divider
  borderPrimary: "rgba(183, 134, 40, 0.25)",      // Viền vàng
  borderSecondary: "rgba(183, 134, 40, 0.12)",    // Viền vàng nhạt
  borderGold: "rgba(183, 134, 40, 0.25)",
  borderGoldLight: "rgba(183, 134, 40, 0.12)",
  borderGoldDashed: "rgba(183, 134, 40, 0.3)",
  borderSubtle: "rgba(0, 0, 0, 0.08)",
  divider: "rgba(183, 134, 40, 0.15)",

  // Button & Interactive
  btnPrimary: "#B78628",                          // Nút Vàng Hoàng Gia chính
  btnPrimaryHover: "#A1721C",
  btnSecondary: "#E58B7B",                        // Nút Hồng Phấn
  btnSecondaryHover: "#C95D46",
  btnDark: "#1A1612",
  btnGradient: "linear-gradient(135deg, #D4AF37 0%, #B78628 50%, #966A1E 100%)",
  btnHoverGradient: "linear-gradient(135deg, #E8C872 0%, #C5A059 50%, #A1721C 100%)",

  // Palette Vàng Hoàng Gia (Gold Tone)
  gold: {
    50: "#FAF6EE",
    100: "#F5ECDC",
    200: "#EAD6B5",
    300: "#DCBE8A",
    400: "#CCA563",
    500: "#B78628", // Main Gold
    600: "#A1721C",
    700: "#875C12",
    800: "#6D470B",
    900: "#503205",
    light: "#E8C872",
    main: "#B78628",
    dark: "#875C12",
    contrastText: "#FFFFFF",
    gradient: "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA771C 100%)",
  },

  // Palette Hồng Phấn Lãng Mạn (Rose Tone)
  rose: {
    50: "#FDF6F4",
    100: "#FBEDE9",
    200: "#F6D7CF",
    300: "#F0B8AA",
    400: "#E89A88",
    500: "#DE7C66", // Main Rose
    600: "#C95D46",
    700: "#A84732",
    800: "#873523",
    900: "#692517",
    light: "#FAD2C0",
    main: "#E58B7B",
    dark: "#A84732",
    contrastText: "#FFFFFF",
    gradient: "linear-gradient(135deg, #FBEDE9 0%, #E58B7B 100%)",
  },

  // Status Colors
  status: {
    error: {
      light: "#FEF2F2",
      main: "#DC2626",
      dark: "#B91C1C",
    },
    warning: {
      light: "#FFFBEB",
      main: "#D97706",
      dark: "#B45309",
    },
    info: {
      light: "#FAF6EE",
      main: "#B78628",
      dark: "#875C12",
    },
    success: {
      light: "#ECFDF5",
      main: "#059669",
      dark: "#047857",
    },
  },
} as const;

export const PALETTE = {
  gold: {
    50: "#FAF6EE",
    100: "#F5ECDC",
    200: "#EAD6B5",
    300: "#DCBE8A",
    400: "#CCA563",
    500: "#B78628",
    600: "#A1721C",
    700: "#875C12",
    800: "#6D470B",
    900: "#503205",
    light: "#E8C872",
    main: "#B78628",
    dark: "#875C12",
    contrastText: "#FFFFFF",
    gradient: "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA771C 100%)",
  },
  rose: {
    50: "#FDF6F4",
    100: "#FBEDE9",
    200: "#F6D7CF",
    300: "#F0B8AA",
    400: "#E89A88",
    500: "#DE7C66",
    600: "#C95D46",
    700: "#A84732",
    800: "#873523",
    900: "#692517",
    light: "#FAD2C0",
    main: "#E58B7B",
    dark: "#A84732",
    contrastText: "#FFFFFF",
    gradient: "linear-gradient(135deg, #FBEDE9 0%, #E58B7B 100%)",
  },
} as const;