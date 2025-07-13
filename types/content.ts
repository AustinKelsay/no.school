/**
 * @fileoverview Content and course-related TypeScript interfaces
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { User } from './auth';

// Content models
export interface Resource {
  id: string;
  userId: string;
  price: number;
  noteId?: string | null;
  videoId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  userId: string;
  price: number;
  noteId?: string | null;
  submissionRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId?: string | null;
  resourceId?: string | null;
  draftId?: string | null;
  index: number;
  createdAt: Date;
  updatedAt: Date;
}

// Draft content models
export interface Draft {
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

export interface CourseDraft {
  id: string;
  userId: string;
  title: string;
  summary: string;
  image?: string | null;
  price?: number | null;
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
  draftLessons?: DraftLesson[];
}

export interface DraftLesson {
  id: string;
  courseDraftId: string;
  title: string;
  content: string;
  index: number;
  createdAt: Date;
  updatedAt: Date;
}

// Progress tracking
export interface UserLesson {
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

export interface UserCourse {
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
export interface Purchase {
  id: string;
  userId: string;
  courseId?: string | null;
  resourceId?: string | null;
  amountPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

// Badge system
export interface Badge {
  id: string;
  name: string;
  noteId: string;
  courseId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: Date;
}

// Content type unions
export type ContentType = 'course' | 'resource' | 'draft';
export type DraftType = 'course' | 'resource' | 'lesson';

// Extended types with relationships for UI
export interface CourseWithDetails extends Course {
  user: User;
  lessons: Lesson[];
  badge?: Badge | null;
  userCourses: UserCourse[];
  purchases: Purchase[];
}

export interface ResourceWithDetails extends Resource {
  user: User;
  lessons: Lesson[];
  purchases: Purchase[];
}

export interface LessonWithDetails extends Lesson {
  course?: Course | null;
  resource?: Resource | null;
  draft?: Draft | null;
  userLessons: UserLesson[];
}

export interface DraftWithDetails extends Draft {
  user: User;
  lessons: Lesson[];
}

export interface CourseDraftWithDetails extends CourseDraft {
  user: User;
  draftLessons: DraftLesson[];
}

// Content filtering and search
export interface ContentFilters {
  type?: ContentType[];
  topics?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  difficulty?: string[];
  userId?: string;
  hasSubmission?: boolean;
}

export interface ContentSearchParams {
  query?: string;
  filters?: ContentFilters;
  sortBy?: 'created' | 'updated' | 'price' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Content creation and editing
export interface CreateCourseRequest {
  title: string;
  summary: string;
  content?: string;
  image?: string;
  price?: number;
  topics: string[];
  submissionRequired?: boolean;
}

export interface CreateResourceRequest {
  title: string;
  summary: string;
  content?: string;
  image?: string;
  price?: number;
  topics: string[];
  videoId?: string;
}

export interface CreateDraftRequest {
  type: DraftType;
  title: string;
  summary: string;
  content?: string;
  image?: string;
  price?: number;
  topics: string[];
  additionalLinks?: string[];
}

// Progress tracking types
export interface UserProgress {
  userId: string;
  courseProgress: UserCourse[];
  lessonProgress: UserLesson[];
  badges: UserBadge[];
  completionRate: number;
  totalTimeSpent?: number;
}

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  estimatedTimeRemaining?: number;
  currentLesson?: Lesson;
}

// Content statistics
export interface ContentStats {
  totalCourses: number;
  totalResources: number;
  totalLessons: number;
  totalUsers: number;
  totalPurchases: number;
  averageCompletionRate: number;
  popularTopics: string[];
  recentActivity: {
    newCourses: number;
    newUsers: number;
    newPurchases: number;
  };
}
