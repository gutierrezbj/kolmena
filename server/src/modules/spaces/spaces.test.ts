import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { closeApp, createTestUser, loginTestUser, authRequest } from '../../test/helpers.js';

afterAll(() => closeApp());

describe('Spaces module', () => {
  let token: string;
  let communityId: string;
  let spaceId: string;
  let bookingId: string;

  beforeAll(async () => {
    const email = `spaces-test-${Date.now()}@kolmena.test`;
    await createTestUser({ email, password: 'testpass123', name: 'Spaces Test' });
    const login = await loginTestUser(email, 'testpass123');
    token = login.body.accessToken;

    const res = await authRequest(token, 'POST', '/api/v1/communities', {
      name: `Spaces Test Community ${Date.now()}`,
      address: 'Calle Spaces 1',
      city: 'Sevilla',
      postalCode: '41001',
      province: 'Sevilla',
    });
    communityId = res.json().community.id;
  });

  it('POST /spaces — creates a space', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/spaces/communities/${communityId}/spaces`, {
      name: 'Piscina',
      description: 'Piscina comunitaria',
      maxCapacity: 30,
      rules: 'Horario: 10:00-21:00. Gorro obligatorio.',
    });
    expect(res.statusCode).toBe(201);
    spaceId = res.json().space.id;
  });

  it('GET /spaces — lists spaces', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/spaces/communities/${communityId}/spaces`);
    expect(res.statusCode).toBe(200);
    expect(res.json().spaces.length).toBe(1);
  });

  it('POST /bookings — creates a booking', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/spaces/communities/${communityId}/bookings`, {
      spaceId,
      startsAt: '2026-04-01T10:00:00Z',
      endsAt: '2026-04-01T12:00:00Z',
      note: 'Cumpleanos',
    });
    expect(res.statusCode).toBe(201);
    bookingId = res.json().booking.id;
    expect(res.json().booking.status).toBe('confirmed');
  });

  it('POST /bookings — rejects overlapping booking', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/spaces/communities/${communityId}/bookings`, {
      spaceId,
      startsAt: '2026-04-01T11:00:00Z',
      endsAt: '2026-04-01T13:00:00Z',
    });
    expect(res.statusCode).toBe(409);
  });

  it('POST /bookings — rejects end before start', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/spaces/communities/${communityId}/bookings`, {
      spaceId,
      startsAt: '2026-04-01T14:00:00Z',
      endsAt: '2026-04-01T13:00:00Z',
    });
    expect(res.statusCode).toBe(400);
  });

  it('PATCH /bookings/:id/cancel — cancels a booking', async () => {
    const res = await authRequest(token, 'PATCH', `/api/v1/spaces/bookings/${bookingId}/cancel`);
    expect(res.statusCode).toBe(200);
    expect(res.json().booking.status).toBe('cancelled');
  });

  it('POST /bookings — allows booking after cancellation', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/spaces/communities/${communityId}/bookings`, {
      spaceId,
      startsAt: '2026-04-01T10:00:00Z',
      endsAt: '2026-04-01T12:00:00Z',
    });
    expect(res.statusCode).toBe(201);
  });
});
