import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { useColors } from '../hooks/useColors';
import { spacing, radius } from '../constants/theme';
import type { RootStackParamList, Difficulty } from '../types';
import type { ThemeMode } from '../constants/theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
}

const STATUS_COLOR: Record<'pending' | 'approved' | 'rejected', string> = {
  pending: '#F59E0B',
  approved: '#34C759',
  rejected: '#FF3B30',
};

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: '#34C759',
  Medium: '#FF9500',
  Advanced: '#FF3B30',
};

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { mode: 'light', label: 'Bright', icon: 'sunny-outline' },
  { mode: 'dark',  label: 'Dark',   icon: 'moon-outline'  },
];

export function SettingsScreen({ navigation: _navigation }: Props) {
  const { submissions, themeMode, setThemeMode } = useApp();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [notifications, setNotifications] = React.useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>Arduino Maker</Text>
          <Text style={styles.profileEmail}>student@arduinolab.app</Text>
        </View>
      </View>

      {/* Theme */}
      <SectionHeader title="Appearance" styles={styles} />
      <View style={styles.group}>
        <View style={styles.themeRow}>
          <Ionicons name="color-palette-outline" size={22} color={colors.text} />
          <Text style={styles.rowLabel}>Theme</Text>
        </View>
        <View style={styles.themeOptions}>
          {THEME_OPTIONS.map(({ mode, label, icon }) => {
            const active = themeMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.themeBtn, active && styles.themeBtnActive]}
                onPress={() => setThemeMode(mode)}
                activeOpacity={0.7}
              >
                <Ionicons name={icon} size={22} color={active ? '#fff' : colors.text} />
                <Text style={[styles.themeBtnText, active && styles.themeBtnTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* General */}
      <SectionHeader title="General" styles={styles} />
      <View style={styles.group}>
        <RowToggle
          icon="notifications-outline"
          label="Notifications"
          value={notifications}
          onValueChange={setNotifications}
          colors={colors}
          styles={styles}
        />
        <Separator styles={styles} />
        <RowAction
          icon="information-circle-outline"
          label="About ArduinoLab"
          onPress={() =>
            Alert.alert('ArduinoLab', 'An open community of Arduino projects. Build, share, and learn together.')
          }
          colors={colors}
          styles={styles}
        />
      </View>

      {/* My submissions */}
      <SectionHeader title="My Submissions" styles={styles} />
      {submissions.length === 0 ? (
        <View style={styles.noSubs}>
          <Text style={styles.noSubsText}>
            You haven't submitted any projects yet. Tap the + button on the home screen to share one!
          </Text>
        </View>
      ) : (
        <View style={styles.group}>
          {submissions.map((sub, idx) => (
            <React.Fragment key={sub.id}>
              {idx > 0 && <Separator styles={styles} />}
              <View style={styles.subRow}>
                <View style={[styles.diffDot, { backgroundColor: DIFF_COLOR[sub.difficulty] }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.subTitle} numberOfLines={1}>{sub.title}</Text>
                  <Text style={styles.subDate}>{new Date(sub.submittedAt).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[sub.status] + '22' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLOR[sub.status] }]}>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>
      )}

      {/* Account */}
      <SectionHeader title="Account" styles={styles} />
      <View style={styles.group}>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xl * 2 }} />
    </ScrollView>
  );
}

type Colors = ReturnType<typeof useColors>;
type Styles = ReturnType<typeof makeStyles>;

function SectionHeader({ title, styles }: { title: string; styles: Styles }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function Separator({ styles }: { styles: Styles }) {
  return <View style={styles.separator} />;
}

function RowAction({ icon, label, onPress, colors, styles }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  colors: Colors;
  styles: Styles;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function RowToggle({ icon, label, value, onValueChange, colors, styles }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  colors: Colors;
  styles: Styles;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary }} thumbColor="#fff" />
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    scroll: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, gap: spacing.sm },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      marginBottom: spacing.sm,
    },
    avatar: {
      width: 60, height: 60, borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
    },
    profileName: { fontSize: 17, fontWeight: '700', color: colors.text },
    profileEmail: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
    sectionHeader: {
      fontSize: 13, fontWeight: '600', color: colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: 0.5,
      paddingHorizontal: spacing.xs, paddingTop: spacing.md, paddingBottom: spacing.xs,
    },
    group: { backgroundColor: colors.card, borderRadius: radius.md, overflow: 'hidden' },
    separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
    row: {
      flexDirection: 'row', alignItems: 'center',
      gap: spacing.md, padding: spacing.md,
    },
    rowLabel: { flex: 1, fontSize: 15, color: colors.text },

    // Theme picker
    themeRow: {
      flexDirection: 'row', alignItems: 'center',
      gap: spacing.md, padding: spacing.md, paddingBottom: spacing.sm,
    },
    themeOptions: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    themeBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm + 2,
      borderRadius: radius.sm,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
    },
    themeBtnActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    themeBtnText: { fontSize: 15, fontWeight: '600', color: colors.text },
    themeBtnTextActive: { color: '#fff' },

    // Submissions
    noSubs: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md },
    noSubsText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    subRow: {
      flexDirection: 'row', alignItems: 'center',
      gap: spacing.md, padding: spacing.md,
    },
    diffDot: { width: 10, height: 10, borderRadius: 5 },
    subTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
    subDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full },
    statusText: { fontSize: 12, fontWeight: '600' },

    // Sign out
    signOutBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
    signOutText: { fontSize: 15, color: '#FF3B30', fontWeight: '500' },
  });
}
