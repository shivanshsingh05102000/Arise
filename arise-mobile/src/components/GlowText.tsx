/**
 * GlowText
 * Text component with a luminous shadow glow effect,
 * evoking the system UI from Solo Leveling.
 */

import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme';

interface GlowTextProps {
  /** The text content to render. */
  text: string;
  /** Glow & text color. Defaults to primary purple. */
  color?: string;
  /** Font size override. */
  size?: number;
  /** Additional text styles. */
  style?: StyleProp<TextStyle>;
  /** Glow intensity – controls shadow radius. Default 10. */
  glowRadius?: number;
}

export const GlowText: React.FC<GlowTextProps> = ({
  text,
  color,
  size,
  style,
  glowRadius = 10,
}) => {
  const { colors, typography } = useTheme();
  const glowColor = color ?? colors.primaryGlow;

  return (
    <Text
      style={[
        styles.base,
        {
          color: glowColor,
          fontSize: size ?? typography.heading3.fontSize,
          fontWeight: typography.heading3.fontWeight,
          textShadowColor: glowColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: glowRadius,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0.5,
  },
});
