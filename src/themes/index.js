import { createTheme } from '@mui/material/styles';
import colors from 'assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

export const theme = (customization) => {
  const color = customization.darkMode ? colors : colors; // Update to your dark color module if needed

  const themeOption = {
    colors: color,
    heading: customization.darkMode ? color.darkPrimaryLight : color.grey900,
    paper: customization.darkMode ? color.darkPaper : color.paper,
    backgroundDefault: customization.darkMode ? color.darkPaper : color.paper,
    background: customization.darkMode ? color.darkBackground : color.primaryLight,
    darkTextPrimary: customization.darkMode ? color.darkPrimaryLight : color.grey700,
    darkTextSecondary: customization.darkMode ? color.darkPrimaryLight : color.grey500,
    textDark: customization.darkMode ? color.darkPrimaryLight : color.grey900,
    menuSelected: customization.darkMode ? color.darkPrimaryLight : color.secondaryDark,
    menuSelectedBack: customization.darkMode ? color.darkLevel1 : color.secondaryLight,
    divider: customization.darkMode ? color.darkBackground : color.grey200,
    customization
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
