import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { closeApp, createTestUser, loginTestUser, authRequest } from '../../test/helpers.js';

afterAll(() => closeApp());

describe('Fix module', () => {
  let token: string;
  let communityId: string;
  let incidentId: string;

  beforeAll(async () => {
    const email = `fix-test-${Date.now()}@kolmena.test`;
    await createTestUser({ email, password: 'testpass123', name: 'Fix Test' });
    const login = await loginTestUser(email, 'testpass123');
    token = login.body.accessToken;

    // Create a community for incidents
    const res = await authRequest(token, 'POST', '/api/v1/communities', {
      name: `Fix Test Community ${Date.now()}`,
      address: 'Calle Fix 1',
      city: 'Barcelona',
      postalCode: '08001',
      province: 'Barcelona',
    });
    communityId = res.json().community.id;
  });

  it('POST /incidents — creates an incident', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/fix/communities/${communityId}/incidents`, {
      title: 'Fuga de agua en garaje',
      description: 'Hay una fuga en la planta -1 del garaje, zona de trasteros',
      category: 'plumbing',
      priority: 'high',
      location: 'Garaje P-1',
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.incident.title).toBe('Fuga de agua en garaje');
    expect(body.incident.status).toBe('open');
    incidentId = body.incident.id;
  });

  it('GET /incidents — lists incidents for community', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/fix/communities/${communityId}/incidents`);
    expect(res.statusCode).toBe(200);
    expect(res.json().incidents.length).toBe(1);
  });

  it('GET /incidents/:id — gets incident detail', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/fix/incidents/${incidentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.json().incident.id).toBe(incidentId);
  });

  it('POST /incidents/:id/comments — adds a comment', async () => {
    const res = await authRequest(token, 'POST', `/api/v1/fix/incidents/${incidentId}/comments`, {
      body: 'He llamado al fontanero, viene manana a las 9',
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().comment.body).toContain('fontanero');
  });

  it('PATCH /incidents/:id/status — transitions status', async () => {
    const res = await authRequest(token, 'PATCH', `/api/v1/fix/incidents/${incidentId}/status`, {
      status: 'assigned',
      note: 'Asignado a Fontaneria Perez',
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().incident.status).toBe('assigned');
  });

  it('GET /incidents/:id/log — shows status log', async () => {
    const res = await authRequest(token, 'GET', `/api/v1/fix/incidents/${incidentId}/log`);
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.log.length).toBe(1);
    expect(body.log[0].toStatus).toBe('assigned');
  });
});

describe('Fix module — status machine & notifications (US-041/US-050)', () => {
  let reporterToken: string;
  let otherToken: string;
  let communityId: string;
  let incidentId: string;

  beforeAll(async () => {
    const emailA = `fix-sm-a-${Date.now()}@kolmena.test`;
    await createTestUser({ email: emailA, password: 'testpass123', name: 'Reporter A' });
    reporterToken = (await loginTestUser(emailA, 'testpass123')).body.accessToken;

    const emailB = `fix-sm-b-${Date.now()}@kolmena.test`;
    await createTestUser({ email: emailB, password: 'testpass123', name: 'Manager B' });
    otherToken = (await loginTestUser(emailB, 'testpass123')).body.accessToken;

    const res = await authRequest(reporterToken, 'POST', '/api/v1/communities', {
      name: `SM Test Community ${Date.now()}`,
      address: 'Calle Estado 1',
      city: 'Sevilla',
      postalCode: '41001',
      province: 'Sevilla',
    });
    communityId = res.json().community.id;

    const inc = await authRequest(reporterToken, 'POST', `/api/v1/fix/communities/${communityId}/incidents`, {
      title: 'Ascensor bloqueado',
      description: 'El ascensor del portal B no responde en ninguna planta',
      category: 'elevator',
      priority: 'urgent',
    });
    incidentId = inc.json().incident.id;
  });

  it('rejects invalid transition open -> resolved', async () => {
    const res = await authRequest(reporterToken, 'PATCH', `/api/v1/fix/incidents/${incidentId}/status`, {
      status: 'resolved',
      resolutionPhotoUrl: 'https://r2.kolmena.app/fix/foto.jpg',
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().message).toContain('Cannot transition');
  });

  it('allows open -> in_progress', async () => {
    const res = await authRequest(reporterToken, 'PATCH', `/api/v1/fix/incidents/${incidentId}/status`, {
      status: 'in_progress',
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().incident.status).toBe('in_progress');
  });

  it('rejects resolved without resolution photo (US-050)', async () => {
    const res = await authRequest(reporterToken, 'PATCH', `/api/v1/fix/incidents/${incidentId}/status`, {
      status: 'resolved',
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().message).toContain('resolution photo');
  });

  it('accepts resolved with photo and stores it', async () => {
    // Changed by another user so the reporter gets a push notification
    const res = await authRequest(otherToken, 'PATCH', `/api/v1/fix/incidents/${incidentId}/status`, {
      status: 'resolved',
      note: 'Reparado el motor del ascensor',
      resolutionPhotoUrl: 'https://r2.kolmena.app/fix/ascensor-ok.jpg',
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.incident.status).toBe('resolved');
    expect(body.incident.resolutionPhotoUrl).toBe('https://r2.kolmena.app/fix/ascensor-ok.jpg');
  });

  it('notified the reporter of the status change (in-app record)', async () => {
    const res = await authRequest(reporterToken, 'GET', '/api/v1/notifications');
    expect(res.statusCode).toBe(200);
    const items = res.json().notifications;
    const statusNotif = items.find(
      (n: { title: string; resourceId: string }) =>
        n.title === 'Actualización de incidencia' && n.resourceId === incidentId,
    );
    expect(statusNotif).toBeDefined();
    expect(statusNotif.body).toContain('resuelta');
  });

  it('closed is terminal — no transitions out', async () => {
    await authRequest(reporterToken, 'PATCH', `/api/v1/fix/incidents/${incidentId}/status`, {
      status: 'closed',
    });
    const res = await authRequest(reporterToken, 'PATCH', `/api/v1/fix/incidents/${incidentId}/status`, {
      status: 'in_progress',
    });
    expect(res.statusCode).toBe(400);
  });
});
