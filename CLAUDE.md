# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# When making changes, always run linting to ensure code quality
```

## Project Architecture

This is a **Next.js 15** application with **React 19** using the App Router pattern. The project demonstrates a sophisticated developer education platform with **hybrid data architecture** combining traditional databases with **Nostr protocol** for content management.

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
- **NIP07** Nostr browser extension authentication support

### Key Architectural Patterns

#### Hybrid Data Architecture (CRITICAL)
The project uses a unique **Database + Nostr Events** approach:
- **Minimal Database Fields**: Only essential data (ID, price, timestamps, relations) stored in traditional database
- **Rich Content from Nostr**: Full content comes from NIP-23 (free) and NIP-99 (paid) events
- **Database Models**: Course, Resource, Lesson with minimal fields only
- **Nostr Event Types**: NostrCourseListEvent (kind 30004), NostrFreeContentEvent (kind 30023), NostrPaidContentEvent (kind 30402)
- **Unified Display Layer**: Combines both sources for complete UI data via Display interfaces

#### Database Adapter Pattern Implementation
Clean data access abstraction with JSON mock database in `src/lib/db-adapter.ts`:
- **CourseAdapter**: CRUD operations with JSON database simulation + Nostr event integration
- **ResourceAdapter**: Handles both documents and videos from JSON files + Nostr events
- **LessonAdapter**: Course-to-resource relationships with JSON persistence
- **Nostr Integration**: Built-in support for combining database metadata with Nostr content
- **Performance Simulation**: Realistic database delays and pagination support

#### Hierarchical Caching System
Production-ready caching in `src/lib/cache.ts`:
- **L1 Memory Cache**: Fast in-memory storage with LRU eviction
- **Tagged Cache**: Complex invalidation patterns with cache statistics
- **TTL Support**: Configurable expiration (5min default for repositories)
- **Pattern Invalidation**: Bulk cache operations for related data

#### Nostr Integration with snstr
Real-time content management through Nostr protocol:
- **SnstrProvider**: Context provider for relay pool management in `src/contexts/snstr-context.tsx`
- **RelayPool**: Shared connection pool across default relays (relay.nostr.band, nos.lol, relay.damus.io)
- **Event Parsing**: Parser functions `parseCourseEvent()` and `parseEvent()` convert Nostr events to UI data
- **Real-time Updates**: Subscribe to content changes via Nostr events

#### Advanced Theme System Architecture
Multi-layered theming with 47 color schemes:
- **ThemeProvider** (next-themes) for dark/light mode
- **ThemeColorProvider** for custom color themes in `src/contexts/theme-context.tsx`
- **Theme Configuration**: `src/lib/theme-config.ts` with multiple radius options and style variants
- **CSS Variables**: Dynamic theme application in `src/app/globals.css`

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

### Critical Files to Understand

#### Data Management (MOST IMPORTANT)
- `src/data/types.ts` - **Database models, Nostr event types, Display interfaces, and parser functions**
- `src/lib/db-adapter.ts` - **Database adapter pattern with JSON mock implementation**
- `src/data/index.ts` - **Centralized data access with mock data functions**
- `src/lib/cache.ts` - **Production-grade caching system**
- `src/data/mockDb/` - **JSON mock data files for Course, Resource, and Lesson**
- All components and API routes use adapters - never access data directly

#### Nostr Integration
- `src/contexts/snstr-context.tsx` - **Nostr relay pool management and context**
- `src/data/nostr-events.ts` - **Nostr event data and examples**
- **Course Events**: NIP-51 course list events (kind 30004) for course curation
- **Free Content**: NIP-23 events (kind 30023) for free resources and lessons
- **Paid Content**: NIP-99 events (kind 30402) for premium resources
- **Parser Functions**: `parseCourseEvent()` and `parseEvent()` in types.ts convert Nostr events to UI data

#### Theme System
- `src/contexts/theme-context.tsx` - **Custom theme color management with 47 complete themes**
- `src/lib/theme-config.ts` - **47 theme configurations with full color schemes and fonts**
- `src/lib/theme-ui-config.ts` - **Theme UI configuration system for toggling controls**
- `config/theme.json` - **Theme and font configuration for deployment customization**
- Global CSS variables in `src/app/globals.css` for dynamic theme colors

#### Configuration & Authentication
- `config/theme.json` - **Theme UI controls and default value configuration**
- `next.config.ts` - **Performance optimizations, security headers, image config**
- `middleware.ts` - **Security middleware with CSP headers and CORS**
- `components.json` - **shadcn/ui configuration**
- `src/lib/auth.ts` - **NextAuth.js configuration with email & NIP07 Nostr authentication**
- `prisma/schema.prisma` - **Complete database schema with User, Course, Resource models**
- `src/lib/prisma.ts` - **Prisma client configuration and connection management**

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

### API Routes Pattern
RESTful API structure in `src/app/api/`:
- **Health Check**: `/api/health` for deployment monitoring
- **CRUD Operations**: `/api/courses` with proper HTTP methods
- **Error Handling**: Structured error classes with proper HTTP codes
- **Validation**: Comprehensive Zod schemas matching TypeScript types
- **CORS Configuration**: Proper cross-origin handling

## Smart Image Optimization
- **OptimizedImage Component**: Automatically handles images from any domain without manual configuration
- **Intelligent Domain Detection**: Checks if domains are configured for optimization
- **Seamless Fallback**: Uses `unoptimized` prop for unknown domains while maintaining all Next.js Image benefits
- **Zero Configuration**: No more manual domain additions to `next.config.ts`

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
- **Production Database**: Full Prisma schema with User, Course, Resource, Lesson, Purchase models
- **Authentication**: NextAuth.js with email magic links + NIP07 Nostr browser extension support
- **Development Mode**: JSON mock files (`src/data/mockDb/`) + real Nostr events for rapid development
- **User Management**: Complete user profiles with pubkeys, email verification, roles, and Lightning addresses
- **Payment Tracking**: Purchase model tracks course/resource payments in sats
- **Progress Tracking**: UserLesson and UserCourse models for learning progress and completion
- **Badge System**: Nostr-based achievements and course completion badges

### Production Features
- **Health Monitoring**: `/api/health` endpoint with proper status codes
- **Environment Config**: Proper variable handling for different environments
- **Cache Statistics**: Real-time performance monitoring
- **Build Optimization**: Zero compilation errors with Turbopack
- **Containerization**: Docker support for deployment

## Database Commands

```bash
# Database operations (requires DATABASE_URL environment variable)
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes to database
npx prisma migrate dev  # Create and apply new migration
npx prisma studio       # Open Prisma Studio for database browsing

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
7. **Authentication Flow**: Test both email magic links and NIP07 Nostr authentication
8. **Environment Variables**: Ensure DATABASE_URL and NEXTAUTH_SECRET are properly configured