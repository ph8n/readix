-- Enable Row Level Security on documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own documents
CREATE POLICY "Users can view own documents" 
  ON documents
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert own documents" 
  ON documents
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update own documents" 
  ON documents
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents" 
  ON documents
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add policy comments
COMMENT ON POLICY "Users can view own documents" ON documents IS 'Complete document isolation - users can only see their own documents';
COMMENT ON POLICY "Users can insert own documents" ON documents IS 'Users can only upload documents associated with their own user_id';
COMMENT ON POLICY "Users can update own documents" ON documents IS 'Users can only update their own documents (reading progress, favorites, etc.)';
COMMENT ON POLICY "Users can delete own documents" ON documents IS 'Users can only delete their own documents';
