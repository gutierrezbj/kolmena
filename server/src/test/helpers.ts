import { buildApp } from '../app.js';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;

export async function getApp() {
  if (!app) {
    app = await buildApp();
    await app.ready();
  }
  return app;
}

export async function closeApp() {
  if (app) {
    await app.close();
  }
}

/** Register a fresh user and return token + user data */
export async function createTestUser(overrides?: { name?: string; email?: string; password?: string }) {
  const a = await getApp();
  const name = overrides?.name ?? 'Test User';
  const email = overrides?.email ?? `test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@kolmena.test`;
  const password = overrides?.password ?? 'testpassword123';

  const res = await a.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: { name, email, password },
  });

  return { name, email, password, status: res.statusCode, body: res.json() };
}

/** Login and return tokens */
export async function loginTestUser(email: string, password: string) {
  const a = await getApp();
  const res = await a.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: { email, password },
  });

  return { status: res.statusCode, body: res.json() };
}

/** Make an authenticated request */
/** Make an authenticated request */
export async function authRequest(token: string, method: string, url: string, payload?: unknown): Promise<{ statusCode: number; json: () => any }> {
  const a = await getApp();
  const res = await a.inject({
    method: method as any,
    url,
    headers: { authorization: `Bearer ${token}` },
    payload: payload as any,
  });
  return res;
}
