import { useState, useEffect, useCallback } from 'react';
import { api, setToken } from '../lib/api';
import * as SecureStore from 'expo-secure-store';

type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const TOKEN_KEY = 'kolmena_access_token';
const REFRESH_KEY = 'kolmena_refresh_token';

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStoredToken = useCallback(async () => {
    try {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (stored) {
        setToken(stored);
        const res = await api<{ user: User }>('/auth/me');
        setUser(res.user);
      }
    } catch {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_KEY);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredToken();
  }, [loadStoredToken]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(res.accessToken);
    await SecureStore.setItemAsync(TOKEN_KEY, res.accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, res.refreshToken);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api<{ accessToken: string; refreshToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    setToken(res.accessToken);
    await SecureStore.setItemAsync(TOKEN_KEY, res.accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, res.refreshToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  }, []);

  return { user, loading, login, register, logout };
}
