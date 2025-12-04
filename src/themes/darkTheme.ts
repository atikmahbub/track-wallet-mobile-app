import {MD3DarkTheme as PaperDarkTheme} from 'react-native-paper';
import {DarkTheme as NavigationDarkTheme} from '@react-navigation/native';
import {colors} from '@trackingPortal/themes/colors';

export const darkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  roundness: 22,
  isV3: true,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    primary: colors.primary,
    secondary: colors.accent,
    tertiary: colors.secondary,
    background: colors.background,
    card: colors.surfaceAlt,
    surface: colors.surface,
    surfaceVariant: colors.surfaceAlt,
    elevation: PaperDarkTheme.colors?.elevation ?? PaperDarkTheme.elevation,
    text: colors.text,
    onSurface: colors.text,
    onSurfaceVariant: colors.subText,
    outline: colors.glassBorder,
    outlineVariant: colors.glassBorder,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    backdrop: colors.overlay,
    border: colors.glassBorder,
  },
};
