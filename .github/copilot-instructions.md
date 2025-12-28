# AI Navigation Codebase Instructions

## Project Overview
This is a Next.js 15 (App Router) project for an AI tools navigation directory. It uses a lightweight JSON-based database (`lowdb`) instead of a traditional SQL database, but implements a Prisma-like API for data access.

## Architecture & Data Layer
- **Database**: Uses `lowdb` storing data in `data/db.json`.
- **Data Access**: DO NOT use standard Prisma. Use the custom wrapper in `src/lib/db/json-client.ts` which mimics the Prisma API (`findMany`, `create`, etc.).
  - Import `prisma` from `@/lib/db/db` (which aliases the JSON client).
  - **Critical**: Data is stored in JSON files. Large datasets may impact performance.
- **State Management**: Uses `jotai` for global client state (e.g., `categoriesAtom`).
- **API Responses**: Use `AjaxResponse` class from `@/lib/utils/utils` for consistent API return formats (`AjaxResponse.ok()`, `AjaxResponse.fail()`).

## Project Structure
- `src/app/(admin)`: Admin dashboard routes.
- `src/app/(app)`: Public facing application routes.
- `src/lib/db`: Database logic. `json-db.ts` defines the schema interfaces (`Website`, `Category`, etc.).
- `data/`: Contains the JSON database files.

## Key Workflows & Commands
- **Initialize Data**: `npm run init-data` (Creates `data/db.json` if missing).
- **Backup/Restore**: 
  - Export: `npm run db:export`
  - Import: `npm run db:import`
  - Reset: `npm run db:reset`
- **Development**: `npm run dev` (Turbopack enabled).

## Conventions
- **Styling**: Tailwind CSS with `clsx` and `tailwind-merge` (via `cn` helper).
- **Components**: Radix UI primitives for accessible interactive components.
- **Icons**: Lucide React.
- **Types**: defined in `src/lib/types.ts` and `src/lib/db/json-db.ts`.

## Common Patterns
- **Fetching Data**: Server Components fetch data directly using the `prisma` wrapper.
- **Client Updates**: Use Server Actions or API routes (`src/app/api/`) for mutations, then revalidate paths.
- **Metadata**: `fetchMetadata` utility in `src/lib/utils/utils.ts` is used to scrape website info (title, description, icon) when adding new tools.

## Warnings
- **Authentication**: The admin panel currently lacks robust authentication middleware. Be cautious when exposing to public networks.
- **File System**: The app relies on writing to the local filesystem (`data/db.json`). Ensure write permissions in deployment environments.
