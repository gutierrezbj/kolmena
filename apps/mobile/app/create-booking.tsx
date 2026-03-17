import { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../src/lib/api';
import { useCommunity } from '../src/hooks/useCommunity';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';

type Space = {
  id: string;
  name: string;
  maxCapacity: number | null;
};

export default function CreateBookingScreen() {
  const router = useRouter();
  const { community } = useCommunity();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSpaces = useCallback(async () => {
    if (!community) return;
    try {
      const res = await api<{ spaces: Space[] }>(`/spaces/communities/${community.id}/spaces`);
      setSpaces(res.spaces);
      if (res.spaces.length > 0) setSelectedSpace(res.spaces[0].id);
    } catch { /* silent */ }
  }, [community]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const handleSubmit = async () => {
    if (!community || !selectedSpace || !date || !startTime || !endTime) {
      Alert.alert('Error', 'Selecciona espacio, fecha y horario');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!dateRegex.test(date) || !timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      Alert.alert('Error', 'Formato: fecha YYYY-MM-DD, hora HH:MM');
      return;
    }

    setSubmitting(true);
    try {
      await api(`/spaces/communities/${community.id}/bookings`, {
        method: 'POST',
        body: {
          spaceId: selectedSpace,
          startsAt: `${date}T${startTime}:00.000Z`,
          endsAt: `${date}T${endTime}:00.000Z`,
          ...(note.trim() && { note: note.trim() }),
        },
      });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo crear la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={typography.label}>Espacio *</Text>
      <View style={styles.chipRow}>
        {spaces.map((s) => (
          <TouchableOpacity key={s.id} style={[styles.chip, selectedSpace === s.id && styles.chipActive]} onPress={() => setSelectedSpace(s.id)}>
            <Text style={[styles.chipText, selectedSpace === s.id && styles.chipTextActive]}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {spaces.length === 0 && <Text style={styles.hint}>No hay espacios disponibles</Text>}

      <Text style={typography.label}>Fecha * (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-03-20" keyboardType="numbers-and-punctuation" />

      <Text style={typography.label}>Hora inicio * (HH:MM)</Text>
      <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} placeholder="10:00" keyboardType="numbers-and-punctuation" />

      <Text style={typography.label}>Hora fin * (HH:MM)</Text>
      <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} placeholder="12:00" keyboardType="numbers-and-punctuation" />

      <Text style={typography.label}>Nota (opcional)</Text>
      <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="Ej: Reunion de vecinos" />

      <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitDisabled]} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>Reservar</Text>}
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.gray100 },
  chipActive: { backgroundColor: colors.honey },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.gray600 },
  chipTextActive: { color: colors.white },
  hint: { ...typography.bodySmall, color: colors.gray500, marginBottom: 16 },
  submitBtn: { backgroundColor: colors.honey, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
