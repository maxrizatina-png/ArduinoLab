import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import type { Difficulty } from '../types';

const DOT_COLOR: Record<Difficulty, string> = {
  Easy: colors.easy,
  Medium: colors.medium,
  Advanced: colors.advanced,
};

interface Props {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

export function DifficultyBadge({ difficulty, size = 'md' }: Props) {
  const isSmall = size === 'sm';
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.dot,
          { backgroundColor: DOT_COLOR[difficulty] },
          isSmall && styles.dotSm,
        ]}
      />
      <Text style={[styles.label, isSmall && styles.labelSm]}>{difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotSm: { width: 9, height: 9, borderRadius: 5 },
  label: { fontSize: 15, color: colors.textSecondary },
  labelSm: { fontSize: 13 },
});
