-- Add thumbnail_url column to documents table
ALTER TABLE documents
ADD COLUMN thumbnail_url TEXT;

-- Add index for thumbnail lookups
CREATE INDEX idx_documents_thumbnail_url ON documents(thumbnail_url)
WHERE thumbnail_url IS NOT NULL;

-- Add comment
COMMENT ON COLUMN documents.thumbnail_url IS 'Storage path to thumbnail image in documents-thumbnails bucket';