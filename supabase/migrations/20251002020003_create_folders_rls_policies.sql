-- Enable Row Level Security on folders
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own folders" ON folders;
DROP POLICY IF EXISTS "Users can insert own folders" ON folders;
DROP POLICY IF EXISTS "Users can update own folders" ON folders;
DROP POLICY IF EXISTS "Users can delete own folders" ON folders;

-- Policy: Users can view their own folders
CREATE POLICY "Users can view own folders"
  ON folders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own folders
CREATE POLICY "Users can insert own folders"
  ON folders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own folders
CREATE POLICY "Users can update own folders"
  ON folders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own folders
CREATE POLICY "Users can delete own folders"
  ON folders
  FOR DELETE
  USING (auth.uid() = user_id);
