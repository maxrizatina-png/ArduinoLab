import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';
import { useColors } from '../hooks/useColors';
import { ProjectCard } from '../components/ProjectCard';
import { AddProjectModal } from '../components/AddProjectModal';
import { spacing, radius } from '../constants/theme';
import type { RootStackParamList, MainTabParamList, Difficulty } from '../types';

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeNavProp;
}

const FILTERS: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Advanced'];

export function HomeScreen({ navigation }: Props) {
  const { projects } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [search, setSearch] = useState('');
  const [activeDiff, setActiveDiff] = useState<Difficulty | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(q);
      const matchDiff = activeDiff === 'All' || p.difficulty === activeDiff;
      return matchSearch && matchDiff;
    });
  }, [projects, search, activeDiff]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} hitSlop={10}>
          <Ionicons name="menu" size={26} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addBtn} hitSlop={4}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, showFilter && styles.filterBtnActive]}
          onPress={() => setShowFilter((v) => !v)}
          hitSlop={4}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={showFilter ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      {showFilter && (
        <View style={styles.chipRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeDiff === f && styles.chipActive]}
              onPress={() => setActiveDiff(f)}
            >
              <Text style={[styles.chipText, activeDiff === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No projects found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProjectCard
              project={item}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
            />
          </View>
        )}
      />

      <AddProjectModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      backgroundColor: colors.card,
    },
    addBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.inputBackground,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      height: 44,
    },
    searchInput: { flex: 1, fontSize: 15, color: colors.text },
    filterBtn: {
      width: 44,
      height: 44,
      borderRadius: radius.sm,
      backgroundColor: colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterBtnActive: { backgroundColor: colors.primary + '22' },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.full,
      backgroundColor: colors.inputBackground,
    },
    chipActive: { backgroundColor: colors.primary },
    chipText: { fontSize: 14, color: colors.text },
    chipTextActive: { color: '#fff' },
    grid: { padding: spacing.md, paddingTop: spacing.sm },
    row: { gap: spacing.md, marginBottom: spacing.md },
    empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: spacing.md },
    emptyText: { fontSize: 16, color: colors.textSecondary },
  });
}
