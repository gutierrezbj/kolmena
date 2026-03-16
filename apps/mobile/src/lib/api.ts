import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 for host loopback
const BASE = Platform.OS === 'android'
  ? 'http://10.0.2.2:4080/api/v1'
  : 'http://127.0.0.1:4080/api/v1';

let accessToken: string | null = null;

export function setToken(token: string | null) {
  accessToken = token;
}

export function getToken() {
  return accessToken;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...opts.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
