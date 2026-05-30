/**
 * RepCounter
 * Rep input with circular +/– buttons for quest completion tracking.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface RepCounterProps {
  /** Current rep count. */
  value: number;
  /** Called when the value changes. */
  onChange: (newValue: number) => void;
  /** Minimum allowed value. Default 0. */
  min?: number;
  /** Maximum allowed value. Default 999. */
  max?: number;
  /** Label displayed above the counter. */
  label?: string;
}

export const RepCounter: React.FC<RepCounterProps> = ({
  value,
  onChange,
  min = 0,
  max = 999,
  label,
}) => {
  const { colors, typography, spacing } = useTheme();

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={styles.wrapper}>
      {label != null && (
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary, ...typography.caption },
          ]}
        >
          {label}
        </Text>
      )}

      <View style={styles.row}>
        {/* Minus button */}
        <Pressable
          onPress={decrement}
          disabled={!canDecrement}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed
                ? colors.primaryGlow
                : colors.primary,
              opacity: canDecrement ? 1 : 0.3,
              borderRadius: spacing.borderRadius.full,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            −
          </Text>
        </Pressable>

        {/* Value display */}
        <View
          style={[
            styles.valueContainer,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              borderRadius: spacing.borderRadius.md,
            },
          ]}
        >
          <Text
            style={[
              styles.value,
              {
                color: colors.textPrimary,
                ...typography.heading2,
                fontFamily: typography.mono.fontFamily,
              },
            ]}
          >
            {value}
          </Text>
        </View>

        {/* Plus button */}
        <Pressable
          onPress={increment}
          disabled={!canIncrement}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed
                ? colors.primaryGlow
                : colors.primary,
              opacity: canIncrement ? 1 : 0.3,
              borderRadius: spacing.borderRadius.full,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 28,
  },
  valueContainer: {
    minWidth: 100,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  value: {
    textAlign: 'center',
  },
});
