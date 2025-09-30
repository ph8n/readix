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
- **AI Integration**: OpenRouter API for chat functionality (simpler than self-hosted)
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
- Use OpenRouter API for AI inference (no infrastructure needed)
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

### **Phase 3: UX & Performance (COMPLETE)**
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
- OpenRouter API setup and configuration
- PDF text extraction using pdfjs-dist
- RAG pipeline for contextual responses
- Chat interface integration with reading experience

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
