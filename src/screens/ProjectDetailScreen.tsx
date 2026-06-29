import React, { useLayoutEffect, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useColors } from '../hooks/useColors';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { spacing, radius } from '../constants/theme';
import type { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProjectDetail'>;
  route: RouteProp<RootStackParamList, 'ProjectDetail'>;
};

export function ProjectDetailScreen({ navigation, route }: Props) {
  const { projects, isFavorite, toggleFavorite } = useApp();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const project = projects.find((p) => p.id === route.params.projectId);

  useLayoutEffect(() => {
    if (project) {
      navigation.setOptions({
        title: project.title,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
      });
    }
  }, [navigation, project, colors]);

  if (!project) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Project not found.</Text>
      </View>
    );
  }

  const favorited = isFavorite(project.id);

  const openYouTube = () => {
    if (!project.youtubeVideoId) return;
    Linking.openURL(`https://www.youtube.com/watch?v=${project.youtubeVideoId}`).catch(() => {});
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: project.image }} style={styles.hero} resizeMode="cover" />

      <View style={styles.titleSection}>
        <Text style={styles.title}>{project.title}</Text>
        <DifficultyBadge difficulty={project.difficulty} />
      </View>

      <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(project.id)} activeOpacity={0.7}>
        <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={20} color={favorited ? '#EF4444' : colors.primary} />
        <Text style={[styles.favText, favorited && styles.favTextActive]}>
          {favorited ? 'Saved to favorites' : 'Add to favorite'}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {project.youtubeVideoId ? (
        <>
          <Section title="How it works" styles={styles}>
            <TouchableOpacity style={styles.ytCard} onPress={openYouTube} activeOpacity={0.85}>
              <Image
                source={{ uri: `https://img.youtube.com/vi/${project.youtubeVideoId}/hqdefault.jpg` }}
                style={styles.ytThumb}
                resizeMode="cover"
              />
              <View style={styles.playOverlay}>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={28} color="#fff" />
                </View>
              </View>
              <View style={styles.ytInfo}>
                <View style={styles.ytAvatar}>
                  <Text style={styles.ytAvatarText}>{(project.youtubeAuthor ?? 'U')[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ytTitle} numberOfLines={2}>{project.title}</Text>
                  <Text style={styles.ytAuthor}>{project.youtubeAuthor}</Text>
                </View>
                <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              </View>
            </TouchableOpacity>
          </Section>
          <View style={styles.divider} />
        </>
      ) : null}

      <Section title="Description" styles={styles}>
        <Text style={styles.body}>{project.description}</Text>
      </Section>
      <View style={styles.divider} />

      <Section title="Step-by-step instructions" styles={styles}>
        <Text style={styles.body}>{project.instructions}</Text>
      </Section>
      <View style={styles.divider} />

      {project.wiringDiagram ? (
        <>
          <Section title="Wiring diagram" styles={styles}>
            <Image source={{ uri: project.wiringDiagram }} style={styles.wiringImage} resizeMode="contain" />
          </Section>
          <View style={styles.divider} />
        </>
      ) : null}

      <Section title="Arduino code" styles={styles}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codeScroll}>
          <Text style={styles.code}>{project.arduinoCode}</Text>
        </ScrollView>
      </Section>

      <View style={{ height: spacing.xl * 2 }} />
    </ScrollView>
  );
}

function Section({ title, children, styles }: { title: string; children: React.ReactNode; styles: ReturnType<typeof makeStyles> }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    scroll: { flex: 1, backgroundColor: colors.card },
    content: {},
    notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    notFoundText: { fontSize: 16, color: colors.textSecondary },
    hero: { width: '100%', height: 280, backgroundColor: colors.inputBackground },
    titleSection: { padding: spacing.md, gap: spacing.sm },
    title: { fontSize: 26, fontWeight: '700', color: colors.text, lineHeight: 32 },
    favBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
    },
    favText: { fontSize: 16, color: colors.primary, fontWeight: '500' },
    favTextActive: { color: '#EF4444' },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.sm },
    section: { padding: spacing.md, gap: spacing.md },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
    body: { fontSize: 15, color: colors.text, lineHeight: 22 },
    ytCard: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: '#111' },
    ytThumb: { width: '100%', height: 200, backgroundColor: '#222' },
    playOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(0,0,0,0.65)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ytInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: '#1a1a1a',
    },
    ytAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ytAvatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    ytTitle: { color: '#fff', fontSize: 13, fontWeight: '600' },
    ytAuthor: { color: '#aaa', fontSize: 12, marginTop: 2 },
    wiringImage: {
      width: '100%',
      height: 260,
      borderRadius: radius.sm,
      backgroundColor: colors.inputBackground,
    },
    codeScroll: { backgroundColor: '#1E1E1E', borderRadius: radius.sm, padding: spacing.md },
    code: {
      fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
      fontSize: 13,
      color: '#D4D4D4',
      lineHeight: 20,
    },
  });
}
