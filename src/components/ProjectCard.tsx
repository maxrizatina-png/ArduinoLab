import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { DifficultyBadge } from './DifficultyBadge';
import type { Project } from '../types';

interface Props {
  project: Project;
  onPress: () => void;
}

export function ProjectCard({ project, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: project.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {project.title}
        </Text>
        <DifficultyBadge difficulty={project.difficulty} size="sm" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1.15,
    backgroundColor: colors.inputBackground,
  },
  body: {
    padding: spacing.sm,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
  },
});
