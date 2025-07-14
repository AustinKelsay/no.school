/**
 * Repository pattern implementation for no.school data access
 * Provides clean abstraction over data sources with caching
 */

import { Course, Lesson, ContentItem, DbCourse, DbLesson } from '@/data/types'
import { dbCoursesMockData, dbLessonsMockData } from '@/data/courses'
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
  private static readonly CACHE_TTL = 300000 // 5 minutes
  private static readonly CACHE_PREFIX = 'course'

  /**
   * Find course by ID with caching
   */
  static async findById(id: number): Promise<Course | null> {
    const cacheKey = `${this.CACHE_PREFIX}:${id}`
    
    return globalCache.get(cacheKey, async () => {
      const course = dbCoursesMockData.find(c => parseInt(c.id.replace('course-', '')) === id)
      if (!course) return null
      
      const lessons = dbLessonsMockData.filter(l => l.courseId === course.id)
      return this.transformDbCourseToLegacy(course, lessons)
    }, this.CACHE_TTL)
  }

  /**
   * Find all courses with optional filtering and caching
   */
  static async findAll(filters: RepositoryFilters = {}): Promise<Course[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      let courses = [...dbCoursesMockData] // Create copy to avoid mutations

      // Apply category filter
      if (filters.category) {
        courses = courses.filter(c => 
          c.category.toLowerCase() === filters.category!.toLowerCase()
        )
      }

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        courses = courses.filter(c =>
          c.title.toLowerCase().includes(searchTerm) ||
          c.description.toLowerCase().includes(searchTerm) ||
          c.instructor.toLowerCase().includes(searchTerm)
        )
      }

      // Transform to legacy format
      return courses.map(course => {
        const lessons = dbLessonsMockData.filter(l => l.courseId === course.id)
        return this.transformDbCourseToLegacy(course, lessons)
      })
    }, this.CACHE_TTL)
  }

  /**
   * Transform DbCourse to legacy Course format
   */
  private static transformDbCourseToLegacy(dbCourse: DbCourse, lessons: DbLesson[] = []): Course {
    return {
      id: parseInt(dbCourse.id.replace('course-', ''), 10),
      title: dbCourse.title,
      description: dbCourse.description,
      category: dbCourse.category.charAt(0).toUpperCase() + dbCourse.category.slice(1),
      duration: this.calculateTotalDuration(lessons),
      instructor: dbCourse.instructor,
      rating: dbCourse.rating,
      image: dbCourse.image || "/placeholder.svg",
      lessons: lessons.map(lesson => ({
        id: parseInt(lesson.id.replace(/lesson-\d+-/, ''), 10),
        title: lesson.title,
        duration: lesson.duration,
        completed: false
      })),
      enrollmentCount: dbCourse.enrollmentCount,
      createdAt: dbCourse.createdAt
    }
  }

  /**
   * Calculate total duration from lessons
   */
  private static calculateTotalDuration(lessons: DbLesson[]): string {
    if (!lessons.length) return '0h 0m'
    
    let totalMinutes = 0
    lessons.forEach(lesson => {
      const [minutes, seconds] = lesson.duration.split(':').map(Number)
      totalMinutes += minutes + (seconds / 60)
    })
    
    const hours = Math.floor(totalMinutes / 60)
    const mins = Math.round(totalMinutes % 60)
    
    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
  }

  /**
   * Find courses by category with caching
   */
  static async findByCategory(category: string): Promise<Course[]> {
    return this.findAll({ category })
  }

  /**
   * Create a new course
   */
  static async create(courseData: Omit<Course, 'id' | 'rating' | 'enrollmentCount' | 'createdAt' | 'lessons'>): Promise<Course> {
    const newId = Math.max(...dbCoursesMockData.map(c => parseInt(c.id.replace('course-', ''))), 0) + 1
    
    const newCourse: DbCourse = {
      id: `course-${newId}`,
      title: courseData.title,
      description: courseData.description,
      category: courseData.category.toLowerCase(),
      instructor: courseData.instructor,
      instructorPubkey: `npub1instructor${newId}`,
      rating: 0,
      enrollmentCount: 0,
      isPremium: false,
      image: courseData.image,
      courseListEventId: `course-event-${newId}`,
      courseListNaddr: `naddr1course${newId}`,
      published: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    // In a real implementation, this would save to database
    dbCoursesMockData.push(newCourse)
    
    // Invalidate cache
    this.invalidateCache()
    
    return this.transformDbCourseToLegacy(newCourse)
  }

  /**
   * Update an existing course
   */
  static async update(id: number, updateData: Partial<Course>): Promise<Course> {
    const index = dbCoursesMockData.findIndex(c => parseInt(c.id.replace('course-', '')) === id)
    if (index === -1) {
      throw new NotFoundError('Course')
    }
    
    const existingCourse = dbCoursesMockData[index]
    const updatedCourse: DbCourse = {
      ...existingCourse,
      title: updateData.title || existingCourse.title,
      description: updateData.description || existingCourse.description,
      category: updateData.category?.toLowerCase() || existingCourse.category,
      instructor: updateData.instructor || existingCourse.instructor,
      image: updateData.image || existingCourse.image,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    dbCoursesMockData[index] = updatedCourse
    
    // Invalidate cache
    this.invalidateCache(id)
    
    const lessons = dbLessonsMockData.filter(l => l.courseId === updatedCourse.id)
    return this.transformDbCourseToLegacy(updatedCourse, lessons)
  }

  /**
   * Delete a course
   */
  static async delete(id: number): Promise<boolean> {
    const index = dbCoursesMockData.findIndex(c => parseInt(c.id.replace('course-', '')) === id)
    if (index === -1) {
      return false
    }
    
    dbCoursesMockData.splice(index, 1)
    
    // Invalidate cache
    this.invalidateCache(id)
    
    return true
  }

  /**
   * Get course statistics
   */
  static async getStats(): Promise<{
    totalCourses: number
    totalEnrollments: number
    averageRating: number
    categoryCounts: Record<string, number>
  }> {
    const cacheKey = `${this.CACHE_PREFIX}:stats`
    
    return globalCache.get(cacheKey, async () => {
      const totalCourses = dbCoursesMockData.length
      const totalEnrollments = dbCoursesMockData.reduce((sum, course) => sum + course.enrollmentCount, 0)
      const averageRating = dbCoursesMockData.reduce((sum, course) => sum + course.rating, 0) / totalCourses

      const categoryCounts = dbCoursesMockData.reduce((acc, course) => {
        const category = course.category.charAt(0).toUpperCase() + course.category.slice(1)
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        totalCourses,
        totalEnrollments,
        averageRating: Math.round(averageRating * 10) / 10,
        categoryCounts
      }
    }, this.CACHE_TTL)
  }

  /**
   * Search courses with relevance scoring
   */
  static async search(query: string, filters: RepositoryFilters = {}): Promise<Course[]> {
    const cacheKey = `${this.CACHE_PREFIX}:search:${query}:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      const courses = await this.findAll(filters)
      
      if (!query.trim()) {
        return courses
      }

      const searchTerm = query.toLowerCase()
      
      // Score courses by relevance
      const scoredCourses = courses.map(course => {
        let score = 0
        
        // Title match (highest weight)
        if (course.title.toLowerCase().includes(searchTerm)) {
          score += 10
          if (course.title.toLowerCase().startsWith(searchTerm)) {
            score += 5 // Bonus for starting with search term
          }
        }
        
        // Description match (medium weight)
        if (course.description.toLowerCase().includes(searchTerm)) {
          score += 5
        }
        
        // Instructor match (medium weight)
        if (course.instructor.toLowerCase().includes(searchTerm)) {
          score += 5
        }
        
        // Category match (low weight)
        if (course.category.toLowerCase().includes(searchTerm)) {
          score += 2
        }

        // Boost popular courses slightly
        score += Math.min((course.enrollmentCount ?? 0) / 100, 2)
        score += Math.min(course.rating, 2)
        
        return { course, score }
      })

      // Filter out courses with no relevance and sort by score
      return scoredCourses
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.course)
    }, this.CACHE_TTL)
  }

  /**
   * Private method to invalidate cache
   */
  private static invalidateCache(id?: number): void {
    if (id) {
      globalCache.invalidate(`${this.CACHE_PREFIX}:${id}`)
    }
    globalCache.invalidatePattern(this.CACHE_PREFIX)
  }

  /**
   * Private method to invalidate category cache
   */
  private static invalidateCategoryCache(category: string): void {
    globalCache.invalidatePattern(`${this.CACHE_PREFIX}:category:${category.toLowerCase()}`)
  }
}

// ============================================================================
// LESSON REPOSITORY
// ============================================================================

export class LessonRepository {
  private static readonly CACHE_TTL = 300000 // 5 minutes
  private static readonly CACHE_PREFIX = 'lesson'

  /**
   * Find lessons by course ID
   */
  static async findByCourseId(courseId: number): Promise<Lesson[]> {
    const cacheKey = `${this.CACHE_PREFIX}:course:${courseId}`
    
    return globalCache.get(cacheKey, async () => {
      const courseIdStr = `course-${courseId}`
      return dbLessonsMockData
        .filter(lesson => lesson.courseId === courseIdStr)
        .map(lesson => ({
          id: parseInt(lesson.id.replace(/lesson-\d+-/, ''), 10),
          title: lesson.title,
          duration: lesson.duration,
          completed: false
        }))
    }, this.CACHE_TTL)
  }

  /**
   * Find specific lesson by course and lesson ID
   */
  static async findById(courseId: number, lessonId: number): Promise<Lesson | null> {
    const lessons = await this.findByCourseId(courseId)
    return lessons.find(lesson => lesson.id === lessonId) || null
  }

  /**
   * Get lesson statistics for a course
   */
  static async getStats(courseId: number): Promise<{
    totalLessons: number
    totalDuration: string
    completedLessons: number
  }> {
    const cacheKey = `${this.CACHE_PREFIX}:stats:${courseId}`
    
    return globalCache.get(cacheKey, async () => {
      const lessons = await this.findByCourseId(courseId)
      
      let totalMinutes = 0
      lessons.forEach(lesson => {
        const [minutes, seconds] = lesson.duration.split(':').map(Number)
        totalMinutes += minutes + (seconds / 60)
      })
      
      const hours = Math.floor(totalMinutes / 60)
      const mins = Math.round(totalMinutes % 60)
      const totalDuration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
      
      return {
        totalLessons: lessons.length,
        totalDuration,
        completedLessons: lessons.filter(l => l.completed).length
      }
    }, this.CACHE_TTL)
  }
}

// ============================================================================
// CONTENT REPOSITORY (for mixed content types)
// ============================================================================

export class ContentRepository {
  private static readonly CACHE_TTL = 300000 // 5 minutes
  private static readonly CACHE_PREFIX = 'content'

  /**
   * Get all content items (courses converted to ContentItem format)
   */
  static async findAll(filters: { type?: string; category?: string } = {}): Promise<ContentItem[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      let items: ContentItem[] = []

      // Add courses if type filter allows
      if (!filters.type || filters.type === 'course') {
        const courses = await CourseRepository.findAll(
          filters.category ? { category: filters.category } : {}
        )
        
        const courseItems: ContentItem[] = courses.map(course => ({
          id: course.id,
          type: 'course' as const,
          title: course.title,
          description: course.description,
          category: course.category,
          instructor: course.instructor,
          rating: course.rating,
          enrollmentCount: course.enrollmentCount ?? 0,
          duration: this.calculateCourseDuration(course.lessons ?? []),
          image: course.image,
          isPremium: false, // Courses are free in current implementation
          tags: [course.category],
          difficulty: 'intermediate' as const, // Default difficulty
          createdAt: course.createdAt ?? new Date().toISOString().split('T')[0],
        }))

        items = [...items, ...courseItems]
      }

      return items
    }, this.CACHE_TTL)
  }

  /**
   * Search across all content types
   */
  static async search(
    query: string, 
    filters: { type?: string; category?: string } = {}
  ): Promise<ContentItem[]> {
    const cacheKey = `${this.CACHE_PREFIX}:search:${query}:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      const items = await this.findAll(filters)
      
      if (!query.trim()) {
        return items
      }

      const searchTerm = query.toLowerCase()
      
      return items.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.instructor?.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }, this.CACHE_TTL)
  }

  /**
   * Get trending content (based on enrollment/rating)
   */
  static async findTrending(limit: number = 10): Promise<ContentItem[]> {
    const cacheKey = `${this.CACHE_PREFIX}:trending:${limit}`
    
    return globalCache.get(cacheKey, async () => {
      const items = await this.findAll()
      
      // Sort by a combination of rating and enrollment count
      return items
        .sort((a, b) => {
          const scoreA = (a.rating ?? 0) * 2
          const scoreB = (b.rating ?? 0) * 2
          return scoreB - scoreA
        })
        .slice(0, limit)
    }, this.CACHE_TTL)
  }

  /**
   * Calculate course duration from lessons
   */
  private static calculateCourseDuration(lessons: Lesson[]): string {
    if (!lessons.length) return '0m'
    
    let totalMinutes = 0
    lessons.forEach(lesson => {
      const [minutes, seconds] = lesson.duration.split(':').map(Number)
      totalMinutes += minutes + (seconds / 60)
    })
    
    const hours = Math.floor(totalMinutes / 60)
    const mins = Math.round(totalMinutes % 60)
    
    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
  }
}

// ============================================================================
// REPOSITORY INTERFACES AND FACTORY
// ============================================================================

export interface IRepository<T, ID = number> {
  findById(id: ID): Promise<T | null>
  findAll(filters?: Record<string, unknown>): Promise<T[]>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: ID, data: Partial<T>): Promise<T>
  delete(id: ID): Promise<boolean>
}

export class RepositoryFactory {
  static getCourseRepository(): typeof CourseRepository {
    // In the future, this could return different implementations
    // based on configuration (MockCourseRepository, DatabaseCourseRepository, etc.)
    return CourseRepository
  }

  static getLessonRepository(): typeof LessonRepository {
    return LessonRepository
  }

  static getContentRepository(): typeof ContentRepository {
    return ContentRepository
  }
}