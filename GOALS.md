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

- **Stack**: Use Next.js 15, TypeScript, Supabase, Tailwind CSS, shadcn/ui, tRPC, Zustand, LangChain.
- **AI Model**: Self-host Llama 3.3 70B, fine-tuned for PDF RAG chat.
- **Scalability**: Monolithic, TypeScript-based architecture for rapid iteration, with easy migration paths to microservices if ever needed.
- **Performance**: Utilize Turbopack for fast development and vLLM for efficient inference.
- **Security**: Enforce authentication, use row-level security in Supabase, and ensure all data (PDF and chat history) is protected.

## User Experience Goals

- Simple, intuitive dashboard for document and chat management.
- Responsive UI across desktop and mobile.
- Fast PDF uploads with drag-and-drop support.
- Instant AI-powered chat suggestions and answers.
- Branded, professional feel using shadcn/ui.

## DevOps \& Deployment

- Deploy frontend to Vercel.
- Host Llama 3.3 70B inference server (GPU cloud or self-hosted).
- Use Supabase Cloud for database, storage, and authentication.
- Automate CI/CD with GitHub Actions.

## Future Roadmap

- Multi-user real-time collaboration (shared PDFs, chat).
- OCR (PDF scans) and annotation support.
- Domain adaptation for legal, medical, academic PDFs.
- Mobile app (if demand).
- Monetization via premium AI features or scale plans.

***

## Short-Term Plans

- Finalize monolithic project structure.
- Setup Supabase, Next.js, tRPC integration.
- Build basic PDF upload/view UX.
- Connect vLLM server locally for AI chat MVP.
- Ship MVP and collect first user feedback.

## Long-Term Plans

- Fine-tune Llama 3.3 70B with conversation data.
- Add production-grade GPU inference.
- Launch to wider audience and iterate features.
- Grow feature set based on feedback and demands.
Mobile app (if demand).

Monetization via premium AI features or scale plans.

Short-Term Plans
Finalize monolithic project structure.

Setup Supabase, Next.js, tRPC integration.

Build basic PDF upload/view UX.

Connect vLLM server locally for AI chat MVP.

Ship MVP and collect first user feedback.

Long-Term Plans
Fine-tune Llama 3.3 70B with conversation data.

Add production-grade GPU inference.

Launch to wider audience and iterate features.

Grow feature set based on feedback and demands.
