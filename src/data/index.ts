/**
 * Centralized exports for all data-related modules
 * This file provides a single import point for all data, types, and configurations
 */

// ============================================================================
// CENTRALIZED DATA EXPORTS
// ============================================================================

// Export all types from domain modules and main types file
export type * from './types'

// Export main configuration and utilities
export * from './config'
// Note: course-utils.ts contains Nostr integration utilities for future use
// export * from './course-utils'

// ============================================================================
// DOMAIN-SPECIFIC EXPORTS
// ============================================================================

// Course domain exports
export {
  dbCoursesMockData,
  dbLessonsMockData,
  coursesWithLessons,
  coursesDatabase,
  getCourseById,
  getLessonsByCourseId,
  getCoursesByCategory,
  getCourseStatistics,
  getFreeCourses,
  getPaidCourses,
  getFreeLessons,
  getPaidLessons
} from './courses'

// Document domain exports
export {
  dbDocumentsMockData,
  getDocumentById,
  getDocumentsByCategory,
  getDocumentsByType,
  getFreeDocuments,
  getPaidDocuments,
  getDocumentsByDifficulty,
  getDocumentsByInstructor,
  searchDocuments,
  getDocumentStatistics,
  getPopularDocuments,
  getRecentDocuments,
  getTopRatedDocuments,
  getDocumentsByTag,
  getRelatedDocuments
} from './documents'

// Video domain exports
export {
  dbVideosMockData,
  getVideoById,
  getVideosByCategory,
  getFreeVideos,
  getPaidVideos,
  getVideosByDifficulty,
  getVideosByInstructor,
  searchVideos,
  getVideoStatistics,
  getPopularVideos,
  getRecentVideos,
  getTopRatedVideos,
  getVideosByDuration,
  getShortVideos,
  getMediumVideos,
  getLongVideos,
  getVideosByTag,
  getRelatedVideos,
  formatVideoDuration,
  getTotalWatchTime,
  getVideoDurationStats
} from './videos'

// ============================================================================
// AGGREGATED DATA FUNCTIONS
// ============================================================================

/**
 * Get all content items for mixed content displays
 * This is a lightweight export that can be used for content discovery
 */
export async function getAllContentSummary() {
  const { dbCoursesMockData } = await import('./courses')
  const { dbDocumentsMockData } = await import('./documents') 
  const { dbVideosMockData } = await import('./videos')
  
  return {
    totalCourses: dbCoursesMockData.length,
    totalDocuments: dbDocumentsMockData.length,
    totalVideos: dbVideosMockData.length,
    totalContent: dbCoursesMockData.length + dbDocumentsMockData.length + dbVideosMockData.length
  }
} 