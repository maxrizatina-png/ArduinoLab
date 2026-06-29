import React from 'react';
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
import { colors, spacing, radius } from '../constants/theme';
import type { RootStackParamList } from '../types';
import type { Difficulty } from '../types';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
}

const STATUS_COLOR: Record<'pending' | 'approved' | 'rejected', string> = {
  pending: '#F59E0B',
  approved: colors.easy,
  rejected: colors.advanced,
};

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: colors.easy,
  Medium: colors.medium,
  Advanced: colors.advanced,
};

export function SettingsScreen({ navigation }: Props) {
  const { submissions } = useApp();
  const [notifications, setNotifications] = React.useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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

      {/* General */}
      <SectionHeader title="General" />
      <View style={styles.group}>
        <RowToggle
          icon="notifications-outline"
          label="Notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
        <Separator />
        <RowAction
          icon="information-circle-outline"
          label="About ArduinoLab"
          onPress={() =>
            Alert.alert(
              'ArduinoLab',
              'An open community of Arduino projects. Build, share, and learn together.',
            )
          }
        />
      </View>

      {/* My submissions */}
      <SectionHeader title="My Submissions" />
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
              {idx > 0 && <Separator />}
              <View style={styles.subRow}>
                <View
                  style={[
                    styles.diffDot,
                    { backgroundColor: DIFF_COLOR[sub.difficulty] },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.subTitle} numberOfLines={1}>
                    {sub.title}
                  </Text>
                  <Text style={styles.subDate}>
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLOR[sub.status] + '22' },
                  ]}
                >
                  <Text
                    style={[styles.statusText, { color: STATUS_COLOR[sub.status] }]}
                  >
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>
      )}

      {/* Danger zone */}
      <SectionHeader title="Account" />
      <View style={styles.group}>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={colors.advanced} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xl * 2 }} />
    </ScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function Separator() {
  return (
    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
  );
}

function RowAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function RowToggle({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },

  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  group: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },

  noSubs: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noSubsText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  diffDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  subDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  signOutText: {
    fontSize: 15,
    color: colors.advanced,
    fontWeight: '500',
  },
});
