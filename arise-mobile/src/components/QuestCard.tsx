/**
 * QuestCard
 * Daily quest card with category label, exercise name, target badge,
 * and status indicator.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

type QuestStatus = 'pending' | 'active' | 'completed' | 'failed';

interface QuestCardProps {
  /** Quest category (e.g. "STRENGTH", "ENDURANCE"). */
  category: string;
  /** Name of the exercise. */
  exerciseName: string;
  /** Target display string, e.g. "3×15". */
  targetDisplay: string;
  /** Current quest status. */
  status: QuestStatus;
  /** Press handler. */
  onPress?: () => void;
}

const STATUS_ICONS: Record<QuestStatus, string> = {
  pending: '●',
  active: '▶',
  completed: '✓',
  failed: '✗',
};

export const QuestCard: React.FC<QuestCardProps> = ({
  category,
  exerciseName,
  targetDisplay,
  status,
  onPress,
}) => {
  const { colors, typography, spacing } = useTheme();

  const statusColorMap: Record<QuestStatus, string> = {
    pending: colors.accentGold,
    active: colors.primary,
    completed: colors.accentGreen,
    failed: colors.accentRed,
  };

  const borderColor = statusColorMap[status];
  const statusColor = statusColorMap[status];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed
            ? colors.surfaceElevated
            : colors.surface,
          borderColor,
          borderRadius: spacing.borderRadius.lg,
        },
      ]}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.category,
            {
              color: colors.accentGold,
              ...typography.caption,
            },
          ]}
        >
          {category}
        </Text>

        <Text
          style={[
            styles.statusIcon,
            { color: statusColor, fontSize: status === 'pending' ? 10 : 16 },
          ]}
        >
          {STATUS_ICONS[status]}
        </Text>
      </View>

      {/* Exercise name */}
      <Text
        style={[
          styles.exerciseName,
          { color: colors.textPrimary, ...typography.heading4 },
        ]}
        numberOfLines={1}
      >
        {exerciseName}
      </Text>

      {/* Target pill */}
      <View
        style={[
          styles.targetPill,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: spacing.borderRadius.full,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.targetText,
            { color: colors.textSecondary, ...typography.mono },
          ]}
        >
          {targetDisplay}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {},
  statusIcon: {
    fontWeight: '900',
  },
  exerciseName: {
    marginBottom: 12,
  },
  targetPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  targetText: {},
});
