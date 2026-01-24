# AGENTS.md - AI Navigation Project Guide

This file contains essential information for agentic coding agents working on this repository.

## Build/Lint/Test Commands

### Development
- `npm run dev` - Start dev server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- Type checking: Run `npx tsc --noEmit` (typescript strict mode enabled)

### Database
- `npx prisma migrate dev` - Create/run migrations
- `npx prisma studio` - Open database GUI
- `npm run init-data` - Initialize seed data

### Tests
- No test framework currently configured

## Code Style Guidelines

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017
- Module resolution: bundler

### Imports
- Use `@/` alias for src directory imports
- Third-party imports before local imports
- Example: `import { prisma } from "@/lib/db/db";`

### Component Directives
- `'use client';` at the top of client components
- Server components are default (no directive needed)

### Naming Conventions
- Components: PascalCase (e.g., `Analytics`)
- Hooks: camelCase with `use` prefix (e.g., `useEffect`)
- Atoms: camelCase with `Atom` suffix (e.g., `websitesAtom`)
- Functions: camelCase
- Files: kebab-case for utilities, PascalCase for components

### Styling
- Tailwind CSS with dark mode (class-based)
- Use `cn()` utility from `@/lib/utils/utils.ts` for conditional classes
- Example: `cn("base-class", isActive && "active-class")`
- CSS variables for theming: `hsl(var(--primary))`

### Database (Prisma)
- NEVER `new PrismaClient()` in routes - always import singleton:
  - `import { prisma } from "@/lib/db/db";`
- Singleton pattern prevents multiple connections in dev

### State Management
- **Server State**: SWR or TanStack Query
- **Client State**: Jotai atoms from `@/lib/atoms/index.ts`
- Use `atomWithStorage` for persistent state (e.g., `isAdminModeAtom`)

### API Responses
- Use `AjaxResponse<T>` wrapper from `@/lib/utils/utils.ts`
- Success: `AjaxResponse.ok(data)`
- Failure: `AjaxResponse.fail(message, code)`
- Wrap in `NextResponse.json()`

### Form Validation
- Zod schemas in `src/lib/utils/validations.ts`
- Define schemas before using in forms
- Example: `websiteFormSchema`, `useCaseFormSchema`

### UI Components
- Radix UI primitives in `src/ui/common/`
- Use existing components before creating new ones
- Framer Motion for animations (preferred over CSS transitions)

### Error Handling
- Use `AjaxResponse.fail()` for API errors
- Zod validation for form errors
- Standard try-catch blocks with descriptive error messages

### Website Metadata
- Use `fetchMetadata(url)` from `@/lib/utils/utils.ts` for scraping
- Thumbnails often stored as Base64 in `thumbnail_base64` field

### Key Directories
- `src/app` - Routes and API endpoints
- `src/components` - Feature-specific components
- `src/ui` - Reusable UI primitives
- `src/lib` - Utilities, atoms, database, types
- `src/hooks` - Custom React hooks

### Important Patterns from Copilot Rules
- Always use shared Prisma instance, never instantiate locally
- Use Zod for form validation
- Maintain consistent API response structure with AjaxResponse
- Use `atomWithStorage` for settings persistence
- Prefer Framer Motion for complex animations

### Code Organization
- Keep utility functions in `src/lib/utils/`
- Store type definitions in `src/lib/types/`
- Background tasks in `src/lib/tasks/`
- OSS sync logic in `src/lib/sync/`

### Environment
- Copy `.env.example` to `.env.local` for local development
- Database URL and API keys in environment variables
