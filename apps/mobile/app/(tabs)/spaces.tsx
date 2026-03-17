import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { useCommunity } from '../../src/hooks/useCommunity';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

type Space = {
  id: string;
  name: string;
  description: string | null;
  maxCapacity: number | null;
  rules: string | null;
};

type Booking = {
  id: string;
  spaceId: string;
  startsAt: string;
  endsAt: string;
  status: string;
  note: string | null;
};

export default function SpacesScreen() {
  const router = useRouter();
  const { community } = useCommunity();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!community) return;
    try {
      const [spacesRes, bookingsRes] = await Promise.all([
        api<{ spaces: Space[] }>(`/spaces/communities/${community.id}/spaces`),
        api<{ bookings: Booking[] }>(`/spaces/communities/${community.id}/bookings`),
      ]);
      setSpaces(spacesRes.spaces);
      setBookings(bookingsRes.bookings);
    } catch { /* silent */ }
  }, [community]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getSpaceName = (spaceId: string) => spaces.find(s => s.id === spaceId)?.name ?? 'Espacio';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservas</Text>
      <Text style={styles.communityName}>{community?.name ?? 'Cargando...'}</Text>

      {spaces.length > 0 && (
        <View style={styles.spacesRow}>
          {spaces.map(s => (
            <View key={s.id} style={styles.spaceChip}>
              <Text style={styles.spaceChipText}>{s.name}</Text>
              {s.maxCapacity && <Text style={styles.spaceCapacity}>{s.maxCapacity} pers.</Text>}
            </View>
          ))}
        </View>
      )}

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.honey} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay reservas</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={typography.h3}>{getSpaceName(item.spaceId)}</Text>
              <Text style={[styles.statusBadge, item.status === 'confirmed' ? styles.confirmed : styles.cancelled]}>
                {item.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
              </Text>
            </View>
            <Text style={styles.timeRange}>
              {formatDateTime(item.startsAt)} → {formatDateTime(item.endsAt)}
            </Text>
            {item.note && <Text style={typography.bodySmall}>{item.note}</Text>}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-booking')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.h1, padding: 24, paddingBottom: 0, paddingTop: 60 },
  communityName: { ...typography.bodySmall, paddingHorizontal: 24, marginBottom: 16 },
  spacesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 24, marginBottom: 16 },
  spaceChip: {
    backgroundColor: colors.honeyLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spaceChipText: { fontSize: 13, fontWeight: '600', color: colors.honeyDark },
  spaceCapacity: { fontSize: 11, color: colors.gray500 },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confirmed: { backgroundColor: '#E8F5E9', color: colors.success },
  cancelled: { backgroundColor: '#FFEBEE', color: colors.error },
  timeRange: { fontSize: 14, fontWeight: '600', color: colors.honey, marginBottom: 4 },
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
