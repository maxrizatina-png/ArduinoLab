import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

type AvatarIcon = React.ComponentProps<typeof Ionicons>['name'];

const AVATAR_ICONS: AvatarIcon[] = [
  'person',
  'happy-outline',
  'star-outline',
  'rocket-outline',
  'code-slash-outline',
  'bulb-outline',
  'game-controller-outline',
  'heart-outline',
  'planet-outline',
  'leaf-outline',
  'flash-outline',
  'construct-outline',
];

const AVATAR_COLORS = [
  '#3B82F6',
  '#34C759',
  '#FF9500',
  '#FF3B30',
  '#AF52DE',
  '#FF2D55',
  '#5AC8FA',
  '#4B5563',
];

const AVATAR_ICON_KEY = '@arduinolab:avatar-icon';
const AVATAR_COLOR_KEY = '@arduinolab:avatar-color';

export function SettingsScreen({ navigation: _navigation }: Props) {
  const { submissions, themeMode, setThemeMode } = useApp();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [notifications, setNotifications] = useState(true);
  const [avatarIcon, setAvatarIcon] = useState<AvatarIcon>('person');
  const [avatarColor, setAvatarColor] = useState('#3B82F6');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([AVATAR_ICON_KEY, AVATAR_COLOR_KEY]).then(([[, icon], [, color]]) => {
      if (icon) setAvatarIcon(icon as AvatarIcon);
      if (color) setAvatarColor(color);
    });
  }, []);

  const saveIcon = (icon: AvatarIcon) => {
    setAvatarIcon(icon);
    AsyncStorage.setItem(AVATAR_ICON_KEY, icon);
  };

  const saveColor = (color: string) => {
    setAvatarColor(color);
    AsyncStorage.setItem(AVATAR_COLOR_KEY, color);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => setShowAvatarPicker(true)} activeOpacity={0.8}>
          <View style={styles.avatarWrap}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Ionicons name={avatarIcon} size={32} color="#fff" />
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={10} color="#fff" />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Arduino Maker</Text>
            <Text style={styles.profileEmail}>student@arduinolab.app</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

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

      {/* Avatar picker modal */}
      <AvatarPicker
        visible={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        selectedIcon={avatarIcon}
        selectedColor={avatarColor}
        onSelectIcon={saveIcon}
        onSelectColor={saveColor}
        colors={colors}
        styles={styles}
      />
    </>
  );
}

function AvatarPicker({
  visible, onClose, selectedIcon, selectedColor, onSelectIcon, onSelectColor, colors, styles,
}: {
  visible: boolean;
  onClose: () => void;
  selectedIcon: AvatarIcon;
  selectedColor: string;
  onSelectIcon: (icon: AvatarIcon) => void;
  onSelectColor: (color: string) => void;
  colors: Colors;
  styles: Styles;
}) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.pickerRoot, { backgroundColor: colors.card }]}>
        <View style={styles.pickerHandle} />
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerTitle}>Customize Avatar</Text>
          <TouchableOpacity onPress={onClose} style={styles.pickerClose} hitSlop={10}>
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Preview */}
        <View style={styles.pickerPreview}>
          <View style={[styles.pickerAvatarLarge, { backgroundColor: selectedColor }]}>
            <Ionicons name={selectedIcon} size={52} color="#fff" />
          </View>
        </View>

        {/* Color swatches */}
        <Text style={styles.pickerSectionLabel}>Color</Text>
        <View style={styles.colorRow}>
          {AVATAR_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.swatch, { backgroundColor: c }, selectedColor === c && styles.swatchSelected]}
              onPress={() => onSelectColor(c)}
            >
              {selectedColor === c && <Ionicons name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Icon grid */}
        <Text style={styles.pickerSectionLabel}>Icon</Text>
        <FlatList
          data={AVATAR_ICONS}
          keyExtractor={(item) => item}
          numColumns={4}
          scrollEnabled={false}
          contentContainerStyle={styles.iconGrid}
          renderItem={({ item }) => {
            const active = item === selectedIcon;
            return (
              <TouchableOpacity
                style={[styles.iconCell, active && { borderColor: selectedColor, borderWidth: 2 }]}
                onPress={() => onSelectIcon(item)}
                activeOpacity={0.7}
              >
                <Ionicons name={item} size={28} color={active ? selectedColor : colors.text} />
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity style={[styles.pickerDone, { backgroundColor: selectedColor }]} onPress={onClose}>
          <Text style={styles.pickerDoneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
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

    // Profile card
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      marginBottom: spacing.sm,
    },
    avatarWrap: { position: 'relative' },
    avatar: {
      width: 60, height: 60, borderRadius: 30,
      alignItems: 'center', justifyContent: 'center',
    },
    editBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.card,
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

    // Avatar picker
    pickerRoot: { flex: 1 },
    pickerHandle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginTop: spacing.sm, marginBottom: spacing.sm,
    },
    pickerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    pickerTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    pickerClose: {
      position: 'absolute',
      right: spacing.md,
      width: 30, height: 30, borderRadius: 15,
      backgroundColor: colors.inputBackground,
      alignItems: 'center', justifyContent: 'center',
    },
    pickerPreview: { alignItems: 'center', paddingVertical: spacing.lg },
    pickerAvatarLarge: {
      width: 96, height: 96, borderRadius: 48,
      alignItems: 'center', justifyContent: 'center',
    },
    pickerSectionLabel: {
      fontSize: 13, fontWeight: '600', color: colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: 0.5,
      marginHorizontal: spacing.md, marginBottom: spacing.sm,
    },
    colorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    swatch: {
      width: 40, height: 40, borderRadius: 20,
      alignItems: 'center', justifyContent: 'center',
    },
    swatchSelected: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    iconGrid: { paddingHorizontal: spacing.md },
    iconCell: {
      flex: 1,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      margin: spacing.xs,
      borderRadius: radius.sm,
      backgroundColor: colors.inputBackground,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    pickerDone: {
      margin: spacing.md,
      height: 50,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pickerDoneText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  });
}
