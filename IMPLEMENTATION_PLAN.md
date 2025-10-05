# 📚 Readix Implementation Plan - Dashboard + Library Architecture

## 🎯 Overview

This plan outlines the complete implementation of Readix's core functionality: **Dashboard (Stats View)** + **Library (Document Management)**. The dashboard remains a stats-only view with a clear "Library" button for document management.

## 📊 Current State Analysis

### ✅ **What EXISTS:**
1. **PDF Reader** - `ViewportOnlyReader` with EmbedPDF integration ✅
2. **Reading Sessions** - Full tracking system (start/heartbeat/end) ✅
3. **Dashboard** - Metrics, streaks, top documents display ✅
4. **Database Schema** - `documents` and `reading_sessions` tables ✅
5. **Server Actions** - `getDocumentUrl()` only (no upload/create) ✅
6. **FileManager** - Placeholder component (no functionality) ❌

### ❌ **What's MISSING:**
1. **Document Upload** - No way to add PDFs to database
2. **Document Library UI** - No grid/list view of user documents
3. **Document Actions** - No delete, download, or management
4. **Real-time Updates** - No subscriptions for document changes
5. **File Storage** - Upload action doesn't exist
6. **Navigation** - Can't get from dashboard to documents

---

## 🏗️ New Architecture

```
/ (homepage)
  → "Enter Library" → /dashboard (STATS view - current implementation)

/dashboard (STATS & OVERVIEW - keep existing)
  ├── Top section: Stats cards (Total Time, This Week, Documents, Avg Progress)
  ├── Middle: Activity (Streaks, Active Days)
  ├── Bottom: Recent Read Books (clickable to open reader)
  └── NEW: "Library" button (prominent, top-right near Refresh)

/library (NEW - DOCUMENT MANAGEMENT)
  ├── Upload documents
  ├── Organize in folders/collections
  ├── Manage all PDFs
  ├── Delete, rename, favorite
  └── Grid/list view toggle

/dashboard/read/[id] (READER - keep existing)
  └── Breadcrumb: Library > Document Title (or Dashboard if from recent)
```

---

## 📋 Detailed Implementation Plan

### **PHASE 1: Keep Dashboard As-Is, Add Library Button** (30 min)

#### **File: `src/app/dashboard/page.tsx`** (UPDATE - keep existing, just add button)

**Location**: Line 85-90 (button section)

```typescript
// BEFORE (existing):
<div className="flex items-center gap-2">
  <Button type="button" size="sm" variant="outline" onClick={handleRefresh} disabled={isFetching}>
    Refresh
  </Button>
</div>

// AFTER (add Library button):
<div className="flex items-center gap-2">
  <Link href="/library">
    <Button type="button" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
      <FolderOpen className="mr-2 h-4 w-4" />
      Library
    </Button>
  </Link>
  <Button type="button" size="sm" variant="outline" onClick={handleRefresh} disabled={isFetching}>
    Refresh
  </Button>
</div>
```

---

### **PHASE 2: Enhance Dashboard with Recent & Favorites** (2 hours)

#### **Dashboard Layout (Enhanced)**

```
┌─────────────────────────────────────────────────────┐
│ Dashboard                    [Library] [Refresh]    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Total Time] [This Week] [Documents] [Avg Progress]│
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────┐  ┌──────────────────────┐ │
│  │  Activity           │  │  Recently Read       │ │
│  │  - Streak: 5 days   │  │  📄 Doc 1 (2 min ago)│ │
│  │  - Active: 5/7 days │  │  📄 Doc 2 (1 hr ago) │ │
│  │  - Last: 2 min ago  │  │  📄 Doc 3 (today)    │ │
│  └─────────────────────┘  └──────────────────────┘ │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────┐  ┌──────────────────────┐ │
│  │  Top Documents      │  │  Favorites ⭐        │ │
│  │  (by reading time)  │  │  (user starred)      │ │
│  │  📄 Doc A - 45 min  │  │  📄 Fav 1            │ │
│  │  📄 Doc B - 30 min  │  │  📄 Fav 2            │ │
│  └─────────────────────┘  └──────────────────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
```

#### **New Components Needed:**

**File: `src/components/dashboard/RecentlyRead.tsx`** (NEW)
```typescript
// Shows last 5 documents ordered by last_read_at DESC
// Format: "Document Title - [relative time]"
// Click: Navigate to /dashboard/read/[id]
```

**File: `src/components/dashboard/FavoriteDocuments.tsx`** (NEW)
```typescript
// Shows favorited documents
// Filter documents where favorite = true
// Click: Navigate to /dashboard/read/[id]
```

---

### **PHASE 3: Create Library Page Structure** (4 hours)

#### **New Directory Structure:**

```
src/app/
├── dashboard/              # STATS VIEW (keep existing)
│   ├── page.tsx           # Dashboard with stats + recent + favorites
│   ├── DashboardClientNew.tsx
│   └── read/[id]/
│       └── page.tsx       # PDF Reader
│
└── library/               # NEW - DOCUMENT MANAGEMENT
    ├── page.tsx           # Server component (auth + fetch)
    ├── LibraryClient.tsx  # Client component (UI + state)
    └── layout.tsx         # Optional: Library-specific layout

src/components/
├── dashboard/             # Keep existing stats components
│   ├── StatCard.tsx
│   ├── ReadingActivity.tsx
│   ├── TopDocumentsList.tsx
│   ├── RecentlyRead.tsx     # NEW
│   └── FavoriteDocuments.tsx # NEW
│
└── library/               # NEW - LIBRARY COMPONENTS
    ├── DocumentCard.tsx
    ├── DocumentGrid.tsx
    ├── UploadDialog.tsx
    ├── DeleteConfirmDialog.tsx
    ├── FolderSidebar.tsx      # For organization
    └── EmptyState.tsx
```

#### **File: `src/app/library/page.tsx`** (NEW)

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getAllDocuments } from '@/app/actions/document-actions'
import LibraryClient from './LibraryClient'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  // Fetch all documents for user
  const result = await getAllDocuments()

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
            <p className="text-sm text-muted-foreground">
              Manage your documents and reading materials
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-8">
        <LibraryClient
          initialDocuments={result.success ? result.data : []}
          error={result.success ? null : result.error}
        />
      </div>
    </div>
  )
}
```

---

### **PHASE 4: Library Features** (6-8 hours)

#### **Library UI Layout:**

```
┌──────────────────────────────────────────────────────┐
│ Library                          [Dashboard]         │
├──────────────────────────────────────────────────────┤
│ [📁 All Documents ▼] [🔍 Search...] [Upload PDF]    │
│ [Grid/List] [Sort: Recent ▼] [Filter ▼]             │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ [thumb] │  │ [thumb] │  │ [thumb] │             │
│  │ Doc 1   │  │ Doc 2   │  │ Doc 3   │             │
│  │ 45%     │  │ 80%     │  │ 10%     │             │
│  │ ⭐ 📖 🗑  │  │ ⭐ 📖 🗑  │  │ ⭐ 📖 🗑  │             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                       │
│  [+ Upload more documents]                           │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Features:**
- **Folders** (left sidebar or dropdown): All, Reading, Completed, Favorites
- **View Toggle**: Grid (default) or List view
- **Search**: Real-time filter by title
- **Sort**: Recent, A-Z, Progress, Reading Time
- **Actions per card**:
  - ⭐ Favorite toggle
  - 📖 Open in reader
  - 🗑️ Delete (with confirmation)

---

### **PHASE 5: Server Actions** (3 hours)

#### **File: `src/app/actions/document-actions.ts`** (NEW - rename from upload-document.ts)

**Required Actions:**

```typescript
'use server'

// 1. uploadDocument(formData: FormData)
//    - Validate file (size <= 50MB, type = application/pdf)
//    - Generate path: documents/{user_id}/{filename}-{timestamp}.pdf
//    - Upload to Supabase Storage
//    - Insert into documents table
//    - Return { success, data: { id, title, ... } }

// 2. getAllDocuments()
//    - Fetch all docs for current user
//    - Include: id, title, file_path, reading_progress, pages_read,
//              last_read_at, upload_date, favorite, folder_id
//    - Order by upload_date DESC
//    - Return { success, data: Document[] }

// 3. getRecentDocuments(limit = 5)
//    - Fetch docs ordered by last_read_at DESC
//    - Filter: last_read_at IS NOT NULL
//    - Return { success, data: Document[] }

// 4. getFavoriteDocuments()
//    - Fetch docs where favorite = true
//    - Order by title ASC
//    - Return { success, data: Document[] }

// 5. deleteDocument(documentId: string)
//    - Auth check
//    - Fetch document to get file_path
//    - Delete from storage bucket
//    - Delete from documents table (cascade deletes sessions)
//    - Return { success }

// 6. toggleFavorite(documentId: string)
//    - Auth check
//    - Toggle favorite boolean
//    - Return { success, data: { favorite: boolean } }

// 7. getDocumentUrl(filePath: string)
//    - KEEP EXISTING (already implemented)

// 8. updateDocument(documentId, updates: { title?, folder_id? })
//    - Auth check
//    - Update document record
//    - Return { success, data: Document }
```

---

### **PHASE 6: Real-time Subscriptions** (2 hours)

#### **File: `src/hooks/useDocuments.ts`** (NEW)

```typescript
"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useDocuments(initialDocuments = []) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    // Get current user
    const getUserAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Subscribe to changes
      const channel = supabase
        .channel('documents-changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setDocuments(prev => [payload.new, ...prev])
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setDocuments(prev => prev.map(doc =>
            doc.id === payload.new.id ? payload.new : doc
          ))
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setDocuments(prev => prev.filter(doc => doc.id !== payload.old.id))
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    getUserAndSubscribe()
  }, [supabase])

  const refetch = async () => {
    setLoading(true)
    // Re-fetch from server action
    setLoading(false)
  }

  return { documents, loading, error, refetch }
}
```

---

### **PHASE 7: Database Schema Updates** (30 min)

#### **Migration: `supabase/migrations/20251005000001_add_favorites_and_folders.sql`** (NEW)

```sql
-- Add favorite column to documents
ALTER TABLE documents
ADD COLUMN favorite BOOLEAN NOT NULL DEFAULT false;

-- Add folder_id column (nullable, for future organization)
ALTER TABLE documents
ADD COLUMN folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;

-- Create folders table (optional, for Phase 2)
CREATE TABLE IF NOT EXISTS folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT folder_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Enable RLS on folders
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own folders"
  ON folders
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for favorite documents queries
CREATE INDEX IF NOT EXISTS idx_documents_user_favorite
  ON documents(user_id, favorite) WHERE favorite = true;

-- Index for recent documents queries
CREATE INDEX IF NOT EXISTS idx_documents_user_last_read
  ON documents(user_id, last_read_at DESC)
  WHERE last_read_at IS NOT NULL;

COMMENT ON COLUMN documents.favorite IS 'User-starred/favorited document';
COMMENT ON COLUMN documents.folder_id IS 'Optional folder organization';
COMMENT ON TABLE folders IS 'User-created folders for document organization';
```

---

### **PHASE 8: Testing & Integration** (3 hours)

---

## 📊 Complete File Checklist

### **Server Actions**
- [ ] `src/app/actions/document-actions.ts` (NEW - complete rewrite of upload-document.ts)
  - uploadDocument()
  - getAllDocuments()
  - getRecentDocuments()
  - getFavoriteDocuments()
  - deleteDocument()
  - toggleFavorite()
  - updateDocument()
  - getDocumentUrl() (keep existing)

### **Pages**
- [ ] `src/app/dashboard/page.tsx` (UPDATE - add Library button)
- [ ] `src/app/library/page.tsx` (NEW)
- [ ] `src/app/library/LibraryClient.tsx` (NEW)

### **Dashboard Components** (Updates/New)
- [ ] `src/components/dashboard/RecentlyRead.tsx` (NEW)
- [ ] `src/components/dashboard/FavoriteDocuments.tsx` (NEW)
- [ ] Update `src/components/dashboard/TopDocumentsList.tsx` (make clickable)

### **Library Components** (All NEW)
- [ ] `src/components/library/DocumentCard.tsx`
- [ ] `src/components/library/DocumentGrid.tsx`
- [ ] `src/components/library/UploadDialog.tsx`
- [ ] `src/components/library/DeleteConfirmDialog.tsx`
- [ ] `src/components/library/EmptyState.tsx`
- [ ] `src/components/library/FolderSidebar.tsx` (optional)

### **Hooks**
- [ ] `src/hooks/useDocuments.ts` (NEW)

### **UI Components** (shadcn - if not existing)
- [ ] `src/components/ui/dialog.tsx`
- [ ] `src/components/ui/alert-dialog.tsx`
- [ ] `src/components/ui/separator.tsx`

### **Database**
- [ ] `supabase/migrations/20251005000001_add_favorites_and_folders.sql` (NEW)

---

## 🎯 Implementation Priority Order

### **MVP - Critical Path (Must Have)** - 12-15 hours

1. **Database Schema** (30 min)
   - Add favorite column
   - Add indexes
   - Run migration

2. **Server Actions** (4 hours)
   - uploadDocument() ✅
   - getAllDocuments() ✅
   - deleteDocument() ✅
   - toggleFavorite() ✅
   - getRecentDocuments() ✅

3. **Library Page** (3 hours)
   - /library route
   - LibraryClient component
   - Basic grid layout

4. **Core Library Components** (4 hours)
   - DocumentCard
   - DocumentGrid
   - UploadDialog
   - EmptyState

5. **Dashboard Updates** (2 hours)
   - Add Library button
   - RecentlyRead component
   - Make TopDocuments clickable

6. **Real-time Updates** (2 hours)
   - useDocuments hook
   - Subscriptions

7. **Testing** (2 hours)
   - Full flow testing
   - Bug fixes

### **Phase 2 - Enhanced Features** (Optional) - 6-8 hours

8. **Folder Organization**
   - FolderSidebar
   - Folder CRUD operations
   - Drag-and-drop to folders

9. **Advanced Search/Filter**
   - Full-text search
   - Filter by status (reading/completed)
   - Sort options

10. **Favorites Dashboard Section**
    - FavoriteDocuments component
    - Dashboard layout update

---

## 🚀 User Flow After Implementation

### **New User Flow:**
```
1. Login → Dashboard (shows 0 stats)
2. Click "Library" button
3. See empty state with upload prompt
4. Upload first PDF
5. Document appears in grid
6. Click document → Opens reader
7. Read for 2 minutes
8. Close tab (session ends)
9. Click "Dashboard" button
10. See updated stats:
    - Total Time: 2 minutes
    - Recent Read: Your document (2 min ago)
    - Top Documents: Your document (2 min)
```

### **Returning User Flow:**
```
1. Login → Dashboard
2. View reading stats, recent books, favorites
3. Click recent book → Opens reader directly
4. OR click "Library" → Manage all documents
5. Upload more, organize, favorite, delete
6. Navigate back to Dashboard to see updated stats
```

---

## 📝 Key Design Decisions

### **Dashboard vs Library Separation**
- **Dashboard** = Read-only overview (stats, recent, favorites)
- **Library** = Document management (upload, organize, delete)
- Clear separation of concerns
- Dashboard is for quick access and motivation
- Library is for organization and management

### **Navigation Pattern**
```
[Landing Page] → Dashboard (default after login)
                    ↓
         [Library Button] ← → [Dashboard Button]
                    ↓
            [Library View]
                    ↓
         [Click Document] → [Reader]
                    ↓
         [Breadcrumb] → Library or Dashboard
```

### **Favorites System**
- Simple boolean flag (no ratings, just starred/not starred)
- Toggle from both library and dashboard
- Shows in dedicated section on dashboard
- Useful for frequently accessed documents

### **Folder Organization** (Optional Phase 2)
- Simple one-level folder structure
- No nested folders (keep simple)
- Smart folders: "Reading", "Completed" (auto-generated)
- User-created folders for custom organization

---

## 📊 Success Metrics

After full implementation:
- ✅ Users can upload PDFs from Library page
- ✅ Documents appear in grid with metadata
- ✅ Click to read opens in ViewportOnlyReader
- ✅ Reading sessions track time automatically
- ✅ Dashboard shows accurate stats (minutes, streaks)
- ✅ Recent read section shows last 5 documents
- ✅ Favorites work across library and dashboard
- ✅ Delete removes from storage and database
- ✅ Real-time updates reflect changes immediately
- ✅ Navigation between Dashboard/Library is clear

**Total Estimated Time**: 18-23 hours
**Risk Level**: Medium (significant new features)
**Impact**: HIGH - Core app functionality complete

---

## 🔧 Technical Implementation Details

### **Upload File Path Convention:**
```
documents/{user_id}/{original-filename}-{timestamp}.pdf
Example: documents/abc123/research-paper-1696723456789.pdf
```

### **Database Record After Upload:**
```typescript
{
  id: uuid,
  user_id: user.id,
  title: 'research-paper.pdf',
  file_path: 'documents/abc123/research-paper-1696723456789.pdf',
  file_size: 2048576,
  page_count: null, // Calculate later or leave null
  reading_progress: 0,
  pages_read: 0,
  upload_date: NOW(),
  last_read_at: null,
  favorite: false,
  folder_id: null
}
```

### **Dashboard Stats Endpoint Already Works:**
Once documents exist in database, the `/api/reading-dashboard` will automatically:
- Show total documents
- Calculate reading time when sessions are created
- Display top documents by reading time
- Track streaks when users actually read

---

## 📋 Phase-by-Phase Task Breakdown

### **PHASE 1: Keep Dashboard As-Is, Add Library Button** (30 min)
- [ ] Add Library button to dashboard header next to Refresh
- [ ] Style Library button as primary CTA (accent color)
- [ ] Add icon to Library button (FolderOpen or Library icon)

### **PHASE 2: Enhance Dashboard with Recent & Favorites** (2 hours)
- [ ] Update TopDocumentsList to show Last Read timestamp
- [ ] Add favorites system to documents table (favorite: boolean)
- [ ] Create FavoriteDocuments component for dashboard
- [ ] Add Recently Read section to dashboard (separate from Top Documents)
- [ ] Make document cards clickable to open reader directly from dashboard

### **PHASE 3: Create Library Page Structure** (4 hours)
- [ ] Create /library route (new top-level app directory)
- [ ] Build library page.tsx with auth check
- [ ] Create LibraryClient component with state management
- [ ] Add breadcrumb navigation (Dashboard < Library)

### **PHASE 4: Library Features** (6-8 hours)
- [ ] Implement upload functionality with drag-and-drop
- [ ] Create DocumentCard with thumbnail, metadata, and actions
- [ ] Add grid/list view toggle
- [ ] Implement folder/collection organization
- [ ] Add favorite toggle (star icon) on documents
- [ ] Implement search functionality
- [ ] Add sort options (name, date, progress, reading time)
- [ ] Create delete with confirmation dialog

### **PHASE 5: Server Actions** (3 hours)
- [ ] Create uploadDocument action (validate, upload to storage, insert DB)
- [ ] Create getAllDocuments action (fetch user documents with metadata)
- [ ] Create deleteDocument action (remove from storage + DB)
- [ ] Create toggleFavorite action (update favorite boolean)
- [ ] Create updateDocument action (rename, move to folder)
- [ ] Add getRecentDocuments action for dashboard
- [ ] Add getFavoriteDocuments action for dashboard

### **PHASE 6: Real-time Subscriptions** (2 hours)
- [ ] Create useDocuments hook with real-time subscriptions
- [ ] Subscribe to INSERT events for new documents
- [ ] Subscribe to UPDATE events for favorites, progress changes
- [ ] Subscribe to DELETE events to remove from UI
- [ ] Implement optimistic updates for delete action

### **PHASE 7: Database Schema Updates** (30 min)
- [ ] Add favorite column to documents table (boolean, default false)
- [ ] Add folder_id column to documents table (uuid, nullable, optional)
- [ ] Create folders table (optional - for organization)
- [ ] Add index on user_id, last_read_at for recent queries

### **PHASE 8: Testing & Integration** (3 hours)
- [ ] Test complete flow: Upload > Library view > Open reader > Sessions track
- [ ] Verify dashboard shows recent read documents correctly
- [ ] Test favorite toggle updates both library and dashboard
- [ ] Verify delete removes from storage, DB, and updates UI
- [ ] Test real-time updates in multiple browser tabs
- [ ] Verify reading sessions accumulate and show in dashboard stats
- [ ] Test responsive design on mobile/tablet for library
- [ ] Check navigation flows between Dashboard/Library/Reader

---

## 🎯 Ready to Implement!

This comprehensive plan provides everything needed to implement the complete Readix document management system with a clear separation between **Dashboard (stats view)** and **Library (document management)**.

**Next Steps:**
1. Start with Phase 1 (add Library button to dashboard)
2. Implement database schema changes
3. Build server actions for document management
4. Create library UI components
5. Add real-time subscriptions
6. Test complete user flow

The plan is designed to be implemented incrementally with clear success metrics at each phase.</content>
</xai:function_call