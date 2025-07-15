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

#### Secure Server Actions Framework
Type-safe server actions in `src/lib/secure-actions.ts`:
- **Input Validation**: Zod schemas for all inputs with runtime validation
- **Rate Limiting**: Per-user, per-action protection with configurable windows
- **Input Sanitization**: XSS and injection prevention
- **Role-based Access**: User, admin, instructor role enforcement
- **Error Security**: No sensitive data leakage in error responses

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
│   └── theme-*.tsx       # Theme-related components
├── contexts/             # React contexts (theme-context.tsx)
├── data/                 # Domain-driven data architecture
│   ├── courses/          # Course domain (types, mock data, parsers)
│   ├── documents/        # Document domain (guides, references)
│   ├── videos/           # Video domain (tutorials, demos)
│   ├── types.ts          # Unified type system (Database + Nostr + Display)
│   └── index.ts          # Centralized data access
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
- All components and API routes use repositories - never access data directly

#### Nostr Integration
- **Course Events**: NIP-51 course list events (kind 30004) for course curation
- **Free Content**: NIP-23 events (kind 30023) for free resources and lessons
- **Paid Content**: NIP-99 events (kind 30402) for premium resources
- **Parser Functions**: `parseCourseEvent()` and `parseEvent()` in types.ts convert Nostr events to UI data

#### Server Actions & Security
- `src/lib/secure-actions.ts` - **Secure server actions with rate limiting and validation**
- `src/lib/api-utils.ts` - **API error handling and validation utilities**
- Server actions include built-in security features - always use the framework

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

### Component Patterns
- **Server Components**: Default for performance with streaming
- **Client Components**: Only when needed for interactivity
- **shadcn/ui Base**: Custom extensions for project-specific needs
- **Progressive Enhancement**: Forms work without JavaScript
- **Error Boundaries**: Graceful failure handling

### Security Implementation
- **CSP Headers**: Configured in middleware and next.config.ts
- **Security Headers**: XSS protection, frame options, content type
- **Input Validation**: Zod schemas for all user inputs
- **Rate Limiting**: Built into secure actions framework
- **Role-based Access**: User, admin, instructor permissions
- **Image Optimization**: Safe domains with next/image

### Content Management
The platform manages three content types:
- **Courses**: 6 structured learning paths with lesson references
- **Documents**: 13 educational resources (guides, cheatsheets, references)
- **Videos**: 12 video tutorials with duration tracking
- **Categories**: Bitcoin, Lightning, Nostr, Frontend, Backend, Mobile

### Development Patterns

#### Type Safety
- **Strict TypeScript**: 100% type coverage with runtime validation
- **Zod Integration**: Runtime schemas match TypeScript interfaces
- **API Type Safety**: End-to-end type checking from database to UI
- **Consistent ID System**: String UUIDs throughout for Nostr compatibility

#### Performance Optimizations
- **Repository Caching**: 67% performance improvement with cache layer
- **Server Components**: Reduced client bundle size
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: AVIF/WebP with next/image

#### Error Handling
- **Custom Error Classes**: NotFoundError, ConflictError, ValidationError
- **Error Boundaries**: Graceful UI failure handling
- **Secure Error Messages**: No sensitive data leakage
- **API Error Consistency**: Structured JSON error responses

### Production Features
- **Docker Support**: Containerized deployment ready
- **Health Monitoring**: `/api/health` endpoint with proper status codes
- **Environment Config**: Proper variable handling for different environments
- **Cache Statistics**: Real-time performance monitoring
- **Build Optimization**: Zero compilation errors with Turbopack