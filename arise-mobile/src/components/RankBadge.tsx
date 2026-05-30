/**
 * RankBadge
 * Hunter rank display badge. S-rank gets a pulsing gold glow.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { useTheme } from '../theme';
import type { RankTier } from '../theme';

interface RankBadgeProps {
  /** Hunter rank tier. */
  rank: RankTier;
  /** Badge size variant. */
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { box: 32, font: 14 },
  md: { box: 48, font: 22 },
  lg: { box: 68, font: 34 },
} as const;

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  size = 'md',
}) => {
  const { colors, spacing } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const isSRank = rank === 'S';
  const rankColor = colors.rankColors[rank];
  const dim = SIZES[size];

  useEffect(() => {
    if (isSRank) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ).start();
    }
  }, [isSRank, pulseAnim]);

  const shadowOpacity = isSRank
    ? pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] })
    : 0;

  const shadowRadius = isSRank
    ? pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [4, 16] })
    : 0;

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          width: dim.box,
          height: dim.box,
          borderRadius: spacing.borderRadius.md,
          borderColor: rankColor,
          backgroundColor: colors.surface,
          shadowColor: isSRank ? colors.accentGold : 'transparent',
          shadowOpacity: shadowOpacity as unknown as number,
          shadowRadius: shadowRadius as unknown as number,
          shadowOffset: { width: 0, height: 0 },
          elevation: isSRank ? 8 : 2,
        },
      ]}
    >
      <Text
        style={[
          styles.letter,
          {
            fontSize: dim.font,
            color: rankColor,
            textShadowColor: rankColor,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isSRank ? 12 : 4,
          },
        ]}
      >
        {rank}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  letter: {
    fontWeight: '900',
    letterSpacing: 1,
  },
});
