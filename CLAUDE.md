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

### Key Architectural Patterns

#### Hybrid Data Architecture (CRITICAL)
The project uses a unique **Database + Nostr Events** approach:
- **Minimal Database Fields**: Only essential data (ID, price, timestamps, relations) stored in traditional database
- **Rich Content from Nostr**: Full content comes from NIP-23 (free) and NIP-99 (paid) events
- **Database Models**: Course, Resource, Lesson with minimal fields only
- **Nostr Event Types**: NostrCourseListEvent (kind 30004), NostrFreeContentEvent (kind 30023), NostrPaidContentEvent (kind 30402)
- **Unified Display Layer**: Combines both sources for complete UI data via Display interfaces

#### Repository Pattern Implementation
Clean data access abstraction with integrated caching in `src/lib/repositories.ts`:
- **CourseRepository**: CRUD operations with database simulation + Nostr event parsing
- **ResourceRepository**: Handles both documents and videos from Nostr events
- **LessonRepository**: Course-to-resource relationships
- **ContentRepository**: Unified search across all content types
- **Caching Integration**: Built-in cache invalidation and TTL management

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
Multi-layered theming with 23 color schemes:
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
├── hooks/                # Custom React hooks for data fetching
├── lib/
│   ├── repositories.ts   # Repository pattern with caching
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
- `src/lib/repositories.ts` - **Repository pattern implementation with caching**
- `src/data/index.ts` - **Centralized data access with mock data functions**
- `src/lib/cache.ts` - **Production-grade caching system**
- `src/data/mockDb/` - **JSON mock data files for Course, Resource, and Lesson**
- All components and API routes use repositories - never access data directly

#### Nostr Integration
- `src/contexts/snstr-context.tsx` - **Nostr relay pool management and context**
- `src/data/nostr-events.ts` - **Nostr event data and examples**
- **Course Events**: NIP-51 course list events (kind 30004) for course curation
- **Free Content**: NIP-23 events (kind 30023) for free resources and lessons
- **Paid Content**: NIP-99 events (kind 30402) for premium resources
- **Parser Functions**: `parseCourseEvent()` and `parseEvent()` in types.ts convert Nostr events to UI data

#### Theme System
- `src/contexts/theme-context.tsx` - **Custom theme color management with 23 variants**
- `src/lib/theme-config.ts` - **Theme configurations and color schemes**
- Global CSS variables in `src/app/globals.css` for dynamic theme colors

#### Configuration
- `next.config.ts` - **Performance optimizations, security headers, image config**
- `middleware.ts` - **Security middleware with CSP headers and CORS**
- `components.json` - **shadcn/ui configuration**

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

## 🎯 **Recent Improvements**

### Smart Image Optimization (Latest)
- **OptimizedImage Component**: Automatically handles images from any domain without manual configuration
- **Intelligent Domain Detection**: Checks if domains are configured for optimization
- **Seamless Fallback**: Uses `unoptimized` prop for unknown domains while maintaining all Next.js Image benefits
- **Zero Configuration**: No more manual domain additions to `next.config.ts`
- **Full Feature Support**: Lazy loading, responsive images, blur placeholders, and proper accessibility

**Usage**: The component automatically detects whether an image domain is configured:
- **Configured domains**: Full Next.js Image optimization (AVIF/WebP conversion, responsive loading)
- **Unknown domains**: Next.js Image with `unoptimized` prop (lazy loading, responsive behavior, but no format conversion)

This solves the "hostname not configured" errors while maintaining optimal performance for known domains.

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
- **Repository Caching**: Significant performance improvement with cache layer
- **Server Components**: Reduced client bundle size
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: AVIF/WebP with next/image
- **React Query**: Client-side caching and data synchronization

#### Error Handling
- **Custom Error Classes**: NotFoundError, ConflictError, ValidationError
- **Error Boundaries**: Graceful UI failure handling
- **Secure Error Messages**: No sensitive data leakage
- **API Error Consistency**: Structured JSON error responses

### Mock Data System
Current implementation uses JSON files for development:
- `src/data/mockDb/Course.json` - Course database records
- `src/data/mockDb/Resource.json` - Resource database records  
- `src/data/mockDb/Lesson.json` - Lesson database records
- Combined with Nostr event parsing to create full display data

### Production Features
- **Health Monitoring**: `/api/health` endpoint with proper status codes
- **Environment Config**: Proper variable handling for different environments
- **Cache Statistics**: Real-time performance monitoring
- **Build Optimization**: Zero compilation errors with Turbopack
- **Containerization**: Docker support for deployment

## Testing Commands

```bash
# No formal testing framework is currently configured
# When implementing tests, check the codebase first to determine the testing approach
# Ask the user for specific test commands if tests are added in the future
```