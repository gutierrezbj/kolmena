import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../src/lib/api';
import { useCommunity } from '../src/hooks/useCommunity';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';

const postTypes = [
  { key: 'general', label: 'General' },
  { key: 'announcement', label: 'Anuncio' },
  { key: 'event', label: 'Evento' },
];

export default function CreatePostScreen() {
  const router = useRouter();
  const { community } = useCommunity();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!community || !title.trim() || !body.trim()) {
      Alert.alert('Error', 'Titulo y contenido son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      await api(`/social/communities/${community.id}/posts`, {
        method: 'POST',
        body: {
          title: title.trim(),
          body: body.trim(),
          type,
        },
      });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo crear el post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={typography.label}>Tipo</Text>
      <View style={styles.chipRow}>
        {postTypes.map((t) => (
          <TouchableOpacity key={t.key} style={[styles.chip, type === t.key && styles.chipActive]} onPress={() => setType(t.key)}>
            <Text style={[styles.chipText, type === t.key && styles.chipTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={typography.label}>Titulo *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titulo del post" />

      <Text style={typography.label}>Contenido *</Text>
      <TextInput style={[styles.input, styles.textArea]} value={body} onChangeText={setBody} placeholder="Escribe tu mensaje..." multiline numberOfLines={6} textAlignVertical="top" />

      <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitDisabled]} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>Publicar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.gray900,
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  textArea: { minHeight: 140 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.gray100 },
  chipActive: { backgroundColor: colors.honey },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.gray600 },
  chipTextActive: { color: colors.white },
  submitBtn: { backgroundColor: colors.honey, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
