-- Drop thumbnail_url column and related index if they exist
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='documents' AND column_name='thumbnail_url'
  ) THEN
    -- Drop index safely if present
    IF EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE schemaname='public' AND indexname='idx_documents_thumbnail_url'
    ) THEN
      EXECUTE 'DROP INDEX IF EXISTS idx_documents_thumbnail_url';
    END IF;

    -- Drop column
    EXECUTE 'ALTER TABLE documents DROP COLUMN IF EXISTS thumbnail_url';
  END IF;
END $$;

-- Optionally drop storage bucket policies (keep history; ops can remove bucket manually)
-- No-op here to preserve historical migrations.
