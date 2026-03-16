import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
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

type Poll = {
  id: string;
  question: string;
  status: string;
  options: { id: string; label: string; votes: number }[];
  createdAt: string;
};

export default function SocialScreen() {
  const { community } = useCommunity();
  const [tab, setTab] = useState<'posts' | 'polls'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!community) return;
    try {
      const res = await api<{ posts: Post[] }>(`/social/communities/${community.id}/posts`);
      setPosts(res.posts);
    } catch { /* silent */ }
  }, [community]);

  const fetchPolls = useCallback(async () => {
    if (!community) return;
    try {
      const res = await api<{ polls: Poll[] }>(`/social/communities/${community.id}/polls`);
      setPolls(res.polls);
    } catch { /* silent */ }
  }, [community]);

  useEffect(() => {
    fetchPosts();
    fetchPolls();
  }, [fetchPosts, fetchPolls]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPosts(), fetchPolls()]);
    setRefreshing(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social</Text>
      <Text style={styles.communityName}>{community?.name ?? 'Cargando...'}</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'posts' && styles.tabActive]} onPress={() => setTab('posts')}>
          <Text style={[styles.tabText, tab === 'posts' && styles.tabTextActive]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'polls' && styles.tabActive]} onPress={() => setTab('polls')}>
          <Text style={[styles.tabText, tab === 'polls' && styles.tabTextActive]}>Votaciones</Text>
        </TouchableOpacity>
      </View>

      {tab === 'posts' ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.honey} />}
          ListEmptyComponent={<Text style={styles.empty}>No hay posts todavia</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                {item.isPinned && <Text style={styles.pinBadge}>FIJADO</Text>}
                <Text style={styles.typeBadge}>{item.type === 'announcement' ? 'ANUNCIO' : item.type === 'event' ? 'EVENTO' : 'GENERAL'}</Text>
              </View>
              <Text style={typography.h3}>{item.title}</Text>
              <Text style={typography.bodySmall} numberOfLines={3}>{item.body}</Text>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.honey} />}
          ListEmptyComponent={<Text style={styles.empty}>No hay votaciones activas</Text>}
          renderItem={({ item }) => {
            const totalVotes = item.options.reduce((sum, o) => sum + o.votes, 0);
            return (
              <View style={styles.card}>
                <Text style={[styles.statusBadge, item.status === 'active' ? styles.activeBadge : styles.closedBadge]}>
                  {item.status === 'active' ? 'ACTIVA' : 'CERRADA'}
                </Text>
                <Text style={typography.h3}>{item.question}</Text>
                {item.options.map((o) => {
                  const pct = totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0;
                  return (
                    <View key={o.id} style={styles.optionRow}>
                      <View style={[styles.optionBar, { width: `${pct}%` }]} />
                      <Text style={styles.optionLabel}>{o.label}</Text>
                      <Text style={styles.optionPct}>{pct}%</Text>
                    </View>
                  );
                })}
                <Text style={styles.date}>{totalVotes} votos - {formatDate(item.createdAt)}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.h1, padding: 24, paddingBottom: 0, paddingTop: 60 },
  communityName: { ...typography.bodySmall, paddingHorizontal: 24, marginBottom: 16 },
  tabRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginBottom: 16 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.gray100 },
  tabActive: { backgroundColor: colors.honey },
  tabText: { fontSize: 14, fontWeight: '500', color: colors.gray600 },
  tabTextActive: { color: colors.white },
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
  cardHeader: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  pinBadge: {
    backgroundColor: colors.honeyLight,
    color: colors.honeyDark,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  typeBadge: {
    backgroundColor: colors.gray100,
    color: colors.gray600,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  activeBadge: { backgroundColor: '#E8F5E9', color: colors.success },
  closedBadge: { backgroundColor: colors.gray100, color: colors.gray500 },
  date: { ...typography.caption, marginTop: 8 },
  empty: { ...typography.bodySmall, textAlign: 'center', marginTop: 32 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginTop: 8,
    padding: 10,
    overflow: 'hidden',
  },
  optionBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.honeyLight,
    borderRadius: 8,
  },
  optionLabel: { flex: 1, fontSize: 14, color: colors.gray800, zIndex: 1 },
  optionPct: { fontSize: 14, fontWeight: '600', color: colors.gray700, zIndex: 1 },
});
