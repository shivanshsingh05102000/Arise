/**
 * StreakCounter
 * Fire emoji + animated streak count display.
 * Gold glow when streak >= 10.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { useTheme } from '../theme';

interface StreakCounterProps {
  /** Current streak in days. */
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  const { colors, typography, spacing } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isHot = streak >= 10;

  useEffect(() => {
    // Bounce animation on streak change
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  }, [streak, scaleAnim]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: spacing.borderRadius.full,
          borderColor: isHot ? colors.accentGold : colors.border,
        },
      ]}
    >
      <Text style={styles.fire}>🔥</Text>

      <Animated.Text
        style={[
          styles.count,
          {
            color: isHot ? colors.accentGold : colors.textPrimary,
            ...typography.heading4,
            transform: [{ scale: scaleAnim }],
            textShadowColor: isHot ? colors.accentGold : 'transparent',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isHot ? 10 : 0,
          },
        ]}
      >
        {streak}
      </Animated.Text>

      <Text
        style={[
          styles.label,
          { color: colors.textSecondary, ...typography.bodySmall },
        ]}
      >
        days
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 6,
  },
  fire: {
    fontSize: 20,
  },
  count: {},
  label: {
    marginLeft: 2,
  },
});
