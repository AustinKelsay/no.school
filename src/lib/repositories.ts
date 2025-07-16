/**
 * Repository pattern implementation for no.school data access
 * Provides clean abstraction over database data + Nostr events with caching
 * Following the minimal database + Nostr events architecture from content_data_models.md
 */

import { 
  Course, 
  Resource, 
  Lesson, 
  CourseDisplay, 
  ResourceDisplay, 
  ContentItem 
} from '@/data/types'
import { 
  getAllCoursesWithContent,
  getAllResourcesWithContent,
  getContentItems,
  searchContent 
} from '@/data'
import { globalCache } from './cache'
import { CourseAdapter, ResourceAdapter, LessonAdapter } from './db-adapter'

// Repository-specific filter type
interface RepositoryFilters {
  category?: string
  search?: string
  type?: string
  difficulty?: string
  isPremium?: boolean
}

// ============================================================================
// COURSE REPOSITORY
// ============================================================================

export class CourseRepository {
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly CACHE_PREFIX = 'course-repo'

  /**
   * Find all courses with full UI data (database + Nostr events)
   */
  static async findAll(filters: RepositoryFilters = {}): Promise<CourseDisplay[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      let courses = getAllCoursesWithContent()

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
          course.description.toLowerCase().includes(searchTerm) ||
          course.topics.some(topic => topic.toLowerCase().includes(searchTerm))
        )
      }

      // Apply premium filter
      if (filters.isPremium !== undefined) {
        courses = courses.filter(course => course.isPremium === filters.isPremium)
      }

      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 50))

      return courses
    }, this.CACHE_TTL)
  }

  /**
   * Find a course by ID with full UI data
   */
  static async findById(id: string): Promise<CourseDisplay | null> {
    const cacheKey = `${this.CACHE_PREFIX}:${id}`
    
    return globalCache.get(cacheKey, async () => {
      const courses = getAllCoursesWithContent()
      const course = courses.find(c => c.id === id)
      if (!course) return null
      
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 30))
      
      return course
    }, this.CACHE_TTL)
  }

  /**
   * Create a new course (database only - Nostr event would be created separately)
   */
  static async create(courseData: Omit<Course, 'id'>): Promise<Course> {
    const newCourse = await CourseAdapter.create(courseData)
    
    // Invalidate cache
    this.invalidateCache()
    
    return newCourse
  }

  /**
   * Update a course (database only)
   */
  static async update(id: string, courseData: Partial<Course>): Promise<Course | null> {
    const updatedCourse = await CourseAdapter.update(id, courseData)
    
    // Invalidate cache
    this.invalidateCache()
    
    return updatedCourse
  }

  /**
   * Delete a course (database only)
   */
  static async delete(id: string): Promise<boolean> {
    const deleted = await CourseAdapter.delete(id)
    
    // Invalidate cache
    this.invalidateCache()
    
    return deleted
  }

  /**
   * Get free courses
   */
  static async findFree(): Promise<CourseDisplay[]> {
    return this.findAll({ isPremium: false })
  }

  /**
   * Get paid courses
   */
  static async findPaid(): Promise<CourseDisplay[]> {
    return this.findAll({ isPremium: true })
  }

  /**
   * Search courses
   */
  static async search(query: string): Promise<CourseDisplay[]> {
    return this.findAll({ search: query })
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
// RESOURCE REPOSITORY
// ============================================================================

export class ResourceRepository {
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly CACHE_PREFIX = 'resource-repo'

  /**
   * Find all resources with full UI data (database + Nostr events)
   */
  static async findAll(filters: RepositoryFilters = {}): Promise<ResourceDisplay[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      let resources = getAllResourcesWithContent()

      // Apply type filter
      if (filters.type) {
        resources = resources.filter(resource => 
          resource.type === filters.type
        )
      }

      // Apply category filter
      if (filters.category) {
        resources = resources.filter(resource => 
          resource.category.toLowerCase() === filters.category!.toLowerCase()
        )
      }

      // Apply difficulty filter
      if (filters.difficulty) {
        resources = resources.filter(resource => 
          resource.difficulty === filters.difficulty
        )
      }

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        resources = resources.filter(resource =>
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }

      // Apply premium filter
      if (filters.isPremium !== undefined) {
        resources = resources.filter(resource => resource.isPremium === filters.isPremium)
      }

      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 50))

      return resources
    }, this.CACHE_TTL)
  }

  /**
   * Find a resource by ID with full UI data
   */
  static async findById(id: string): Promise<ResourceDisplay | null> {
    const cacheKey = `${this.CACHE_PREFIX}:${id}`
    
    return globalCache.get(cacheKey, async () => {
      const resources = getAllResourcesWithContent()
      const resource = resources.find(r => r.id === id)
      if (!resource) return null
      
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 30))
      
      return resource
    }, this.CACHE_TTL)
  }

  /**
   * Find documents only
   */
  static async findDocuments(filters: RepositoryFilters = {}): Promise<ResourceDisplay[]> {
    return this.findAll({ ...filters, type: 'document' })
  }

  /**
   * Find videos only
   */
  static async findVideos(filters: RepositoryFilters = {}): Promise<ResourceDisplay[]> {
    return this.findAll({ ...filters, type: 'video' })
  }

  /**
   * Create a new resource (database only - Nostr event would be created separately)
   */
  static async create(resourceData: Omit<Resource, 'id'>): Promise<Resource> {
    const newResource = await ResourceAdapter.create(resourceData)
    
    // Invalidate cache
    this.invalidateCache()
    
    return newResource
  }

  /**
   * Search resources
   */
  static async search(query: string): Promise<ResourceDisplay[]> {
    return this.findAll({ search: query })
  }

  /**
   * Invalidate all resource caches
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
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly CACHE_PREFIX = 'lesson-repo'

  /**
   * Find lessons by course ID
   */
  static async findByCourseId(courseId: string): Promise<Lesson[]> {
    const cacheKey = `${this.CACHE_PREFIX}:course:${courseId}`
    
    return globalCache.get(cacheKey, async () => {
      return await LessonAdapter.findByCourseId(courseId)
    }, this.CACHE_TTL)
  }

  /**
   * Find a lesson by ID
   */
  static async findById(id: string): Promise<Lesson | null> {
    const cacheKey = `${this.CACHE_PREFIX}:${id}`
    
    return globalCache.get(cacheKey, async () => {
      return await LessonAdapter.findById(id)
    }, this.CACHE_TTL)
  }

  /**
   * Create a new lesson
   */
  static async create(lessonData: Omit<Lesson, 'id'>): Promise<Lesson> {
    const newLesson = await LessonAdapter.create(lessonData)
    
    // Invalidate cache
    this.invalidateCache()
    
    return newLesson
  }

  /**
   * Update a lesson
   */
  static async update(id: string, lessonData: Partial<Lesson>): Promise<Lesson | null> {
    const updatedLesson = await LessonAdapter.update(id, lessonData)
    
    // Invalidate cache
    this.invalidateCache()
    
    return updatedLesson
  }

  /**
   * Delete a lesson
   */
  static async delete(id: string): Promise<boolean> {
    const deleted = await LessonAdapter.delete(id)
    
    // Invalidate cache
    this.invalidateCache()
    
    return deleted
  }

  /**
   * Invalidate lesson caches
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
// UNIFIED CONTENT REPOSITORY
// ============================================================================

export class ContentRepository {
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly CACHE_PREFIX = 'content-repo'

  /**
   * Search across all content types
   */
  static async search(query: string, filters?: RepositoryFilters): Promise<ContentItem[]> {
    const cacheKey = `${this.CACHE_PREFIX}:search:${query}:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 50))
      
      return searchContent(query)
    }, this.CACHE_TTL)
  }

  /**
   * Get all content items
   */
  static async findAll(filters?: RepositoryFilters): Promise<ContentItem[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all:${JSON.stringify(filters)}`
    
    return globalCache.get(cacheKey, async () => {
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 50))
      
      let content = getContentItems()

      // Apply filters
      if (filters?.type) {
        content = content.filter(item => item.type === filters.type)
      }
      if (filters?.category) {
        content = content.filter(item => item.category === filters.category)
      }
      if (filters?.difficulty) {
        content = content.filter(item => item.difficulty === filters.difficulty)
      }
      if (filters?.isPremium !== undefined) {
        content = content.filter(item => item.isPremium === filters.isPremium)
      }

      return content
    }, this.CACHE_TTL)
  }

  /**
   * Get trending content
   */
  static async findTrending(limit: number = 10): Promise<ContentItem[]> {
    const cacheKey = `${this.CACHE_PREFIX}:trending:${limit}`
    
    return globalCache.get(cacheKey, async () => {
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const content = getContentItems()
      return content
        .sort((a, b) => {
          const aScore = (a.viewCount || 0) + (a.enrollmentCount || 0)
          const bScore = (b.viewCount || 0) + (b.enrollmentCount || 0)
          return bScore - aScore
        })
        .slice(0, limit)
    }, this.CACHE_TTL)
  }
} 