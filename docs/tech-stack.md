# Technical Stack

## Overview

This document outlines the technical stack for the Moodboard platform, built around Next.js 14.1 and Vercel infrastructure. The stack is designed for optimal performance, developer experience, and maintainability, with strong support for real-time collaboration features.

## Core Infrastructure

### Hosting & Deployment
- **Platform:** Vercel
- **Storage:** Vercel Blob Storage
- **Database:** PostgreSQL (Neon)
- **Version Control:** GitHub
- **CI/CD:** Vercel + GitHub Actions

### AI Services
- **Text Generation:** OpenAI GPT-4
- **Image Generation:** 
  - Primary: OpenAI (Text, Image, Video)
  - Secondary: Replicate (Text, Image)

### Email Service
- **Provider:** Google SMTP
- **Templating:** React Email

### Real-time Collaboration
- **WebSocket:** Socket.io
- **Presence:** Pusher
- **State Sync:** Y.js

## Stack Implementation

### Frontend
- **Framework:** Next.js 14.1 (App Router)
- **UI Components:** 
  - Shadcn/ui (based on Radix UI)
  - Tailwind CSS
- **State Management:** 
  - Zustand (global state)
  - React Context (local state)
- **Forms:** React Hook Form + Zod
- **Data Fetching:** 
  - TanStack Query v5
  - tRPC Client

### Backend
- **API:** 
  - Next.js API Routes
  - tRPC Router
- **Authentication:** Next-Auth v5
- **Database Access:** Prisma ORM
- **Caching:** Vercel KV

### Developer Experience
- **Language:** TypeScript 5.3+
- **Package Manager:** pnpm 8+
- **Linting:** ESLint + Prettier
- **Testing:** Vitest + Testing Library
- **Documentation:** TypeDoc

## Key Benefits

1. **UI Development**
   - Shadcn/ui provides high-quality, customizable components
   - Tailwind CSS enables rapid development and consistent styling
   - Small bundle size and good performance

2. **State Management**
   - Zustand offers simple but powerful global state management
   - React Context for component-level state
   - Excellent TypeScript support

3. **Data Management**
   - TanStack Query for efficient server state management
   - Prisma ORM for type-safe database access
   - Built-in caching and optimization

4. **Developer Productivity**
   - End-to-end type safety with tRPC
   - Strong typing and good IDE support
   - Comprehensive testing tools

5. **Collaboration Features**
   - Real-time updates with WebSocket
   - Presence awareness
   - Conflict resolution
   - Type-safe API communication

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/         # React components
├── lib/               # Utility functions
├── server/            # tRPC routers and procedures
├── styles/           # Global styles
└── types/            # TypeScript types
```

## Implementation Notes

### Getting Started
1. Create Next.js project with TypeScript
```bash
pnpm create next-app@latest moodboard --typescript --tailwind --eslint
```

### Prerequisites
```bash
node >= 20.0.0
pnpm >= 8.0.0
```

### Environment Variables
```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=your-neon-database-url

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# AI Services
REPLICATE_API_TOKEN=your-replicate-token
OPENAI_API_KEY=your-openai-key

# Real-time
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
```

### Key Dependencies
```json
{
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "next-auth": "^5.0.0",
    "@trpc/server": "^11.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "socket.io": "^4.7.0",
    "socket.io-client": "^4.7.0",
    "pusher-js": "^8.4.0-rc2",
    "pusher": "^5.2.0",
    "y-websocket": "^1.5.0",
    "yjs": "^13.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "18.2.0",
    "@types/node": "20.11.0",
    "eslint": "8.56.0",
    "prettier": "^3.2.0",
    "vitest": "^1.2.0",
    "prisma": "^5.0.0"
  }
}
```

### Database Management
```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push     # Push schema changes
pnpm db:studio   # Open Prisma Studio
```

_Last updated: 2024-03-27_