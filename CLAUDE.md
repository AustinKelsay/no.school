# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

Comprehensive technical documentation is available in the `/docs` directory:
- [Profile System Architecture](./docs/profile-system-architecture.md) - Multi-account profile management
- [Profile API Reference](./docs/profile-api-reference.md) - Complete API documentation
- [Profile Implementation Guide](./docs/profile-implementation-guide.md) - Implementation details
- [Documentation Index](./docs/README.md) - All available documentation

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production (includes prisma generate)
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema changes
npm run db:seed      # Seed database with sample data

# Database operations (requires DATABASE_URL environment variable)
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes to database
npx prisma migrate dev  # Create and apply new migration
npx prisma studio       # Open Prisma Studio for database browsing
```

## Important Development Workflow

When making changes to this codebase:
1. **Always run linting**: Use `npm run lint` after making changes
2. **Check build success**: Run `npm run build` to ensure no compilation errors
3. **Database Adapter Pattern**: Use adapters for all data access - never access data directly
4. **Type Safety**: Maintain strict TypeScript compliance with runtime Zod validation
5. **Caching**: All adapter methods include built-in caching for performance
6. **Database Changes**: Use `npx prisma generate` after schema changes, `npx prisma db push` for development

## ESLint Configuration

The project uses a customized ESLint configuration in `eslint.config.mjs`:
- Extends `next/core-web-vitals` and `next/typescript`
- **Disabled Rules**: 
  - `@typescript-eslint/no-unused-vars` and `no-unused-vars`
  - `@typescript-eslint/no-unused-params` and `no-unused-params`
  - `@typescript-eslint/no-explicit-any`

## Project Architecture

This is a **Next.js 15** application with **React 19** using the App Router pattern. The project demonstrates a sophisticated developer education platform with **hybrid data architecture** combining traditional databases with **Nostr protocol** for content management.

### Key Architectural Patterns

#### Hybrid Data Architecture
The project uses a unique **Database + Nostr Events** approach:
- **Minimal Database Fields**: Only essential data (ID, price, timestamps, relations) stored in PostgreSQL
- **Rich Content from Nostr**: Full content comes from NIP-23 (free) and NIP-99 (paid) events
- **Unified Display Layer**: Combines both sources for complete UI data via Display interfaces
- **Development Mode**: JSON mock files + real Nostr events for rapid development without database setup

#### Database Adapter Pattern
Clean data access abstraction in `src/lib/db-adapter.ts`:
- **CourseAdapter**: CRUD operations with JSON database simulation + Nostr event integration
- **ResourceAdapter**: Handles both documents and videos from JSON files + Nostr events
- **LessonAdapter**: Course-to-resource relationships with JSON persistence
- **Performance**: Built-in hierarchical caching for sub-50ms response times
- **IMPORTANT**: Always use adapters, never access mock data or database directly

#### Nostr Integration
Real-time content management through Nostr protocol:
- **SnstrProvider**: Context provider for relay pool management in `src/contexts/snstr-context.tsx`
- **Event Parsing**: Parser functions in `src/data/types.ts` convert Nostr events to UI data
- **Publishing System**: Complete draft-to-Nostr publishing flow with NIP-07 browser extension support
- **Atomic Operations**: All draft lessons published before course creation

### Key Architectural Files

#### Data Management
- `src/data/types.ts` - **Complete type system**: Database models, Nostr event types, Display interfaces, and parser functions
- `src/lib/db-adapter.ts` - **Database adapter pattern**: Clean data abstraction with JSON mock + Nostr integration
- `src/data/mockDb/` - **JSON mock database**: Course.json, Resource.json, Lesson.json files for development
- `src/lib/cache.ts` - **Production caching**: Hierarchical L1/L2 cache with TTL and statistics

#### Authentication System
- `src/lib/auth.ts` - **Dual Identity Architecture**: 
  - **Nostr-first** (NIP07, Anonymous): Nostr profile is source of truth, syncs on every login
  - **OAuth-first** (Email, GitHub): OAuth profile is authoritative, gets ephemeral Nostr keys
- **5 Authentication Methods**: Email magic links, GitHub OAuth, NIP07 browser extension, Anonymous, Recovery mode
- **Universal Nostr Access**: All users get Nostr capabilities with appropriate key custody models

#### Publishing System
- `src/lib/nostr-events.ts` - **Event builders**: Create NIP-23/NIP-99/NIP-51 compliant events
- `src/lib/publish-service.ts` - **Publishing service**: Atomic operations for drafts to Nostr
- `src/lib/draft-service.ts` - **Draft management**: CourseDraftService, DraftService, DraftLessonService classes

#### API Routes
- `/api/health` - Health check endpoint
- `/api/courses` - Course CRUD with validation
- `/api/resources` - Resource management endpoints
- `/api/drafts/*/publish` - Publishing endpoints for drafts
- **Error Handling**: Structured error classes (NotFoundError, ValidationError, etc.)
- **Validation**: Comprehensive Zod schemas matching TypeScript types

### Core Technologies
- **Next.js 15.3.5** with Turbopack
- **React 19** with Server Components
- **TypeScript** with strict mode
- **Tailwind CSS v4** with shadcn/ui
- **snstr** for Nostr protocol
- **Zod** for runtime validation
- **@tanstack/react-query** for data fetching
- **NextAuth.js** with Prisma adapter
- **Prisma** with PostgreSQL

### Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for JWT encryption
- `NEXTAUTH_URL` - Application URL (e.g., http://localhost:3000)

**Optional (for GitHub OAuth):**
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

## Code Style Guidelines

1. **Component Structure**:
   - Use function declarations for pages: `export default function PageName() {}`
   - Use arrow functions for components: `export const ComponentName = () => {}`

2. **Import Organization**:
   - React/Next imports first
   - Third-party libraries
   - Internal components
   - Types/interfaces
   - Utils/lib functions

3. **Data Access**:
   - ALWAYS use adapters (CourseAdapter, ResourceAdapter, etc.)
   - NEVER access mock data or database directly
   - Always check cache before fetching data

4. **Error Handling**:
   - Use try-catch blocks for async operations
   - Return structured error responses from API routes
   - Use custom error classes

## Smart Image Optimization
- **OptimizedImage Component**: Automatically handles images from any domain without manual configuration
- **Seamless Fallback**: Uses `unoptimized` prop for unknown domains
- **Pre-configured Domains**: Unsplash, GitHub avatars, YouTube thumbnails, DiceBear, DigitalOcean Spaces

## Git Workflow

When creating commits:
1. **Always run**: `npm run lint` and `npm run build` before committing
2. **Database changes**: Run `npx prisma generate` after schema changes
3. **Atomic commits**: Keep commits focused on single features or fixes

## Common Pitfalls to Avoid

1. **Don't add domains to next.config.ts** - Use OptimizedImage component instead
2. **Don't create new mock data files** - Use existing JSON structure
3. **Don't bypass the adapter pattern** - Always use adapters for data access
4. **Don't ignore TypeScript errors** - Fix them properly
5. **Don't skip cache invalidation** - Update caches when data changes
6. **Don't create files unless necessary** - Prefer editing existing files