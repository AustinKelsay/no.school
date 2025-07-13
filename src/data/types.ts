import type { LucideIcon } from "lucide-react"

/**
 * Core data types used throughout the application
 */

export interface Lesson {
  id: number
  title: string
  duration: string
  videoUrl?: string
  completed?: boolean
}

export interface Course {
  id: number
  title: string
  description: string
  category: string
  duration: string
  instructor: string
  rating: number
  image: string
  lessons?: Lesson[]
  enrollmentCount?: number
  createdAt?: string
}

export interface ContentItem {
  id: number
  title: string
  description: string
  type: 'course' | 'video' | 'document' | 'guide' | 'cheatsheet'
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  instructor?: string
  rating?: number
  image?: string
  isPremium: boolean
  createdAt: string
}

export interface Video {
  id: number
  title: string
  description: string
  duration: string
  instructor: string
  rating: number
  category: string
  tags: string[]
  isPremium: boolean
  createdAt: string
}

export interface Document {
  id: number
  title: string
  description: string
  type: 'cheatsheet' | 'guide' | 'cookbook' | 'checklist' | 'reference'
  category: string
  tags: string[]
  isPremium: boolean
  createdAt: string
}

export interface CourseStats {
  totalCourses: number
  totalStudents: number
  averageRating: number
  completionRate: number
  topCategories: Array<{
    name: string
    count: number
  }>
}

// Homepage display interfaces
export interface MockCourse {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
}

export interface MockVideo {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  duration: string
}

export interface MockDocument {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  type: string
}

// API Response types
export interface CoursesApiResponse {
  courses: Course[]
  total: number
  page: number
  totalPages: number
}

export interface CourseApiResponse {
  course: Course
}

export interface ApiErrorResponse {
  error: string
}

// Search and filter types
export interface SearchResult {
  results: Course[]
  total: number
  query: string
  category?: string
}

// Database Models - Metadata Only
export interface DbCourse {
  id: string
  title: string
  description: string
  category: string
  instructor: string
  instructorPubkey: string
  rating: number
  enrollmentCount: number
  isPremium: boolean
  price?: number
  currency?: string
  image?: string
  // Nostr identifiers
  courseListEventId: string // NIP-51 list event ID
  courseListNaddr: string // NIP-19 naddr for the course list
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface DbLesson {
  id: string
  courseId: string
  title: string
  description: string
  duration: string
  order: number
  isPremium: boolean
  price?: number
  currency?: string
  // Nostr identifiers
  lessonEventId: string // NIP-23 or NIP-99 event ID
  lessonNaddr: string // NIP-19 naddr for the lesson
  published: boolean
  createdAt: string
  updatedAt: string
}

// Database Models for Documents and Videos
export interface DbDocument {
  id: string
  title: string
  description: string
  category: string
  type: 'guide' | 'cheatsheet' | 'reference' | 'tutorial' | 'documentation'
  instructor: string
  instructorPubkey: string
  rating: number
  viewCount: number
  isPremium: boolean
  price?: number
  currency?: string
  image?: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  // Nostr identifiers
  documentEventId: string // NIP-23 or NIP-99 event ID
  documentNaddr: string // NIP-19 naddr for the document
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface DbVideo {
  id: string
  title: string
  description: string
  category: string
  instructor: string
  instructorPubkey: string
  duration: string
  rating: number
  viewCount: number
  isPremium: boolean
  price?: number
  currency?: string
  thumbnailUrl?: string
  videoUrl?: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  // Nostr identifiers
  videoEventId: string // NIP-23 or NIP-99 event ID
  videoNaddr: string // NIP-19 naddr for the video
  published: boolean
  createdAt: string
  updatedAt: string
}

// Nostr Event Types
export interface NostrEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

// NIP-51 Course List Event (kind 30001 or custom kind)
export interface NostrCourseListEvent extends Omit<NostrEvent, 'tags'> {
  kind: 30001 // Using bookmark list kind as base
  tags: string[][] // Flexible tags array
}

// NIP-23 Free Lesson Event (kind 30023)
export interface NostrFreeLessonEvent extends Omit<NostrEvent, 'tags'> {
  kind: 30023
  tags: string[][] // Flexible tags array
  content: string // Markdown content
}

// NIP-99 Paid Lesson Event (kind 30402)
export interface NostrPaidLessonEvent extends Omit<NostrEvent, 'tags'> {
  kind: 30402
  tags: string[][] // Flexible tags array
  content: string // Markdown content
}

// NIP-23 Free Document Event (kind 30023)
export interface NostrFreeDocumentEvent extends Omit<NostrEvent, 'tags'> {
  kind: 30023
  tags: string[][] // Flexible tags array
  content: string // Markdown content
}

// NIP-99 Paid Document Event (kind 30402)
export interface NostrPaidDocumentEvent extends Omit<NostrEvent, 'tags'> {
  kind: 30402
  tags: string[][] // Flexible tags array
  content: string // Markdown content
}

// NIP-23 Free Video Event (kind 30023)
export interface NostrFreeVideoEvent extends Omit<NostrEvent, 'tags'> {
  kind: 30023
  tags: string[][] // Flexible tags array
  content: string // Markdown content with video details
}

// NIP-99 Paid Video Event (kind 30402)
export interface NostrPaidVideoEvent extends Omit<NostrEvent, 'tags'> {
  kind: 30402
  tags: string[][] // Flexible tags array
  content: string // Markdown content with video details
}

// Combined types for application use
export interface CourseWithLessons extends DbCourse {
  lessons: DbLesson[]
}

export interface NostrCourseData {
  courseListEvent: NostrCourseListEvent
  lessonEvents: (NostrFreeLessonEvent | NostrPaidLessonEvent)[]
}

export interface NostrDocumentData {
  documentEvent: NostrFreeDocumentEvent | NostrPaidDocumentEvent
}

export interface NostrVideoData {
  videoEvent: NostrFreeVideoEvent | NostrPaidVideoEvent
}

// Utility types for content creation
export interface CreateCourseData {
  title: string
  description: string
  category: string
  instructor: string
  instructorPubkey: string
  isPremium: boolean
  price?: number
  currency?: string
  image?: string
  lessons: CreateLessonData[]
}

export interface CreateLessonData {
  title: string
  description: string
  content: string
  duration: string
  order: number
  isPremium: boolean
  price?: number
  currency?: string
}

export interface CreateDocumentData {
  title: string
  description: string
  content: string
  category: string
  type: 'guide' | 'cheatsheet' | 'reference' | 'tutorial' | 'documentation'
  instructor: string
  instructorPubkey: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  price?: number
  currency?: string
  image?: string
}

export interface CreateVideoData {
  title: string
  description: string
  content: string
  category: string
  instructor: string
  instructorPubkey: string
  duration: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  price?: number
  currency?: string
  thumbnailUrl?: string
  videoUrl?: string
}

// Content progress tracking
export interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  completedAt?: string
  progress: number // 0-100
  lastAccessedAt: string
}

export interface LessonProgress {
  id: string
  userId: string
  courseId: string
  lessonId: string
  completed: boolean
  completedAt?: string
  timeSpent: number // in seconds
  lastAccessedAt: string
}

export interface DocumentView {
  id: string
  userId: string
  documentId: string
  viewedAt: string
  timeSpent: number // in seconds
  completed: boolean
}

export interface VideoView {
  id: string
  userId: string
  videoId: string
  viewedAt: string
  timeSpent: number // in seconds
  progress: number // 0-100 percentage watched
  completed: boolean
}

// Content statistics
export interface ContentStats {
  totalCourses: number
  totalDocuments: number
  totalVideos: number
  totalUsers: number
  averageRating: number
  topCategories: Array<{
    name: string
    count: number
    type: 'course' | 'document' | 'video'
  }>
}