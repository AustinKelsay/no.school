/**
 * Course domain exports
 * Central export point for all course-related data and types
 */

// Export all types
export type * from './types'

// Export mock data
export {
  dbCoursesMockData,
  dbLessonsMockData,
  coursesDatabase,
  coursesWithLessons,
  getCourseById,
  getLessonsByCourseId,
  getCoursesByCategory,
  getFreeCourses,
  getPaidCourses,
  getFreeLessons,
  getPaidLessons,
  getCourseStatistics
} from './mock-courses'