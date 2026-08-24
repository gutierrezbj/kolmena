import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { api, uploadFiles } from '../src/lib/api';
import { useCommunity } from '../src/hooks/useCommunity';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';

const categories = [
  { key: 'plumbing', label: 'Fontaneria' },
  { key: 'electrical', label: 'Electricidad' },
  { key: 'elevator', label: 'Ascensor' },
  { key: 'structural', label: 'Estructura' },
  { key: 'cleaning', label: 'Limpieza' },
  { key: 'garden', label: 'Jardineria' },
  { key: 'security', label: 'Seguridad' },
  { key: 'other', label: 'Otros' },
];

const priorities = [
  { key: 'low', label: 'Baja', color: colors.info },
  { key: 'medium', label: 'Media', color: colors.warning },
  { key: 'high', label: 'Alta', color: '#FF5722' },
  { key: 'urgent', label: 'Urgente', color: colors.error },
];

export default function CreateIncidentScreen() {
  const router = useRouter();
  const { community } = useCommunity();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 5));
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la camara');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!community || !title.trim() || !description.trim()) {
      Alert.alert('Error', 'Titulo y descripcion son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      let imageUrls: string[] | undefined;
      if (images.length > 0) {
        imageUrls = await uploadFiles(images);
      }
      await api(`/fix/communities/${community.id}/incidents`, {
        method: 'POST',
        body: {
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
          ...(location.trim() && { location: location.trim() }),
          ...(imageUrls && { imageUrls }),
        },
      });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo crear la incidencia');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={typography.label}>Titulo *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Describe brevemente el problema" />

      <Text style={typography.label}>Descripcion *</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Detalla el problema" multiline numberOfLines={4} textAlignVertical="top" />

      <Text style={typography.label}>Categoria</Text>
      <View style={styles.chipRow}>
        {categories.map((c) => (
          <TouchableOpacity key={c.key} style={[styles.chip, category === c.key && styles.chipActive]} onPress={() => setCategory(c.key)}>
            <Text style={[styles.chipText, category === c.key && styles.chipTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={typography.label}>Prioridad</Text>
      <View style={styles.chipRow}>
        {priorities.map((p) => (
          <TouchableOpacity key={p.key} style={[styles.chip, priority === p.key && { backgroundColor: p.color }]} onPress={() => setPriority(p.key)}>
            <Text style={[styles.chipText, priority === p.key && { color: colors.white }]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={typography.label}>Ubicacion (opcional)</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ej: Portal 3, planta 2" />

      <Text style={typography.label}>Fotos (opcional, max 5)</Text>
      <View style={styles.imageSection}>
        {images.map((uri, i) => (
          <View key={uri} style={styles.imageThumb}>
            <Image source={{ uri }} style={styles.thumbImg} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(i)}>
              <Text style={styles.removeBtnText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        {images.length < 5 && (
          <View style={styles.addBtns}>
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
              <Text style={styles.addImageText}>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addImageBtn} onPress={takePhoto}>
              <Text style={styles.addImageText}>Camara</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitDisabled]} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>Reportar incidencia</Text>}
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
  textArea: { minHeight: 100 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.gray100 },
  chipActive: { backgroundColor: colors.honey },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.gray600 },
  chipTextActive: { color: colors.white },
  imageSection: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6, marginBottom: 16 },
  imageThumb: { width: 80, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  thumbImg: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(0,0,0,0.6)', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  addBtns: { flexDirection: 'row', gap: 8 },
  addImageBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.gray100, borderWidth: 1, borderColor: colors.gray200, borderStyle: 'dashed' },
  addImageText: { fontSize: 13, fontWeight: '500', color: colors.gray600 },
  submitBtn: { backgroundColor: colors.honey, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
