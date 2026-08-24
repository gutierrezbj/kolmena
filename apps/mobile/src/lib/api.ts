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

export async function uploadFiles(uris: string[]): Promise<string[]> {
  const formData = new FormData();
  for (const uri of uris) {
    const name = uri.split('/').pop() ?? 'photo.jpg';
    const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    formData.append('file', { uri, name, type } as unknown as Blob);
  }

  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const endpoint = uris.length === 1 ? '/upload' : '/upload/batch';
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return uris.length === 1 ? [data.url] : data.urls;
}

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
