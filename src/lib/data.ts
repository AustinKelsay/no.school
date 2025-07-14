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
import { dbCoursesMockData, dbLessonsMockData } from '@/data/courses'
import { dbDocumentsMockData } from '@/data/documents'
import { dbVideosMockData } from '@/data/videos'

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
function calculateTotalDuration(lessons: import('@/data/types').DbLesson[]): string {
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
    type: 'video' as const,
    category: dbVideo.category,
    tags: dbVideo.tags,
    difficulty: dbVideo.difficulty,
    instructor: dbVideo.instructor,
    rating: dbVideo.rating,
    duration: dbVideo.duration,
    image: dbVideo.thumbnailUrl,
    isPremium: dbVideo.isPremium,
    createdAt: dbVideo.createdAt
  }
}

/**
 * Updated data layer using the repository pattern with real caching
 */

/**
 * Fetch all courses using repository pattern
 */
export async function getCachedCourses(category?: string) {
  return CourseRepository.findAll(category ? { category } : {})
}

/**
 * Fetch a single course by ID using repository pattern
 */
export async function getCachedCourseById(id: number) {
  return CourseRepository.findById(id)
}

/**
 * Fetch lessons for a course using repository pattern
 */
export async function getCachedLessons(courseId: number) {
  return LessonRepository.findByCourseId(courseId)
}

/**
 * Fetch course statistics using repository pattern
 */
export async function getCachedCourseStats() {
  return CourseRepository.getStats()
}

/**
 * Fetch all content items (mixed courses, documents, videos) using repository pattern
 */
export async function getCachedContentItems() {
  return globalCache.get('content:all:mixed', async () => {
    const items: import('@/data/types').ContentItem[] = []

    // Add courses
    const courses = await CourseRepository.findAll()
    const courseItems: import('@/data/types').ContentItem[] = courses.map(course => ({
      id: course.id,
      type: 'course' as const,
      title: course.title,
      description: course.description,
      category: course.category,
      instructor: course.instructor,
      rating: course.rating,
      enrollmentCount: course.enrollmentCount ?? 0,
      duration: course.duration,
      image: course.image,
      isPremium: false,
      tags: [course.category],
      difficulty: 'intermediate' as const,
      createdAt: course.createdAt ?? new Date().toISOString().split('T')[0],
    }))
    items.push(...courseItems)

    // Add documents
    const documentItems = dbDocumentsMockData.map(transformDbDocumentToContentItem)
    items.push(...documentItems)

    // Add videos
    const videoItems = dbVideosMockData.map(transformDbVideoToContentItem)
    items.push(...videoItems)

    return items
  }, 300000) // 5 minute cache
}

/**
 * Fetch all documents with optional category filtering
 */
export async function getDocuments(category?: string) {
  let filteredDocuments = dbDocumentsMockData
  if (category) {
    filteredDocuments = dbDocumentsMockData.filter(doc => 
      doc.category.toLowerCase() === category.toLowerCase()
    )
  }
  return filteredDocuments
}

/**
 * Fetch a single document by ID
 */
export async function getDocumentById(id: number) {
  return dbDocumentsMockData.find(doc => doc.id === `doc-${id}`) || null
}

/**
 * Fetch all videos with optional category filtering
 */
export async function getVideos(category?: string) {
  let filteredVideos = dbVideosMockData
  if (category) {
    filteredVideos = dbVideosMockData.filter(video => 
      video.category.toLowerCase() === category.toLowerCase()
    )
  }
  return filteredVideos
}

/**
 * Fetch a single video by ID
 */
export async function getVideoById(id: number) {
  return dbVideosMockData.find(video => video.id === `video-${id}`) || null
}

/**
 * Fetch content statistics with caching
 */
export async function getContentStats() {
  return globalCache.get('content:stats', async () => {
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
 * Search functionality using repository pattern
 */
export async function searchContent(query: string, filters?: { type?: string; category?: string }) {
  return ContentRepository.search(query, filters)
}

/**
 * Get trending content using repository pattern
 */
export async function getTrendingContent(limit: number = 10) {
  return ContentRepository.findTrending(limit)
}

/**
 * Fetch database courses directly (new function)
 */
export async function getDbCourses(category?: string) {
  if (category) {
    return dbCoursesMockData.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    )
  }
  return dbCoursesMockData
}

/**
 * Fetch a single database course by ID
 */
export async function getDbCourseById(id: string) {
  return dbCoursesMockData.find(course => course.id === id) || null
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
  let items: (import('@/data/types').DbCourse | import('@/data/types').DbDocument | import('@/data/types').DbVideo)[] = []

  switch (type) {
    case 'course':
      items = dbCoursesMockData
      break
    case 'document':
      items = dbDocumentsMockData
      break
    case 'video':
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