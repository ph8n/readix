-- Documents table with metadata and reading progress
-- Purpose: Store PDF documents with reading progress tracking
-- Relations: auth.users (many-to-one via user_id)

CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- File metadata
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  file_hash TEXT,
  page_count INTEGER,
  document_language TEXT DEFAULT 'en',
  
  -- Timestamps
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- User preferences
  is_favorite BOOLEAN DEFAULT false,

  -- Reading progress tracking
  pages_read INTEGER DEFAULT 0,
  reading_progress DECIMAL(5,2) DEFAULT 0.0,
  last_read_at TIMESTAMPTZ,

  -- Bookmarks stored as JSON array
  bookmarks JSONB DEFAULT '[]'::jsonb,

  -- Constraints
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 52428800),
  CONSTRAINT valid_progress CHECK (reading_progress >= 0 AND reading_progress <= 100),
  CONSTRAINT valid_pages_read CHECK (pages_read >= 0)
);

-- Indexes for performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_upload_date ON documents(upload_date DESC);
CREATE INDEX idx_documents_title ON documents USING gin(to_tsvector('english', title));
CREATE INDEX idx_documents_file_hash ON documents(file_hash);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add table comments
COMMENT ON TABLE documents IS 'PDF documents with reading progress tracking';
COMMENT ON COLUMN documents.file_path IS 'Storage path: documents/{user_id}/{filename-timestamp}.pdf';
COMMENT ON COLUMN documents.bookmarks IS 'JSON array of bookmark objects with page number and title';
COMMENT ON COLUMN documents.reading_progress IS 'Calculated as (pages_read / page_count) * 100';
