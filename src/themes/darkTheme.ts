import {MD3DarkTheme as PaperDarkTheme} from 'react-native-paper';
import {DarkTheme as NavigationDarkTheme} from '@react-navigation/native';
import {colors} from '@trackingPortal/themes/colors';

export const darkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    error: colors.error,
  },
};
