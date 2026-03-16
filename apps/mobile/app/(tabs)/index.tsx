import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { api } from '../../src/lib/api';
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

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      // TODO: use actual community ID from context
      const res = await api<{ posts: Post[] }>('/social/communities/TODO/posts');
      setPosts(res.posts);
    } catch {
      // silent fail on home
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcome}>
        <Text style={typography.h1}>Kolmena</Text>
        <Text style={styles.tagline}>Bienvenido a tu comunidad</Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={typography.label}>Acceso rapido</Text>
        <View style={styles.actionRow}>
          {[
            { icon: '🔧', label: 'Incidencia' },
            { icon: '📅', label: 'Reservar' },
            { icon: '📢', label: 'Anuncio' },
            { icon: '📊', label: 'Votacion' },
          ].map((a) => (
            <View key={a.label} style={styles.actionCard}>
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {posts.length > 0 && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.honey} />}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {item.isPinned && <Text style={styles.pinBadge}>FIJADO</Text>}
              <Text style={typography.h3}>{item.title}</Text>
              <Text style={typography.bodySmall} numberOfLines={2}>{item.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  welcome: { padding: 24, paddingTop: 60 },
  tagline: { ...typography.body, color: colors.gray500, marginTop: 4 },
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
});
