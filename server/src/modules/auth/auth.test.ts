import { describe, it, expect, afterAll } from 'vitest';
import { getApp, closeApp, createTestUser, loginTestUser, authRequest } from '../../test/helpers.js';

afterAll(() => closeApp());

describe('Auth module', () => {
  const email = `auth-test-${Date.now()}@kolmena.test`;
  const password = 'securePassword123';
  let accessToken: string;
  let refreshToken: string;

  it('POST /register — creates a new user', async () => {
    const { status, body } = await createTestUser({ email, password, name: 'Auth Test' });
    expect(status).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.email).toBe(email);
  });

  it('POST /register — rejects duplicate email', async () => {
    const { status } = await createTestUser({ email, password });
    expect(status).toBe(409);
  });

  it('POST /login — returns tokens', async () => {
    const { status, body } = await loginTestUser(email, password);
    expect(status).toBe(200);
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
    expect(body.user.email).toBe(email);
    accessToken = body.accessToken;
    refreshToken = body.refreshToken;
  });

  it('POST /login — rejects wrong password', async () => {
    const { status } = await loginTestUser(email, 'wrongpassword');
    expect(status).toBe(401);
  });

  it('GET /me — returns current user', async () => {
    const res = await authRequest(accessToken, 'GET', '/api/v1/auth/me');
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.user.email).toBe(email);
  });

  it('GET /me — rejects without token', async () => {
    const app = await getApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/auth/me' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /refresh — rotates tokens', async () => {
    const app = await getApp();
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
    expect(body.refreshToken).not.toBe(refreshToken);
  });
});
