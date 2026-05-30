/**
 * ARISE Spacing System
 * 4-point spacing scale and border radius tokens.
 */

export const Spacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 32px */
  xxxl: 32,

  borderRadius: {
    /** 6px – small chips, tags */
    sm: 6,
    /** 10px – cards, inputs */
    md: 10,
    /** 14px – buttons, modals */
    lg: 14,
    /** 20px – large containers */
    xl: 20,
    /** 999px – fully rounded / pill */
    full: 999,
  },
} as const;

export type SpacingType = typeof Spacing;
