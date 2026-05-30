/**
 * ARISE Typography System
 * Font sizes, weights, and line heights for the training system UI.
 */

import { Platform, TextStyle } from 'react-native';

const monoFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const Typography = {
  heading1: {
    fontSize: 34,
    fontWeight: '900' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
  },
  heading2: {
    fontSize: 28,
    fontWeight: '900' as TextStyle['fontWeight'],
    letterSpacing: 0.4,
  },
  heading3: {
    fontSize: 22,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: 0.3,
  },
  heading4: {
    fontSize: 18,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '700' as TextStyle['fontWeight'],
    textTransform: 'uppercase' as TextStyle['textTransform'],
    letterSpacing: 1.2,
  },
  mono: {
    fontSize: 15,
    fontFamily: monoFont,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
} as const;

export type TypographyType = typeof Typography;
