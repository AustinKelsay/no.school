# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture & Key Components

This is a Next.js 15 application using the App Router with TypeScript, Tailwind CSS, and shadcn/ui components.

### Core Structure
- **App Router**: Uses Next.js App Router (`src/app/`) for routing and layouts
- **Component System**: shadcn/ui components in `src/components/ui/` with custom layout components in `src/components/layout/`
- **Theme System**: Dark/light mode using next-themes, defaults to dark mode
- **Styling**: Tailwind CSS with custom CSS variables for theming

### Key Patterns
- **Layout Hierarchy**: `MainLayout` component provides consistent structure with header and main content area
- **Theme Provider**: Wraps app with theme context, disables system theme detection
- **Component Organization**: 
  - UI components in `src/components/ui/` (shadcn/ui)
  - Layout components in `src/components/layout/`
  - Barrel exports in `index.ts` files

### shadcn/ui Configuration
- Style: "new-york"
- Base color: neutral
- Icon library: lucide-react
- Path aliases configured for `@/components`, `@/lib`, `@/ui`

### Technology Stack
- Next.js 15 with React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- next-themes for theme management
- Lucide React for icons