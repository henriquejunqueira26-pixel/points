import { describe, expect, it } from 'vitest';
import { InMemoryEventPublisher, PointsAgent } from './index.js';

describe('PointsAgent', () => {
  it('publishes an agent.requested event and accepts the request', async () => {
    const events = new InMemoryEventPublisher();
    const response = await new PointsAgent(events).handle({
      conversationId: '550e8400-e29b-41d4-a716-446655440000',
      message: 'hello',
    });
    expect(response.status).toBe('accepted');
    expect(events.events).toHaveLength(1);
    expect(events.events[0]?.name).toBe('agent.requested');
  });
});
