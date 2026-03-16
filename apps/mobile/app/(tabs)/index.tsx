import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { useCommunity } from '../../src/hooks/useCommunity';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

type Post = {
  id: string;
  title: string;
  body: string;
  type: string;
  isPinned: boolean;
  createdAt: string;
};

type NotificationSummary = {
  unread: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const { community } = useCommunity();
  const [posts, setPosts] = useState<Post[]>([]);
  const [unread, setUnread] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!community) return;
    try {
      const [postsRes, notifRes] = await Promise.all([
        api<{ posts: Post[] }>(`/social/communities/${community.id}/posts`),
        api<NotificationSummary>(`/notifications/unread-count`).catch(() => ({ unread: 0 })),
      ]);
      setPosts(postsRes.posts);
      setUnread(notifRes.unread);
    } catch {
      // silent fail on home
    }
  }, [community]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const quickActions = [
    { icon: '🔧', label: 'Incidencia', route: '/fix' as const },
    { icon: '📅', label: 'Reservar', route: '/spaces' as const },
    { icon: '📢', label: 'Anuncio', route: '/social' as const },
    { icon: '📊', label: 'Votacion', route: '/social' as const },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.welcome}>
        <View style={styles.headerRow}>
          <View>
            <Text style={typography.h1}>Kolmena</Text>
            <Text style={styles.communityName}>{community?.name ?? 'Cargando...'}</Text>
          </View>
          {unread > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifText}>{unread > 99 ? '99+' : unread}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={typography.label}>Acceso rapido</Text>
        <View style={styles.actionRow}>
          {quickActions.map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionCard} onPress={() => router.push(a.route)}>
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.honey} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay novedades</Text>}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            {item.isPinned && <Text style={styles.pinBadge}>FIJADO</Text>}
            <Text style={typography.h3}>{item.title}</Text>
            <Text style={typography.bodySmall} numberOfLines={2}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  welcome: { padding: 24, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  communityName: { ...typography.bodySmall, color: colors.gray500, marginTop: 2 },
  notifBadge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notifText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  quickActions: { padding: 24, paddingTop: 0 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionLabel: { ...typography.caption, fontWeight: '500' },
  postCard: {
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
  pinBadge: {
    backgroundColor: colors.honeyLight,
    color: colors.honeyDark,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    overflow: 'hidden',
  },
  empty: { ...typography.bodySmall, textAlign: 'center', marginTop: 32 },
});
