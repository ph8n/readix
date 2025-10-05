-- Add folder_id to documents to support organization
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;

-- Index for quick folder filtering per user
CREATE INDEX IF NOT EXISTS idx_documents_folder_id ON documents(folder_id);
