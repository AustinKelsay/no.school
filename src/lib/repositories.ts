/**
 * Repository pattern implementation for no.school data access
 * Provides clean abstraction over data sources with caching
 */

import { Course, Lesson, ContentItem } from '@/data/types'
import { coursesMockData, lessonsMockData } from '@/data/courses'
import { globalCache } from './cache'
import { NotFoundError, ConflictError } from './api-utils'

// Repository-specific filter type (no pagination required)
interface RepositoryFilters {
  category?: string
  search?: string
}

// ============================================================================
// COURSE REPOSITORY
// ============================================================================

export class CourseRepository {
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly CACHE_PREFIX = 'course-repo'

  /**
   * Find all courses with optional filtering and caching
   */
  static async findAll(filters: RepositoryFilters = {}): Promise<Course[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      let courses = [...coursesMockData] // Create copy to avoid mutations

      // Apply category filter
      if (filters.category) {
        courses = courses.filter(course => 
          course.category.toLowerCase() === filters.category!.toLowerCase()
        )
      }

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        courses = courses.filter(course =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm)
        )
      }

      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 50))

      return courses
    }, this.CACHE_TTL)
  }

  /**
   * Find a course by ID with caching
   */
  static async findById(id: string): Promise<Course | null> {
    const cacheKey = `${this.CACHE_PREFIX}:${id}`
    
    return globalCache.get(cacheKey, async () => {
      const course = coursesMockData.find((c: Course) => c.id === id)
      if (!course) return null
      
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 30))
      
      return course
    }, this.CACHE_TTL)
  }

  /**
   * Create a new course
   */
  static async create(courseData: Omit<Course, 'id'>): Promise<Course> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`
    }

    // In a real implementation, this would save to database
    coursesMockData.push(newCourse)
    
    // Invalidate cache
    this.invalidateCache()
    
    return newCourse
  }

  /**
   * Update a course
   */
  static async update(id: string, courseData: Partial<Course>): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const courseIndex = coursesMockData.findIndex((c: Course) => c.id === id)
    if (courseIndex === -1) return null

    coursesMockData[courseIndex] = { ...coursesMockData[courseIndex], ...courseData }
    
    // Invalidate cache
    this.invalidateCache()
    
    return coursesMockData[courseIndex]
  }

  /**
   * Delete a course
   */
  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const courseIndex = coursesMockData.findIndex((c: Course) => c.id === id)
    if (courseIndex === -1) return false

    coursesMockData.splice(courseIndex, 1)
    
    // Invalidate cache
    this.invalidateCache()
    
    return true
  }

  /**
   * Invalidate all course caches
   */
  private static invalidateCache(id?: string) {
    if (id) {
      globalCache.invalidate(`${this.CACHE_PREFIX}:${id}`)
    } else {
      globalCache.clear()
    }
  }
}

// ============================================================================
// LESSON REPOSITORY
// ============================================================================

export class LessonRepository {
  
  static async findByCourseId(courseId: string): Promise<Lesson[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    
    const lessons = lessonsMockData.filter((l: Lesson) => l.courseId === courseId)
    return lessons
  }

  static async findById(id: string): Promise<Lesson | null> {
    await new Promise(resolve => setTimeout(resolve, 30))
    
    const lesson = lessonsMockData.find((l: Lesson) => l.id === id)
    return lesson || null
  }

  static async create(lessonData: Omit<Lesson, 'id'>): Promise<Lesson> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-${Date.now()}`
    }

    lessonsMockData.push(newLesson)
    return newLesson
  }

  static async update(id: string, lessonData: Partial<Lesson>): Promise<Lesson | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const lessonIndex = lessonsMockData.findIndex((l: Lesson) => l.id === id)
    if (lessonIndex === -1) return null

    lessonsMockData[lessonIndex] = { ...lessonsMockData[lessonIndex], ...lessonData }
    return lessonsMockData[lessonIndex]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const lessonIndex = lessonsMockData.findIndex((l: Lesson) => l.id === id)
    if (lessonIndex === -1) return false

    lessonsMockData.splice(lessonIndex, 1)
    return true
  }
}

// ============================================================================
// CONTENT TRANSFORMATION UTILITIES
// ============================================================================

function transformDbCourseToContentItem(course: Course, lessons: Lesson[]): ContentItem {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    type: 'course',
    category: course.category,
    tags: [],
    difficulty: 'intermediate' as const,
    instructor: course.instructor,
    instructorPubkey: course.instructorPubkey,
    rating: course.rating,
    enrollmentCount: course.enrollmentCount,
    isPremium: course.isPremium,
    price: course.price,
    currency: course.currency,
    image: course.image,
    createdAt: course.createdAt,
    lessons: lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.resourceId || 'Untitled Lesson',
      description: '',
      type: 'lesson',
      duration: '',
      order: lesson.index,
      isPremium: false,
      price: 0,
      currency: 'sats',
      videoUrl: '',
      documentUrl: '',
      createdAt: lesson.createdAt
    }))
  }
} 