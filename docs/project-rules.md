# Project Rules - PlebDevs ⚡️

## Overview

This document establishes the development standards and organizational principles for the PlebDevs platform - an AI-first codebase designed for maximum modularity, scalability, and maintainability. These rules ensure the codebase remains highly navigable and compatible with modern AI development tools.

**Core Philosophy**: Build a codebase that is as intelligible to AI assistants as it is to human developers, with clear structure, comprehensive documentation, and predictable patterns.

---

## Directory Structure & File Organization

### Root Directory Structure

```
/app                    # Next.js App Router (pages and layouts)
/components            # React components (organized by purpose)
  /ui                  # Base UI components (Shadcn/ui)
  /forms              # Form-specific components
  /layout             # Layout and navigation components
  /content            # Content display components
  /auth               # Authentication components
  /admin              # Admin interface components
  /common             # Shared utility components
/lib                   # Utility functions and configurations
  /api                # API client functions
  /auth               # Authentication utilities
  /config             # Configuration management
  /utils              # General utility functions
  /validators         # Zod validation schemas
  /hooks              # Custom React hooks
/types                # TypeScript type definitions
  /api                # API response types
  /auth               # Authentication types
  /content            # Content model types
  /ui                 # UI component types
/data                 # Mock data and fixtures
  /courses            # Course and lesson mock data
  /users              # User and role mock data
  /resources          # Resource mock data
  /purchases          # Purchase and payment mock data
  /badges             # Badge and achievement mock data
  /nostr              # Nostr event mock data
  /lightning          # Lightning payment mock data
/config               # JSON configuration files
  /themes             # Theme configuration files
  /components         # Component styling configs
  /platform           # Platform feature configs
/styles               # Global styles and Tailwind config
/public               # Static assets
  /images             # Image assets
  /icons              # Icon assets
  /docs               # Documentation assets
```

### File Naming Conventions

#### Component Files

```
// PascalCase for components
UserProfile.tsx
CourseCard.tsx
NavigationHeader.tsx

// kebab-case for non-component files
user-profile.types.ts
course-card.utils.ts
navigation-header.styles.ts
```

#### Utility and Configuration Files

```
// kebab-case for utilities
auth-utils.ts
validation-schemas.ts
api-client.ts

// SCREAMING_SNAKE_CASE for constants
API_ENDPOINTS.ts
THEME_CONSTANTS.ts
```

#### Directory Naming

```
// kebab-case for directories
/user-management
/course-content
/admin-dashboard

// Single word when possible
/auth
/forms
/layout
```

---

## Code Organization Standards

### File Structure Template

Every file should follow this template:

```typescript
/**
 * @fileoverview Brief description of the file's purpose and main functionality
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// External library imports (alphabetical)
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Internal imports (alphabetical, grouped by type)
import { APIResponse } from '@/types/api';
import { validateRequest } from '@/lib/validators';
import { createApiResponse } from '@/lib/utils/api-utils';

// Type definitions (if needed in file)
interface LocalType {
  // Type definition
}

// Constants (if needed in file)
const LOCAL_CONSTANT = 'value';

// Main implementation
```

### Function Documentation Standards

#### JSDoc/TSDoc Format

````typescript
/**
 * Brief description of what the function does
 *
 * @param {Type} paramName - Description of the parameter
 * @param {Type} [optionalParam] - Description of optional parameter
 * @returns {Type} Description of return value
 *
 * @throws {ErrorType} Description of when this error is thrown
 *
 * @example
 * ```typescript
 * const result = functionName(param1, param2);
 * console.log(result); // Expected output
 * ```
 *
 * @since 1.0.0
 */
function functionName(paramName: Type, optionalParam?: Type): ReturnType {
  // Implementation
}
````

#### React Component Documentation

````typescript
/**
 * Component for displaying user profile information with edit capabilities
 *
 * @component
 * @param {Object} props - Component props
 * @param {User} props.user - User object with profile data
 * @param {boolean} [props.isEditable=false] - Whether the profile can be edited
 * @param {Function} [props.onUpdate] - Callback function when profile is updated
 *
 * @returns {JSX.Element} Rendered user profile component
 *
 * @example
 * ```tsx
 * <UserProfile
 *   user={currentUser}
 *   isEditable={true}
 *   onUpdate={handleProfileUpdate}
 * />
 * ```
 */
export function UserProfile({
  user,
  isEditable = false,
  onUpdate,
}: UserProfileProps) {
  // Component implementation
}
````

### Code Organization Within Files

#### Maximum File Length

- **Maximum 500 lines per file**
- If a file exceeds 500 lines, split it into logical modules
- Use barrel exports (`index.ts`) to maintain clean imports

#### Function Organization

```typescript
/**
 * @fileoverview User authentication utilities
 */

// 1. Type definitions and interfaces
interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

// 2. Constants and configuration
const AUTH_COOKIE_NAME = 'plebdevs-auth';
const SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days

// 3. Pure utility functions (no side effects)
function createAuthToken(user: AuthUser): string {
  // Implementation
}

function validateAuthToken(token: string): boolean {
  // Implementation
}

// 4. Functions with side effects
async function authenticateUser(
  credentials: LoginCredentials,
): Promise<AuthUser> {
  // Implementation
}

// 5. Main exported functions
export { createAuthToken, validateAuthToken, authenticateUser };
```

---

## TypeScript Standards

### Type Definitions

```typescript
// Core User model matching Prisma schema
interface User {
  id: string;
  pubkey?: string | null;
  privkey?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  username?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
  nip05?: string | null;
  lud16?: string | null;
  role?: Role | null;
  platformNip05?: PlatformNip05 | null;
  platformLightningAddress?: PlatformLightningAddress | null;
}

// Role and subscription management
interface Role {
  id: string;
  userId: string;
  subscribed: boolean;
  admin: boolean;
  subscriptionType: string;
  subscriptionStartDate?: Date | null;
  lastPaymentAt?: Date | null;
  subscriptionExpiredAt?: Date | null;
  nwc?: string | null;
}

// Content models
interface Resource {
  id: string;
  userId: string;
  price: number;
  noteId?: string | null;
  videoId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Course {
  id: string;
  userId: string;
  price: number;
  noteId?: string | null;
  submissionRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Lesson {
  id: string;
  courseId?: string | null;
  resourceId?: string | null;
  draftId?: string | null;
  index: number;
  createdAt: Date;
  updatedAt: Date;
}

// Draft content models
interface Draft {
  id: string;
  userId: string;
  type: string;
  title: string;
  summary: string;
  content: string;
  image?: string | null;
  price?: number | null;
  topics: string[];
  additionalLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CourseDraft {
  id: string;
  userId: string;
  title: string;
  summary: string;
  image?: string | null;
  price?: number | null;
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Progress tracking
interface UserLesson {
  id: string;
  userId: string;
  lessonId: string;
  opened: boolean;
  completed: boolean;
  openedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCourse {
  id: string;
  userId: string;
  courseId: string;
  started: boolean;
  completed: boolean;
  startedAt?: Date | null;
  completedAt?: Date | null;
  submittedRepoLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Commerce models
interface Purchase {
  id: string;
  userId: string;
  courseId?: string | null;
  resourceId?: string | null;
  amountPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

// Badge system
interface Badge {
  id: string;
  name: string;
  noteId: string;
  courseId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: Date;
}

// Platform services
interface PlatformNip05 {
  id: string;
  userId: string;
  pubkey: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PlatformLightningAddress {
  id: string;
  userId: string;
  name: string;
  allowsNostr: boolean;
  description?: string | null;
  maxSendable: bigint;
  minSendable: bigint;
  invoiceMacaroon: string;
  lndCert?: string | null;
  lndHost: string;
  lndPort: string;
}

// NextAuth models
interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  oauth_token_secret?: string | null;
  oauth_token?: string | null;
}

interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

// API response types
type APIResponse<T> = {
  data: T;
  success: boolean;
  error?: string;
};

// Generic pagination
interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Content type unions
type ContentType = 'course' | 'resource' | 'draft';
type DraftType = 'course' | 'resource' | 'lesson';
type SubscriptionType = 'monthly' | 'yearly';

// Extended types with relationships for UI
interface CourseWithDetails extends Course {
  user: User;
  lessons: Lesson[];
  badge?: Badge | null;
  userCourses: UserCourse[];
  purchases: Purchase[];
}

interface ResourceWithDetails extends Resource {
  user: User;
  lessons: Lesson[];
  purchases: Purchase[];
}

interface UserWithDetails extends User {
  role?: Role | null;
  purchases: Purchase[];
  userCourses: UserCourse[];
  userLessons: UserLesson[];
  userBadges: UserBadge[];
}
```

### Strict Type Safety

```typescript
// Always use strict TypeScript settings
// Enable in tsconfig.json:
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true
  }
}

// Use type assertions sparingly and with comments
const element = document.getElementById('root') as HTMLElement // Safe: we know this element exists

// Prefer type guards over assertions
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj
}
```

---

## React Component Standards

### Component Structure

```typescript
/**
 * @fileoverview Course card component for displaying course information
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseWithDetails } from '@/types/content'

// Props interface with full JSDoc
interface CourseCardProps {
  /** Course data with related information */
  course: CourseWithDetails
  /** Whether to show the purchase button */
  showPurchaseButton?: boolean
  /** Whether to show Lightning zap button */
  showZapButton?: boolean
  /** Current user ID for purchase status */
  currentUserId?: string
  /** Callback when course is clicked */
  onCourseClick?: (courseId: string) => void
  /** Callback when purchase button is clicked */
  onPurchaseClick?: (courseId: string) => void
  /** Callback when zap button is clicked */
  onZapClick?: (courseId: string, amount: number) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Displays a course card with title, metadata, and interaction buttons
 * Supports Bitcoin Lightning payments and progress tracking
 *
 * @component
 * @param {CourseCardProps} props - Component props
 * @returns {JSX.Element} Rendered course card
 */
export function CourseCard({
  course,
  showPurchaseButton = false,
  showZapButton = false,
  currentUserId,
  onCourseClick,
  onPurchaseClick,
  onZapClick,
  className = ''
}: CourseCardProps) {
  // Event handlers
  const handleCardClick = () => {
    onCourseClick?.(course.id)
  }

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPurchaseClick?.(course.id)
  }

  const handleZapClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onZapClick?.(course.id, 1000) // Default 1000 sats
  }

  // Computed values
  const formattedPrice = formatSatoshis(course.price)
  const isPurchased = currentUserId ? course.purchases.some(p => p.userId === currentUserId) : false
  const userProgress = currentUserId ? course.userCourses.find(uc => uc.userId === currentUserId) : null
  const completionPercentage = userProgress && course.lessons.length > 0
    ? Math.round((userProgress.completed ? 100 : 0))
    : 0

  // Render
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${className}`} onClick={handleCardClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{course.user.username || 'Anonymous'}</CardTitle>
            <p className="text-sm text-muted-foreground">Course • {course.lessons.length} lessons</p>
          </div>
          {course.badge && (
            <Badge variant="secondary" className="ml-2">
              🏆 {course.badge.name}
            </Badge>
          )}
        </div>
        {userProgress && (
          <div className="mt-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {showPurchaseButton && !isPurchased && (
              <Button
                variant="default"
                size="sm"
                onClick={handlePurchaseClick}
              >
                Purchase - {formattedPrice}
              </Button>
            )}
            {isPurchased && (
              <Badge variant="success">Owned</Badge>
            )}
            {showZapButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleZapClick}
                className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
              >
                ⚡ Zap
              </Button>
            )}
          </div>
          {course.submissionRequired && (
            <Badge variant="outline" className="text-xs">
              Submission Required
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions (if only used in this component)
function formatSatoshis(amount: number): string {
  if (amount === 0) return 'Free'
  return `${amount.toLocaleString()} sats`
}
```

### Custom Hooks

````typescript
/**
 * @fileoverview Custom hook for managing user authentication state
 */

import { useState, useEffect } from 'react';
import { User } from '@/types/auth';

/**
 * Hook for managing user authentication state and operations
 *
 * @returns {Object} Authentication state and operations
 * @returns {User | null} returns.user - Current authenticated user or null
 * @returns {boolean} returns.isLoading - Whether authentication is loading
 * @returns {Function} returns.login - Function to log in a user
 * @returns {Function} returns.logout - Function to log out the current user
 * @returns {Function} returns.updateUser - Function to update user data
 *
 * @example
 * ```tsx
 * const { user, isLoading, login, logout } = useAuth()
 *
 * if (isLoading) return <LoadingSpinner />
 * if (!user) return <LoginForm onLogin={login} />
 * return <Dashboard user={user} onLogout={logout} />
 * ```
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Implementation...

  return {
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };
}
````

### Draft Content Management Hook

````typescript
/**
 * @fileoverview Custom hook for managing draft content creation and editing
 */

import { useState, useEffect } from 'react';
import { Draft, CourseDraft } from '@/types/content';

/**
 * Hook for managing draft content with auto-save functionality
 *
 * @param {string} [initialDraftId] - ID of existing draft to load
 * @param {'draft' | 'course'} draftType - Type of draft content
 *
 * @returns {Object} Draft management state and operations
 * @returns {Draft | CourseDraft | null} returns.draft - Current draft data
 * @returns {boolean} returns.isLoading - Whether draft is loading
 * @returns {boolean} returns.isSaving - Whether draft is currently saving
 * @returns {boolean} returns.hasUnsavedChanges - Whether there are unsaved changes
 * @returns {Function} returns.updateDraft - Function to update draft content
 * @returns {Function} returns.saveDraft - Function to manually save draft
 * @returns {Function} returns.publishDraft - Function to publish draft
 * @returns {Function} returns.deleteDraft - Function to delete draft
 *
 * @example
 * ```tsx
 * const {
 *   draft,
 *   isLoading,
 *   hasUnsavedChanges,
 *   updateDraft,
 *   publishDraft
 * } = useDraftContent(draftId, 'course')
 *
 * if (isLoading) return <LoadingSpinner />
 *
 * return (
 *   <DraftEditor
 *     draft={draft}
 *     onChange={updateDraft}
 *     onPublish={publishDraft}
 *     hasUnsavedChanges={hasUnsavedChanges}
 *   />
 * )
 * ```
 */
export function useDraftContent(
  initialDraftId?: string,
  draftType: 'draft' | 'course' = 'draft',
) {
  const [draft, setDraft] = useState<Draft | CourseDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && draft) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, draft]);

  // Load existing draft
  useEffect(() => {
    if (initialDraftId) {
      loadDraft(initialDraftId);
    } else {
      setIsLoading(false);
    }
  }, [initialDraftId]);

  const loadDraft = async (draftId: string) => {
    try {
      setIsLoading(true);
      const endpoint = draftType === 'course' ? 'course-drafts' : 'drafts';
      const response = await fetch(`/api/${endpoint}/${draftId}`);
      const draftData = await response.json();
      setDraft(draftData);
    } catch (error) {
      console.error('Failed to load draft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDraft = (updates: Partial<Draft | CourseDraft>) => {
    setDraft(prev => (prev ? { ...prev, ...updates } : null));
    setHasUnsavedChanges(true);
  };

  const saveDraft = async () => {
    if (!draft || isSaving) return;

    try {
      setIsSaving(true);
      const endpoint = draftType === 'course' ? 'course-drafts' : 'drafts';
      const method = draft.id ? 'PUT' : 'POST';
      const url = draft.id
        ? `/api/${endpoint}/${draft.id}`
        : `/api/${endpoint}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });

      const savedDraft = await response.json();
      setDraft(savedDraft);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const publishDraft = async () => {
    if (!draft?.id) return;

    try {
      const endpoint = draftType === 'course' ? 'course-drafts' : 'drafts';
      const response = await fetch(`/api/${endpoint}/${draft.id}/publish`, {
        method: 'POST',
      });

      const publishedContent = await response.json();
      return publishedContent;
    } catch (error) {
      console.error('Failed to publish draft:', error);
      throw error;
    }
  };

  const deleteDraft = async () => {
    if (!draft?.id) return;

    try {
      const endpoint = draftType === 'course' ? 'course-drafts' : 'drafts';
      await fetch(`/api/${endpoint}/${draft.id}`, {
        method: 'DELETE',
      });

      setDraft(null);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to delete draft:', error);
      throw error;
    }
  };

  return {
    draft,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    updateDraft,
    saveDraft,
    publishDraft,
    deleteDraft,
  };
}
````

---

## API and Data Management

### API Client Structure

```typescript
/**
 * @fileoverview API client for course-related operations
 */

import { z } from 'zod';
import {
  Course,
  CourseWithDetails,
  CourseDraft,
  UserCourse,
} from '@/types/content';
import { APIResponse, PaginatedResponse } from '@/types/api';

// Validation schemas based on Prisma models
const CourseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  price: z.number().min(0),
  noteId: z.string().optional(),
  submissionRequired: z.boolean().default(false),
});

const CourseDraftSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1),
  summary: z.string().min(1),
  image: z.string().optional(),
  price: z.number().min(0).optional(),
  topics: z.array(z.string()),
});

const UserCourseSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  submittedRepoLink: z.string().optional(),
});

/**
 * Fetches all courses with optional pagination and filtering
 *
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.pageSize=20] - Number of items per page
 * @param {string} [params.userId] - Filter by course creator
 * @param {string} [params.search] - Search term for course content
 * @param {boolean} [params.includeDetails=false] - Include user, lessons, and badges
 *
 * @returns {Promise<PaginatedResponse<Course | CourseWithDetails>>} Paginated course data
 *
 * @throws {Error} When the API request fails
 */
export async function getCourses(params?: {
  page?: number;
  pageSize?: number;
  userId?: string;
  search?: string;
  includeDetails?: boolean;
}): Promise<PaginatedResponse<Course | CourseWithDetails>> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.pageSize)
    searchParams.set('pageSize', params.pageSize.toString());
  if (params?.userId) searchParams.set('userId', params.userId);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.includeDetails) searchParams.set('includeDetails', 'true');

  const response = await fetch(`/api/courses?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Creates a new course draft
 *
 * @param {CourseDraft} draftData - Course draft data to create
 * @returns {Promise<CourseDraft>} Created course draft
 *
 * @throws {Error} When validation fails or API request fails
 */
export async function createCourseDraft(
  draftData: Omit<CourseDraft, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<CourseDraft> {
  // Validate input
  const validatedData = CourseDraftSchema.parse(draftData);

  const response = await fetch('/api/course-drafts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create course draft: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Publishes a course draft to a live course
 *
 * @param {string} draftId - ID of the draft to publish
 * @returns {Promise<Course>} Published course data
 *
 * @throws {Error} When the API request fails
 */
export async function publishCourseDraft(draftId: string): Promise<Course> {
  const response = await fetch(`/api/course-drafts/${draftId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to publish course draft: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Enrolls a user in a course
 *
 * @param {string} courseId - ID of the course to enroll in
 * @param {string} userId - ID of the user to enroll
 * @returns {Promise<UserCourse>} User course enrollment data
 *
 * @throws {Error} When the API request fails
 */
export async function enrollInCourse(
  courseId: string,
  userId: string,
): Promise<UserCourse> {
  const response = await fetch(`/api/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to enroll in course: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Tracks user progress in a course
 *
 * @param {string} courseId - ID of the course
 * @param {string} userId - ID of the user
 * @param {Object} progress - Progress data
 * @param {boolean} [progress.completed] - Whether the course is completed
 * @param {string} [progress.submittedRepoLink] - Repository link for submission
 *
 * @returns {Promise<UserCourse>} Updated user course data
 *
 * @throws {Error} When the API request fails
 */
export async function updateCourseProgress(
  courseId: string,
  userId: string,
  progress: {
    completed?: boolean;
    submittedRepoLink?: string;
  },
): Promise<UserCourse> {
  const response = await fetch(`/api/courses/${courseId}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, ...progress }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update course progress: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Purchases a course with Lightning payment
 *
 * @param {string} courseId - ID of the course to purchase
 * @param {string} userId - ID of the user making the purchase
 * @param {number} amountPaid - Amount paid in satoshis
 * @param {string} [paymentHash] - Lightning payment hash for verification
 *
 * @returns {Promise<Purchase>} Purchase record
 *
 * @throws {Error} When the API request fails
 */
export async function purchaseCourse(
  courseId: string,
  userId: string,
  amountPaid: number,
  paymentHash?: string,
): Promise<Purchase> {
  const response = await fetch(`/api/courses/${courseId}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, amountPaid, paymentHash }),
  });

  if (!response.ok) {
    throw new Error(`Failed to purchase course: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
```

### Mock Data Organization

```typescript
/**
 * @fileoverview Mock data for courses - matches production schema exactly
 */

import {
  User,
  Course,
  CourseWithDetails,
  Resource,
  Lesson,
  UserCourse,
  Purchase,
  Badge,
  UserBadge,
  Role,
  PlatformLightningAddress,
} from '@/types/content';

/**
 * Mock users with Nostr/Lightning integration
 * Matches production User model from Prisma schema
 */
export const mockUsers: User[] = [
  {
    id: 'user-1',
    pubkey:
      '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
    privkey: null, // Never expose in real app
    email: 'alice@example.com',
    emailVerified: new Date('2024-01-10'),
    username: 'alice_dev',
    avatar: 'https://avatars.githubusercontent.com/u/1234567',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    nip05: 'alice@plebdevs.com',
    lud16: 'alice@plebdevs.com',
    role: null,
    platformNip05: null,
    platformLightningAddress: null,
  },
  {
    id: 'user-2',
    pubkey:
      '03b3ec27c8b2a0c7e23b9a4f5c3d6e7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
    privkey: null,
    email: 'bob@example.com',
    emailVerified: new Date('2024-01-05'),
    username: 'bitcoinbob',
    avatar: 'https://avatars.githubusercontent.com/u/7654321',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-10'),
    nip05: 'bob@plebdevs.com',
    lud16: 'bob@plebdevs.com',
    role: null,
    platformNip05: null,
    platformLightningAddress: null,
  },
];

/**
 * Mock user roles and subscriptions
 */
export const mockRoles: Role[] = [
  {
    id: 'role-1',
    userId: 'user-1',
    subscribed: true,
    admin: false,
    subscriptionType: 'monthly',
    subscriptionStartDate: new Date('2024-01-01'),
    lastPaymentAt: new Date('2024-01-01'),
    subscriptionExpiredAt: new Date('2024-02-01'),
    nwc: 'nostr+walletconnect://...',
  },
];

/**
 * Mock courses matching production schema
 */
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    userId: 'user-2',
    price: 50000, // 50,000 sats
    noteId: 'note1abcdef123456789',
    submissionRequired: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'course-2',
    userId: 'user-2',
    price: 0, // Free course
    noteId: 'note1xyz789012345678',
    submissionRequired: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
];

/**
 * Mock resources (individual content items)
 */
export const mockResources: Resource[] = [
  {
    id: 'resource-1',
    userId: 'user-2',
    price: 10000, // 10,000 sats
    noteId: 'note1resource123456',
    videoId: 'video-1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
  },
];

/**
 * Mock lessons within courses and resources
 */
export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    courseId: 'course-1',
    resourceId: null,
    draftId: null,
    index: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'lesson-2',
    courseId: 'course-1',
    resourceId: null,
    draftId: null,
    index: 2,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'lesson-3',
    courseId: null,
    resourceId: 'resource-1',
    draftId: null,
    index: 1,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

/**
 * Mock user course enrollments and progress
 */
export const mockUserCourses: UserCourse[] = [
  {
    id: 'user-course-1',
    userId: 'user-1',
    courseId: 'course-1',
    started: true,
    completed: false,
    startedAt: new Date('2024-01-20'),
    completedAt: null,
    submittedRepoLink: null,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
  },
];

/**
 * Mock purchases
 */
export const mockPurchases: Purchase[] = [
  {
    id: 'purchase-1',
    userId: 'user-1',
    courseId: 'course-1',
    resourceId: null,
    amountPaid: 50000,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

/**
 * Mock badges for achievements
 */
export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Bitcoin Basics Graduate',
    noteId: 'note1badge123456789',
    courseId: 'course-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

/**
 * Mock user badges
 */
export const mockUserBadges: UserBadge[] = [
  {
    id: 'user-badge-1',
    userId: 'user-1',
    badgeId: 'badge-1',
    awardedAt: new Date('2024-01-25'),
  },
];

/**
 * Mock courses with full relationship data for UI components
 */
export const mockCoursesWithDetails: CourseWithDetails[] = [
  {
    ...mockCourses[0],
    user: mockUsers[1], // Course creator
    lessons: mockLessons.filter(l => l.courseId === 'course-1'),
    badge: mockBadges[0],
    userCourses: mockUserCourses.filter(uc => uc.courseId === 'course-1'),
    purchases: mockPurchases.filter(p => p.courseId === 'course-1'),
  },
  {
    ...mockCourses[1],
    user: mockUsers[1], // Course creator
    lessons: mockLessons.filter(l => l.courseId === 'course-2'),
    badge: null,
    userCourses: [],
    purchases: [],
  },
];

/**
 * Simulates API delay for realistic development experience
 *
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {Promise<void>} Promise that resolves after delay
 */
export function simulateApiDelay(delay: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Simulates Lightning payment processing
 *
 * @param {number} amountSats - Amount in satoshis
 * @param {string} [description] - Payment description
 * @returns {Promise<{success: boolean, paymentHash?: string}>} Mock payment result
 */
export async function simulateLightningPayment(
  amountSats: number,
  description?: string,
): Promise<{ success: boolean; paymentHash?: string }> {
  await simulateApiDelay(1000); // Simulate payment processing time

  // Mock payment success/failure (90% success rate)
  const success = Math.random() > 0.1;

  return {
    success,
    paymentHash: success ? `lnbc${amountSats}u1...` : undefined,
  };
}

/**
 * Simulates Nostr event publishing
 *
 * @param {Object} event - Nostr event to publish
 * @param {string[]} [relays] - Relay URLs to publish to
 * @returns {Promise<{success: boolean, eventId?: string}>} Mock publish result
 */
export async function simulateNostrPublish(
  event: any,
  relays?: string[],
): Promise<{ success: boolean; eventId?: string }> {
  await simulateApiDelay(500); // Simulate network delay

  const success = Math.random() > 0.05; // 95% success rate

  return {
    success,
    eventId: success
      ? `note1${Math.random().toString(36).substring(2)}`
      : undefined,
  };
}
```

---

## Nostr & Lightning Integration Standards

### Nostr Integration Patterns

```typescript
/**
 * @fileoverview Nostr event handling utilities
 */

import { NostrEvent, validateEvent, verifySignature } from 'nostr-tools';

/**
 * Validates and processes a Nostr event for course content
 *
 * @param {NostrEvent} event - Raw Nostr event
 * @returns {Promise<{isValid: boolean, content?: any}>} Validation result
 *
 * @throws {Error} When event validation fails
 */
export async function validateNostrCourseEvent(event: NostrEvent): Promise<{
  isValid: boolean;
  content?: any;
}> {
  // Validate event structure
  if (!validateEvent(event)) {
    return { isValid: false };
  }

  // Verify signature
  const isValidSignature = verifySignature(event);
  if (!isValidSignature) {
    return { isValid: false };
  }

  // Parse content based on event kind
  if (event.kind === 30023) {
    // Long-form content (NIP-23)
    const content = JSON.parse(event.content);
    return { isValid: true, content };
  }

  return { isValid: false };
}

/**
 * Creates a Nostr event for course publication
 *
 * @param {CourseDraft} draft - Course draft to publish
 * @param {string} privateKey - Author's private key
 * @returns {Promise<NostrEvent>} Signed Nostr event
 */
export async function createCourseNostrEvent(
  draft: CourseDraft,
  privateKey: string,
): Promise<NostrEvent> {
  const event = {
    kind: 30023, // Long-form content
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ['d', draft.id], // Unique identifier
      ['title', draft.title],
      ['summary', draft.summary],
      ['image', draft.image || ''],
      ['price', draft.price?.toString() || '0'],
      ...draft.topics.map(topic => ['t', topic]),
    ],
    content: JSON.stringify({
      title: draft.title,
      summary: draft.summary,
      content: draft.content || '',
      lessons: draft.draftLessons || [],
    }),
    pubkey: '', // Will be set during signing
  };

  // Sign event (implementation depends on chosen Nostr library)
  // const signedEvent = await signEvent(event, privateKey)
  // return signedEvent

  return event as NostrEvent;
}
```

### Lightning Payment Integration

```typescript
/**
 * @fileoverview Lightning payment processing utilities
 */

import { webln } from '@webln/providers';

/**
 * Processes a Lightning payment for course purchase
 *
 * @param {number} amountSats - Amount in satoshis
 * @param {string} description - Payment description
 * @param {string} [courseId] - Course ID for purchase tracking
 *
 * @returns {Promise<{success: boolean, paymentHash?: string}>} Payment result
 *
 * @throws {Error} When payment processing fails
 */
export async function processLightningPayment(
  amountSats: number,
  description: string,
  courseId?: string,
): Promise<{ success: boolean; paymentHash?: string }> {
  try {
    // Enable WebLN if available
    if (typeof window !== 'undefined' && window.webln) {
      await window.webln.enable();

      // Generate invoice (would typically come from backend)
      const invoice = await generateInvoice(amountSats, description);

      // Process payment
      const result = await window.webln.sendPayment(invoice);

      // Record purchase in database
      if (result.preimage && courseId) {
        await recordPurchase(courseId, amountSats, result.preimage);
      }

      return {
        success: true,
        paymentHash: result.paymentHash,
      };
    }

    throw new Error('WebLN not available');
  } catch (error) {
    console.error('Lightning payment failed:', error);
    return { success: false };
  }
}

/**
 * Generates a Lightning invoice for course payment
 *
 * @param {number} amountSats - Amount in satoshis
 * @param {string} description - Payment description
 * @returns {Promise<string>} Lightning invoice (BOLT11)
 */
async function generateInvoice(
  amountSats: number,
  description: string,
): Promise<string> {
  // In real implementation, this would call your Lightning backend
  // For now, return a mock invoice
  return `lnbc${amountSats}u1...`;
}

/**
 * Records a course purchase after successful payment
 *
 * @param {string} courseId - Course ID
 * @param {number} amountPaid - Amount paid in satoshis
 * @param {string} paymentHash - Lightning payment hash
 * @returns {Promise<Purchase>} Purchase record
 */
async function recordPurchase(
  courseId: string,
  amountPaid: number,
  paymentHash: string,
): Promise<Purchase> {
  // Implementation would call your API to record the purchase
  const purchase = await fetch('/api/purchases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId,
      amountPaid,
      paymentHash,
    }),
  });

  return purchase.json();
}
```

### Platform Services Integration

```typescript
/**
 * @fileoverview Platform-provided NIP-05 and Lightning address services
 */

/**
 * Creates a platform NIP-05 identity for a user
 *
 * @param {string} userId - User ID
 * @param {string} pubkey - User's Nostr public key
 * @param {string} preferredName - Preferred username
 * @returns {Promise<PlatformNip05>} Created NIP-05 identity
 */
export async function createPlatformNip05(
  userId: string,
  pubkey: string,
  preferredName: string,
): Promise<PlatformNip05> {
  // Validate pubkey format
  if (!pubkey.match(/^[0-9a-f]{64}$/)) {
    throw new Error('Invalid pubkey format');
  }

  // Check name availability
  const isAvailable = await checkNip05Availability(preferredName);
  if (!isAvailable) {
    throw new Error('Name not available');
  }

  // Create NIP-05 identity
  const nip05 = await fetch('/api/platform/nip05', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      pubkey,
      name: preferredName,
    }),
  });

  return nip05.json();
}

/**
 * Creates a platform Lightning address for a user
 *
 * @param {string} userId - User ID
 * @param {string} preferredName - Preferred username
 * @param {Object} lndConfig - Lightning node configuration
 * @returns {Promise<PlatformLightningAddress>} Created Lightning address
 */
export async function createPlatformLightningAddress(
  userId: string,
  preferredName: string,
  lndConfig: {
    invoiceMacaroon: string;
    lndHost: string;
    lndPort?: string;
    lndCert?: string;
  },
): Promise<PlatformLightningAddress> {
  // Validate Lightning node connection
  const isValidNode = await validateLightningNode(lndConfig);
  if (!isValidNode) {
    throw new Error('Invalid Lightning node configuration');
  }

  // Create Lightning address
  const lightningAddress = await fetch('/api/platform/lightning-address', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      name: preferredName,
      ...lndConfig,
    }),
  });

  return lightningAddress.json();
}

/**
 * Validates Lightning node connectivity
 *
 * @param {Object} config - Lightning node configuration
 * @returns {Promise<boolean>} Whether the node is accessible
 */
async function validateLightningNode(config: {
  invoiceMacaroon: string;
  lndHost: string;
  lndPort?: string;
  lndCert?: string;
}): Promise<boolean> {
  // Implementation would test connection to Lightning node
  // For mock purposes, return true
  return true;
}

/**
 * Checks if a NIP-05 name is available
 *
 * @param {string} name - Desired name
 * @returns {Promise<boolean>} Whether the name is available
 */
async function checkNip05Availability(name: string): Promise<boolean> {
  const response = await fetch(`/api/platform/nip05/availability?name=${name}`);
  const { available } = await response.json();
  return available;
}
```

---

## Testing Standards

### Test File Organization

```typescript
/**
 * @fileoverview Tests for CourseCard component
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { CourseCard } from './CourseCard'
import { mockCourses } from '@/data/courses'

describe('CourseCard', () => {
  const mockCourse = mockCourses[0]
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  /**
   * Test: Should render course information correctly
   */
  it('renders course information correctly', () => {
    render(<CourseCard course={mockCourse} />)

    expect(screen.getByText(mockCourse.title)).toBeInTheDocument()
    expect(screen.getByText(mockCourse.description)).toBeInTheDocument()
    expect(screen.getByText(mockCourse.difficulty)).toBeInTheDocument()
  })

  /**
   * Test: Should call onClick handler when clicked
   */
  it('calls onClick handler when clicked', () => {
    render(<CourseCard course={mockCourse} onCourseClick={mockOnClick} />)

    fireEvent.click(screen.getByRole('button'))

    expect(mockOnClick).toHaveBeenCalledWith(mockCourse.id)
  })
})
```

---

## Configuration Management

### JSON Configuration Structure

```json
{
  "_meta": {
    "description": "Theme configuration for PlebDevs platform",
    "version": "1.0.0",
    "author": "PlebDevs Team",
    "lastUpdated": "2024-01-01"
  },
  "colors": {
    "primary": "#F2A900",
    "secondary": "#7B68EE",
    "accent": "#8B5CF6",
    "neutral": "#71717A"
  },
  "typography": {
    "fontFamily": "Inter",
    "headingScale": 1.25,
    "bodySize": "1rem",
    "lineHeight": 1.5
  },
  "components": {
    "Button": {
      "variants": {
        "primary": {
          "backgroundColor": "var(--color-primary)",
          "color": "white",
          "borderRadius": "0.5rem"
        }
      }
    }
  }
}
```

### Configuration Schema Validation

```typescript
/**
 * @fileoverview Theme configuration validation schemas
 */

import { z } from 'zod';

/**
 * Schema for validating theme configuration files
 */
export const ThemeConfigSchema = z.object({
  _meta: z.object({
    description: z.string(),
    version: z.string(),
    author: z.string(),
    lastUpdated: z.string(),
  }),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i),
    neutral: z.string().regex(/^#[0-9A-F]{6}$/i),
  }),
  typography: z.object({
    fontFamily: z.string(),
    headingScale: z.number().min(1).max(2),
    bodySize: z.string(),
    lineHeight: z.number().min(1).max(3),
  }),
  components: z.record(z.unknown()),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
```

---

## Development Workflow

### Git Workflow

```bash
# Branch naming convention
feature/user-authentication
fix/course-card-overflow
chore/update-dependencies
docs/api-documentation

# Commit message format
type(scope): description

# Examples:
feat(auth): add Nostr authentication support
fix(ui): resolve button hover state issue
docs(api): add JSDoc to course endpoints
chore(deps): update Next.js to v14.1.0
```

### Code Review Checklist

- [ ] All functions have proper JSDoc documentation
- [ ] File has appropriate fileoverview comment
- [ ] TypeScript types are properly defined
- [ ] File is under 500 lines
- [ ] Functions are pure where possible
- [ ] Error handling is comprehensive
- [ ] Tests are included for new functionality
- [ ] Configuration follows JSON schema
- [ ] Responsive design is considered
- [ ] Accessibility standards are met

### Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "analyze": "ANALYZE=true npm run build",
    "docs": "typedoc --out docs/api src/"
  }
}
```

---

## Performance Guidelines

### Code Splitting

```typescript
// Dynamic imports for large components
const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})

// Lazy loading for non-critical components
const ContactForm = lazy(() => import('./ContactForm'))
```

### Bundle Size Monitoring

```typescript
// Use webpack-bundle-analyzer
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// In next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
```

---

## Error Handling Standards

### Error Boundary Implementation

```typescript
/**
 * @fileoverview Error boundary for graceful error handling
 */

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * Error boundary component that catches JavaScript errors in child components
 *
 * @component
 * @param {React.PropsWithChildren} props - Component props with children
 * @returns {JSX.Element} Error UI or children components
 */
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page.</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## AI Optimization Guidelines

### AI-Friendly Code Patterns

```typescript
/**
 * Use clear, descriptive names that explain intent
 * Bad: const d = new Date()
 * Good: const currentTimestamp = new Date()
 */

/**
 * Prefer explicit over implicit
 * Bad: function handle(e) { ... }
 * Good: function handleButtonClick(event: MouseEvent) { ... }
 */

/**
 * Use consistent patterns throughout codebase
 * All API functions follow the same error handling pattern
 * All components use the same prop validation approach
 */

/**
 * Keep functions focused and single-purpose
 * Each function should do one thing well
 * Complex operations should be broken into smaller functions
 */
```

### Documentation for AI Context

```typescript
/**
 * @fileoverview This explains the file's purpose and how it fits into the larger system
 *
 * This file is part of the authentication system and handles user login/logout.
 * It connects to the main auth context and provides utilities for other components.
 * Related files: auth-context.tsx, login-form.tsx, user-profile.tsx
 */
```

---

## Conclusion

These project rules establish a foundation for building a maintainable, scalable, and AI-friendly codebase. By following these standards, we ensure:

1. **Consistency**: All team members and AI assistants can navigate and understand the code
2. **Maintainability**: Clear documentation and structure make updates easier
3. **Scalability**: Modular architecture supports growth and feature additions
4. **Quality**: Comprehensive testing and validation prevent bugs
5. **Performance**: Optimized patterns ensure fast loading and smooth interactions

All team members should familiarize themselves with these rules and refer to them during development. Regular reviews should ensure compliance and identify areas for improvement.

---

_This document is a living guide that evolves with the project. Updates should be documented and communicated to all team members._
