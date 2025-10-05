-- Temporarily disable RLS on storage.objects to allow uploads for testing
-- This will be re-enabled with proper policies after testing

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;

-- Disable RLS temporarily
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
