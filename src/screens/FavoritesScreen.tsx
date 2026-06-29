import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ProjectCard';
import { colors, spacing } from '../constants/theme';
import type { RootStackParamList, MainTabParamList } from '../types';

type FavNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'FavoritesTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: FavNavProp;
}

export function FavoritesScreen({ navigation }: Props) {
  const { projects, favorites } = useApp();
  const favoriteProjects = projects.filter((p) => favorites.includes(p.id));

  if (favoriteProjects.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the heart on any project to save it here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteProjects}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background },
  grid: { padding: spacing.md },
  row: { gap: spacing.md, marginBottom: spacing.md },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
