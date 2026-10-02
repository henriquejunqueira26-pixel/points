# Points

Technical foundation for Points. Sprint 0 establishes a TypeScript monorepo and deliberately exposes extension boundaries without delivering product behavior from later sprints.

## Architecture

- **`apps/api`** — Fastify HTTP entry point. `GET /health` is operational health; `POST /v1/agent/messages` validates and hands a request to the orchestration boundary, returning `202`.
- **`packages/agent`** — orchestration contract plus a minimal acknowledgement implementation. It defines dependency boundaries for durable memory, tool registration, and event publication. No tools, proactive behavior, scheduling, or memory recall is implemented.
- **`packages/shared`** — runtime request schemas and shared domain types.
- **`packages/db`** — PostgreSQL client factory and an explicit initial SQL migration. The migration enables `pgvector` and reserves a vector-backed `memory_entries` table for a future memory implementation.
- **`packages/redis`** — lazy Redis client factory, ready to support future event/work scheduling infrastructure.

## Local development

Prerequisites: Node.js 22+, pnpm 9+, and Docker Compose.

```sh
cp .env.example .env
pnpm install
pnpm docker:up
pnpm db:migrate
pnpm dev
```

In a second terminal, validate health:

```sh
curl http://localhost:3000/health
```

## Commands

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm docker:down
```

`pnpm db:migrate` applies `packages/db/migrations/001_initial.sql` to the local container. Production migration execution is intentionally left to deployment infrastructure.
