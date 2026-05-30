/**
 * ARISE Theme Provider
 * React Context that provides the full theme (colors, typography, spacing)
 * to all child components via the useTheme() hook.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { Colors, ColorsType } from './colors';
import { Typography, TypographyType } from './typography';
import { Spacing, SpacingType } from './spacing';

export interface AriseTheme {
  colors: ColorsType;
  typography: TypographyType;
  spacing: SpacingType;
}

const defaultTheme: AriseTheme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
};

const ThemeContext = createContext<AriseTheme>(defaultTheme);

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Optional theme overrides – merged shallowly with the default theme. */
  theme?: Partial<AriseTheme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: overrides,
}) => {
  const theme = useMemo<AriseTheme>(
    () => ({
      colors: overrides?.colors ?? defaultTheme.colors,
      typography: overrides?.typography ?? defaultTheme.typography,
      spacing: overrides?.spacing ?? defaultTheme.spacing,
    }),
    [overrides],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook to access the ARISE theme from any component.
 * Must be used inside a <ThemeProvider>.
 */
export const useTheme = (): AriseTheme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within an <ThemeProvider>');
  }
  return theme;
};
