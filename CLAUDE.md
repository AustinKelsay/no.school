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

This is a **Next.js 15** application with **React 19** using the App Router pattern. The project demonstrates modern full-stack development with advanced theming capabilities.

### Core Technologies
- **Next.js 15.3.5** with Turbopack for development
- **React 19** with Server Components and Server Actions
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with shadcn/ui components
- **next-themes** for theme management with custom theme system

### Key Architectural Patterns

#### Server Actions Pattern
Server Actions are used for form submissions and data mutations without API routes:
- `src/lib/actions.ts` contains all server actions
- Form components use progressive enhancement
- Server actions include validation, error handling, and automatic revalidation

#### Caching Strategy
Uses Next.js `unstable_cache` with multiple cache layers:
- `src/lib/data.ts` implements cached data fetching
- Cache tags for targeted revalidation
- Different revalidation periods (60s, 5min, 10min)

#### Theme System Architecture
Advanced theming with multiple providers:
- `ThemeProvider` (next-themes) for dark/light mode
- `ThemeColorProvider` for custom color themes
- `src/lib/theme-config.ts` for theme configuration
- Components: `theme-toggle.tsx`, `theme-selector.tsx`

### Directory Structure

```
src/
├── app/                    # App Router pages
│   ├── api/               # API routes (health, courses CRUD)
│   ├── courses/           # Course pages with dynamic routing
│   ├── globals.css        # Global styles and CSS variables
│   └── layout.tsx         # Root layout with theme providers
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components (header, container, section)
│   ├── forms/            # Form components with server actions
│   └── theme-*.tsx       # Theme-related components
├── contexts/             # React contexts (theme-context.tsx)
├── lib/
│   ├── actions.ts        # Server actions for forms
│   ├── data.ts          # Data fetching with caching
│   ├── theme-config.ts  # Theme configuration
│   └── utils.ts         # Utilities (cn, clsx)
middleware.ts             # Security headers, CSP, CORS
```

### Key Files to Understand

#### Server Components & Actions
- `src/lib/actions.ts` - Server actions with validation and revalidation
- `src/lib/data.ts` - Cached data fetching functions
- Server actions are used in forms for progressive enhancement

#### Theme System
- `src/contexts/theme-context.tsx` - Custom theme color management
- `src/lib/theme-config.ts` - Theme configurations and color schemes
- Global CSS variables in `src/app/globals.css` for theme colors

#### Configuration
- `next.config.ts` - Performance optimizations, security headers, image config
- `middleware.ts` - Security middleware with CSP headers
- `components.json` - shadcn/ui configuration

### API Routes Pattern
RESTful API structure in `src/app/api/`:
- Health check at `/api/health`
- CRUD operations for courses at `/api/courses`
- Proper error handling and TypeScript interfaces

### Component Patterns
- Server Components by default for performance
- shadcn/ui components in `src/components/ui/`
- Layout components with consistent spacing and responsive design
- Form components integrated with server actions

### Security Implementation
- CSP headers configured in middleware and next.config.ts
- Security headers (XSS protection, frame options, content type)
- CORS configuration for API routes
- Image optimization with safe domains