-- Create storage bucket for thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents-thumbnails', 'documents-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for thumbnails (RLS)
CREATE POLICY "Users can view their own thumbnails"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents-thumbnails'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents-thumbnails'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents-thumbnails'
  AND auth.uid()::text = (storage.foldername(name))[1]
);