/**
 * Centralized exports for all data-related modules
 * This file provides a single import point for all data, types, and configurations
 * Based on content_data_models.md database schema
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

// Export all types from the main types file
export type * from './types'

// ============================================================================
// DATABASE MODELS (Primary Data)
// ============================================================================

// Course data (matching Prisma schema)
export {
  coursesMockData,
  lessonsMockData,
  coursesWithLessons,
  getCourseById,
  getCoursesByCategory,
  getFreeCourses,
  getPaidCourses,
  getLessonsByCourseId,
  getLessonById,
  getCourseWithLessons,
  mockUserIds as courseMockUserIds,
  mockInstructorPubkeys as courseMockInstructorPubkeys
} from './courses/mock-courses'

// Resource data (videos + documents combined)
export {
  resourcesMockData,
  getResourceById,
  getResourcesByCategory,
  getResourcesByType,
  getDocumentResources,
  getVideoResources,
  getFreeResources,
  getPaidResources,
  getResourcesByDifficulty,
  getResourcesByInstructor,
  searchResources,
  getResourcesByTags,
  mockUserIds as resourceMockUserIds,
  mockInstructorPubkeys as resourceMockInstructorPubkeys
} from './resources/mock-resources'

// ============================================================================
// NOSTR EVENTS
// ============================================================================

// Nostr event data (NIP-51, NIP-23, NIP-99)
export {
  nostrCourseListEvents,
  nostrFreeContentEvents,
  nostrPaidContentEvents,
  allNostrEvents,
  nostrEventsByKind,
  mockInstructorPubkeys as nostrMockInstructorPubkeys
} from './nostr-events'

// Parsing functions
export {
  parseCourseEvent,
  parseResourceEvent
} from './types'

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

// Legacy course data (for components that haven't been updated yet)
export {
  coursesMockData as dbCoursesMockData,
  lessonsMockData as dbLessonsMockData,
  coursesWithLessons as dbCoursesWithLessons
} from './courses/mock-courses'

// Legacy document/video data (now unified as resources)
export {
  getDocumentResources as dbDocumentsMockData,
  getVideoResources as dbVideosMockData,
  resourcesMockData as dbResourcesMockData
} from './resources/mock-resources'

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Import data for utility functions
import { coursesMockData } from './courses/mock-courses'
import { resourcesMockData, getDocumentResources, getVideoResources, getFreeResources, getPaidResources } from './resources/mock-resources'

/**
 * Get all content items (courses, documents, videos) as a unified list
 */
export function getAllContentItems() {
  return [
    ...coursesMockData.map(course => ({
      ...course,
      type: 'course' as const,
      content: course
    })),
    ...resourcesMockData.map(resource => ({
      ...resource,
      type: resource.type,
      content: resource
    }))
  ]
}

/**
 * Search across all content types
 */
export function searchAllContent(query: string) {
  const lowerQuery = query.toLowerCase()
  
  const matchingCourses = coursesMockData.filter(course => 
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery) ||
    course.instructor.toLowerCase().includes(lowerQuery)
  )
  
  const matchingResources = resourcesMockData.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.description.toLowerCase().includes(lowerQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    resource.instructor.toLowerCase().includes(lowerQuery)
  )
  
  return {
    courses: matchingCourses,
    resources: matchingResources,
    total: matchingCourses.length + matchingResources.length
  }
}

/**
 * Get content statistics
 */
export function getContentStats() {
  const totalCourses = coursesMockData.length
  const totalResources = resourcesMockData.length
  const totalDocuments = getDocumentResources().length
  const totalVideos = getVideoResources().length
  
  const allRatings = [
    ...coursesMockData.map(c => c.rating),
    ...resourcesMockData.map(r => r.rating)
  ]
  const averageRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
  
  const totalEnrollments = coursesMockData.reduce((sum, course) => sum + course.enrollmentCount, 0)
  const totalViews = resourcesMockData.reduce((sum, resource) => sum + resource.viewCount, 0)
  
  return {
    totalCourses,
    totalResources,
    totalDocuments,
    totalVideos,
    averageRating: Math.round(averageRating * 10) / 10,
    totalEnrollments,
    totalViews,
    freeCourses: coursesMockData.filter(c => c.price === 0).length,
    paidCourses: coursesMockData.filter(c => c.price > 0).length,
    freeResources: getFreeResources().length,
    paidResources: getPaidResources().length
  }
}

/**
 * Get trending content (simple algorithm based on views/enrollments and recency)
 */
export function getTrendingContent(limit: number = 10) {
  const allContent = getAllContentItems()
  
  // Simple trending algorithm: combine views/enrollments with recency
  const scored = allContent.map(item => {
    const views = 'viewCount' in item ? item.viewCount : item.enrollmentCount
    const createdAt = new Date(item.createdAt).getTime()
    const now = Date.now()
    const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24)
    
    // Score: views divided by days since creation (newer content gets boost)
    const score = views / Math.max(daysSinceCreation, 1)
    
    return { ...item, trendingScore: score }
  })
  
  return scored
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export * from './config' 