/**
 * Repository pattern implementation for no.school data access
 * Provides clean abstraction over data sources with caching
 */

import { Course, Lesson, ContentItem } from '@/data/types'
import { coursesDatabase } from '@/data/mock-data'
import { globalCache, taggedCache } from './cache'
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
      const course = coursesDatabase.find(c => c.id === id)
      return course || null
    }, this.CACHE_TTL)
  }

  /**
   * Find all courses with optional filtering and caching
   */
  static async findAll(filters: RepositoryFilters = {}): Promise<Course[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      let courses = [...coursesDatabase] // Create copy to avoid mutations

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

      return courses
    }, this.CACHE_TTL)
  }

  /**
   * Find courses by category with caching
   */
  static async findByCategory(category: string): Promise<Course[]> {
    return this.findAll({ category })
  }

  /**
   * Create new course
   */
  static async create(courseData: Omit<Course, 'id' | 'rating' | 'enrollmentCount' | 'createdAt' | 'lessons'>): Promise<Course> {
    // Check for title conflicts
    const existingCourse = coursesDatabase.find(c => 
      c.title.toLowerCase() === courseData.title.toLowerCase()
    )
    
    if (existingCourse) {
      throw new ConflictError('Course with this title already exists')
    }

    // Generate new ID
    const newId = Math.max(...coursesDatabase.map(c => c.id), 0) + 1

    const newCourse: Course = {
      id: newId,
      ...courseData,
      rating: 0,
      enrollmentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lessons: []
    }

    // Add to database
    coursesDatabase.push(newCourse)

    // Invalidate relevant caches
    this.invalidateCache()
    this.invalidateCategoryCache(courseData.category)

    return newCourse
  }

  /**
   * Update existing course
   */
  static async update(id: number, updateData: Partial<Course>): Promise<Course> {
    const existingCourse = await this.findById(id)
    if (!existingCourse) {
      throw new NotFoundError('Course')
    }

    // Find index in database
    const index = coursesDatabase.findIndex(c => c.id === id)
    if (index === -1) {
      throw new NotFoundError('Course')
    }

    // Check for title conflicts if title is being updated
    if (updateData.title && updateData.title !== existingCourse.title) {
      const titleConflict = coursesDatabase.find(c => 
        c.id !== id && c.title.toLowerCase() === updateData.title!.toLowerCase()
      )
      
      if (titleConflict) {
        throw new ConflictError('Course with this title already exists')
      }
    }

    // Update course
    const updatedCourse = {
      ...existingCourse,
      ...updateData,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString().split('T')[0]
    }

    coursesDatabase[index] = updatedCourse

    // Invalidate caches
    this.invalidateCache(id)
    this.invalidateCategoryCache(existingCourse.category)
    if (updateData.category && updateData.category !== existingCourse.category) {
      this.invalidateCategoryCache(updateData.category)
    }

    return updatedCourse
  }

  /**
   * Delete course
   */
  static async delete(id: number): Promise<boolean> {
    const course = await this.findById(id)
    if (!course) {
      return false
    }

    const index = coursesDatabase.findIndex(c => c.id === id)
    if (index === -1) {
      return false
    }

    // Remove from database
    coursesDatabase.splice(index, 1)

    // Invalidate caches
    this.invalidateCache(id)
    this.invalidateCategoryCache(course.category)

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
      const courses = await this.findAll()
      
      const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrollmentCount ?? 0), 0)
      const ratingsSum = courses.reduce((sum, course) => sum + (course.rating * (course.enrollmentCount ?? 0)), 0)
      const averageRating = totalEnrollments > 0 ? ratingsSum / totalEnrollments : 0
      
      const categoryCounts = courses.reduce((counts, course) => {
        counts[course.category] = (counts[course.category] || 0) + 1
        return counts
      }, {} as Record<string, number>)

      return {
        totalCourses: courses.length,
        totalEnrollments,
        averageRating: Number(averageRating.toFixed(2)),
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
   * Cache invalidation helpers
   */
  private static invalidateCache(id?: number): void {
    if (id) {
      globalCache.invalidate(`${this.CACHE_PREFIX}:${id}`)
    }
    globalCache.invalidatePattern(`${this.CACHE_PREFIX}:all`)
    globalCache.invalidatePattern(`${this.CACHE_PREFIX}:search`)
    globalCache.invalidate(`${this.CACHE_PREFIX}:stats`)
  }

  private static invalidateCategoryCache(category: string): void {
    globalCache.invalidatePattern(`category:${category}`)
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
      const course = await CourseRepository.findById(courseId)
      return course?.lessons || []
    }, this.CACHE_TTL)
  }

  /**
   * Find lesson by ID
   */
  static async findById(courseId: number, lessonId: number): Promise<Lesson | null> {
    const lessons = await this.findByCourseId(courseId)
    return lessons.find(l => l.id === lessonId) || null
  }

  /**
   * Get lesson statistics
   */
  static async getStats(courseId: number): Promise<{
    totalLessons: number
    totalDuration: string
    completedLessons: number
  }> {
    const cacheKey = `${this.CACHE_PREFIX}:stats:${courseId}`
    
    return globalCache.get(cacheKey, async () => {
      const lessons = await this.findByCourseId(courseId)
      
      // Calculate total duration (simplified - assumes format like "10:30")
      const totalMinutes = lessons.reduce((total, lesson) => {
        if (lesson.duration) {
          const [minutes, seconds] = lesson.duration.split(':').map(Number)
          return total + minutes + (seconds / 60)
        }
        return total
      }, 0)
      
      const hours = Math.floor(totalMinutes / 60)
      const minutes = Math.round(totalMinutes % 60)
      const totalDuration = `${hours}:${minutes.toString().padStart(2, '0')}`
      
      return {
        totalLessons: lessons.length,
        totalDuration,
        completedLessons: 0 // Would need user progress data
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
   * Get all content items (courses, documents, and videos in ContentItem format)
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

      // Add documents if type filter allows
      if (!filters.type || filters.type === 'document' || filters.type === 'guide' || filters.type === 'cheatsheet') {
        const { dbDocumentsMockData } = await import('@/data/documents')
        
        let documents = dbDocumentsMockData
        if (filters.category) {
          documents = documents.filter(doc => doc.category === filters.category)
        }
        
        const documentItems: ContentItem[] = documents.map(doc => ({
          id: parseInt(doc.id.replace('doc-', ''), 10) + 2000, // Offset to avoid ID conflicts
          type: doc.type as 'document' | 'guide' | 'cheatsheet',
          title: doc.title,
          description: doc.description,
          category: doc.category,
          instructor: doc.instructor,
          rating: doc.rating,
          image: doc.image,
          isPremium: doc.isPremium,
          tags: doc.tags,
          difficulty: doc.difficulty,
          createdAt: doc.createdAt,
        }))

        items = [...items, ...documentItems]
      }

      // Add videos if type filter allows
      if (!filters.type || filters.type === 'video') {
        const { dbVideosMockData } = await import('@/data/videos')
        
        let videos = dbVideosMockData
        if (filters.category) {
          videos = videos.filter(video => video.category === filters.category)
        }
        
        const videoItems: ContentItem[] = videos.map(video => ({
          id: parseInt(video.id.replace('video-', ''), 10) + 3000, // Offset to avoid ID conflicts
          type: 'video' as const,
          title: video.title,
          description: video.description,
          category: video.category,
          instructor: video.instructor,
          rating: video.rating,
          duration: video.duration,
          image: video.thumbnailUrl,
          isPremium: video.isPremium,
          tags: video.tags,
          difficulty: video.difficulty,
          createdAt: video.createdAt,
        }))

        items = [...items, ...videoItems]
      }

      return items
    }, this.CACHE_TTL)
  }

  /**
   * Search across all content types with relevance scoring
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
      
      // Score items by relevance
      const scoredItems = items.map(item => {
        let score = 0
        
        // Title match (highest weight)
        if (item.title.toLowerCase().includes(searchTerm)) {
          score += 10
          if (item.title.toLowerCase().startsWith(searchTerm)) {
            score += 5
          }
        }
        
        // Description match (medium weight)
        if (item.description.toLowerCase().includes(searchTerm)) {
          score += 5
        }
        
        // Instructor match (medium weight)
        if (item.instructor?.toLowerCase().includes(searchTerm)) {
          score += 5
        }
        
        // Category match (low weight)
        if (item.category.toLowerCase().includes(searchTerm)) {
          score += 2
        }
        
        // Tag match (medium weight)
        if (item.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
          score += 3
        }

        // Boost popular content slightly
        score += Math.min(item.rating ?? 0, 2)
        
        return { item, score }
      })

      // Filter out items with no relevance and sort by score
      return scoredItems
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item)
    }, this.CACHE_TTL)
  }

  /**
   * Get trending content (based on views/rating across all content types)
   */
  static async findTrending(limit: number = 10): Promise<ContentItem[]> {
    const cacheKey = `${this.CACHE_PREFIX}:trending:${limit}`
    
    return globalCache.get(cacheKey, async () => {
      const items = await this.findAll()
      
      // Sort by a combination of rating and view count/enrollment count
      return items
        .sort((a, b) => {
          const enrollmentA = (a as ContentItem & { enrollmentCount?: number }).enrollmentCount || 0
          const enrollmentB = (b as ContentItem & { enrollmentCount?: number }).enrollmentCount || 0
          const scoreA = (a.rating ?? 0) * 2 + Math.min(enrollmentA, 100) / 100
          const scoreB = (b.rating ?? 0) * 2 + Math.min(enrollmentB, 100) / 100
          return scoreB - scoreA
        })
        .slice(0, limit)
    }, this.CACHE_TTL)
  }

  /**
   * Helper to calculate course duration from lessons
   */
  private static calculateCourseDuration(lessons: Lesson[]): string {
    const totalMinutes = lessons.reduce((total, lesson) => {
      if (lesson.duration) {
        const [minutes, seconds] = lesson.duration.split(':').map(Number)
        return total + minutes + (seconds / 60)
      }
      return total
    }, 0)
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
}

// ============================================================================
// REPOSITORY FACTORY (for future database implementations)
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