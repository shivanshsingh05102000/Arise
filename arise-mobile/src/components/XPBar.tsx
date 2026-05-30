/**
 * XPBar
 * Animated progress bar showing XP towards the next hunter level.
 * Gold fill with a subtle purple glow.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface XPBarProps {
  /** Current XP earned in this level. */
  currentXP: number;
  /** XP required to reach the next level. */
  requiredXP: number;
  /** Current hunter level. */
  level: number;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  requiredXP,
  level,
}) => {
  const { colors, typography, spacing } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const progress = requiredXP > 0 ? Math.min(currentXP / requiredXP, 1) : 0;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const fillWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Labels */}
      <View style={styles.labelRow}>
        <Text
          style={[
            styles.levelLabel,
            { color: colors.accentGold, ...typography.caption },
          ]}
        >
          LEVEL {level}
        </Text>
        <Text
          style={[
            styles.xpLabel,
            { color: colors.textSecondary, ...typography.bodySmall },
          ]}
        >
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </Text>
      </View>

      {/* Track */}
      <View
        style={[
          styles.track,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: spacing.borderRadius.full,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Fill */}
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
              backgroundColor: colors.accentGold,
              borderRadius: spacing.borderRadius.full,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelLabel: {},
  xpLabel: {},
  track: {
    height: 10,
    overflow: 'hidden',
    borderWidth: 1,
  },
  fill: {
    height: '100%',
  },
});
