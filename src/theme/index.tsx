import { useMemo } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeOptions,
  StyledEngineProvider,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
// components
import { useSettingsContext } from "../components/settings";
//
import palette from "./palette";
import typography from "./typography";
import GlobalStyles from "./globalStyles";
import ComponentsOverrides from "./overrides";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const { themeMode, fontSize, primaryColor, neturalColor } =
    useSettingsContext();

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: palette(themeMode, primaryColor, neturalColor),
      typography: typography(fontSize),
      shape: { borderRadius: 8 },
    }),
    [themeMode, fontSize, primaryColor, neturalColor]
  );

  const theme = createTheme(themeOptions);

  theme.components = ComponentsOverrides(theme) as any;

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
