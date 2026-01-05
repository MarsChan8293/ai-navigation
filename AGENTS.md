# AI Navigation - Agent Guidelines

This file provides essential information for agentic coding assistants working on this repository.

## 🚀 Build, Lint, Test Commands

```bash
# Development (takes ~20s to start)
npm run dev

# Production build
npm run build

# Linting
npm run lint

# Testing (Playwright)
npx playwright test                    # Run all tests
npx playwright test playwright-test-ipd.spec.ts  # Run single test file
npx playwright test --headed           # Run with browser UI
npx playwright test --project=chromium # Run specific browser

# Database operations
npm run init-data      # Seed initial data
npm run db:export      # Export database to JSON
npm run db:import      # Import database from JSON
npm run db:reset       # Reset database
```

## 📏 Code Style Guidelines

### Imports & Formatting
- Use `@/` for absolute imports from `src/` directory
- Group imports: external libraries → internal modules → types
- Use `cn()` utility (clsx + tailwind-merge) for conditional Tailwind classes
- No comments unless explicitly requested

### Types
- TypeScript strict mode enabled
- Define shared interfaces in `src/lib/types.ts`
- Use `type` for object interfaces, `interface` for component props
- Use union types for status fields: `Website["status"]`

### Naming Conventions
- Components: PascalCase (`WebsiteCard`, `SearchBox`)
- Utilities/functions: camelCase (`fetchMetadata`, `cn`)
- Constants: UPPER_SNAKE_CASE (rare, prefer const)
- Hooks: `use` prefix (`useCardTilt`, `useThemeEffect`)
- Atoms: descriptive with suffix (`websitesAtom`, `isAdminModeAtom`)

### Error Handling
- API routes: Return `AjaxResponse.fail(message, code)` with status code
- Try-catch around async operations with console.error
- Validate inputs with Zod schemas in `src/lib/utils/validations.ts`
- Never expose sensitive information in error messages

## 🏗 Architecture Patterns

### API Routes
- Always use shared database instance: `import { prisma } from "@/lib/db/db"`
- Return `NextResponse.json(AjaxResponse.ok(data))` for success
- Use `invalidateCache()` after data mutations
- Validate required fields before database operations
- Handle unique constraints (URLs) before insertion

### State Management
- **Server State**: SWR or React Query (@tanstack/react-query)
- **Client State**: Jotai atoms (`src/lib/atoms/index.ts`)
- Persistent state: `atomWithStorage` for localStorage
- Component state: `useState` for UI-only state

### Component Structure
- `"use client"` directive at top of client components
- Props interface above component
- Extract hooks at component start (`const isAdmin = useAtomValue(isAdminModeAtom)`)
- Use Framer Motion `motion.div` for animations
- Prefer components from `src/ui/common` (shadcn/ui primitives)

### Form Validation
- Use react-hook-form with Zod resolvers
- Define schemas in `src/lib/utils/validations.ts`
- Chinese error messages for validation

### Styling
- Tailwind CSS with custom design tokens in CSS variables
- Dark mode: `class` strategy (add/remove `dark` class)
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Gradient backgrounds with opacity for subtle effects
- Shadows with white/black variants for dark mode

## 🧪 Testing

- Use Playwright for E2E testing
- Test files: `*.spec.ts` in root
- Run single test: `npx playwright test <filename>`
- Use `expect(page.locator(selector)).toBeVisible()` pattern
- Test at http://localhost:3001 (dev server port)

## 📁 Directory Structure

```
src/
├── app/              # Next.js App Router (pages + API)
├── components/       # Feature components (website, header, footer)
├── lib/              # Core logic (types, utils, db, atoms)
├── ui/               # Reusable UI primitives (Radix-based)
├── hooks/            # Custom React hooks
└── styles/           # Global styles (Tailwind)
```

## ⚠️ Critical Rules

- Never create new `PrismaClient()` instances
- Always validate URLs before insertion
- Website thumbnails may be Base64 encoded for faster loading
- Use `fetchMetadata()` utility when creating websites
- Admin authentication uses simple password-based auth
- Cache invalidation required after data mutations
- Test locally before committing changes
