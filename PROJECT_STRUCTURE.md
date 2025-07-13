# Project Structure

This document outlines the complete directory structure for the PlebDevs platform.

## Root Level

```
/app                    # Next.js App Router pages and layouts
/components            # React components organized by purpose
/lib                   # Utility functions and configurations
/types                 # TypeScript type definitions
/data                  # Mock data matching production schema
/config               # JSON configuration files
/hooks                # Custom React hooks
/styles               # Global styles and component-specific styles
/docs                 # Project documentation
```

## Components Organization

```
/components
  /ui                  # Base UI components (Shadcn/ui)
  /forms              # Form-specific components
  /layout             # Layout and navigation components
  /content            # Content display components
  /auth               # Authentication components
  /admin              # Admin interface components
  /common             # Shared utility components
```

## Library Organization

```
/lib
  /api                # API client functions
  /auth               # Authentication utilities
  /config             # Configuration management
  /utils              # General utility functions (utils.ts is the main export)
  /validators         # Zod validation schemas
```

## Type Definitions

```
/types
  /api                # API response types
  /auth               # Authentication types
  /content            # Content model types
  /ui                 # UI component types
```

## Mock Data Organization

```
/data
  /courses            # Course and lesson mock data
  /users              # User and role mock data
  /resources          # Resource mock data
  /purchases          # Purchase and payment mock data
  /badges             # Badge and achievement mock data
  /nostr              # Nostr event mock data
  /lightning          # Lightning payment mock data
```

## Configuration System

```
/config
  /themes             # Theme configuration files
  /components         # Component styling configs
  /platform           # Platform feature configs
```

## File Naming Conventions

### Components

- PascalCase for React components: `UserProfile.tsx`
- kebab-case for non-component files: `user-profile.types.ts`

### Utilities and Configuration

- kebab-case for utilities: `auth-utils.ts`
- SCREAMING_SNAKE_CASE for constants: `API_ENDPOINTS.ts`

### Directories

- kebab-case for multi-word directories: `/user-management`
- Single word when possible: `/auth`, `/forms`, `/layout`

## Import Aliases

The project uses path aliases configured in `tsconfig.json`:

- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/types` → `./types`
- `@/data` → `./data`
- `@/config` → `./config`
- `@/hooks` → `./hooks`
- `@/styles` → `./styles`

## File Size Guidelines

- Maximum 500 lines per file
- Split larger files into logical modules
- Use barrel exports (`index.ts`) to maintain clean imports
