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
