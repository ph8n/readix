# Supabase Database Migrations

This directory contains SQL migration files for the Readix database schema.

## 📁 Migration Files

| File | Purpose |
|------|---------|
| `20251001000001_create_profiles_table.sql` | User profiles table (extends auth.users) |
| `20251001000002_create_documents_table.sql` | Documents table with reading progress tracking |
| `20251001000003_create_profiles_rls_policies.sql` | Row Level Security policies for profiles |
| `20251001000004_create_documents_rls_policies.sql` | Row Level Security policies for documents |
| `20251001000005_create_storage_bucket.sql` | Storage bucket for PDF files |
| `20251001000006_create_storage_policies.sql` | Storage bucket RLS policies |

## 🚀 Using Supabase CLI

### Initial Setup

```bash
# Link to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF

# Pull current schema (documents existing state)
npx supabase db pull
```

### Running Migrations

```bash
# Push all migrations to remote database
npx supabase db push

# Push to production
npx supabase db push --db-url "postgresql://..."
```

### Creating New Migrations

```bash
# Create a new migration file
npx supabase migration new migration_name

# Example: Add chat_messages table for AI features
npx supabase migration new create_chat_messages_table
```

### Viewing Database State

```bash
# Dump current schema
npx supabase db dump --schema public,storage

# Dump data only
npx supabase db dump --data-only

# View migration history
npx supabase migration list
```

### Local Development

```bash
# Start local Supabase (Docker required)
npx supabase start

# Stop local Supabase
npx supabase stop

# Reset local database
npx supabase db reset
```

## 🔒 Security Notes

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**Profiles Table:**
- Users can only view/update their own profile
- Automatic profile creation on signup

**Documents Table:**
- Complete user isolation - users can only access their own documents
- All CRUD operations restricted to document owner

**Storage Bucket:**
- Folder-based isolation: `documents/{user_id}/`
- Users can only upload/view/delete files in their own folder
- 50MB file size limit
- PDF files only

### Testing RLS Policies

```sql
-- Test as specific user
SET request.jwt.claims.sub = 'user-uuid-here';

-- View your documents
SELECT * FROM documents;

-- Should return empty (other user's documents)
SELECT * FROM documents WHERE user_id != 'user-uuid-here';
```

## 📊 Database Schema

### Profiles
- **Purpose**: Extended user information
- **Relations**: `auth.users` (1:1)
- **Fields**: id, email, full_name, created_at

### Documents
- **Purpose**: PDF storage with reading progress
- **Relations**: `auth.users` (many-to-one)
- **Key Features**: 
  - Reading progress tracking (pages_read, reading_progress %)
  - Bookmarks (JSONB array)
  - Favorites system
  - Full-text search on titles
  - Duplicate detection (file_hash)

### Storage Bucket: documents
- **Path Format**: `documents/{user_id}/{filename-timestamp}.pdf`
- **Limits**: 50MB, PDF only
- **Access**: Private (RLS enforced)

## 🆘 Troubleshooting

### Migration Fails

```bash
# Check migration status
npx supabase migration list

# Repair migration (if needed)
npx supabase migration repair --status reverted
```

### RLS Policy Issues

```bash
# Disable RLS temporarily for debugging (DANGEROUS - dev only)
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

# Re-enable
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Reset Everything (DESTRUCTIVE)

```bash
# Local only
npx supabase db reset

# Never run on production without backup!
```

## 📚 Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
