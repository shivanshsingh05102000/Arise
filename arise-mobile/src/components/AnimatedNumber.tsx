/**
 * AnimatedNumber
 * A number that animates (counts up/down) when its value changes.
 * Uses the React Native Animated API to interpolate smoothly.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Text, Animated, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme';

interface AnimatedNumberProps {
  /** The target numeric value. */
  value: number;
  /** Animation duration in ms. Default 500. */
  duration?: number;
  /** String prepended to the number, e.g. "$". */
  prefix?: string;
  /** String appended to the number, e.g. " XP". */
  suffix?: string;
  /** Additional text styles. */
  style?: StyleProp<TextStyle>;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 500,
  prefix = '',
  suffix = '',
  style,
}) => {
  const { colors, typography } = useTheme();
  const animatedValue = useRef(new Animated.Value(value)).current;
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v));
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, duration, animatedValue]);

  return (
    <Text
      style={[
        styles.text,
        {
          color: colors.textPrimary,
          ...typography.heading3,
          fontFamily: typography.mono.fontFamily,
        },
        style,
      ]}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
