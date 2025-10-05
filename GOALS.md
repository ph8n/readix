# Goals.md

## Product Vision

- Build a modern, seamless PDF/DOC/Research paper reader application with integrated AI chat for smart contextual conversations.
- Empower users to upload, view, and interact with PDFs while leveraging AI for understanding and Q\&A.

## Core Features

- PDF uploading, storage, and management.
- In-browser PDF viewing (with React PDF and custom UI).
- AI chat integrated with real-time PDF context (Retrieval Augmented Generation).
- Secure user authentication and access control.
- Fast, reliable search and retrieval of PDF content.

## Technical Goals

- **Stack**: Next.js 15, TypeScript, Supabase, Tailwind CSS, shadcn/ui, React PDF
- **AI Integration**: Google Gemini 2.0 Flash + LangChain for RAG-powered chat
- **Scalability**: Monolithic, TypeScript-based architecture for rapid iteration
- **Performance**: Turbopack for fast development, optimistic UI updates
- **Security**: Complete user isolation with RLS policies, secure file storage

## User Experience Goals

- Simple, intuitive dashboard for document and chat management.
- Responsive UI across desktop and mobile.
- Fast PDF uploads with drag-and-drop support.
- Instant AI-powered chat suggestions and answers.
- Branded, professional feel using shadcn/ui.

## DevOps \& Deployment

- Deploy frontend to Vercel
- Use Google Gemini API for AI inference (free tier: 1M tokens/month)
- Supabase Cloud for database, storage, and authentication
- Automate CI/CD with GitHub Actions

## Future Roadmap

- Multi-user real-time collaboration (shared PDFs, chat).
- OCR (PDF scans) and annotation support.
- Domain adaptation for legal, medical, academic PDFs.
- Mobile app (if demand).
- Monetization via premium AI features or scale plans.

***

## ✅ COMPLETED FEATURES (Current State)

### **Phase 1: Foundation & Authentication (COMPLETE)**
- ✅ **Supabase Integration**: Database, storage, and authentication fully configured
- ✅ **User Authentication**: Login/signup with Supabase Auth, protected routes
- ✅ **Database Schema**: Documents table with metadata, reading progress, bookmarks
- ✅ **Storage Bucket**: User-specific file organization with security policies
- ✅ **Middleware**: Route protection and session management

### **Phase 2: Document Management (COMPLETE)**
- ✅ **PDF Upload System**: 50MB limit, drag-and-drop, file validation
- ✅ **Document Library**: Real-time document grid with metadata display
- ✅ **User Isolation**: Complete separation of documents by user
- ✅ **Real-time Updates**: Instant upload/delete without page refresh
- ✅ **File Management**: Download, delete with optimistic UI updates
- ✅ **Security**: Row Level Security, user-specific storage folders

### **Phase 3: Dashboard & Analytics (COMPLETE)**
- ✅ **Dashboard Implementation**: TanStack Query-based metrics dashboard
- ✅ **Reading Metrics**: Total time, weekly activity, document progress tracking
- ✅ **Reading Streaks**: Current streak, longest streak, activity indicators
- ✅ **Top Documents**: Most read documents with progress visualization
- ✅ **Real-time Updates**: Auto-refresh every 60 seconds with background sync
- ✅ **Error Handling**: Comprehensive error states with retry functionality
- ✅ **Responsive Design**: Mobile-first dashboard layout
- ✅ **Type Safety**: Complete TypeScript coverage for all dashboard components

### **Phase 4: UX & Performance (COMPLETE)**
- ✅ **Optimistic Updates**: Instant delete with rollback on failure
- ✅ **Real-time Subscriptions**: User-filtered Supabase subscriptions
- ✅ **Error Handling**: Comprehensive error states and recovery
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Zen Aesthetic**: Clean, minimal UI following design philosophy

## 📋 NEXT STEPS (Priority Order)

### **Immediate Priority (Next Session)**
1. **PDF Viewer Implementation**
   - React PDF integration for in-browser viewing
   - Reading interface with sidebar navigation
   - Page navigation and zoom controls
   - Reading progress tracking integration

2. **AI Chat Integration (Simplified with OpenRouter)**
   - OpenRouter API setup (much easier than self-hosted vLLM)
   - PDF text extraction using pdfjs-dist
   - Simple chat interface for document Q&A
   - Context-aware responses using document content

### **Medium Priority**
3. **Enhanced Document Features**
   - Favorites system (toggle and filter)
   - Search functionality (title and content)
   - Document thumbnails (first page preview)
   - Bulk operations (select multiple documents)

4. **Reading Experience**
   - Bookmark management interface
   - Reading progress visualization
   - Document annotations (if needed)
   - Recent documents section

### **Future Enhancements**
5. **AI Capabilities**
   - Document summarization
   - Chapter/section extraction
   - Smart search within documents
   - Reading recommendations

6. **Advanced Features**
   - Document sharing between users
   - Export/backup functionality
   - Advanced search filters
   - Usage analytics

## 🏗️ CURRENT ARCHITECTURE

```
Frontend (React/Next.js 15)
├── Authentication (Supabase Auth)
├── Document Upload (Server Actions + Storage)
├── Real-time Updates (Supabase Subscriptions)  
├── Document Library (Grid View with Metadata)
└── Optimistic UI (Instant Updates)

Backend (Supabase)
├── PostgreSQL Database (Documents + Users)
├── Storage Bucket (User-specific folders)
├── Row Level Security (Complete isolation)
├── Real-time Subscriptions (User-filtered)
└── Server Actions (Upload/Delete/Download)
```

## 🔧 TECHNICAL DECISIONS MADE

### **AI Integration: OpenRouter vs Self-hosted**
- **Decision**: Use OpenRouter API instead of self-hosted vLLM
- **Benefits**: No infrastructure, easier implementation, multiple models
- **Next**: Set up OpenRouter account and API integration

### **File Structure: User Isolation**
- **Structure**: `documents/{user_id}/{filename-timestamp}.pdf`
- **Security**: Complete user separation with RLS policies
- **Status**: ✅ Fully implemented and secure

### **Real-time Strategy: Optimistic Updates**
- **Approach**: Optimistic UI + real-time subscriptions + fallbacks
- **Benefits**: Instant feedback, error recovery, bulletproof UX
- **Status**: ✅ Working perfectly

## 🚀 MVP STATUS: CORE FEATURES COMPLETE

The document management system is **fully functional**:
- ✅ Users can upload PDFs (up to 50MB)
- ✅ Documents appear instantly in library
- ✅ Delete works without refresh
- ✅ Complete user isolation and security
- ✅ Real-time updates across sessions
- ✅ Professional UI/UX

**Ready for PDF Viewer and AI Chat integration!**

## ✅ PHASE 1 PROGRESS UPDATE (Current Session - December 2024)

### **COMPLETED - PDF Reader Foundation & Upload Fix**
- ✅ **Critical Upload Fix**: Increased file size limit from 1MB to 50MB
  - **Problem**: 1MB upload limit despite 50MB application code
  - **Root Cause**: Next.js Server Actions default 1MB body limit  
  - **Solution**: Added `serverActions: { bodySizeLimit: '50mb' }` to next.config.ts
  - **Result**: Full 50MB upload capability on Supabase free tier ✅

- ✅ **Component Architecture**: Modular PDF reader foundation built
  - **Progress UI Component**: Created missing shadcn/ui Progress component
  - **v0 Integration**: Successfully extracted v0-generated UI into modular components
  - **Sidebar Components**: All 4 panels separated and optimized:
    - ✅ DocumentInfo.tsx - Document metadata display
    - ✅ ProgressPanel.tsx - Reading progress with visual indicators  
    - ✅ PageNavigation.tsx - Page controls and jump functionality
    - ✅ QuickActions.tsx - Download and share buttons
  - **Shared Types**: Clean TypeScript interfaces eliminate code duplication
  - **Navigation System**: Document cards → /dashboard/read/[id] route working ✅

### **CURRENT PROJECT STATUS - Foundation Complete, Ready for Integration**

**File Structure Created:**
```
src/components/reader/
├── types.ts                    # ✅ Shared interfaces & type safety
└── sidebar/
    ├── DocumentInfo.tsx        # ✅ Document metadata panel
    ├── ProgressPanel.tsx       # ✅ Progress visualization with Progress component
    ├── PageNavigation.tsx      # ✅ Page navigation controls with form handling
    └── QuickActions.tsx        # ✅ Action buttons (download/share)

src/app/dashboard/read/[id]/
└── page.tsx                    # ✅ Basic route (shows document ID, ready for integration)

src/components/ui/
└── progress.tsx                # ✅ New shadcn/ui component (with Radix UI)
```

### **Architecture Decisions Made:**
- ✅ **Component Modularity**: Separated v0 monolith into 10+ focused components
- ✅ **Type Safety**: Shared TypeScript interfaces with proper prop distribution
- ✅ **User Experience Priority**: Sidebar panels prioritized for immediate user value
- ✅ **Clean Code**: Single responsibility principle throughout
- ✅ **Future-Ready**: Architecture supports react-pdf and AI chat integration
- ✅ **Zen Aesthetic**: Maintained throughout all new components

## 📋 IMMEDIATE NEXT STEPS (Phase 1 Completion - HIGH PRIORITY)

### **Status: Ready to Implement Full Reading Interface**

#### **Step 1: Document Fetching Server Action** 
**File**: `/src/app/actions/reading-actions.ts`
- Fetch real document data from Supabase with user authentication
- Transform database fields to DocumentData interface
- Handle document access control and error states
- Convert reading_progress to currentPage calculation

#### **Step 2: ReadingSidebar Container Component**  
**File**: `/src/components/reader/ReadingSidebar.tsx`
- Combine all 4 sidebar panels into 30% width container
- Handle collapse/expand state with smooth transitions
- Manage data flow to child components
- Apply zen aesthetic styling (warm colors, minimal design)

#### **Step 3: PDFReader Main Orchestrator**
**File**: `/src/components/reader/PDFReader.tsx`  
- 70/30 layout coordination (PDF area + sidebar)
- State management (currentPage, sidebar collapse, zoom, fullscreen)
- Header with document title and controls
- PDF placeholder area matching v0 design aesthetic

#### **Step 4: Integration & Testing**
**File**: `/src/app/dashboard/read/[id]/page.tsx`
- Replace basic placeholder with full PDFReader component
- Add comprehensive error handling for missing documents
- Connect real database data to UI components
- Test complete user flow: Upload → Documents → Open → Reading Interface

### **Expected Outcome After Phase 1:**
✅ **Complete Visual Interface**: Professional 70/30 layout with functional sidebar  
✅ **Real Data Integration**: Document metadata from Supabase database
✅ **Interactive Navigation**: Page controls that update display state
✅ **Professional UI**: Clean zen aesthetic throughout entire reading experience
✅ **Functional Testing**: Complete flow - Upload PDF → Click Open → Full reading interface
✅ **User Experience**: All sidebar information displays (metadata, progress, navigation, actions)

## 🚀 DEVELOPMENT PHASES

### **✅ PHASE 1A: FOUNDATION (COMPLETE)**
- Upload system with 50MB support ✅
- Document management with real-time updates ✅  
- Authentication and user isolation ✅
- Component architecture and type safety ✅
- Navigation between document library and reader ✅

### **🔄 PHASE 1B: INTEGRATION (NEXT - IMMEDIATE PRIORITY)**  
- Document data fetching from database
- ReadingSidebar container with all panels
- PDFReader main component coordination
- Complete visual reading interface with real data

### **📅 PHASE 2: PDF RENDERING (FUTURE)**
- react-pdf Document/Page integration
- PDF controls (zoom, fullscreen, search)
- Reading progress persistence to database  
- Error handling for corrupted PDFs
- Mobile responsive optimization

### **📅 PHASE 3: AI INTEGRATION (FUTURE)**

#### **Phase 3A: Simple Context Chat (MVP - Week 3)**
- Google Gemini API setup with LangChain
- PDF text extraction using pdfjs-dist (already installed)
- Simple chat: Pass full PDF text in context (works for PDFs up to ~500 pages)
- Basic chat interface integrated with reading experience
- **Time**: 1-2 days | **Cost**: Free tier (1M tokens/month)

#### **Phase 3B: Advanced RAG (Optional - Week 4+)**
- Document chunking and embeddings generation
- Supabase pgvector setup for vector storage
- Semantic search with LangChain retrieval chains
- Multi-document chat support
- **Time**: 3-4 days | **Cost**: ~$5-15/month (after free tier)

**Why Gemini + LangChain:**
- ✅ **Cost**: 10-20x cheaper than OpenRouter (free tier very generous)
- ✅ **Context**: 1M token window perfect for entire PDFs
- ✅ **Architecture**: LangChain provides RAG abstractions and flexibility
- ✅ **Integration**: Native Supabase pgvector support via LangChain
- ✅ **Future-proof**: Easy to switch models with LangChain abstraction layer

## Short-Term Plans (Updated - December 2024)

- ✅ Finalize monolithic project structure  
- ✅ Setup Supabase, Next.js integration
- ✅ Build PDF upload/management system
- ✅ Fix critical 1MB upload limitation 
- ✅ Create modular component architecture for PDF reader
- 🔄 **CURRENT**: Complete Phase 1B - Full reading interface with sidebar components
- 📅 **NEXT**: Implement react-pdf for actual PDF rendering
- 📅 **NEXT**: Connect OpenRouter API for AI chat MVP
- 📅 Ship MVP and collect first user feedback

## Long-Term Plans

- Implement advanced AI features with OpenRouter
- Add collaborative features (document sharing)
- Launch to wider audience and iterate features
- Mobile app (if demand exists)
- Monetization via premium AI features or scale plans

---

## 📘 CODING CONVENTIONS & STYLE GUIDE

> **For AI Agents**: Follow these conventions when generating or modifying code

### **Naming Conventions**

#### **Files & Folders**
- **Pages (default exports)**: `PascalCase` + descriptive suffix
  - ✅ `LoginPage.tsx`, `DocumentsPage.tsx`, `ReadPage.tsx`
  - ✅ `DashboardLayout.tsx`
- **Components**: `PascalCase.tsx`
  - ✅ `UploadDialog.tsx`, `DocumentInfo.tsx`, `ReadingSidebar.tsx`
- **Utilities/Libs**: `kebab-case.ts`
  - ✅ `document-utils.ts`, `env.ts`, `utils.ts`
- **Actions**: `kebab-case.ts` or descriptive names
  - ✅ `upload-document.ts`, `reading-actions.ts`
- **Hooks**: `camelCase.ts` starting with `use`
  - ✅ `useDocuments.ts`, `useReadingProgress.ts`

#### **Variables & Functions**
- **Functions**: `camelCase`
  - ✅ `formatFileSize()`, `transformDocumentForReader()`, `getDocumentUrl()`
- **Server Actions**: `camelCase` (async)
  - ✅ `export async function uploadDocument()`
  - ✅ `export async function getDocumentForReading()`
- **Components**: `PascalCase`
  - ✅ `function Button()`, `function DocumentInfo()`
  - ✅ `export default function LoginPage()`
- **Constants**: `SCREAMING_SNAKE_CASE`
  - ✅ `MAX_FILE_SIZE`, `SUPABASE_URL`, `AVG_READING_TIME_PER_PAGE`
- **Variables**: `camelCase`
  - ✅ `const documentId`, `const currentPage`, `const isCollapsed`

#### **Types & Interfaces**
- **Interfaces**: `PascalCase`
  - ✅ `interface DocumentData`, `interface ReadingSidebarProps`
- **Types**: `PascalCase`
  - ✅ `type Document`, `type UploadState`
- **Enums**: `PascalCase` for name, `SCREAMING_SNAKE_CASE` for values
  - ✅ `enum Status { PENDING = 'PENDING', SUCCESS = 'SUCCESS' }`

### **Code Organization**

#### **Import Order**
```typescript
// 1. React/Next.js core
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party libraries
import { createClient } from '@supabase/ssr'

// 3. Internal components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 4. Internal utilities/hooks
import { formatFileSize } from '@/lib/document-utils'
import { useDocuments } from '@/hooks/useDocuments'

// 5. Actions
import { uploadDocument } from '@/app/actions/upload-document'

// 6. Types (use type imports)
import type { Document } from '@/hooks/useDocuments'
import type { DocumentData } from '@/components/reader/types'

// 7. Icons (Lucide React)
import { Upload, FileText, Download } from 'lucide-react'
```

#### **File Structure**
```typescript
// 1. "use client" or "use server" directive (if needed)
"use client"

// 2. Imports (organized as above)

// 3. Types/Interfaces (local to file)
interface ComponentProps {
  // ...
}

// 4. Constants (local to file)
const MAX_ITEMS = 10

// 5. Helper functions (before component)
function helperFunction() {
  // ...
}

// 6. Main component/function
export default function Component() {
  // ...
}

// 7. Additional exports (if any)
export { helperFunction }
```

### **TypeScript Conventions**

#### **Type Safety**
- ✅ **DO**: Use explicit types for function parameters and returns
  ```typescript
  export async function getDocument(id: string): Promise<Document | null>
  ```
- ✅ **DO**: Use type imports for types
  ```typescript
  import type { Document } from '@/hooks/useDocuments'
  ```
- ❌ **DON'T**: Use `any` type
- ❌ **DON'T**: Use non-null assertions (`!`) without validation
  - Exception: After validation in `src/lib/env.ts`

#### **Interfaces vs Types**
- **Interfaces**: For component props, object shapes
  ```typescript
  interface ButtonProps {
    variant?: 'default' | 'outline'
    size?: 'sm' | 'md' | 'lg'
  }
  ```
- **Types**: For unions, intersections, utility types
  ```typescript
  type Status = 'idle' | 'loading' | 'success' | 'error'
  type Document = DatabaseDocument & { computed: string }
  ```

### **React/Next.js Patterns**

#### **Components**
- **Server Components** (default): No "use client" directive
  ```typescript
  export default async function ServerPage() {
    const data = await fetchData()
    return <div>{data}</div>
  }
  ```
- **Client Components**: Add "use client" at top
  ```typescript
  "use client"
  
  export default function ClientComponent() {
    const [state, setState] = useState()
    return <div>{state}</div>
  }
  ```

#### **Server Actions**
- Always mark with "use server" or in separate file
- Use async/await
- Include proper error handling
  ```typescript
  'use server'
  
  export async function serverAction(formData: FormData) {
    try {
      // Authenticate
      // Validate
      // Execute
      return { success: true, data }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  ```

#### **Hooks**
- Custom hooks start with `use`
- Return object with named properties
  ```typescript
  export function useDocuments() {
    const [documents, setDocuments] = useState([])
    
    return {
      documents,
      loading,
      error,
      refetch
    }
  }
  ```

### **Styling Conventions**

#### **Tailwind CSS**
- Use utility classes, avoid custom CSS unless necessary
- Follow mobile-first responsive design
  ```typescript
  className="p-4 md:p-6 lg:p-8"
  ```
- Use `cn()` helper for conditional classes
  ```typescript
  import { cn } from '@/lib/utils'
  
  className={cn(
    "base-classes",
    isActive && "active-classes",
    variant === 'primary' && "primary-classes"
  )}
  ```

#### **Color Palette (Zen Aesthetic)**
- **Background**: `#FEFEFE` (warm white)
- **Foreground**: `#2C2C2C` (charcoal)
- **Accent**: `#E8F0E3` (sage green)
- **Muted**: `#F5F5F5` (light gray)
- **Border**: `#E5E7EB`

Use semantic color names:
```typescript
className="bg-background text-foreground border-border"
className="bg-accent text-accent-foreground"
```

#### **Typography**
- **Headings**: `font-serif` (Playfair Display)
- **Body**: `font-sans` (Inter)
  ```typescript
  <h1 className="font-serif text-2xl font-bold">Title</h1>
  <p className="font-sans text-base">Body text</p>
  ```

### **Database Conventions**

#### **Field Naming**
- **Database**: `snake_case`
  - ✅ `user_id`, `file_path`, `upload_date`, `page_count`
- **TypeScript**: `camelCase`
  - ✅ `userId`, `filePath`, `uploadDate`, `pageCount`

#### **Transformations**
Always transform database fields to TypeScript conventions:
```typescript
// Database Document
{
  id: string
  user_id: string
  file_path: string
  page_count: number
  upload_date: string
}

// TypeScript Document (after transformation)
{
  id: string
  userId: string
  filePath: string
  pageCount: number
  uploadDate: Date
}
```

Use `transformDocumentForReader()` from `@/lib/document-utils` for reader components.

### **Error Handling**

#### **Pattern**
```typescript
try {
  // Attempt operation
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  
  // User-friendly error message
  const message = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred'
  
  return { success: false, error: message }
}
```

#### **Error Messages**
- ✅ User-friendly, actionable
- ✅ No stack traces or technical jargon
- ✅ Suggest next steps when possible

```typescript
// Good
"File size must be less than 50MB"
"Please check your email to confirm your account"

// Bad
"ERR_FILE_TOO_LARGE"
"Authentication failed with status 401"
```

### **Comments & Documentation**

#### **When to Comment**
- ✅ Complex business logic
- ✅ Non-obvious workarounds
- ✅ TODO items with context
- ❌ Obvious code (let the code speak)

```typescript
// ✅ Good comment
// Calculate reading time assuming 60 seconds per page
const estimatedTime = (totalPages - currentPage) * 60

// ❌ Bad comment (obvious)
// Set the page to 1
setPage(1)

// ✅ Good TODO
// TODO: Add rate limiting (max 10 uploads/hour) - Issue #10
```

#### **Function Documentation**
For complex functions, use JSDoc:
```typescript
/**
 * Transforms database document to reader-compatible format
 * @param dbDoc - Document from Supabase database
 * @returns DocumentData with camelCase fields and formatted values
 */
export function transformDocumentForReader(dbDoc: Document): DocumentData {
  // ...
}
```

### **Testing Conventions** (When Implemented)

- Test files: `ComponentName.test.tsx`
- Test descriptions: Describe user behavior
  ```typescript
  describe('UploadDialog', () => {
    it('shows error when file exceeds 50MB', () => {
      // ...
    })
  })
  ```

### **Git Commit Messages**

Follow conventional commits:
```
feat: add reading progress tracking
fix: resolve type mismatch in reader components
docs: update coding conventions in GOALS.md
refactor: extract formatFileSize to shared utility
chore: update dependencies
```

### **Environment Variables**

- Prefix public vars: `NEXT_PUBLIC_*`
- Validate all env vars in `src/lib/env.ts`
- Never commit `.env.local` (use `.env.example`)

### **Performance Best Practices**

- Use Server Components by default
- Add "use client" only when needed (useState, useEffect, etc.)
- Lazy load heavy components
- Optimize images with Next.js Image component
- Use React.memo() for expensive renders (sparingly)

### **Security Best Practices**

- Never log sensitive data
- Validate all user inputs
- Use RLS (Row Level Security) for database access
- Sanitize file uploads
- Use environment variables for secrets
- Implement rate limiting on server actions

---

## 🔗 Related Documentation

- **ACTION_PLAN.md** - Current sprint and task tracking
- **PROGRESS_LOG.md** - Daily development log
- **ISSUES.md** - Bug tracking and technical debt
- **DESIGN_PLAN.md** - UI/UX guidelines and zen aesthetic
- **AGENTS.md** - AI agent guidelines (being deprecated/merged)

---

**Conventions Last Updated**: October 1, 2025
