# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production (includes prisma generate)
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema changes
npm run db:seed      # Seed database with sample data

# When making changes, always run linting to ensure code quality
```

## ESLint Configuration

The project uses a customized ESLint configuration in `eslint.config.mjs`:
- Extends `next/core-web-vitals` and `next/typescript`
- **Disabled Rules**: 
  - `@typescript-eslint/no-unused-vars` and `no-unused-vars`
  - `@typescript-eslint/no-unused-params` and `no-unused-params`
  - `@typescript-eslint/no-explicit-any`
- This allows for cleaner development without unused variable/parameter warnings and explicit any type warnings during active development

## Database Commands

```bash
# Database operations (requires DATABASE_URL environment variable)
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes to database
npx prisma migrate dev  # Create and apply new migration
npx prisma studio       # Open Prisma Studio for database browsing
npm run db:seed         # Seed database with sample data

# Development with hybrid data
npm run dev             # Uses JSON mock data + real Nostr events for optimal development experience
```

## Testing Commands

```bash
# No formal testing framework is currently configured
# When implementing tests, check the codebase first to determine the testing approach
# Ask the user for specific test commands if tests are added in the future
```

## Important Development Workflow

When making changes to this codebase:
1. **Always run linting**: Use `npm run lint` after making changes
2. **Check build success**: Run `npm run build` to ensure no compilation errors
3. **Database Adapter Pattern**: Use adapters for all data access - never access data directly
4. **Type Safety**: Maintain strict TypeScript compliance with runtime Zod validation
5. **Caching**: All adapter methods include built-in caching for performance
6. **Database Changes**: Use `npx prisma generate` after schema changes, `npx prisma db push` for development
7. **Authentication Flow**: Test all 5 auth methods (Email, GitHub, NIP07, Anonymous, Recovery)
8. **Environment Variables**: Required vars include DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, GITHUB_CLIENT_ID/SECRET (if using GitHub)
9. **Dual Identity Model**: Understand the difference between Nostr-first (user controls keys) and OAuth-first (platform manages keys) authentication flows
10. **Configuration Files**: Check `config/auth.json` and `config/theme.json` for runtime configuration options

## Project Architecture

This is a **Next.js 15** application with **React 19** using the App Router pattern. The project demonstrates a sophisticated developer education platform with **hybrid data architecture** combining traditional databases with **Nostr protocol** for content management.

### Key Architectural Files

#### Data Management
- `src/data/types.ts` - **Complete type system**: Database models, Nostr event types, Display interfaces, and parser functions
- `src/lib/db-adapter.ts` - **Database adapter pattern**: Clean data abstraction with JSON mock + Nostr integration
- `src/data/mockDb/` - **JSON mock database**: Course.json, Resource.json, Lesson.json files for development
- `src/lib/cache.ts` - **Production caching**: Hierarchical L1/L2 cache with TTL and statistics

#### Authentication & Session
- `src/lib/auth.ts` - **NextAuth configuration**: 5 providers (Email, GitHub, NIP07, Anonymous, Recovery)
- `config/auth.json` - **Auth configuration**: Provider settings, session handling, UI copy
- **Dual Identity Architecture**: Nostr-first (user controls keys) vs OAuth-first (platform manages keys)

#### Nostr Integration
- `src/contexts/snstr-context.tsx` - **Nostr relay pool**: Connection management to production relays
- `src/data/nostr-events.ts` - **Event examples**: Real NIP-23/NIP-99 events and parser utilities
- `src/lib/nostr-events.ts` - **Event builders**: Create NIP-23/NIP-99/NIP-51 compliant events
- `src/lib/publish-service.ts` - **Publishing service**: Atomic operations for drafts to Nostr

#### Theme System
- `src/lib/theme-config.ts` - **47 theme definitions**: Complete color schemes with font pairings
- `src/contexts/theme-context.tsx` - **Theme management**: Runtime theme switching and persistence
- `config/theme.json` - **Theme UI controls**: Toggle visibility and force default values

#### API & Validation
- `src/lib/api-utils.ts` - **API utilities**: Validation helpers, error handling, response formatting
- `src/lib/secure-actions.ts` - **Server actions**: Rate limiting, validation, role-based access
- Zod schemas throughout for runtime validation matching TypeScript types

### Core Technologies
- **Next.js 15.3.5** with Turbopack for development
- **React 19** with Server Components and Server Actions
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with shadcn/ui components
- **next-themes** for theme management with custom theme system
- **snstr** for Nostr protocol integration
- **Zod** for runtime type validation
- **@tanstack/react-query** for data fetching and caching
- **zapthreads** for Lightning Network integration and Bitcoin payments
- **react-markdown** with syntax highlighting for content rendering
- **NextAuth.js** with Prisma adapter for authentication
- **Prisma** with PostgreSQL for database management
- **Authentication Providers**: Email magic links, GitHub OAuth, NIP07 Nostr, Anonymous, and Recovery modes

### Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for JWT encryption
- `NEXTAUTH_URL` - Application URL (e.g., http://localhost:3000)

**Optional:**
- `GITHUB_CLIENT_ID` - For GitHub OAuth (required if using GitHub auth)
- `GITHUB_CLIENT_SECRET` - For GitHub OAuth (required if using GitHub auth)
- `EMAIL_SERVER` - SMTP server for email magic links
- `EMAIL_FROM` - From address for emails

### Key Architectural Patterns

#### Hybrid Data Architecture (CRITICAL)
The project uses a unique **Database + Nostr Events** approach:
- **Minimal Database Fields**: Only essential data (ID, price, timestamps, relations) stored in traditional database
- **Rich Content from Nostr**: Full content comes from NIP-23 (free) and NIP-99 (paid) events
- **Database Models**: Course, Resource, Lesson with minimal fields only
- **Nostr Event Types**: NostrCourseListEvent (kind 30004), NostrFreeContentEvent (kind 30023), NostrPaidContentEvent (kind 30402)
- **Unified Display Layer**: Combines both sources for complete UI data via Display interfaces
- **Development Mode**: JSON mock files + real Nostr events for rapid development without database setup

#### Database Adapter Pattern Implementation
Clean data access abstraction with JSON mock database in `src/lib/db-adapter.ts`:
- **CourseAdapter**: CRUD operations with JSON database simulation + Nostr event integration
- **ResourceAdapter**: Handles both documents and videos from JSON files + Nostr events
- **LessonAdapter**: Course-to-resource relationships with JSON persistence
- **Nostr Integration**: Built-in support for combining database metadata with Nostr content
- **Performance Simulation**: Realistic database delays and pagination support
- **Cache Integration**: All adapters use hierarchical caching for sub-50ms response times

#### Hierarchical Caching System
Production-ready caching in `src/lib/cache.ts`:
- **L1 Memory Cache**: Fast in-memory storage with LRU eviction
- **Tagged Cache**: Complex invalidation patterns with cache statistics
- **TTL Support**: Configurable expiration (5min default for repositories)
- **Pattern Invalidation**: Bulk cache operations for related data

#### Nostr Integration with snstr
Real-time content management through Nostr protocol:
- **SnstrProvider**: Context provider for relay pool management in `src/contexts/snstr-context.tsx`
- **RelayPool**: Shared connection pool across 8 production relays:
  - wss://relay.nostr.band
  - wss://nos.lol
  - wss://relay.damus.io
  - wss://relay.snort.social
  - wss://relay.primal.net
  - wss://nostr.wine
  - wss://relay.nostr.bg
  - wss://nostr.orangepill.dev
- **Event Parsing**: Parser functions `parseCourseEvent()` and `parseEvent()` convert Nostr events to UI data
- **Real-time Updates**: Subscribe to content changes via Nostr events
- **Profile Sync**: Automatic profile synchronization for Nostr-first accounts on every login

#### Advanced Theme System Architecture
Multi-layered theming with 47 color schemes:
- **ThemeProvider** (next-themes) for dark/light mode
- **ThemeColorProvider** for custom color themes in `src/contexts/theme-context.tsx`
- **Theme Configuration**: `src/lib/theme-config.ts` with multiple radius options and style variants
- **CSS Variables**: Dynamic theme application in `src/app/globals.css`
- **Configuration Control**: `config/theme.json` to show/hide controls and force defaults

### Directory Structure

```
src/
├── app/                    # App Router pages
│   ├── api/               # RESTful API routes with error handling
│   ├── content/           # Content discovery page with filtering
│   ├── courses/           # Course pages with dynamic routing
│   ├── globals.css        # Global styles and CSS variables
│   └── layout.tsx         # Root layout with theme providers
├── components/
│   ├── ui/               # shadcn/ui components + custom extensions
│   ├── layout/           # Layout components (header, container, section)
│   ├── forms/            # Form components with server actions
│   ├── homepage/         # Homepage-specific components
│   └── theme-*.tsx       # Theme-related components
├── contexts/             # React contexts (theme, query, snstr)
├── data/                 # Domain-driven data architecture
│   ├── mockDb/           # JSON mock data files
│   ├── types.ts          # Unified type system (Database + Nostr + Display)
│   ├── nostr-events.ts   # Nostr event data and examples
│   └── index.ts          # Centralized data access
├── hooks/                # Custom React hooks (useCoursesQuery, useDocumentsQuery, useVideosQuery)
├── lib/
│   ├── db-adapter.ts     # Database adapter pattern with JSON mock
│   ├── cache.ts         # Hierarchical caching system
│   ├── secure-actions.ts # Secure server actions framework
│   ├── api-utils.ts     # API validation & error handling
│   ├── theme-config.ts  # Theme configuration
│   └── utils.ts         # Utilities (cn, clsx)
middleware.ts             # Security headers, CSP, CORS
```

### Data Flow Architecture

#### Content Creation Flow
1. **Database**: Create minimal record (Course/Resource) with price, relations
2. **Nostr**: Publish rich content event (NIP-23 free or NIP-99 paid)
3. **Parser**: Parse Nostr event tags to extract title, description, topics
4. **Display**: Combine database + parsed event via createCourseDisplay/createResourceDisplay
5. **Cache**: Store combined result in repository cache layer

#### Content Retrieval Flow
1. **Repository**: Check cache first (L1 memory cache)
2. **Database**: Fetch minimal record if cache miss
3. **Nostr**: Parse associated event for rich content
4. **Combine**: Merge database + Nostr data into Display interface
5. **Cache**: Store result with TTL for future requests

#### Draft Publishing Flow
1. **Create Draft**: Store draft content in database (Draft/CourseDraft models)
2. **Publish to Nostr**: Use NIP-07 or ephemeral keys to sign and publish events
3. **Atomic Operations**: All draft lessons published before course creation
4. **Database Update**: Store Nostr event IDs (noteId) in Resource/Course records
5. **Cache Invalidation**: Clear relevant caches after publishing

#### Draft Service Classes
- **CourseDraftService** (`src/lib/draft-service.ts`): Manages course draft creation, updates, and publishing
- **DraftService**: Handles resource drafts (documents and videos)
- **DraftLessonService**: Manages lesson relationships within course drafts
- **PublishService** (`src/lib/publish-service.ts`): Coordinates Nostr event creation and publishing

### API Routes Pattern
RESTful API structure in `src/app/api/`:
- **Health Check**: `/api/health` for deployment monitoring
- **CRUD Operations**: `/api/courses` with proper HTTP methods
- **Draft Management**: `/api/drafts` for draft/publish workflow
- **Admin Operations**: `/api/admin` for role-based administration
- **Search**: `/api/search` for content discovery
- **Authentication**: `/api/auth/*` NextAuth.js routes
- **Error Handling**: Structured error classes with proper HTTP codes
- **Validation**: Comprehensive Zod schemas matching TypeScript types
- **CORS Configuration**: Proper cross-origin handling
- **Publishing Endpoints**: `/api/drafts/resources/[id]/publish` and `/api/drafts/courses/[id]/publish`

## Smart Image Optimization
- **OptimizedImage Component**: Automatically handles images from any domain without manual configuration
- **Intelligent Domain Detection**: Checks if domains are configured for optimization
- **Seamless Fallback**: Uses `unoptimized` prop for unknown domains while maintaining all Next.js Image benefits
- **Zero Configuration**: No more manual domain additions to `next.config.ts`
- **Pre-configured Domains**: Supports Unsplash, GitHub avatars, YouTube thumbnails, DiceBear, DigitalOcean Spaces

## Admin System
- **Dual Admin Detection**:
  - Database role-based (Role.admin field in database)
  - Config-based via Nostr pubkeys in `config/admin.json`
- **Permission System**: Granular permissions for admins and moderators in `src/lib/admin-utils.ts`
- **Admin Dashboard**: `/admin` route with user management and content moderation
- **Draft Management**: Admins can view and manage all drafts across the platform
- **User Management**: View users, assign roles, manage permissions
- **Content Moderation**: Review and approve/reject user-submitted content

## Theme Configuration System
- **Configurable UI Controls**: Control visibility of theme selector, font toggle, and dark mode toggle via `config/theme.json`
- **Default Value Override**: Force specific themes, fonts, or dark mode settings for branded deployments
- **47 Complete Themes**: All themes from shadcn community with full color palettes and appropriate fonts
- **24 Font Options**: Comprehensive font library including serif, sans-serif, and monospace options

### Component Patterns
- **Server Components**: Default for performance with streaming
- **Client Components**: Only when needed for interactivity
- **shadcn/ui Base**: Custom extensions for project-specific needs
- **Progressive Enhancement**: Forms work without JavaScript
- **Error Boundaries**: Graceful failure handling

### Content Management
The platform manages three content types:
- **Courses**: Structured learning paths with lesson references
- **Documents**: Educational resources (guides, cheatsheets, references)
- **Videos**: Video tutorials with duration tracking
- **Categories**: Bitcoin, Lightning, Nostr, Frontend, Backend, Mobile

### Development Patterns

#### Type Safety
- **Strict TypeScript**: 100% type coverage with runtime validation
- **Zod Integration**: Runtime schemas match TypeScript interfaces
- **API Type Safety**: End-to-end type checking from database to UI
- **Consistent ID System**: String UUIDs throughout for Nostr compatibility
- **Parser Functions**: Type-safe Nostr event parsing with validation

#### Performance Optimizations
- **Adapter Caching**: 67% performance improvement with hierarchical cache layer
- **Server Components**: Reduced client bundle size with React 19
- **Code Splitting**: Automatic route-based splitting with Next.js 15
- **Batch Nostr Queries**: Efficient event fetching with 'd' tag optimization
- **Image Optimization**: Smart domain detection with automatic fallback
- **React Query**: Client-side caching with stale-while-revalidate patterns

#### Error Handling
- **Custom Error Classes**: NotFoundError, ConflictError, ValidationError
- **Error Boundaries**: Graceful UI failure handling
- **Secure Error Messages**: No sensitive data leakage
- **API Error Consistency**: Structured JSON error responses

### Database & Authentication System
Production-ready PostgreSQL database with hybrid development approach:
- **Production Database**: Full Prisma schema with 18 models covering all platform functionality
- **Dual Identity Architecture**: Nostr-first (user controls keys) vs OAuth-first (platform manages ephemeral keys)
- **Authentication Providers**: 
  - Email magic links (OAuth-first)
  - GitHub OAuth (OAuth-first)
  - NIP07 Nostr browser extension (Nostr-first)
  - Anonymous with ephemeral keys (Nostr-first)
  - Recovery mode for ephemeral accounts (Nostr-first)
- **Development Mode**: JSON mock files (`src/data/mockDb/`) + real Nostr events for rapid development
- **User Management**: Complete user profiles with pubkeys, email verification, roles, and Lightning addresses
- **Payment Tracking**: Purchase model tracks course/resource payments in sats
- **Progress Tracking**: UserLesson and UserCourse models for learning progress and completion
- **Badge System**: Nostr-based achievements and course completion badges
- **Draft System**: CourseDraft and DraftLesson models for content creation workflow
- **Platform Services**: PlatformNip05 and PlatformLightningAddress for user services

#### Authentication Flow Details
- **Nostr-First**: Profile syncs from Nostr relays on every login
- **OAuth-First**: Profile from OAuth provider is authoritative
- **Ephemeral Keys**: Auto-generated for Email/GitHub users for Nostr access
- **Session Data**: Complete user profile including nip05, lud16, banner fields

### Production Features
- **Health Monitoring**: `/api/health` endpoint with proper status codes
- **Environment Config**: Proper variable handling for different environments
- **Cache Statistics**: Real-time performance monitoring
- **Build Optimization**: Zero compilation errors with Turbopack
- **Containerization**: Docker support for deployment
- **Database Seeding**: `npm run db:seed` for sample data
- **Postinstall Hook**: Auto-generates Prisma client in production builds

### Security Features
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection configured in middleware
- **CSP (Content Security Policy)**: Environment-aware CSP with proper directives for development and production
- **CORS Configuration**: Proper cross-origin handling for API routes
- **Rate Limiting**: Applied to authentication endpoints
- **Input Sanitization**: XSS and injection prevention
- **Secure Cookies**: HttpOnly, Secure, SameSite configuration
- **No Sensitive Data Leakage**: Error messages sanitized in production

## Code Style Guidelines

1. **Component Structure**:
   - Use function declarations for pages: `export default function PageName() {}`
   - Use arrow functions for components: `export const ComponentName = () => {}`
   - Always use explicit return types for functions

2. **Import Organization**:
   - React/Next imports first
   - Third-party libraries
   - Internal components
   - Types/interfaces
   - Utils/lib functions

3. **Naming Conventions**:
   - Components: PascalCase
   - Files: kebab-case
   - Functions/variables: camelCase
   - Types/Interfaces: PascalCase with 'I' prefix for interfaces

4. **Error Handling**:
   - Always use try-catch blocks for async operations
   - Return structured error responses from API routes
   - Use custom error classes (NotFoundError, ValidationError, etc.)

5. **Data Access**:
   - ALWAYS use adapters (CourseAdapter, ResourceAdapter, etc.)
   - NEVER access mock data or database directly
   - Always check cache before fetching data

## Common Pitfalls to Avoid

1. **Don't add domains to next.config.ts** - Use OptimizedImage component instead
2. **Don't create new mock data files** - Use existing JSON structure
3. **Don't bypass the adapter pattern** - Always use adapters for data access
4. **Don't ignore TypeScript errors** - Fix them properly, don't suppress
5. **Don't skip cache invalidation** - Update caches when data changes

## Testing Checklist

When implementing features, verify:
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Type checking passes
- [ ] Authentication works for all 5 methods
- [ ] Caching is properly implemented
- [ ] Error handling is comprehensive
- [ ] Mobile responsive design
- [ ] Dark mode compatibility