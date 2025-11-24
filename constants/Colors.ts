/**
 * Color palette for Oxify v2 application
 * All colors should be selected from this predefined palette
 */

export const Colors = {
  // Background colors
  primaryBg: "#19223C", // darkest shade
  secondaryBg: "#232B47", // medium shade
  tertiaryBg: "#19223C", // lighter shade

  // Dark colors
  black: "#000000",
  themeBlack: "#090B0D",
  charcoal: "#1A1A1A",
  darkGray: "#2D2D2D",

  blue: "#4C8BF5",
  grayText: "#9FA6B0",
  grayBg: "#3A4049",

  // Light colors
  white: "#FFFFFF",
  offWhite: "#F8F8F8",
  lightGray: "#E5E5E5",
  mediumGray: "#9E9E9E",
  neutralGray: "#DDE2E5",
  textDesGray: "#D9D9D9",

  // Blue tones
  primaryBlue: "#007AFF",
  brightBlue: "#0080FF",
  lightMint: "#C8F7C5",
  blueGray: "#8E9AAF",
  slateBlue: "#5A6B8C",

  // Additional colors
  navy: "#1E2A4A",
  mintGreen: "#A8E6CF",
  steel: "#6C7B7F",
  dimGray: "#50555C99",
  lightBlue: "#8BAFCE",
  bgLightRed: "#F5493B4D",
} as const;

/**
 * Semantic color mappings for consistent theming
 */
export const Theme = {
  backgroundGradient: {
    start: "#14181B",
    middle: "#171D27",
    end: "#1B273C",
  },
  backgroundGradient2: {
    start: "#14181B00",
    middle: "#171D2700",
    end: "#1B273C00",
  },
  backgroundDark: {
    start: Colors.themeBlack,
    middle: Colors.themeBlack,
    end: Colors.themeBlack,
  },

  backgroundDarkToLight: {
    start: "#14181B",
    middle: "#171D27",
    end: "#1B273C",
  },

  dashboardGradient: {
    start: "#14181B",
    middle: "#171D27",
    end: "#243551",
  },

  // Background colors
  background: {
    primary: Colors.white,
    secondary: Colors.offWhite,
    dark: Colors.charcoal,
    overlay: Colors.black + "80",
    bgLightRed: Colors.bgLightRed,
    blue: Colors.blue,
  },

  // Text colors
  text: {
    primary: Colors.black,
    secondary: Colors.mediumGray,
    light: Colors.lightGray,
    inverse: Colors.white,
    neutral: Colors.neutralGray,
    textDesGray: Colors.textDesGray,
    dimGray: Colors.dimGray,
    lightBlue: Colors.lightBlue,
    white: Colors.white,
  },

  // Action colors
  action: {
    primary: Colors.primaryBlue,
    secondary: Colors.blueGray,
    accent: Colors.brightBlue,
  },

  // Status colors
  status: {
    success: Colors.mintGreen,
    info: Colors.primaryBlue,
    warning: Colors.lightMint,
    error: "#FF4444", // You may want to add this to your palette
  },

  // Border colors
  border: {
    light: Colors.lightGray,
    medium: Colors.mediumGray,
    dark: Colors.darkGray,
  },
} as const;

// Type definitions for TypeScript support
export type ColorKeys = keyof typeof Colors;
export type ThemeColorKeys = keyof typeof Theme;
