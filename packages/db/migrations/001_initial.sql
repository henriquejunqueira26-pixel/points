CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reserved persistent-memory storage; no memory retrieval behavior is implemented in Sprint 0.
CREATE TABLE IF NOT EXISTS memory_entries (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS memory_entries_conversation_id_idx ON memory_entries(conversation_id);
CREATE INDEX IF NOT EXISTS memory_entries_embedding_idx
  ON memory_entries USING hnsw (embedding vector_cosine_ops);
