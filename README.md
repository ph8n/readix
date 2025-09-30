# Readix - PDF Reader with AI Chat

A modern, zen-inspired PDF reader application with integrated AI chat capabilities for contextual document interaction.

## 🎯 Project Vision
**"Read. Reflect. Remember."** - A seamless PDF reading experience with AI-powered insights using Retrieval Augmented Generation (RAG).

## 🚀 Current Project Status (December 2024)

### ✅ **FOUNDATION COMPLETE**
- **Document Management**: Upload (50MB), library, real-time updates with Supabase
- **Authentication**: Complete user isolation with Row Level Security
- **UI Framework**: shadcn/ui components with zen aesthetic (#FEFEFE, #E8F0E3, #2C2C2C)
- **Component Architecture**: Modular PDF reader components extracted and tested
- **Navigation**: Working flow from document library to reading interface

### 🔄 **CURRENT PHASE: Reading Interface Integration**
**Status**: Foundation components built, ready for integration
- All sidebar components (DocumentInfo, ProgressPanel, PageNavigation, QuickActions) ✅
- Shared TypeScript interfaces for clean development ✅  
- Basic routing `/dashboard/read/[id]` working ✅
- **Next**: Combine components into complete reading interface

### 📅 **UPCOMING PHASES**
1. **PDF Rendering**: react-pdf integration for actual document display
2. **AI Integration**: OpenRouter API + RAG pipeline for contextual chat
3. **Enhanced Features**: Search, bookmarks, collaboration

## 🛠 Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (database/storage/auth) + tRPC  
- **UI**: shadcn/ui with zen aesthetic design
- **PDF**: react-pdf + pdfjs-dist
- **AI**: OpenRouter API (planned) with RAG capabilities

## 🏃‍♂️ Quick Start

```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── documents/          # Document library
│   │   └── read/[id]/          # PDF reading interface  
│   └── actions/                # Server actions
├── components/
│   ├── reader/                 # PDF reader components
│   │   ├── sidebar/            # Modular sidebar panels
│   │   └── types.ts            # Shared interfaces
│   └── ui/                     # shadcn/ui components
└── utils/supabase/             # Database integration
```

## 🎨 Design Philosophy

**Zen/Japanese-Inspired Minimalism**
- Warm color palette with generous whitespace
- Progressive disclosure - show only what's needed  
- Gentle transitions and contextual actions
- Focus on reading experience over feature complexity

## 🔧 Development

### Commands
- `npm run dev` - Development server with Turbopack
- `npm run build` - Production build
- `npm run lint` - ESLint checking

### Key Features Implemented
- ✅ PDF upload up to 50MB (Supabase free tier)
- ✅ Real-time document synchronization
- ✅ User authentication and document isolation
- ✅ Responsive zen aesthetic UI
- ✅ Modular component architecture
- 🔄 Reading interface integration (in progress)

## 📚 Documentation

- [`GOALS.md`](./GOALS.md) - Detailed project roadmap and progress
- [`DESIGN_PLAN.md`](./DESIGN_PLAN.md) - UI/UX design decisions and implementation status

## 🌟 Vision

Building towards a complete PDF reading experience with:
- Immersive document reading with progress tracking
- AI-powered contextual chat for document understanding  
- Clean, distraction-free interface inspired by Japanese minimalism
- Seamless integration of reading and AI interaction
