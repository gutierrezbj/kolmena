import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { closeApp, createTestUser, loginTestUser, authRequest } from '../../test/helpers.js';
import { sendNotification } from './notify.service.js';

afterAll(() => closeApp());

describe('Notify module', () => {
  let token: string;
  let userId: string;
  let notificationId: string;

  beforeAll(async () => {
    const email = `notify-test-${Date.now()}@kolmena.test`;
    await createTestUser({ email, password: 'testpass123', name: 'Notify Test' });
    const login = await loginTestUser(email, 'testpass123');
    token = login.body.accessToken;
    userId = login.body.user.id;
  });

  it('sendNotification — creates an in-app notification', async () => {
    const notif = await sendNotification({
      userId,
      title: 'Nueva incidencia',
      body: 'Se ha reportado una fuga de agua en el garaje',
      resource: 'incident',
    });
    expect(notif.id).toBeDefined();
    expect(notif.isRead).toBe(false);
    notificationId = notif.id;
  });

  it('GET /notifications — lists user notifications', async () => {
    const res = await authRequest(token, 'GET', '/api/v1/notifications');
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.notifications.length).toBe(1);
    expect(body.unread).toBe(1);
  });

  it('PATCH /notifications/:id/read — marks as read', async () => {
    const res = await authRequest(token, 'PATCH', `/api/v1/notifications/${notificationId}/read`);
    expect(res.statusCode).toBe(200);
    expect(res.json().notification.isRead).toBe(true);
  });

  it('GET /notifications — unread count is 0', async () => {
    const res = await authRequest(token, 'GET', '/api/v1/notifications');
    expect(res.json().unread).toBe(0);
  });

  it('POST /notifications/read-all — marks all as read', async () => {
    // Create 2 more
    await sendNotification({ userId, title: 'Test 2', body: 'Body 2' });
    await sendNotification({ userId, title: 'Test 3', body: 'Body 3' });

    const res = await authRequest(token, 'POST', '/api/v1/notifications/read-all');
    expect(res.statusCode).toBe(204);

    const check = await authRequest(token, 'GET', '/api/v1/notifications');
    expect(check.json().unread).toBe(0);
  });
});
