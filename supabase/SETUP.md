# Supabase CLI Setup Guide

## ✅ Files Created

All migration files and configuration are ready in `supabase/` directory.

## 🚀 Quick Setup

### Step 1: Link to Your Supabase Project

You'll need your **project reference ID** from your Supabase dashboard.

Find it at: `https://app.supabase.com/project/YOUR_PROJECT_REF/settings/general`

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

This will prompt you for your database password (found in Supabase dashboard).

### Step 2: Verify Connection

```bash
npx supabase projects list
```

Should show your linked project.

### Step 3: Document Current State (IMPORTANT)

Since your database already has tables, create a snapshot:

```bash
npx supabase db pull
```

This creates a migration file representing your current database state.

### Step 4: Future Changes

For new migrations (like AI tables in Phase 3):

```bash
# Create new migration
npx supabase migration new add_chat_messages_table

# Edit the generated file
# Then push to database
npx supabase db push
```

## 📊 What's Already in Your Database

Based on your existing setup, the following should already exist:
- ✅ `profiles` table
- ✅ `documents` table with RLS policies
- ✅ `documents` storage bucket with policies

The migration files in `supabase/migrations/` document this schema for version control.

## ⚠️ Important Notes

**DO NOT run `supabase db push` yet** - your database already has these tables!

These migrations are for:
1. **Documentation** - Version control for your schema
2. **Team onboarding** - Other developers can recreate your schema
3. **Future migrations** - Starting point for new changes

## 🔄 Recommended Workflow

1. ✅ Link project (Step 1 above)
2. ✅ Pull current state: `npx supabase db pull`
3. ✅ Keep existing migrations as documentation
4. ✅ Future changes go in new migration files

## 🆘 If You Get Errors

### "Relation already exists"
- Your database already has the tables
- Use `npx supabase db pull` to document existing state instead

### "Connection refused"
- Check your database password
- Verify project ref is correct
- Check your network connection

### "Permission denied"
- Ensure you're using the correct credentials
- Try re-linking: `npx supabase link --project-ref YOUR_PROJECT_REF`

## 📚 Next Steps

After setup, see `README.md` for:
- Creating new migrations
- Local development
- Testing RLS policies
