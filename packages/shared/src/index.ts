import { z } from 'zod';

export const HealthStatusSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('points-api'),
  timestamp: z.string().datetime(),
});
export type HealthStatus = z.infer<typeof HealthStatusSchema>;

export const AgentRequestSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().trim().min(1).max(10_000),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type AgentRequest = z.infer<typeof AgentRequestSchema>;

export const AgentResponseSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string(),
  status: z.enum(['accepted']),
});
export type AgentResponse = z.infer<typeof AgentResponseSchema>;

export type DomainEvent<TPayload = unknown> = {
  id: string;
  name: string;
  occurredAt: Date;
  payload: TPayload;
};
