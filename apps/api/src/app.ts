import { InMemoryEventPublisher, PointsAgent, type AgentOrchestrator } from '@points/agent';
import { AgentRequestSchema, type HealthStatus } from '@points/shared';
import Fastify, { type FastifyInstance } from 'fastify';

export type AppDependencies = {
  agent?: AgentOrchestrator;
  now?: () => Date;
};

export function buildApp(dependencies: AppDependencies = {}): FastifyInstance {
  const app = Fastify({ logger: false });
  const agent = dependencies.agent ?? new PointsAgent(new InMemoryEventPublisher());
  const now = dependencies.now ?? (() => new Date());

  app.get(
    '/health',
    async (): Promise<HealthStatus> => ({
      status: 'ok',
      service: 'points-api',
      timestamp: now().toISOString(),
    }),
  );

  app.post('/v1/agent/messages', async (request, reply) => {
    const parsed = AgentRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: 'Invalid agent request', details: parsed.error.flatten() });
    }
    return reply.code(202).send(await agent.handle(parsed.data));
  });

  return app;
}
