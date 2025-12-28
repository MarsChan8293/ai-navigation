# AI Navigation Project Instructions

You are an expert AI coding agent working on the AI Navigation project, a modern AI tool directory built with Next.js 15.

## 🏗 Architecture & Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Prisma 6 with SQLite
- **State Management**: 
  - **Server State**: SWR and React Query (TanStack Query)
  - **Client State**: Jotai (atoms located in [src/lib/atoms/index.ts](src/lib/atoms/index.ts))
- **Styling**: Tailwind CSS + Framer Motion for animations
- **UI Components**: Radix UI primitives (common components in [src/ui/common](src/ui/common))

## 🛠 Key Patterns & Conventions

### 1. API Responses
All API routes should return a consistent response format using the `AjaxResponse` class from [src/lib/utils/utils.ts](src/lib/utils/utils.ts).
```typescript
import { AjaxResponse } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.website.findMany();
  return NextResponse.json(AjaxResponse.ok(data));
}
```

### 2. Database Access
Always use the shared Prisma instance from [src/lib/db/db.ts](src/lib/db/db.ts) to avoid multiple connection issues in development.
- **Avoid**: `new PrismaClient()` inside routes.
- **Prefer**: `import { prisma } from "@/lib/db/db";`

### 3. Global State
Use Jotai atoms for cross-component state.
- Persistent state (like theme or admin mode) uses `atomWithStorage`.
- Example: `isAdminModeAtom` in [src/lib/atoms/index.ts](src/lib/atoms/index.ts).

### 4. Metadata Fetching
When adding or updating websites, use the `fetchMetadata` utility in [src/lib/utils/utils.ts](src/lib/utils/utils.ts) to scrape title, description, and thumbnails.

### 5. UI Development
- Use the `cn` utility for conditional Tailwind classes.
- Prefer components from [src/ui/common](src/ui/common) (shadcn/ui style).
- Use Framer Motion for entry animations and transitions.
- Use **Zod** for form validation (see [src/lib/utils/validations.ts](src/lib/utils/validations.ts)).

## 🚀 Developer Workflows
- **Development**: `npm run dev && sleep 20` (uses Turbopack)，attention:the web server will be ready  at least 20 seconds after run command.
- **Database Migrations**: `npx prisma migrate dev`
- **Seed Data**: `npm run init-data` (runs [src/lib/utils/init-data.ts](src/lib/utils/init-data.ts))
- **Prisma Studio**: `npx prisma studio` to view/edit data

## 📂 Directory Structure
- `src/app/api`: Backend API endpoints.
- `src/app/(admin)`: Admin-only pages and layouts.
- `src/components`: Feature-specific components (website, footer, header).
- `src/lib`: Core business logic, types, and utilities.
- `src/ui`: Reusable UI primitives.

## ⚠️ Important Notes
- The project uses a simple password-based admin authentication (see [src/app/api/login/route.ts](src/app/api/login/route.ts)).
- Website thumbnails are often stored as Base64 in the database (`thumbnail_base64`) for faster initial loading.
