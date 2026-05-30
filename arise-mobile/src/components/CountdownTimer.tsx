/**
 * CountdownTimer
 * 24-hour countdown showing HH:MM:SS remaining until a deadline.
 * Turns red when < 1 hour remains. Calls onExpired when time is up.
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface CountdownTimerProps {
  /** Unix timestamp (ms) of the deadline. */
  deadlineTimestamp: number;
  /** Called once when the countdown reaches zero. */
  onExpired?: () => void;
}

const pad = (n: number): string => n.toString().padStart(2, '0');

const formatRemaining = (
  ms: number,
): { hours: string; minutes: string; seconds: string } => {
  if (ms <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return {
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  deadlineTimestamp,
  onExpired,
}) => {
  const { colors, typography, spacing } = useTheme();
  const [remaining, setRemaining] = useState(
    deadlineTimestamp - Date.now(),
  );
  const expiredRef = useRef(false);

  const tick = useCallback(() => {
    const diff = deadlineTimestamp - Date.now();
    setRemaining(diff);
    if (diff <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpired?.();
    }
  }, [deadlineTimestamp, onExpired]);

  useEffect(() => {
    expiredRef.current = false;
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const isUrgent = remaining > 0 && remaining < 3600000; // < 1 hour
  const isExpired = remaining <= 0;
  const { hours, minutes, seconds } = formatRemaining(remaining);

  const timeColor = isExpired
    ? colors.accentRed
    : isUrgent
      ? colors.accentRed
      : colors.textPrimary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: spacing.borderRadius.md,
          borderColor: isUrgent || isExpired ? colors.accentRed : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary, ...typography.caption },
        ]}
      >
        {isExpired ? 'EXPIRED' : 'TIME REMAINING'}
      </Text>

      <View style={styles.timeRow}>
        <Text
          style={[
            styles.digit,
            {
              color: timeColor,
              fontFamily: typography.mono.fontFamily,
              textShadowColor: isUrgent ? colors.accentRed : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: isUrgent ? 8 : 0,
            },
          ]}
        >
          {hours}
        </Text>
        <Text style={[styles.separator, { color: colors.textMuted }]}>:</Text>
        <Text
          style={[
            styles.digit,
            {
              color: timeColor,
              fontFamily: typography.mono.fontFamily,
            },
          ]}
        >
          {minutes}
        </Text>
        <Text style={[styles.separator, { color: colors.textMuted }]}>:</Text>
        <Text
          style={[
            styles.digit,
            {
              color: timeColor,
              fontFamily: typography.mono.fontFamily,
            },
          ]}
        >
          {seconds}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
  },
  label: {
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  digit: {
    fontSize: 36,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'center',
  },
  separator: {
    fontSize: 36,
    fontWeight: '300',
    marginHorizontal: 2,
  },
});
