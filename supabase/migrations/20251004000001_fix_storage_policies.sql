-- Fix storage policies for documents bucket
-- Use string manipulation instead of storage.foldername() which may not work as expected

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;

-- Create policies using string pattern matching
-- Path format: documents/{user_id}/{filename}
CREATE POLICY "Users can upload own documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' 
    AND name LIKE 'documents/' || auth.uid()::text || '/%'
  );

CREATE POLICY "Users can view own documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' 
    AND name LIKE 'documents/' || auth.uid()::text || '/%'
  );

CREATE POLICY "Users can update own documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' 
    AND name LIKE 'documents/' || auth.uid()::text || '/%'
  )
  WITH CHECK (
    bucket_id = 'documents' 
    AND name LIKE 'documents/' || auth.uid()::text || '/%'
  );

CREATE POLICY "Users can delete own documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' 
    AND name LIKE 'documents/' || auth.uid()::text || '/%'
  );

-- Add comments
COMMENT ON POLICY "Users can upload own documents" ON storage.objects IS 'Users can upload to their own folder: documents/{user_id}/';
COMMENT ON POLICY "Users can view own documents" ON storage.objects IS 'Users can view files in their own folder';
COMMENT ON POLICY "Users can update own documents" ON storage.objects IS 'Users can update files in their own folder';
COMMENT ON POLICY "Users can delete own documents" ON storage.objects IS 'Users can delete files from their own folder';
