import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export type ColorSchema =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// SETUP COLORS

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

const PRIMARY = {
  lighter: "#bcdcf5",
  light: "#63aee9",
  main: "#1d7dc9",
  dark: "#16619c",
  darker: "#16619c",
  contrastText: "#fff",
};

const SECONDARY = {
  lighter: "#ffdf80",
  light: "#ffd24d",
  main: "#F5B700",
  dark: "#b38500",
  darker: "#805f00",
  contrastText: "#fff",
};

const INFO = {
  lighter: "#CAFDF5",
  light: "#61F3F3",
  main: "#00B8D9",
  dark: "#006C9C",
  darker: "#003768",
  contrastText: "#fff",
};

const SUCCESS = {
  lighter: "#D8FBDE",
  light: "#86E8AB",
  main: "#36B37E",
  dark: "#1B806A",
  darker: "#0A5554",
  contrastText: "#fff",
};

const WARNING = {
  lighter: "#FFF5CC",
  light: "#FFD666",
  main: "#FFAB00",
  dark: "#B76E00",
  darker: "#7A4100",
  contrastText: GREY[800],
};

const ERROR = {
  lighter: "#FFE9D5",
  light: "#FFAC82",
  main: "#FF5630",
  dark: "#B71D18",
  darker: "#7A0916",
  contrastText: "#fff",
};

const COMMON = {
  common: { black: "#000", white: "#fff" },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default function palette(
  themeMode: string,
  primaryColor: string,
  neutralColor: string
) {
  const light = {
    ...COMMON,
    primary: {
      lighter: primaryColor,
      light: primaryColor,
      main: primaryColor,
      dark: primaryColor,
      darker: primaryColor,
      contrastText: "#fff",
    },
    mode: "Light",
    text: {
      primary: "#000000",
      secondary: "#4A4A4A",
      disabled: "#979797",
    },
    background: { default: "#FFFFFF", neutral: "#F0F4F8", paper: "#FFFFFF" },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  } as const;

  const dark = {
    ...COMMON,
    primary: {
      lighter: alpha(primaryColor, 0.3),
      light: alpha(primaryColor, 0.7),
      main: alpha(primaryColor, 1),
      dark: alpha(primaryColor, 1.3),
      darker: alpha(primaryColor, 1.7),
      contrastText: "#fff",
    },
    mode: "Dark",
    text: {
      primary: "#DDDDDD",
      secondary: "#FFFFFF",
      disabled: "#979797",
    },
    background: { default: "#0D0D0D", neutral: "#23262A", paper: "#0D0D0D" },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  } as const;

  return themeMode === "Light" ? light : dark;
}
