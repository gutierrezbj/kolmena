import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.logo}>Kolmena</Text>
        <Text style={styles.subtitle}>Tu comunidad, conectada</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={colors.gray400}
        />

        <TextInput
          style={styles.input}
          placeholder="Contrasena"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.gray400}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>No tienes cuenta? Registrate</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 42, fontWeight: '800', color: colors.honey, letterSpacing: -1 },
  subtitle: { ...typography.body, color: colors.gray500, marginTop: 8 },
  form: { gap: 16 },
  input: {
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.gray900,
  },
  button: {
    backgroundColor: colors.honey,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center', marginTop: 16 },
  linkText: { color: colors.honey, fontSize: 14, fontWeight: '500' },
  error: { color: colors.error, fontSize: 14, textAlign: 'center' },
});
