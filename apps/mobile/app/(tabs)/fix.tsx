import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { useCommunity } from '../../src/hooks/useCommunity';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

type Incident = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: string | null;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  open: 'Abierta',
  assigned: 'Asignada',
  in_progress: 'En curso',
  waiting_parts: 'Esperando material',
  resolved: 'Resuelta',
  closed: 'Cerrada',
};

const priorityColors: Record<string, string> = {
  low: colors.info,
  medium: colors.warning,
  high: '#FF5722',
  urgent: colors.error,
};

const categoryLabels: Record<string, string> = {
  plumbing: 'Fontaneria',
  electrical: 'Electricidad',
  elevator: 'Ascensor',
  structural: 'Estructura',
  cleaning: 'Limpieza',
  garden: 'Jardineria',
  security: 'Seguridad',
  other: 'Otros',
};

export default function FixScreen() {
  const router = useRouter();
  const { community } = useCommunity();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = useCallback(async () => {
    if (!community) return;
    try {
      const res = await api<{ incidents: Incident[] }>(`/fix/communities/${community.id}/incidents`);
      setIncidents(res.incidents);
    } catch { /* silent */ }
  }, [community]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIncidents();
    setRefreshing(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incidencias</Text>
      <Text style={styles.communityName}>{community?.name ?? 'Cargando...'}</Text>

      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.honey} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay incidencias reportadas</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[styles.priorityDot, { backgroundColor: priorityColors[item.priority] ?? colors.gray400 }]}>{' '}</Text>
              <Text style={styles.categoryLabel}>{categoryLabels[item.category] ?? item.category}</Text>
              <Text style={styles.statusLabel}>{statusLabels[item.status] ?? item.status}</Text>
            </View>
            <Text style={typography.h3}>{item.title}</Text>
            <Text style={typography.bodySmall} numberOfLines={2}>{item.description}</Text>
            {item.location && <Text style={styles.location}>{item.location}</Text>}
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-incident')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.h1, padding: 24, paddingBottom: 0, paddingTop: 60 },
  communityName: { ...typography.bodySmall, paddingHorizontal: 24, marginBottom: 16 },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, overflow: 'hidden' },
  categoryLabel: {
    backgroundColor: colors.gray100,
    color: colors.gray600,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusLabel: {
    backgroundColor: colors.honeyLight,
    color: colors.honeyDark,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  location: { ...typography.caption, color: colors.gray500, marginTop: 4 },
  date: { ...typography.caption, marginTop: 8 },
  empty: { ...typography.bodySmall, textAlign: 'center', marginTop: 32 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.honey,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: colors.white, fontSize: 28, fontWeight: '300', marginTop: -2 },
});
