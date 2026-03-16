import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? '?'}</Text>
      </View>
      <Text style={typography.h2}>{user?.name ?? 'Usuario'}</Text>
      <Text style={typography.bodySmall}>{user?.email ?? ''}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 80, alignItems: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.honey,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.white },
  logoutButton: {
    marginTop: 32,
    backgroundColor: colors.gray100,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  logoutText: { color: colors.error, fontSize: 16, fontWeight: '500' },
});
