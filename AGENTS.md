# Agent Guidelines for Readix

## Project Overview
- PDF/document reader with AI chat capabilities using RAG (Retrieval Augmented Generation)
- Target: Upload, view, and interact with PDFs through AI-powered contextual conversations
- Architecture: Monolithic TypeScript for rapid iteration, migration-ready for microservices

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: tRPC, Supabase (database/storage/auth)
- **UI Components**: shadcn/ui for branded, professional interface
- **State Management**: Zustand
- **AI/ML**: LangChain, self-hosted Llama 3.3 70B via vLLM
- **PDF Handling**: React PDF for in-browser viewing

## Build/Lint/Test Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- No test suite configured yet

## Code Style Guidelines

### TypeScript & Imports
- Use TypeScript with strict mode enabled
- Import types with `import type { Type } from "module"`
- Use path aliases: `@/*` maps to `./src/*`
- Named exports for components, default exports for pages

### React/Next.js Conventions
- Use React 19 with Next.js 15 App Router
- Server Components by default, mark Client Components with `"use client"`
- Export metadata from pages: `export const metadata: Metadata = {...}`
- Use `export default function ComponentName()` for components

### Styling & Formatting
- Use Tailwind CSS v4 for styling
- Follow utility-first approach with responsive classes
- Use template literals for dynamic class names
- Prefer semantic HTML elements

### Security & Database
- Use Supabase row-level security (RLS) for all data access
- Enforce authentication for all PDF and chat operations
- Protect user data and chat history with proper access controls
- Use Supabase client with TypeScript for type-safe database operations

### AI Integration
- Use LangChain for RAG pipeline implementation
- Structure prompts for PDF context and chat continuity
- Handle vLLM server communication for inference
- Implement context-aware chat with document retrieval

### UI/UX Guidelines
- Use shadcn/ui components for consistent, professional design
- Implement responsive design for desktop and mobile
- Support drag-and-drop PDF uploads
- Provide instant AI chat suggestions and answers
- Follow accessibility best practices