export const PADDING_GAP_ITEM = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 32,
  full: "9999px",
};

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