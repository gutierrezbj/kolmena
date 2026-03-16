import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { closeApp, createTestUser, loginTestUser, authRequest } from '../../test/helpers.js';

afterAll(() => closeApp());

describe('Core module', () => {
  let token: string;
  let communityId: string;
  let userId: string;
  const suffix = Date.now();

  beforeAll(async () => {
    const email = `core-test-${suffix}@kolmena.test`;
    await createTestUser({ email, password: 'testpass123', name: 'Core Test' });
    const login = await loginTestUser(email, 'testpass123');
    token = login.body.accessToken;
    userId = login.body.user.id;
  });

  it('POST /communities — creates a community', async () => {
    const res = await authRequest(token, 'POST', '/api/v1/communities', {
      name: `Core Test Community ${suffix}`,
      address: 'Calle Test 1',
      city: 'Madrid',
      postalCode: '28001',
      province: 'Madrid',
    });
    expect(res.statusCode).toBe(201);
    communityId = res.json().community.id;
  });

  it('GET /communities — lists communities', async () => {
    const res = await authRequest(token, 'GET', '/api/v1/communities');
    expect(res.statusCode).toBe(200);
    expect(res.json().communities.length).toBeGreaterThan(0);
  });

  it('GET /communities/:id — gets a community', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/communities/${communityId}`);
    expect(res.statusCode).toBe(200);
    expect(res.json().community.id).toBe(communityId);
  });

  it('PATCH /communities/:id — updates a community', async () => {
    const res = await authRequest(token, 'PATCH', `/api/v1/communities/${communityId}`, {
      name: `Core Updated ${suffix}`,
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().community.name).toBe(`Core Updated ${suffix}`);
  });

  it('GET /communities/:id/members — lists members (creator auto-added)', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/communities/${communityId}/members`);
    expect(res.statusCode).toBe(200);
    expect(res.json().members.length).toBeGreaterThan(0);
  });

  it('GET /users/:id — gets a user', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.json().user.id).toBe(userId);
  });

  it('GET /users/:id/communities — lists user communities', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/users/${userId}/communities`);
    expect(res.statusCode).toBe(200);
    expect(res.json().communities.length).toBeGreaterThan(0);
  });
});
