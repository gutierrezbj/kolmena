import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { closeApp, createTestUser, loginTestUser, authRequest } from '../../test/helpers.js';

afterAll(() => closeApp());

describe('Social module', () => {
  let token: string;
  let communityId: string;
  let postId: string;
  let pollId: string;
  let optionId: string;

  beforeAll(async () => {
    const email = `social-test-${Date.now()}@kolmena.test`;
    await createTestUser({ email, password: 'testpass123', name: 'Social Test' });
    const login = await loginTestUser(email, 'testpass123');
    token = login.body.accessToken;

    const res = await authRequest(token, 'POST', '/api/v1/communities', {
      name: `Social Test Community ${Date.now()}`,
      address: 'Calle Social 1',
      city: 'Valencia',
      postalCode: '46001',
      province: 'Valencia',
    });
    communityId = res.json().community.id;
  });

  // --- Posts ---

  it('POST /posts — creates a post', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/social/communities/${communityId}/posts`, {
      title: 'Reunion de vecinos',
      body: 'Se convoca reunion para el viernes',
      type: 'announcement',
      isPinned: true,
    });
    expect(res.statusCode).toBe(201);
    postId = res.json().post.id;
  });

  it('GET /posts — lists posts', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/social/communities/${communityId}/posts`);
    expect(res.statusCode).toBe(200);
    expect(res.json().posts.length).toBe(1);
  });

  it('PATCH /posts/:id — updates a post', async () => {
    const res = await authRequest(token, 'PATCH', `/api/v1/social/posts/${postId}`, {
      title: 'Reunion actualizada',
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().post.title).toBe('Reunion actualizada');
  });

  it('DELETE /posts/:id — deletes a post', async () => {
    const res = await authRequest(token, 'DELETE', `/api/v1/social/posts/${postId}`);
    expect(res.statusCode).toBe(204);
  });

  // --- Polls ---

  it('POST /polls — creates a poll', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/social/communities/${communityId}/polls`, {
      question: 'Cambiar la empresa de limpieza?',
      options: ['Si', 'No', 'Abstenerme'],
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    pollId = body.poll.id;
    optionId = body.poll.options[0].id;
    expect(body.poll.options.length).toBe(3);
  });

  it('POST /polls — rejects poll with < 2 options', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/social/communities/${communityId}/polls`, {
      question: 'Solo una opcion?',
      options: ['Unica'],
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /polls/:id/vote — casts a vote', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/social/polls/${pollId}/vote`, {
      optionId,
    });
    expect(res.statusCode).toBe(201);
  });

  it('POST /polls/:id/vote — rejects double vote', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/social/polls/${pollId}/vote`, {
      optionId,
    });
    expect(res.statusCode).toBe(409);
  });

  it('GET /polls/:id — shows results with counts', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/social/polls/${pollId}`);
    expect(res.statusCode).toBe(200);
    const body = res.json();
    const voted = body.poll.options.find((o: any) => o.id === optionId);
    expect(voted.votes).toBe(1);
  });

  it('PATCH /polls/:id/close — closes a poll', async () => {
    const res = await authRequest(token, 'PATCH', `/api/v1/social/polls/${pollId}/close`);
    expect(res.statusCode).toBe(200);
    expect(res.json().poll.status).toBe('closed');
  });
});

describe('Social module — announcement permissions & broadcast', () => {
  let presidentToken: string;
  let residentToken: string;
  let residentId: string;
  let outsiderToken: string;
  let communityId: string;

  beforeAll(async () => {
    const emailP = `social-pres-${Date.now()}@kolmena.test`;
    await createTestUser({ email: emailP, password: 'testpass123', name: 'Presidente' });
    presidentToken = (await loginTestUser(emailP, 'testpass123')).body.accessToken;

    const emailR = `social-res-${Date.now()}@kolmena.test`;
    const regR = await createTestUser({ email: emailR, password: 'testpass123', name: 'Residente' });
    residentId = regR.body.id;
    residentToken = (await loginTestUser(emailR, 'testpass123')).body.accessToken;

    const emailO = `social-out-${Date.now()}@kolmena.test`;
    await createTestUser({ email: emailO, password: 'testpass123', name: 'Outsider' });
    outsiderToken = (await loginTestUser(emailO, 'testpass123')).body.accessToken;

    const res = await authRequest(presidentToken, 'POST', '/api/v1/communities', {
      name: `Broadcast Community ${Date.now()}`,
      address: 'Calle Aviso 1',
      city: 'Bilbao',
      postalCode: '48001',
      province: 'Vizcaya',
    });
    communityId = res.json().community.id;

    // No public join endpoint yet — add the resident membership directly
    const { db } = await import('../../shared/db/client.js');
    const { userCommunities } = await import('../../shared/db/schema.js');
    const { generateId } = await import('../../shared/utils/uuid.js');
    await db.insert(userCommunities).values({
      id: generateId(),
      userId: residentId,
      communityId,
      role: 'resident',
    });
  });

  it('outsider cannot post an announcement', async () => {
    const res = await authRequest(outsiderToken, 'POST', `/api/v1/social/communities/${communityId}/posts`, {
      title: 'Aviso falso',
      body: 'No deberia publicarse',
      type: 'announcement',
    });
    expect(res.statusCode).toBe(403);
  });

  it('resident member cannot post an announcement', async () => {
    const res = await authRequest(residentToken, 'POST', `/api/v1/social/communities/${communityId}/posts`, {
      title: 'Aviso de residente',
      body: 'Tampoco deberia publicarse',
      type: 'announcement',
    });
    expect(res.statusCode).toBe(403);
  });

  it('resident CAN post a general post', async () => {
    const res = await authRequest(residentToken, 'POST', `/api/v1/social/communities/${communityId}/posts`, {
      title: 'Hola vecinos',
      body: 'Me presento, soy el nuevo del 3B',
      type: 'general',
    });
    expect(res.statusCode).toBe(201);
  });

  it('president announcement broadcasts in-app notification to members', async () => {
    const res = await authRequest(presidentToken, 'POST', `/api/v1/social/communities/${communityId}/posts`, {
      title: 'Corte de agua el lunes',
      body: 'De 9:00 a 13:00 por obras en la red general',
      type: 'announcement',
    });
    expect(res.statusCode).toBe(201);
    const postId = res.json().post.id;

    const notifs = await authRequest(residentToken, 'GET', '/api/v1/notifications');
    expect(notifs.statusCode).toBe(200);
    const broadcast = notifs.json().notifications.find(
      (n: { title: string; resourceId: string }) =>
        n.title === 'Aviso oficial' && n.resourceId === postId,
    );
    expect(broadcast).toBeDefined();
    expect(broadcast.body).toBe('Corte de agua el lunes');
  });

  it('does not notify the announcement author', async () => {
    const notifs = await authRequest(presidentToken, 'GET', '/api/v1/notifications');
    const own = notifs.json().notifications.find(
      (n: { title: string }) => n.title === 'Aviso oficial',
    );
    expect(own).toBeUndefined();
  });
});
