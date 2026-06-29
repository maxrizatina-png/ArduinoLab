import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { spacing, radius } from '../constants/theme';
import { useColors } from '../hooks/useColors';
import { DifficultyBadge } from './DifficultyBadge';
import { useApp } from '../context/AppContext';
import type { Difficulty } from '../types';

const DIFFICULTIES: Difficulty[] = ['Medium', 'Advanced', 'Easy'];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function AddProjectModal({ visible, onClose }: Props) {
  const { addSubmission } = useApp();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [wiringUri, setWiringUri] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const pickImage = async (setter: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) setter(result.assets[0].uri);
  };

  const isValid =
    !!imageUri &&
    title.trim().length > 0 &&
    !!difficulty &&
    description.trim().length > 0 &&
    instructions.trim().length > 0 &&
    code.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid || !difficulty) return;
    addSubmission({
      title: title.trim(),
      difficulty,
      description: description.trim(),
      instructions: instructions.trim(),
      arduinoCode: code.trim(),
      imageUri: imageUri ?? undefined,
      wiringDiagramUri: wiringUri ?? undefined,
    });
    Alert.alert(
      'Project submitted!',
      'You have to wait until the project is approved to see it on the Home menu.',
      [{ text: 'OK', onPress: reset }],
    );
  };

  const reset = () => {
    setImageUri(null);
    setTitle('');
    setDifficulty(null);
    setDescription('');
    setInstructions('');
    setWiringUri(null);
    setCode('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={reset}>
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: colors.card }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Drag handle */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add a project</Text>
          <TouchableOpacity onPress={reset} style={styles.closeBtn} hitSlop={10}>
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Info banner */}
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              You have to wait until the project is approved to see it on the Home menu.
            </Text>
          </View>

          {/* Project Image */}
          <FieldLabel label="Project Image" required styles={styles} />
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setImageUri)}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.pickedImage} />
            ) : (
              <View style={styles.imagePickerInner}>
                <Ionicons name="image-outline" size={22} color={colors.textSecondary} />
                <Text style={styles.imagePickerText}>Choose an image...</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Project Title */}
          <FieldLabel label="Project Title" required styles={styles} />
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
            placeholderTextColor={colors.textSecondary}
          />

          {/* Difficulty */}
          <FieldLabel label="Difficulty Level" required styles={styles} />
          {DIFFICULTIES.map((d) => (
            <TouchableOpacity
              key={d}
              style={styles.radioRow}
              onPress={() => setDifficulty(d)}
              activeOpacity={0.7}
            >
              <View style={[styles.radioOuter, difficulty === d && styles.radioSelected]}>
                {difficulty === d && <View style={styles.radioInner} />}
              </View>
              <DifficultyBadge difficulty={d} />
            </TouchableOpacity>
          ))}

          {/* Description */}
          <FieldLabel label="Description" required styles={styles} />
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />

          {/* Instructions */}
          <FieldLabel label="Step-by-Step Instructions" required styles={styles} />
          <TextInput
            style={[styles.input, styles.multiline]}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />

          {/* Wiring Diagram */}
          <Text style={styles.label}>Wiring Diagram</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setWiringUri)}>
            {wiringUri ? (
              <Image source={{ uri: wiringUri }} style={styles.pickedImage} />
            ) : (
              <View style={styles.imagePickerInner}>
                <Ionicons name="image-outline" size={22} color={colors.textSecondary} />
                <Text style={styles.imagePickerText}>Choose an image...</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Arduino Code */}
          <FieldLabel label="Arduino Code" required styles={styles} />
          <TextInput
            style={[styles.input, styles.multiline, { marginBottom: spacing.xl }]}
            value={code}
            onChangeText={setCode}
            multiline
            textAlignVertical="top"
            autoCorrect={false}
            autoCapitalize="none"
            placeholderTextColor={colors.textSecondary}
          />
        </ScrollView>

        {/* Footer buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitBtn, !isValid && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type Styles = ReturnType<typeof makeStyles>;

function FieldLabel({ label, required, styles }: { label: string; required?: boolean; styles: Styles }) {
  return (
    <View style={styles.fieldHeader}>
      <Text style={styles.label}>{label}</Text>
      {required && <Text style={styles.requiredText}>Required</Text>}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1 },
    handleBar: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    closeBtn: {
      position: 'absolute',
      right: spacing.md,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: { padding: spacing.md, gap: spacing.sm },
    banner: {
      backgroundColor: colors.primary + '18',
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    bannerText: { fontSize: 14, color: colors.primary, lineHeight: 20 },
    fieldHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    label: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: spacing.sm },
    requiredText: { fontSize: 13, color: colors.textSecondary },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.inputBackground,
      minHeight: 44,
    },
    multiline: { minHeight: 80, paddingTop: spacing.sm },
    imagePicker: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      overflow: 'hidden',
      minHeight: 48,
    },
    imagePickerInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
    },
    imagePickerText: { fontSize: 15, color: colors.textSecondary },
    pickedImage: { width: '100%', height: 180, resizeMode: 'cover' },
    radioRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: { borderColor: colors.primary },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
    footer: {
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.md,
      paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    cancelBtn: {
      flex: 1,
      height: 48,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelText: { fontSize: 16, fontWeight: '600', color: colors.text },
    submitBtn: {
      flex: 1,
      height: 48,
      borderRadius: radius.sm,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitDisabled: { backgroundColor: colors.primary + '60' },
    submitText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  });
}
