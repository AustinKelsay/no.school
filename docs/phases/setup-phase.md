# Setup Phase - PlebDevs Frontend Foundation

## Phase Overview

**Duration**: Week 1 (5-7 days)  
**Goal**: Establish basic Next.js application with routing, core components, and data structures that run but aren't fully functional.

## Success Criteria

- [ ] Next.js 14 app runs locally with all dependencies
- [ ] Basic routing structure in place for all 7 core pages
- [ ] Shadcn/ui components integrated and working
- [ ] Mock data structures match production schema
- [ ] Basic authentication UI (non-functional)
- [ ] Responsive layout framework established

## Core Deliverables

### 1. Project Infrastructure Setup

**Goal**: Initialize Next.js project with all necessary dependencies and configurations.

**Steps**:

1. Initialize Next.js 14 project with TypeScript and App Router
2. Install and configure Tailwind CSS with custom design tokens
3. Set up Shadcn/ui components with initial configuration
4. Configure ESLint, Prettier, and Husky for code quality
5. Set up project structure matching the defined architecture

**Files Created**:

- `package.json` with all dependencies
- `tailwind.config.js` with custom design tokens
- `next.config.js` with optimization settings
- `.eslintrc.json` and `.prettierrc` for code quality
- Basic folder structure (`/app`, `/components`, `/lib`, `/types`, `/data`)

### 2. Core Type Definitions

**Goal**: Establish TypeScript interfaces matching production Prisma schema.

**Steps**:

1. Create user and authentication types (`/types/auth.ts`)
2. Define content types for courses, resources, lessons (`/types/content.ts`)
3. Set up commerce types for purchases and subscriptions (`/types/commerce.ts`)
4. Create API response and pagination types (`/types/api.ts`)
5. Export all types from main index file (`/types/index.ts`)

**Files Created**:

- `/types/auth.ts` - User, Role, Session, Account types
- `/types/content.ts` - Course, Resource, Lesson, Draft types
- `/types/commerce.ts` - Purchase, Subscription, Badge types
- `/types/api.ts` - APIResponse, PaginatedResponse types
- `/types/index.ts` - Barrel export file

### 3. Basic Mock Data Structure

**Goal**: Create mock data that exactly matches production schema for development.

**Steps**:

1. Create mock users with Nostr/Lightning properties (`/data/users.ts`)
2. Set up mock courses with relationships (`/data/courses.ts`)
3. Create mock resources and lessons (`/data/resources.ts`)
4. Add mock purchase and subscription data (`/data/commerce.ts`)
5. Create data utilities for API simulation (`/data/utils.ts`)

**Files Created**:

- `/data/users.ts` - Mock user profiles with roles
- `/data/courses.ts` - Mock courses with lessons and progress
- `/data/resources.ts` - Mock individual content items
- `/data/commerce.ts` - Mock purchases and subscriptions
- `/data/utils.ts` - API delay simulation and utilities

### 4. Basic Component Foundation

**Goal**: Set up core UI components with consistent styling.

**Steps**:

1. Install and configure base Shadcn/ui components (Button, Card, Input, etc.)
2. Create layout components (Header, Footer, Sidebar)
3. Build basic page templates (PageLayout, AuthLayout, AdminLayout)
4. Create loading and error state components
5. Set up basic form components with validation structure

**Files Created**:

- `/components/ui/` - All Shadcn/ui components
- `/components/layout/Header.tsx` - Main navigation header
- `/components/layout/Footer.tsx` - Site footer
- `/components/layout/PageLayout.tsx` - Base page wrapper
- `/components/common/LoadingSpinner.tsx` - Loading states
- `/components/common/ErrorBoundary.tsx` - Error handling

### 5. App Router Structure

**Goal**: Implement all 7 core pages with basic routing and navigation.

**Steps**:

1. Create home page with hero section (`/app/page.tsx`)
2. Set up content browsing page (`/app/content/page.tsx`)
3. Build user profile page structure (`/app/profile/page.tsx`)
4. Create feeds page with tabs (`/app/feeds/page.tsx`)
5. Add about, create, and individual content pages

**Files Created**:

- `/app/page.tsx` - Home page with hero and carousels
- `/app/content/page.tsx` - Content browsing with filters
- `/app/profile/page.tsx` - User profile and settings
- `/app/feeds/page.tsx` - Multi-platform feeds
- `/app/about/page.tsx` - Platform information
- `/app/create/page.tsx` - Content creation (admin)
- `/app/content/[id]/page.tsx` - Individual content view
- `/app/course/[id]/page.tsx` - Course detail page

### 6. Basic Authentication UI

**Goal**: Create authentication interface components (non-functional).

**Steps**:

1. Create login modal with multiple provider options
2. Build registration form with user type selection
3. Set up profile management UI components
4. Create authentication state context structure
5. Add authentication guards for protected routes

**Files Created**:

- `/components/auth/LoginModal.tsx` - Login interface
- `/components/auth/SignupForm.tsx` - Registration form
- `/components/auth/ProfileForm.tsx` - Profile editing
- `/lib/auth/auth-context.tsx` - Authentication context
- `/lib/auth/auth-utils.ts` - Authentication utilities

### 7. Responsive Layout Framework

**Goal**: Establish responsive design system with mobile-first approach.

**Steps**:

1. Configure Tailwind with custom breakpoints and spacing
2. Create responsive grid components and utilities
3. Set up mobile navigation with drawer/sidebar
4. Implement responsive typography and spacing scale
5. Test basic responsive behavior across all pages

**Files Created**:

- `/styles/globals.css` - Global styles and CSS variables
- `/components/layout/MobileNav.tsx` - Mobile navigation
- `/components/layout/Sidebar.tsx` - Desktop sidebar
- `/lib/utils/responsive.ts` - Responsive utilities
- Updated Tailwind config with custom design tokens

## Technical Architecture

### Dependencies Added

```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "@tailwindcss/typography": "^0.5.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "lucide-react": "^0.290.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "14.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

### Project Structure Established

```
├── app/
│   ├── page.tsx (Home)
│   ├── content/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── profile/page.tsx
│   ├── feeds/page.tsx
│   ├── about/page.tsx
│   ├── create/page.tsx
│   └── course/[id]/page.tsx
├── components/
│   ├── ui/ (Shadcn components)
│   ├── layout/
│   ├── auth/
│   ├── forms/
│   └── common/
├── lib/
│   ├── utils/
│   ├── auth/
│   └── api/
├── types/
├── data/
└── styles/
```

## Mock Data Structure

### Sample User Data

```typescript
// Example of mock user matching production schema
export const mockUsers: User[] = [
  {
    id: 'user-1',
    pubkey:
      '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
    privkey: null,
    email: 'alice@example.com',
    emailVerified: new Date('2024-01-10'),
    username: 'alice_dev',
    avatar: 'https://avatars.githubusercontent.com/u/1234567',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    nip05: 'alice@plebdevs.com',
    lud16: 'alice@plebdevs.com',
    // ... other fields matching schema
  },
];
```

### Sample Course Data

```typescript
// Example of mock course with relationships
export const mockCoursesWithDetails: CourseWithDetails[] = [
  {
    id: 'course-1',
    userId: 'user-2',
    price: 50000, // 50,000 sats
    noteId: 'note1abcdef123456789',
    submissionRequired: true,
    user: mockUsers[1],
    lessons: mockLessons.filter(l => l.courseId === 'course-1'),
    badge: mockBadges[0],
    userCourses: [],
    purchases: [],
    // ... other fields
  },
];
```

## Page Templates

### Home Page Structure

```typescript
export default function HomePage() {
  return (
    <PageLayout>
      <HeroSection />
      <ContentCarousel title="Featured Courses" content={mockCourses} />
      <ContentCarousel title="Latest Videos" content={mockVideos} />
      <ContentCarousel title="Popular Documents" content={mockDocuments} />
      <StatsSection />
    </PageLayout>
  )
}
```

### Content Page Structure

```typescript
export default function ContentPage() {
  return (
    <PageLayout>
      <ContentHeader />
      <ContentFilters />
      <ContentGrid content={mockContent} />
      <Pagination />
    </PageLayout>
  )
}
```

## Development Workflow

### Daily Tasks

1. **Day 1**: Project setup, dependencies, basic structure
2. **Day 2**: Type definitions, mock data structure
3. **Day 3**: Basic components, layout framework
4. **Day 4**: Page routing, navigation structure
5. **Day 5**: Authentication UI, responsive testing

### Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works between all pages
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Mock data displays correctly
- [ ] Authentication UI renders properly
- [ ] Build process completes without errors
- [ ] ESLint and Prettier run without issues

## Known Limitations

- Authentication is UI-only (non-functional)
- No real data persistence
- Limited interactive features
- Basic styling (will be enhanced in later phases)
- No backend API integration
- No real-time features

## Next Phase Preparation

- Mock API routes structure planned
- Component enhancement strategy outlined
- Data fetching patterns identified
- Interactive features prioritized
- Performance optimization opportunities noted

---

This setup phase establishes the foundation for a production-ready frontend application. All subsequent phases will build upon this structure, gradually adding functionality and polish to create a complete developer education platform.
