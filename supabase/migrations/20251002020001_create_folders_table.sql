-- Create folders table for organizing documents
-- Purpose: Provide hierarchical folders per user

CREATE TABLE IF NOT EXISTS folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  color TEXT DEFAULT 'blue',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_parent_name ON folders(user_id, parent_id, name);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_folders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW
  EXECUTE FUNCTION update_folders_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Comments
COMMENT ON TABLE folders IS 'User-owned hierarchical folders for organizing documents';
COMMENT ON COLUMN folders.parent_id IS 'Self-referential parent folder id, NULL for root';
