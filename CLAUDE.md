# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PlebDevs is a decentralized developer education platform built on Bitcoin and Nostr protocols. It's a Next.js 14 application with TypeScript that integrates Lightning payments and Nostr content publishing for a sovereign learning experience.

**Current Status**: Early development phase - the codebase currently contains only documentation and planning files. No actual implementation exists yet.

## Development Commands

```bash
# Development (when implemented)
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix auto-fixable issues
pnpm format           # Format code with Prettier
pnpm type-check       # Check TypeScript types

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests
pnpm test:coverage    # Generate coverage report
```

## Tech Stack

### Core Framework

- **Next.js 14** with App Router for optimal performance and SEO
- **TypeScript** for type safety throughout the application
- **Tailwind CSS** for utility-first styling and themeable design

### UI & Components

- **Shadcn/ui** - Configurable components built on Radix UI primitives
- **Lucide React** - Consistent icon system
- **Recharts** - Data visualization for analytics

### State Management

- **React Context** - Simple state management for authentication and preferences
- **TanStack Query** - Data fetching, caching, and synchronization
- **Zod** - Runtime validation for forms and configuration files

### Future Integrations

- **NDK (Nostr Development Kit)** - Decentralized content publishing
- **Bitcoin-Connect + Alby SDK** - Lightning payment integration
- **PostgreSQL + Prisma** - Production database layer

## Architecture Principles

### AI-First Codebase

- Maximum 500 lines per file for optimal maintainability
- Comprehensive JSDoc documentation for all functions and components
- Clear, descriptive variable and function names
- Type safety with comprehensive TypeScript coverage

### Configuration-Driven Design

- JSON-based theming system for white-label customization
- Zod schemas for configuration validation
- Feature toggles for platform capabilities
- Multi-tenant support through configuration

### Bitcoin/Nostr Integration Patterns

- Nostr events for decentralized content publishing (NIP-23 long-form content)
- Lightning payments for course purchases and creator monetization
- Platform-provided NIP-05 identities and Lightning addresses
- WebLN integration for seamless payment experiences

## Directory Structure

```
/app                    # Next.js App Router pages and layouts
/components            # React components organized by purpose
  /ui                  # Base UI components (Shadcn/ui)
  /forms              # Form-specific components
  /layout             # Layout and navigation components
  /content            # Content display components
  /auth               # Authentication components
  /admin              # Admin interface components
/lib                   # Utility functions and configurations
  /api                # API client functions
  /auth               # Authentication utilities
  /config             # Configuration management
  /utils              # General utility functions
  /validators         # Zod validation schemas
/types                # TypeScript type definitions
/data                 # Mock data matching production schema
/config               # JSON configuration files
  /themes             # Theme configuration files
  /components         # Component styling configs
  /platform           # Platform feature configs
/hooks                # Custom React hooks
/styles               # Global styles and Tailwind config
/docs                 # Project documentation and phases
```

## Data Models

The application follows a comprehensive schema for educational content:

### Core Models

- **User**: Nostr pubkey, email, Lightning addresses (nip05, lud16)
- **Course**: Multi-lesson learning paths with pricing and badges
- **Resource**: Individual content items (videos, documents)
- **Lesson**: Individual learning units within courses or resources
- **Draft/CourseDraft**: Content creation with auto-save functionality

### Progress Tracking

- **UserCourse**: Course enrollment and completion tracking
- **UserLesson**: Individual lesson progress
- **Purchase**: Lightning payment records

### Platform Services

- **PlatformNip05**: Platform-provided Nostr identities
- **PlatformLightningAddress**: Platform-provided Lightning addresses

## Development Guidelines

### File Organization

- Use PascalCase for React components (`UserProfile.tsx`)
- Use kebab-case for utilities and non-components (`auth-utils.ts`)
- Maximum 500 lines per file - split larger files into logical modules
- Comprehensive JSDoc documentation for all exports

### Component Patterns

- Functional components with TypeScript interfaces for props
- Custom hooks for state management and side effects
- Error boundaries for graceful error handling
- Progressive Web App capabilities for offline learning

### API Integration

- TanStack Query for data fetching and caching
- Zod validation for all API inputs and outputs
- Mock data that exactly matches production schema
- Comprehensive error handling with user-friendly messages

### Testing Strategy

- Jest for unit tests with comprehensive coverage
- Playwright for end-to-end testing
- Test files co-located with components
- Mock data that matches real API responses

## Configuration System

### Theme Customization

JSON-based configuration system supporting:

- Color schemes and typography
- Component styling overrides
- Platform feature toggles
- White-label branding options

### Validation

All configuration files use Zod schemas for:

- Runtime validation
- Type safety
- Clear error messages for invalid configurations

## Security Considerations

- Never expose private keys in client-side code
- Comprehensive input validation with Zod
- Content Security Policy headers
- No user tracking - privacy-first analytics only
- Self-hostable deployment options

## Performance Targets

- Initial Load: < 100KB JavaScript
- Page Load Time: < 3 seconds
- Core Web Vitals: All metrics in "Good" range
- Bundle size monitoring with webpack-bundle-analyzer

## Common Patterns

### Error Handling

```typescript
// Throw errors instead of returning fallback values
if (!user) {
  throw new Error('User not found');
}
```

### Component Structure

```typescript
/**
 * Component description
 * @component
 * @param {Props} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export function ComponentName({ prop1, prop2 }: Props) {
  // Implementation
}
```

### API Functions

```typescript
/**
 * Function description
 * @param {Type} param - Parameter description
 * @returns {Promise<Type>} Return description
 * @throws {Error} When validation fails
 */
export async function apiFunction(param: Type): Promise<ReturnType> {
  // Validation with Zod
  // API call
  // Error handling
}
```

This codebase prioritizes clarity, maintainability, and AI-tool compatibility while building toward a decentralized, Bitcoin-native educational platform.
