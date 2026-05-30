/**
 * ARISE Color Palette
 * Dark-mode-only theme inspired by Solo Leveling's shadow aesthetic.
 */

export type RankTier = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export const Colors = {
  // Backgrounds
  background: '#0A0A0F',
  surface: '#12121A',
  surfaceElevated: '#1A1A2E',

  // Primary
  primary: '#7B2FF7',
  primaryGlow: '#9D4EDD',

  // Accents
  accentGold: '#FFD700',
  accentRed: '#FF3333',
  accentGreen: '#00FF88',

  // Text
  textPrimary: '#E8E8F0',
  textSecondary: '#8888AA',
  textMuted: '#555577',

  // Borders
  border: '#2A2A3E',
  borderLight: '#3A3A4E',

  // Hunter Rank Colors
  rankColors: {
    E: '#808080',
    D: '#4CAF50',
    C: '#2196F3',
    B: '#FF9800',
    A: '#FF3333',
    S: '#FFD700',
  } as Record<RankTier, string>,
} as const;

export type ColorsType = typeof Colors;
