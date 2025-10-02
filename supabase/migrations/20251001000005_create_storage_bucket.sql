-- Create storage bucket for documents
-- Purpose: Store PDF files with user-specific folder structure
-- Path format: documents/{user_id}/{filename-timestamp}.pdf

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Add bucket metadata
COMMENT ON TABLE storage.buckets IS 'Storage buckets for file uploads';
