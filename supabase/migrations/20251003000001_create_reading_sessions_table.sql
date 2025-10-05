-- Create reading_sessions table for tracking per-user reading time and page ranges
-- Mirrors design plan Phase 1: data foundations
-- NOTE: Future enhancements (streaks, velocity, rollups) can build on this base

-- Table definition
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ, -- NULL while active
  last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  page_start INTEGER, -- page index (1-based or 0-based? client decides; informational)
  page_end INTEGER,
  -- Basic integrity checks
  CONSTRAINT fk_user_document_consistency CHECK (user_id IS NOT NULL AND document_id IS NOT NULL),
  CONSTRAINT valid_page_start CHECK (page_start IS NULL OR page_start >= 0),
  CONSTRAINT valid_page_end CHECK (page_end IS NULL OR page_end >= 0),
  CONSTRAINT chronological_times CHECK (ended_at IS NULL OR ended_at >= started_at)
);

COMMENT ON TABLE reading_sessions IS 'Discrete reading sessions per user & document (time tracking)';
COMMENT ON COLUMN reading_sessions.started_at IS 'Session start timestamp';
COMMENT ON COLUMN reading_sessions.ended_at IS 'Session end timestamp; NULL if still active';
COMMENT ON COLUMN reading_sessions.last_heartbeat_at IS 'Last heartbeat / activity update to detect stale sessions';
COMMENT ON COLUMN reading_sessions.page_start IS 'Page at session start (client supplied)';
COMMENT ON COLUMN reading_sessions.page_end IS 'Last page reached in this session (updated on heartbeat/end)';

-- Indexes for common access patterns
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_started ON reading_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_doc ON reading_sessions(user_id, document_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_active ON reading_sessions(user_id) WHERE ended_at IS NULL;

-- Enable Row Level Security
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (mirror documents table style for clarity)
CREATE POLICY "Users can view own reading sessions" 
  ON reading_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading sessions"
  ON reading_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading sessions"
  ON reading_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading sessions"
  ON reading_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON POLICY "Users can view own reading sessions" ON reading_sessions IS 'Users may only read their own sessions';
COMMENT ON POLICY "Users can insert own reading sessions" ON reading_sessions IS 'Create sessions only for themselves';
COMMENT ON POLICY "Users can update own reading sessions" ON reading_sessions IS 'Update heartbeats, end times only for their sessions';
COMMENT ON POLICY "Users can delete own reading sessions" ON reading_sessions IS 'Allow cleanup of their own sessions';

-- (Optional future) A maintenance job / trigger could auto-end stale sessions where last_heartbeat_at < now() - interval '5 minutes'.
-- Left out for MVP to keep logic in application layer.
