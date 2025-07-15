/**
 * Course domain mock data
 * Minimal database fields only - UI data comes from Nostr events
 * Based on content_data_models.md Course model
 */

import type { Course, Lesson, CourseWithLessons } from '../types'

// Mock user IDs for the database relations
export const mockUserIds = {
  austinKelsay: 'f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741',
  alexJohnson: '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e',
  mariaSantos: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
  davidWilson: '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa',
  sarahLee: '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
  mikeTaylor: '91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3'
}

// ============================================================================
// DATABASE COURSE DATA (Minimal fields only - matching content_data_models.md)
// ============================================================================

export const coursesMockData: Course[] = [
  {
    id: 'f538f5c5-1a72-4804-8eb1-3f05cea64874',
    userId: mockUserIds.austinKelsay,
    price: 0, // Free course
    noteId: 'd2797459e3f15491b39225a68146d3ec375f71d01b57cfe3a559179777e20912',
    submissionRequired: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: 'course-bitcoin-lightning-dev',
    userId: mockUserIds.alexJohnson,
    price: 0, // Free course
    noteId: 'bitcoin-lightning-dev-course-event',
    submissionRequired: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: 'course-nostr-protocol-dev',
    userId: mockUserIds.mariaSantos,
    price: 0, // Free course
    noteId: 'nostr-protocol-dev-course-event',
    submissionRequired: false,
    createdAt: '2024-01-11T09:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
  },
  {
    id: 'course-frontend-bitcoin-apps',
    userId: mockUserIds.davidWilson,
    price: 18000, // Paid course - price in sats
    noteId: 'frontend-bitcoin-apps-course-event',
    submissionRequired: true,
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
  },
  {
    id: 'course-lightning-api-integration',
    userId: mockUserIds.sarahLee,
    price: 22000, // Paid course - price in sats
    noteId: 'lightning-api-integration-course-event',
    submissionRequired: true,
    createdAt: '2024-01-05T13:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 'course-web3-security-practices',
    userId: mockUserIds.mikeTaylor,
    price: 28000, // Paid course - price in sats
    noteId: 'web3-security-practices-course-event',
    submissionRequired: true,
    createdAt: '2024-01-02T14:00:00Z',
    updatedAt: '2024-01-09T12:00:00Z',
  }
]

// ============================================================================
// LESSON DATA (connecting courses to resources)
// ============================================================================

export const lessonsMockData: Lesson[] = [
  // PlebDevs Starter Course lessons
  {
    id: 'lesson-starter-1',
    courseId: 'f538f5c5-1a72-4804-8eb1-3f05cea64874',
    resourceId: 'f93827ed-68ad-4b5e-af33-f7424b37f0d6',
    index: 0,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'lesson-starter-2',
    courseId: 'f538f5c5-1a72-4804-8eb1-3f05cea64874',
    resourceId: '6d8260b3-c902-46ec-8aed-f3b8c8f1229b',
    index: 1,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'lesson-starter-3',
    courseId: 'f538f5c5-1a72-4804-8eb1-3f05cea64874',
    resourceId: '80aac9d4-8bef-4a92-9ee9-dea1c2d66c3a',
    index: 2,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 'lesson-starter-4',
    courseId: 'f538f5c5-1a72-4804-8eb1-3f05cea64874',
    resourceId: '6fe3cb4b-2571-4e3b-9159-db78325ee5cc',
    index: 3,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
  {
    id: 'lesson-starter-5',
    courseId: 'f538f5c5-1a72-4804-8eb1-3f05cea64874',
    resourceId: 'e5399c72-9b95-46d6-a594-498e673b6c58',
    index: 4,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'lesson-starter-6',
    courseId: 'f538f5c5-1a72-4804-8eb1-3f05cea64874',
    resourceId: 'a3083ab5-0187-4b77-83d1-29ae1f644559',
    index: 5,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  
  // Bitcoin & Lightning Protocol Development course lessons
  {
    id: 'lesson-bitcoin-fundamentals',
    courseId: 'course-bitcoin-lightning-dev',
    resourceId: 'bitcoin-fundamentals',
    index: 0,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'lesson-lightning-basics',
    courseId: 'course-bitcoin-lightning-dev',
    resourceId: 'lightning-basics',
    index: 1,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'lesson-advanced-bitcoin-dev',
    courseId: 'course-bitcoin-lightning-dev',
    resourceId: 'advanced-bitcoin-dev',
    index: 2,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  
  // Nostr Protocol Development course lessons
  {
    id: 'lesson-nostr-fundamentals',
    courseId: 'course-nostr-protocol-dev',
    resourceId: 'nostr-fundamentals',
    index: 0,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 'lesson-nostr-client-building',
    courseId: 'course-nostr-protocol-dev',
    resourceId: 'nostr-client-building',
    index: 1,
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
  },
  {
    id: 'lesson-advanced-nostr-dev',
    courseId: 'course-nostr-protocol-dev',
    resourceId: 'advanced-nostr-dev',
    index: 2,
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  }
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get course by ID
 */
export function getCourseById(id: string): Course | undefined {
  return coursesMockData.find(course => course.id === id)
}

/**
 * Get courses by category (requires parsing Nostr events)
 */
export function getCoursesByCategory(category: string): Course[] {
  // This would need to be implemented with Nostr event parsing
  // For now, returning all courses
  return coursesMockData
}

/**
 * Get free courses
 */
export function getFreeCourses(): Course[] {
  return coursesMockData.filter(course => course.price === 0)
}

/**
 * Get paid courses
 */
export function getPaidCourses(): Course[] {
  return coursesMockData.filter(course => course.price > 0)
}

/**
 * Get lessons for a course
 */
export function getLessonsByCourseId(courseId: string): Lesson[] {
  return lessonsMockData.filter(lesson => lesson.courseId === courseId)
}

/**
 * Get lesson by ID
 */
export function getLessonById(id: string): Lesson | undefined {
  return lessonsMockData.find(lesson => lesson.id === id)
}

/**
 * Get course with lessons (requires resource lookup)
 */
export function getCourseWithLessons(courseId: string): CourseWithLessons | undefined {
  const course = getCourseById(courseId)
  if (!course) return undefined
  
  const lessons = getLessonsByCourseId(courseId)
  
  // This would need to be implemented with proper resource lookup and Nostr parsing
  // For now, returning basic structure
  return {
    ...course,
    // These would come from Nostr event parsing
    title: 'Unknown Course',
    description: 'No description available',
    category: 'general',
    instructor: 'Unknown',
    instructorPubkey: course.userId,
    rating: 0,
    enrollmentCount: 0,
    isPremium: course.price > 0,
    currency: 'sats',
    image: '',
    published: true,
    topics: [],
    lessonReferences: [],
    lessons: lessons.map(lesson => ({
      ...lesson,
      title: 'Unknown Lesson',
      description: 'No description available',
      type: 'document' as const,
      isPremium: false
    }))
  }
}