const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4080/api/v1';

let token: string | null = localStorage.getItem('kolmena_admin_token');

export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem('kolmena_admin_token', t);
  else localStorage.removeItem('kolmena_admin_token');
}

export function getToken() {
  return token;
}

export async function api<T = unknown>(path: string, opts?: { method?: string; body?: unknown }): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: opts?.method ?? 'GET',
    headers,
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
