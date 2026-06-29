import React, { useLayoutEffect } from 'react';
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
import { DifficultyBadge } from '../components/DifficultyBadge';
import { colors, spacing, radius } from '../constants/theme';
import type { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProjectDetail'>;
  route: RouteProp<RootStackParamList, 'ProjectDetail'>;
};

export function ProjectDetailScreen({ navigation, route }: Props) {
  const { projects, isFavorite, toggleFavorite } = useApp();
  const project = projects.find((p) => p.id === route.params.projectId);

  useLayoutEffect(() => {
    if (project) {
      navigation.setOptions({ title: project.title });
    }
  }, [navigation, project]);

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
    const url = `https://www.youtube.com/watch?v=${project.youtubeVideoId}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero image */}
      <Image
        source={{ uri: project.image }}
        style={styles.hero}
        resizeMode="cover"
      />

      {/* Title + difficulty */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{project.title}</Text>
        <DifficultyBadge difficulty={project.difficulty} />
      </View>

      {/* Favorite button */}
      <TouchableOpacity
        style={styles.favBtn}
        onPress={() => toggleFavorite(project.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={20}
          color={favorited ? '#EF4444' : colors.primary}
        />
        <Text style={[styles.favText, favorited && styles.favTextActive]}>
          {favorited ? 'Saved to favorites' : 'Add to favorite'}
        </Text>
      </TouchableOpacity>

      <Divider />

      {/* How it works — YouTube */}
      {project.youtubeVideoId ? (
        <>
          <Section title="How it works">
            <TouchableOpacity style={styles.ytCard} onPress={openYouTube} activeOpacity={0.85}>
              <Image
                source={{
                  uri: `https://img.youtube.com/vi/${project.youtubeVideoId}/hqdefault.jpg`,
                }}
                style={styles.ytThumb}
                resizeMode="cover"
              />
              {/* Play overlay */}
              <View style={styles.playOverlay}>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={28} color="#fff" />
                </View>
              </View>
              {/* Info bar */}
              <View style={styles.ytInfo}>
                <View style={styles.ytAvatar}>
                  <Text style={styles.ytAvatarText}>
                    {(project.youtubeAuthor ?? 'U')[0].toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ytTitle} numberOfLines={2}>
                    {project.title}
                  </Text>
                  <Text style={styles.ytAuthor}>{project.youtubeAuthor}</Text>
                </View>
                <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              </View>
            </TouchableOpacity>
          </Section>
          <Divider />
        </>
      ) : null}

      {/* Description */}
      <Section title="Description">
        <Text style={styles.body}>{project.description}</Text>
      </Section>

      <Divider />

      {/* Step-by-step instructions */}
      <Section title="Step-by-step instructions">
        <Text style={styles.body}>{project.instructions}</Text>
      </Section>

      <Divider />

      {/* Wiring diagram */}
      {project.wiringDiagram ? (
        <>
          <Section title="Wiring diagram">
            <Image
              source={{ uri: project.wiringDiagram }}
              style={styles.wiringImage}
              resizeMode="contain"
            />
          </Section>
          <Divider />
        </>
      ) : null}

      {/* Arduino code */}
      <Section title="Arduino code">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.codeScroll}
        >
          <Text style={styles.code}>{project.arduinoCode}</Text>
        </ScrollView>
      </Section>

      {project.classCode ? (
        <View style={styles.classCodeBadge}>
          <Text style={styles.classCodeLabel}>Class code</Text>
          <Text style={styles.classCodeValue}>{project.classCode}</Text>
        </View>
      ) : null}

      <View style={{ height: spacing.xl * 2 }} />
    </ScrollView>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.card },
  content: {},
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16, color: colors.textSecondary },

  hero: {
    width: '100%',
    height: 280,
    backgroundColor: colors.inputBackground,
  },

  titleSection: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 32,
  },

  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  favText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  favTextActive: {
    color: '#EF4444',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  section: {
    padding: spacing.md,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },

  // YouTube card
  ytCard: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  ytThumb: {
    width: '100%',
    height: 200,
    backgroundColor: '#222',
  },
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
  ytAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  ytTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  ytAuthor: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },

  // Wiring
  wiringImage: {
    width: '100%',
    height: 260,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBackground,
  },

  // Code
  codeScroll: {
    backgroundColor: '#1E1E1E',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 13,
    color: '#D4D4D4',
    lineHeight: 20,
  },

  classCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#F0F9FF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  classCodeLabel: {
    fontSize: 14,
    color: '#0369A1',
    fontWeight: '500',
  },
  classCodeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369A1',
  },
});
