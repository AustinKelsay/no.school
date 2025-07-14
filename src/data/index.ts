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
export * from './course-utils'

// ============================================================================
// DOMAIN-SPECIFIC EXPORTS
// ============================================================================

// Course domain exports
export {
  dbCoursesMockData,
  dbLessonsMockData,
  coursesWithLessons,
  getCourseById,
  getLessonsByCourseId,
  getCoursesByCategory,
  getFreeCourses,
  getPaidCourses,
  getFreeLessons,
  getPaidLessons,
  getCourseStatistics
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
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

// Legacy mock data export
export {
  coursesDatabase
} from './mock-data'

// ============================================================================
// UNIFIED CONTENT EXPORTS
// ============================================================================

// Import data for internal use
import { dbDocumentsMockData } from './documents'
import { dbVideosMockData } from './videos'

/**
 * Get all content items (documents and videos) in a unified format
 */
export function getAllContent() {
  const documents = dbDocumentsMockData.map(doc => ({
    id: doc.id,
    type: 'document' as const,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    instructor: doc.instructor,
    rating: doc.rating,
    viewCount: doc.viewCount,
    isPremium: doc.isPremium,
    price: doc.price,
    difficulty: doc.difficulty,
    tags: doc.tags,
    createdAt: doc.createdAt
  }))

  const videos = dbVideosMockData.map(video => ({
    id: video.id,
    type: 'video' as const,
    title: video.title,
    description: video.description,
    category: video.category,
    instructor: video.instructor,
    rating: video.rating,
    viewCount: video.viewCount,
    isPremium: video.isPremium,
    price: video.price,
    difficulty: video.difficulty,
    tags: video.tags,
    duration: video.duration,
    createdAt: video.createdAt
  }))

  return [...documents, ...videos]
} 