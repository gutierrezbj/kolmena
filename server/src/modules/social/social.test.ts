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
