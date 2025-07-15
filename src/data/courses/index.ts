/**
 * Course domain exports
 * Central export point for all course-related data and types
 */

// Export all types
export type * from './types'

// Export mock data
export {
  coursesMockData,
  lessonsMockData,
  getCourseById,
  getLessonsByCourseId,
  getCoursesByCategory,
  getFreeCourses,
  getPaidCourses,
  getLessonById,
  getCourseWithLessons,
  mockUserIds
} from './mock-courses'