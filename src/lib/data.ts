/**
 * Data access layer with caching and repository patterns
 * Updated to use new database schema from content_data_models.md
 */

// Import all types from centralized location (new structure)
import type { 
  Course, 
  Lesson, 
  Resource,
  ContentItem, 
  CourseWithLessons,
  NostrCourseData,
  SearchFilters,
  SortOptions,
  ParsedCourseEvent,
  ParsedResourceEvent
} from '@/data/types'

// Re-export types for consumers
export type { 
  Course, 
  Lesson, 
  Resource,
  ContentItem, 
  CourseWithLessons,
  NostrCourseData,
  SearchFilters,
  SortOptions,
  ParsedCourseEvent,
  ParsedResourceEvent
} from '@/data/types'

/**
 * Import the new caching and repository layers
 */
import { CourseRepository, LessonRepository } from './repositories'
import { globalCache } from './cache'
import { 
  coursesMockData, 
  lessonsMockData, 
  coursesWithLessons,
  getCourseById,
  getCoursesByCategory,
  getFreeCourses,
  getPaidCourses,
  getLessonsByCourseId,
  getCourseWithLessons
} from '@/data/courses/mock-courses'
import { 
  resourcesMockData,
  getResourceById,
  getResourcesByCategory,
  getResourcesByType,
  getDocumentResources,
  getVideoResources,
  getFreeResources,
  getPaidResources,
  searchResources
} from '@/data/resources/mock-resources'
import { getContentStats, getAllContentItems, searchAllContent } from '@/data/index'

// ============================================================================
// COURSE DATA ACCESS
// ============================================================================

/**
 * Get all courses with caching
 */
export async function getCachedCourses(category?: string): Promise<Course[]> {
  const cacheKey = category ? `courses:category:${category}` : 'courses:all'
  
  return globalCache.get(cacheKey, async () => {
    if (category) {
      return getCoursesByCategory(category)
    }
    return coursesMockData
  })
}

/**
 * Get course by ID with caching
 */
export async function getCachedCourseById(id: string): Promise<Course | null> {
  return globalCache.get(`course:${id}`, async () => {
    return getCourseById(id) || null
  })
}

/**
 * Get course with lessons by ID with caching
 */
export async function getCachedCourseWithLessons(id: string): Promise<CourseWithLessons | null> {
  return globalCache.get(`course:lessons:${id}`, async () => {
    return getCourseWithLessons(id) || null
  })
}

/**
 * Get course statistics with caching
 */
export async function getCachedCourseStats() {
  return globalCache.get('course:stats', async () => {
    const stats = getContentStats()
    return {
      totalCourses: stats.totalCourses,
      totalEnrollments: stats.totalEnrollments,
      averageRating: stats.averageRating,
      freeCourses: stats.freeCourses,
      paidCourses: stats.paidCourses
    }
  })
}

// ============================================================================
// RESOURCE DATA ACCESS (Documents + Videos)
// ============================================================================

/**
 * Get all resources with caching
 */
export async function getCachedResources(type?: Resource['type'], category?: string): Promise<Resource[]> {
  const cacheKey = `resources:${type || 'all'}:${category || 'all'}`
  
  return globalCache.get(cacheKey, async () => {
    let resources = resourcesMockData
    
    if (type) {
      resources = resources.filter(r => r.type === type)
    }
    
    if (category) {
      resources = resources.filter(r => r.category === category)
    }
    
    return resources
  })
}

/**
 * Get resource by ID with caching
 */
export async function getCachedResourceById(id: string): Promise<Resource | null> {
  return globalCache.get(`resource:${id}`, async () => {
    return getResourceById(id) || null
  })
}

/**
 * Get documents with caching
 */
export async function getCachedDocuments(category?: string): Promise<Resource[]> {
  const cacheKey = category ? `documents:category:${category}` : 'documents:all'
  
  return globalCache.get(cacheKey, async () => {
    let documents = getDocumentResources()
    
    if (category) {
      documents = documents.filter(d => d.category === category)
    }
    
    return documents
  })
}

/**
 * Get videos with caching
 */
export async function getCachedVideos(category?: string): Promise<Resource[]> {
  const cacheKey = category ? `videos:category:${category}` : 'videos:all'
  
  return globalCache.get(cacheKey, async () => {
    let videos = getVideoResources()
    
    if (category) {
      videos = videos.filter(v => v.category === category)
    }
    
    return videos
  })
}

// ============================================================================
// CONTENT DISCOVERY
// ============================================================================

/**
 * Get all content items (courses + resources) with caching
 */
export async function getCachedContentItems(): Promise<ContentItem[]> {
  return globalCache.get('content:all', async () => {
    const allContent = getAllContentItems()
    
    // Transform to ContentItem format for backward compatibility
    return allContent.map(item => {
      const baseItem = {
        id: item.id, // Keep string ID
        title: item.title,
        description: item.description,
        category: item.category,
        tags: 'tags' in item ? item.tags : [],
        difficulty: ('difficulty' in item ? item.difficulty : 'beginner') as ContentItem['difficulty'],
        instructor: item.instructor,
        rating: item.rating,
        image: item.image,
        isPremium: item.isPremium,
        createdAt: item.createdAt
      }
      
      if (item.type === 'course') {
        return {
          ...baseItem,
          type: 'course' as const,
          duration: undefined // Courses don't have direct duration
        }
      } else {
        return {
          ...baseItem,
          type: item.type as ContentItem['type'],
          duration: item.duration || undefined
        }
      }
    })
  })
}

/**
 * Search content with caching
 */
export async function getCachedSearchResults(query: string): Promise<{
  courses: Course[]
  resources: Resource[]
  total: number
}> {
  const cacheKey = `search:${query.toLowerCase()}`
  
  return globalCache.get(cacheKey, async () => {
    return searchAllContent(query)
  })
}

/**
 * Get trending content with caching
 */
export async function getCachedTrendingContent(limit: number = 10): Promise<ContentItem[]> {
  return globalCache.get(`trending:${limit}`, async () => {
    const trending = await import('@/data/index').then(m => m.getTrendingContent(limit))
    
    // Transform to ContentItem format for backward compatibility
    return trending.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type as ContentItem['type'],
      category: item.category,
      tags: 'tags' in item ? item.tags : [],
      difficulty: ('difficulty' in item ? item.difficulty : 'beginner') as ContentItem['difficulty'],
      duration: item.type === 'course' ? undefined : item.duration || undefined,
      instructor: item.instructor,
      rating: item.rating,
      image: item.image,
      isPremium: item.isPremium,
      createdAt: item.createdAt
    }))
  })
}

// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS
// ============================================================================

/**
 * Legacy function for backward compatibility - maps to new getCachedCourseById
 * @deprecated Use getCachedCourseById with string ID instead
 */
export async function getCachedCourseByIdLegacy(id: number): Promise<Course | null> {
  // Try to find course by converting number to string format
  const courseId = `course-${id}`
  return getCachedCourseById(courseId)
}

/**
 * Calculate total duration from lessons
 */
function calculateTotalDuration(lessons: { duration?: string }[]): string {
  let totalMinutes = 0

  lessons.forEach(lesson => {
    if (!lesson.duration) return
    
    const duration = lesson.duration
    const match = duration.match(/(\d+):(\d+)/)
    if (match) {
      const hours = parseInt(match[1], 10)
      const minutes = parseInt(match[2], 10)
      totalMinutes += hours * 60 + minutes
    }
  })

  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }

  return `${hours}h ${minutes}m`
} 