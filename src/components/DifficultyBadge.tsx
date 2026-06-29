import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';
import type { Difficulty } from '../types';

interface Props {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

export function DifficultyBadge({ difficulty, size = 'md' }: Props) {
  const colors = useColors();
  const isSmall = size === 'sm';

  const dotColor: Record<Difficulty, string> = {
    Easy: colors.easy,
    Medium: colors.medium,
    Advanced: colors.advanced,
  };

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: dotColor[difficulty] }, isSmall && styles.dotSm]} />
      <Text style={[styles.label, { color: colors.textSecondary }, isSmall && styles.labelSm]}>
        {difficulty}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotSm: { width: 9, height: 9, borderRadius: 5 },
  label: { fontSize: 15 },
  labelSm: { fontSize: 13 },
});
