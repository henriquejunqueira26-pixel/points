import { describe, expect, it } from 'vitest';
import { buildApp } from './app.js';

describe('Points API', () => {
  it('reports its health with an injectable clock', async () => {
    const app = buildApp({ now: () => new Date('2026-01-01T00:00:00.000Z') });
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'ok',
      service: 'points-api',
      timestamp: '2026-01-01T00:00:00.000Z',
    });
    await app.close();
  });

  it('accepts a valid agent request', async () => {
    const app = buildApp();
    const response = await app.inject({
      method: 'POST',
      url: '/v1/agent/messages',
      payload: { conversationId: '550e8400-e29b-41d4-a716-446655440000', message: 'hello' },
    });
    expect(response.statusCode).toBe(202);
    expect(response.json()).toMatchObject({ status: 'accepted', message: '' });
    await app.close();
  });

  it('rejects an invalid agent request', async () => {
    const app = buildApp();
    const response = await app.inject({
      method: 'POST',
      url: '/v1/agent/messages',
      payload: { message: '' },
    });
    expect(response.statusCode).toBe(400);
    await app.close();
  });
});
