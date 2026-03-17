import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { closeApp, createTestUser, loginTestUser, authRequest } from '../../test/helpers.js';

afterAll(() => closeApp());

describe('Admin module', () => {
  let token: string;
  let communityId: string;
  const suffix = Date.now();

  beforeAll(async () => {
    const email = `admin-test-${suffix}@kolmena.test`;
    await createTestUser({ email, password: 'testpass123', name: 'Admin Test' });
    const login = await loginTestUser(email, 'testpass123');
    token = login.body.accessToken;

    // Create a community so stats have data
    const res = await authRequest(token, 'POST', '/api/v1/communities', {
      name: `Admin Test Community ${suffix}`,
      address: 'Calle Test 1',
      city: 'Madrid',
      postalCode: '28001',
      province: 'Madrid',
    });
    communityId = res.json().community.id;

    // Create an incident for the community
    await authRequest(token, 'POST', `/api/v1/fix/communities/${communityId}/incidents`, {
      title: 'Test incident for admin',
      description: 'Testing admin stats endpoint',
      category: 'plumbing',
      priority: 'medium',
    });

    // Create a post
    await authRequest(token, 'POST', `/api/v1/social/communities/${communityId}/posts`, {
      title: 'Test post for admin',
      body: 'Testing admin stats',
      type: 'general',
    });
  });

  it('GET /admin/stats — returns dashboard counts', async () => {
    const res = await authRequest(token, 'GET', '/api/v1/admin/stats');
    expect(res.statusCode).toBe(200);
    const { stats } = res.json();
    expect(stats).toHaveProperty('users');
    expect(stats).toHaveProperty('communities');
    expect(stats).toHaveProperty('incidents');
    expect(stats).toHaveProperty('posts');
    expect(stats).toHaveProperty('polls');
    expect(stats).toHaveProperty('bookings');
    expect(stats.users).toBeGreaterThanOrEqual(1);
    expect(stats.communities).toBeGreaterThanOrEqual(1);
    expect(stats.incidents).toBeGreaterThanOrEqual(1);
    expect(stats.posts).toBeGreaterThanOrEqual(1);
  });

  it('GET /admin/incidents/by-status — returns breakdown', async () => {
    const res = await authRequest(token, 'GET', '/api/v1/admin/incidents/by-status');
    expect(res.statusCode).toBe(200);
    const { breakdown } = res.json();
    expect(Array.isArray(breakdown)).toBe(true);
    expect(breakdown.length).toBeGreaterThanOrEqual(1);
    const open = breakdown.find((b: { status: string }) => b.status === 'open');
    expect(open).toBeDefined();
    expect(open.count).toBeGreaterThanOrEqual(1);
  });

  it('GET /admin/communities — returns communities with member counts', async () => {
    const res = await authRequest(token, 'GET', '/api/v1/admin/communities');
    expect(res.statusCode).toBe(200);
    const { communities } = res.json();
    expect(Array.isArray(communities)).toBe(true);
    expect(communities.length).toBeGreaterThanOrEqual(1);
    const found = communities.find((c: { id: string }) => c.id === communityId);
    expect(found).toBeDefined();
    expect(found.memberCount).toBeGreaterThanOrEqual(1);
    expect(found).toHaveProperty('name');
    expect(found).toHaveProperty('city');
    expect(found).toHaveProperty('tier');
  });

  it('GET /admin/incidents/recent — returns recent incidents', async () => {
    const res = await authRequest(token, 'GET', '/api/v1/admin/incidents/recent');
    expect(res.statusCode).toBe(200);
    const { incidents } = res.json();
    expect(Array.isArray(incidents)).toBe(true);
    expect(incidents.length).toBeGreaterThanOrEqual(1);
    expect(incidents[0]).toHaveProperty('title');
    expect(incidents[0]).toHaveProperty('category');
    expect(incidents[0]).toHaveProperty('priority');
    expect(incidents[0]).toHaveProperty('status');
  });

  it('GET /admin/stats — requires auth', async () => {
    const res = await authRequest('invalid-token', 'GET', '/api/v1/admin/stats');
    expect(res.statusCode).toBe(401);
  });
});
