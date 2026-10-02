import type { AgentRequest, AgentResponse, DomainEvent } from '@points/shared';

/** Boundary for durable memory, implemented by a later sprint. */
export interface MemoryStore {
  recall(conversationId: string, query: string): Promise<readonly string[]>;
  remember(conversationId: string, content: string): Promise<void>;
}

/** Boundary for approved capabilities; no external tools are registered in Sprint 0. */
export interface ToolRegistry {
  list(): readonly string[];
}

/** Boundary for publishing events to future workers and schedulers. */
export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export interface AgentOrchestrator {
  handle(request: AgentRequest): Promise<AgentResponse>;
}

export class PointsAgent implements AgentOrchestrator {
  public constructor(private readonly events: EventPublisher) {}

  public async handle(request: AgentRequest): Promise<AgentResponse> {
    await this.events.publish({
      id: crypto.randomUUID(),
      name: 'agent.requested',
      occurredAt: new Date(),
      payload: { conversationId: request.conversationId },
    });

    return { conversationId: request.conversationId, message: '', status: 'accepted' };
  }
}

export class InMemoryEventPublisher implements EventPublisher {
  public readonly events: DomainEvent[] = [];
  public async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }
}
