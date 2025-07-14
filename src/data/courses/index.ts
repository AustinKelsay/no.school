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
  coursesWithLessons,
  getCourseById,
  getLessonsByCourseId,
  getCoursesByCategory,
  getFreeCourses,
  getPaidCourses,
  getLessonById,
  getCourseWithLessons,
  mockInstructorPubkeys,
  mockUserIds
} from './mock-courses'