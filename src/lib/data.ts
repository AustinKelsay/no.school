// Import all types from centralized location
export type { 
  Course, 
  Lesson, 
  ContentItem, 
  CourseStats,
  SearchResult,
  DbCourse,
  DbLesson,
  DbDocument,
  DbVideo,
  CourseWithLessons,
  NostrCourseData,
  NostrDocumentData,
  NostrVideoData,
  ContentStats
} from '@/data/types'

/**
 * Import the new caching and repository layers
 */
import { CourseRepository, LessonRepository, ContentRepository } from './repositories'
import { globalCache } from './cache'

/**
 * Simulate network delay for legacy functions
 */
async function simulateDelay(ms: number): Promise<void> {
  // Remove in production - only for compatibility
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Transform DbCourse to Course format for backward compatibility
 */
function transformDbCourseToLegacyFormat(dbCourse: import('@/data/types').DbCourse, lessons: import('@/data/types').DbLesson[] = []): import('@/data/types').Course {
  return {
    id: parseInt(dbCourse.id.replace('course-', ''), 10),
    title: dbCourse.title,
    description: dbCourse.description,
    category: dbCourse.category.charAt(0).toUpperCase() + dbCourse.category.slice(1),
    duration: calculateTotalDuration(lessons),
    instructor: dbCourse.instructor,
    rating: dbCourse.rating,
    image: dbCourse.image || "/placeholder.svg",
    lessons: lessons.map(lesson => ({
      id: parseInt(lesson.id.replace('lesson-', '').split('-')[1], 10),
      title: lesson.title,
      duration: lesson.duration,
      completed: false
    })),
    enrollmentCount: dbCourse.enrollmentCount,
    createdAt: dbCourse.createdAt
  }
}

/**
 * Transform DbCourse to ContentItem format
 */
function transformDbCourseToContentItem(dbCourse: import('@/data/types').DbCourse): import('@/data/types').ContentItem {
  return {
    id: parseInt(dbCourse.id.replace('course-', ''), 10) + 1000,
    title: dbCourse.title,
    description: dbCourse.description,
    type: 'course',
    category: dbCourse.category,
    tags: [dbCourse.category, dbCourse.isPremium ? 'premium' : 'free', 'course'],
    difficulty: 'intermediate' as const, // Default difficulty
    duration: '4 hours', // Default duration
    instructor: dbCourse.instructor,
    rating: dbCourse.rating,
    image: dbCourse.image,
    isPremium: dbCourse.isPremium,
    createdAt: dbCourse.createdAt
  }
}

/**
 * Transform DbDocument to ContentItem format
 */
function transformDbDocumentToContentItem(dbDocument: import('@/data/types').DbDocument): import('@/data/types').ContentItem {
  return {
    id: parseInt(dbDocument.id.replace('doc-', ''), 10) + 2000,
    title: dbDocument.title,
    description: dbDocument.description,
    type: dbDocument.type === 'cheatsheet' ? 'cheatsheet' : 
          dbDocument.type === 'guide' ? 'guide' : 'document',
    category: dbDocument.category,
    tags: dbDocument.tags,
    difficulty: dbDocument.difficulty,
    instructor: dbDocument.instructor,
    rating: dbDocument.rating,
    image: dbDocument.image,
    isPremium: dbDocument.isPremium,
    createdAt: dbDocument.createdAt
  }
}

/**
 * Transform DbVideo to ContentItem format
 */
function transformDbVideoToContentItem(dbVideo: import('@/data/types').DbVideo): import('@/data/types').ContentItem {
  return {
    id: parseInt(dbVideo.id.replace('video-', ''), 10) + 3000,
    title: dbVideo.title,
    description: dbVideo.description,
    type: 'video',
    category: dbVideo.category,
    tags: dbVideo.tags,
    difficulty: dbVideo.difficulty,
    duration: dbVideo.duration,
    instructor: dbVideo.instructor,
    rating: dbVideo.rating,
    image: dbVideo.thumbnailUrl,
    isPremium: dbVideo.isPremium,
    createdAt: dbVideo.createdAt
  }
}

/**
 * Calculate total duration from lessons
 */
function calculateTotalDuration(lessons: import('@/data/types').DbLesson[]): string {
  let totalMinutes = 0

  lessons.forEach(lesson => {
    const duration = lesson.duration.toLowerCase()
    const match = duration.match(/(\d+)\s*(min|minutes|hour|hours|h)/)
    
    if (match) {
      const value = parseInt(match[1], 10)
      const unit = match[2]
      
      if (unit.startsWith('h')) {
        totalMinutes += value * 60
      } else {
        totalMinutes += value
      }
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

/**
 * Fetch all courses with caching
 * Now uses the repository layer with real caching
 */
export async function getCourses(category?: string) {
  return CourseRepository.findAll(category ? { category } : {})
}

/**
 * Cached version of getCourses - now truly cached
 */
export async function getCachedCourses(category?: string) {
  return CourseRepository.findAll(category ? { category } : {})
}

/**
 * Fetch a single course by ID with caching
 */
export async function getCourseById(id: number) {
  return CourseRepository.findById(id)
}

/**
 * Cached version of getCourseById - now truly cached
 */
export async function getCachedCourseById(id: number) {
  return CourseRepository.findById(id)
}

/**
 * Fetch all documents with caching
 */
export async function getDocuments(category?: string) {
  await simulateDelay(400)

  const { dbDocumentsMockData } = await import('@/data/mock-data')

  let filteredDocuments = dbDocumentsMockData
  if (category) {
    filteredDocuments = dbDocumentsMockData.filter(doc => 
      doc.category.toLowerCase() === category.toLowerCase()
    )
  }

  return filteredDocuments
}

/**
 * Cached version of getDocuments - returns a promise
 */
export async function getCachedDocuments(category?: string) {
  return getDocuments(category)
}

/**
 * Fetch a single document by ID
 */
export async function getDocumentById(id: number) {
  await simulateDelay(300)

  const { dbDocumentsMockData } = await import('@/data/mock-data')
  
  return dbDocumentsMockData.find(doc => doc.id === `doc-${id}`) || null
}

/**
 * Cached version of getDocumentById - returns a promise
 */
export async function getCachedDocumentById(id: number) {
  return getDocumentById(id)
}

/**
 * Fetch all videos with caching
 */
export async function getVideos(category?: string) {
  await simulateDelay(400)

  const { dbVideosMockData } = await import('@/data/mock-data')

  let filteredVideos = dbVideosMockData
  if (category) {
    filteredVideos = dbVideosMockData.filter(video => 
      video.category.toLowerCase() === category.toLowerCase()
    )
  }

  return filteredVideos
}

/**
 * Cached version of getVideos - returns a promise
 */
export async function getCachedVideos(category?: string) {
  return getVideos(category)
}

/**
 * Fetch a single video by ID
 */
export async function getVideoById(id: number) {
  await simulateDelay(300)

  const { dbVideosMockData } = await import('@/data/mock-data')
  
  return dbVideosMockData.find(video => video.id === `video-${id}`) || null
}

/**
 * Cached version of getVideoById - returns a promise
 */
export async function getCachedVideoById(id: number) {
  return getVideoById(id)
}

/**
 * Fetch content statistics with caching
 */
export async function getContentStats() {
  return globalCache.get('content:stats', async () => {
    const { dbCoursesMockData, dbDocumentsMockData, dbVideosMockData } = await import('@/data/mock-data')
    
    const totalCourses = dbCoursesMockData.length
    const totalDocuments = dbDocumentsMockData.length
    const totalVideos = dbVideosMockData.length
    const totalStudents = dbCoursesMockData.reduce((sum, course) => sum + course.enrollmentCount, 0)
    
    // Calculate average rating across all content
    const allContent = [...dbCoursesMockData, ...dbDocumentsMockData, ...dbVideosMockData]
    const averageRating = allContent.reduce((sum, item) => sum + item.rating, 0) / allContent.length

    const categoryStats = allContent.reduce((acc, item) => {
      const category = item.category.charAt(0).toUpperCase() + item.category.slice(1)
      
      if (!acc[category]) {
        acc[category] = { name: category, count: 0, type: 'course' as const }
      }
      acc[category].count++
      return acc
    }, {} as Record<string, { name: string; count: number; type: 'course' | 'document' | 'video' }>)

    const topCategories = Object.values(categoryStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)

    return {
      totalCourses,
      totalDocuments,
      totalVideos,
      totalUsers: totalStudents,
      averageRating: Math.round(averageRating * 10) / 10,
      topCategories
    }
  }, 300000) // 5 minute cache
}

/**
 * Fetch course statistics with caching
 */
export async function getCourseStats() {
  return CourseRepository.getStats()
}

/**
 * Cached version of getCourseStats - now truly cached
 */
export async function getCachedCourseStats() {
  return CourseRepository.getStats()
}

/**
 * Search courses with caching and relevance scoring
 */
export async function searchCourses(query: string, category?: string) {
  const results = await CourseRepository.search(query, category ? { category } : {})
  
  return {
    results,
    total: results.length,
    query,
    category,
  }
}

/**
 * Search all content with caching
 */
export async function searchContent(query: string, type?: string, category?: string) {
  const results = await ContentRepository.search(query, { type, category })
  
  return {
    results,
    total: results.length,
    query,
    type,
    category,
  }
}

/**
 * Fetch mixed content items with caching
 */
export async function getContentItems() {
  return ContentRepository.findAll()
}

/**
 * Cached version of getContentItems - now truly cached
 */
export async function getCachedContentItems() {
  return ContentRepository.findAll()
}

/**
 * Fetch database courses directly (new function)
 */
export async function getDbCourses(category?: string) {
  await simulateDelay(300)

  const { dbCoursesMockData } = await import('@/data/mock-data')
  
  if (category) {
    return dbCoursesMockData.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    )
  }

  return dbCoursesMockData
}

/**
 * Fetch database courses with lessons (new function)
 */
export async function getDbCoursesWithLessons(category?: string) {
  await simulateDelay(300)

  const { coursesWithLessons } = await import('@/data/mock-data')
  
  if (category) {
    return coursesWithLessons.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    )
  }

  return coursesWithLessons
}

/**
 * Fetch a single database course by ID with lessons
 */
export async function getDbCourseById(id: string) {
  await simulateDelay(300)

  const { coursesWithLessons } = await import('@/data/mock-data')
  
  return coursesWithLessons.find(course => course.id === id) || null
}

/**
 * Cached version of getDbCourseById - returns a promise
 */
export async function getCachedDbCourseById(id: string) {
  return getDbCourseById(id)
}

/**
 * Get content by type and filters
 */
export async function getContentByType(
  type: 'course' | 'document' | 'video',
  filters?: {
    category?: string
    isPremium?: boolean
    difficulty?: string
  }
) {
  await simulateDelay(300)

  let items: (import('@/data/types').DbCourse | import('@/data/types').DbDocument | import('@/data/types').DbVideo)[] = []

  switch (type) {
    case 'course':
      const { dbCoursesMockData } = await import('@/data/mock-data')
      items = dbCoursesMockData
      break
    case 'document':
      const { dbDocumentsMockData } = await import('@/data/mock-data')
      items = dbDocumentsMockData
      break
    case 'video':
      const { dbVideosMockData } = await import('@/data/mock-data')
      items = dbVideosMockData
      break
  }

  // Apply filters
  let filteredItems = items
  
  if (filters?.category) {
    filteredItems = filteredItems.filter(item => 
      item.category.toLowerCase() === filters.category!.toLowerCase()
    )
  }

  if (filters?.isPremium !== undefined) {
    filteredItems = filteredItems.filter(item => item.isPremium === filters.isPremium)
  }

  if (filters?.difficulty) {
    filteredItems = filteredItems.filter(item => 
      'difficulty' in item && item.difficulty === filters.difficulty
    )
  }

  return filteredItems
}

/**
 * Get trending content with caching
 */
export async function getTrendingContent(limit: number = 10) {
  return ContentRepository.findTrending(limit)
} 