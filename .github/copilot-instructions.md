# AI Navigation Project Instructions

## 🏗 Architecture & Tech Stack
- **Framework**: Next.js 15 (App Router with Turbopack)
- **Database**: Prisma 6 with SQLite. Use the shared instance from [src/lib/db/db.ts](src/lib/db/db.ts).
- **State Management**: 
  - **Server State**: [SWR](https://swr.vercel.app/) and [TanStack Query](https://tanstack.com/query/latest).
  - **Client State**: [Jotai](https://jotai.org/) (atoms in [src/lib/atoms/index.ts](src/lib/atoms/index.ts)).
- **Styling**: Tailwind CSS + Framer Motion for animations.
- **UI Components**: Radix UI primitives (common components in [src/ui/common](src/ui/common)).

## 🛠 Key Patterns & Conventions

### 1. API Responses
Use `AjaxResponse` from [src/lib/utils/utils.ts](src/lib/utils/utils.ts) for consistent JSON structure.
```typescript
import { AjaxResponse } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.website.findMany();
  return NextResponse.json(AjaxResponse.ok(data));
}
```

### 2. Website Metadata & Thumbnails
Use `fetchMetadata` in [src/lib/utils/utils.ts](src/lib/utils/utils.ts) to scrape site info. 
- Thumbnails are often stored as Base64 in the `thumbnail_base64` field of the `Website` model to avoid external hotlinking issues.

### 3. Persistent Client State
Use `atomWithStorage` from Jotai for persistent settings like theme or admin mode.
- Example: `isAdminModeAtom` in [src/lib/atoms/index.ts](src/lib/atoms/index.ts).

### 4. Form Validation
Use [Zod](https://zod.dev/) schemas located in [src/lib/utils/validations.ts](src/lib/utils/validations.ts).

## 🚀 Developer Workflow
- **Start Dev**: `npm run dev` (uses Turbopack)
- **Database**: 
  - Migrate: `npx prisma migrate dev`
  - Studio: `npx prisma studio`
  - Seed/Init: `npm run init-data` (runs [src/lib/utils/init-data.ts](src/lib/utils/init-data.ts))

## 📂 Key Directories
- `src/app`: Routes and API endpoints.
- `src/components` & `src/ui`: Reusable UI elements and logic.
- `src/lib/tasks`: Background tasks or migration scripts (e.g., `update-thumbnails.ts`).
- `src/lib/sync`: OSS synchronization logic (backup/restore).

## ⚠️ Important Implementation Details
- **Prisma**: Never `new PrismaClient()` in local routes; always import `{ prisma } from "@/lib/db/db"`.
- **Animations**: Prefer `Framer Motion` over raw CSS transitions for complex interactions.
- **Admin Authentication**: Handled via simple password check in `src/app/api/login/route.ts`.
