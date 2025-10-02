-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own documents
-- Path structure: documents/{user_id}/{filename}
CREATE POLICY "Users can upload own documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own documents
CREATE POLICY "Users can view own documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update their own documents (for metadata updates)
CREATE POLICY "Users can update own documents"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add policy comments
COMMENT ON POLICY "Users can upload own documents" ON storage.objects IS 'Users can only upload to their own folder: documents/{user_id}/';
COMMENT ON POLICY "Users can view own documents" ON storage.objects IS 'Users can only access files in their own folder';
COMMENT ON POLICY "Users can delete own documents" ON storage.objects IS 'Users can only delete files from their own folder';
