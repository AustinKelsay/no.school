/**
 * Course domain types
 * All TypeScript interfaces related to courses and lessons
 */

// ============================================================================
// LEGACY COURSE TYPES (for backward compatibility)
// ============================================================================

export interface Course {
  id: number
  title: string
  description: string
  category: string
  duration: string
  instructor: string
  rating: number
  image?: string
  lessons: Lesson[]
  enrollmentCount: number
  createdAt: string
}

export interface Lesson {
  id: number
  title: string
  duration: string
  completed: boolean
}

// ============================================================================
// DATABASE COURSE MODELS
// ============================================================================

export interface DbCourse {
  id: string                    // Unique course ID (e.g., "course-1")
  title: string                 // Course title
  description: string           // Course description
  category: string              // Course category
  instructor: string            // Instructor name
  instructorPubkey: string      // Instructor's Nostr pubkey
  rating: number                // Course rating (0-5)
  enrollmentCount: number       // Number of enrolled students
  isPremium: boolean            // Whether course is paid
  price?: number                // Course price in sats
  currency?: string             // Currency (default: 'sats')
  image?: string                // Course image URL
  courseListEventId: string     // NIP-51 list event ID
  courseListNaddr: string       // NIP-19 naddr for course list
  published: boolean            // Whether course is published
  createdAt: string             // Creation timestamp
  updatedAt: string             // Update timestamp
}

export interface DbLesson {
  id: string                    // Unique lesson ID (e.g., "lesson-1-1")
  title: string                 // Lesson title
  description: string           // Lesson description
  courseId: string              // Parent course ID
  duration: string              // Lesson duration (e.g., "45 min")
  isPremium: boolean            // Whether lesson is paid
  price?: number                // Lesson price in sats
  currency?: string             // Currency (default: 'sats')
  lessonEventId: string         // NIP-23/99 event ID
  lessonNaddr: string           // NIP-19 naddr for lesson
  published: boolean            // Whether lesson is published
  createdAt: string             // Creation timestamp
  updatedAt: string             // Update timestamp
}

// ============================================================================
// COMBINED TYPES
// ============================================================================

export interface CourseWithLessons extends DbCourse {
  lessons: DbLesson[]
}

// ============================================================================
// ENROLLMENT AND PROGRESS TRACKING
// ============================================================================

export interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  completedAt?: string
  progress: number              // 0-100
  currentLessonId?: string
}

export interface LessonProgress {
  id: string
  userId: string
  lessonId: string
  courseId: string
  startedAt: string
  completedAt?: string
  progress: number              // 0-100
  timeSpent: number             // in seconds
}

// ============================================================================
// COURSE STATISTICS
// ============================================================================

export interface CourseStats {
  totalCourses: number
  totalEnrollments: number
  averageRating: number
  categoryCounts: Record<string, number>
  premiumCourses: number
  freeCourses: number
}

// ============================================================================
// FILTERING AND SEARCH
// ============================================================================

export interface CourseFilters {
  category?: string
  isPremium?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  instructor?: string
  rating?: number
}

export interface CourseSearchResult {
  courses: Course[]
  total: number
  query: string
  filters: CourseFilters
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateCourseData {
  title: string
  description: string
  category: string
  instructor?: string
  isPremium?: boolean
  price?: number
  image?: string
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  published?: boolean
}

export interface CreateLessonData {
  title: string
  description: string
  courseId: string
  duration: string
  isPremium?: boolean
  price?: number
}

export interface UpdateLessonData extends Partial<CreateLessonData> {
  published?: boolean
}