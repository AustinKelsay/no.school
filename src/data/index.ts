/**
 * Unified data access layer
 * Combines database models with Nostr events for complete content representation
 * Follows content_data_models.md architecture
 */

import type { 
  Course, 
  Resource, 
  Lesson,
  CourseDisplay,
  ResourceDisplay,
  LessonDisplay,
  CourseWithLessons,
  ContentItem,
  ParsedCourseEvent,
  ParsedResourceEvent
} from './types'

import { 
  parseCourseEvent, 
  parseEvent, 
  createCourseDisplay, 
  createResourceDisplay 
} from './types'

import { 
  nostrCourseListEvents, 
  nostrFreeContentEvents, 
  nostrPaidContentEvents
} from './nostr-events'

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

// New functions using seed data
export function getLessonsByCourseId(courseId: string) {
  const lessons = getLessonsSync()
  return lessons.filter(lesson => lesson.courseId === courseId).sort((a, b) => a.index - b.index)
}

export function getLessonById(id: string) {
  const lessons = getLessonsSync()
  return lessons.find(lesson => lesson.id === id) || null
}

// ============================================================================
// NOSTR DATA EXPORTS
// ============================================================================

export {
  nostrCourseListEvents,
  nostrFreeContentEvents,
  nostrPaidContentEvents,
  realPubkeys
} from './nostr-events'

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

export {
  parseCourseEvent,
  parseEvent,
  createCourseDisplay,
  createResourceDisplay
} from './types'

// ============================================================================
// UNIFIED DATA ACCESS FUNCTIONS
// ============================================================================

import { CourseAdapter, ResourceAdapter, getCoursesSync, getResourcesSync, getLessonsSync } from '@/lib/db-adapter'

/**
 * Get all courses with full UI data (database + parsed Nostr events)
 */
export function getAllCoursesWithContent(): CourseDisplay[] {
  // Temporary sync bridge - you should use getAllCoursesWithContentAsync for new code
  const courses = getCoursesSync()
  return courses.map(course => {
    // Find corresponding Nostr event
    const nostrEvent = nostrCourseListEvents.find(event => 
      event.id === course.noteId || event.tags.some(tag => tag[0] === 'd' && tag[1] === course.id)
    )
    
    if (nostrEvent) {
      const parsedEvent = parseCourseEvent(nostrEvent)
      return createCourseDisplay(course, parsedEvent)
    }
    
    // Fallback for courses without Nostr events - with better default data
    return {
      ...course,
      title: `Course ${course.id}`,
      description: 'Course description from database',
      category: 'bitcoin',
      instructor: 'Unknown Instructor',
      instructorPubkey: course.userId,
      rating: 4.5,
      enrollmentCount: 100,
      isPremium: course.price > 0,
      currency: 'sats',
      image: '',
      published: true,
      tags: [],
      topics: ['bitcoin', 'development'],
      lessonReferences: [],
      additionalLinks: []
    }
  })
}

export async function getAllCoursesWithContentAsync(): Promise<CourseDisplay[]> {
  const courses = await CourseAdapter.findAll()
  return courses.map(course => {
    // Find corresponding Nostr event
    const nostrEvent = nostrCourseListEvents.find(event => 
      event.id === course.noteId || event.tags.some(tag => tag[0] === 'd' && tag[1] === course.id)
    )
    
    if (nostrEvent) {
      const parsedEvent = parseCourseEvent(nostrEvent)
      return createCourseDisplay(course, parsedEvent)
    }
    
    // Fallback for courses without Nostr events - with better default data
    return {
      ...course,
      title: `Course ${course.id}`,
      description: 'Course description from database',
      category: 'bitcoin',
      instructor: 'Unknown Instructor',
      instructorPubkey: course.userId,
      rating: 4.5,
      enrollmentCount: 100,
      isPremium: course.price > 0,
      currency: 'sats',
      image: '',
      published: true,
      tags: [],
      topics: ['bitcoin', 'development'],
      lessonReferences: [],
      additionalLinks: []
    }
  })
}

/**
 * Get all resources (documents and videos) with full UI data
 */
export function getAllResourcesWithContent(): ResourceDisplay[] {
  // Temporary sync bridge - you should use getAllResourcesWithContentAsync for new code
  const allResources = getResourcesSync()
  
  return allResources.map(resource => {
    // Find corresponding Nostr event in free content first
    const nostrEvent = nostrFreeContentEvents.find(event => 
      event.id === resource.noteId || event.tags.some(tag => tag[0] === 'd' && tag[1] === resource.id)
    )
    
    if (nostrEvent) {
      const parsedEvent = parseEvent(nostrEvent)
      return createResourceDisplay(resource, parsedEvent)
    }
    
    // If not found in free content, check paid content
    const paidEvent = nostrPaidContentEvents.find(event => 
      event.id === resource.noteId || event.tags.some(tag => tag[0] === 'd' && tag[1] === resource.id)
    )
    
    
    if (paidEvent) {
      const parsedEvent = parseEvent(paidEvent)
      return createResourceDisplay(resource, parsedEvent)
    }
    
    // Fallback for resources without Nostr events - with better default data
    return {
      ...resource,
      title: `Resource ${resource.id}`,
      description: 'Resource description from database',
      category: 'bitcoin',
      type: resource.videoId ? 'video' : 'document',
      instructor: 'Unknown Instructor',
      instructorPubkey: resource.userId,
      rating: 4.5,
      viewCount: 500,
      isPremium: resource.price > 0,
      currency: 'sats',
      image: '',
      tags: ['bitcoin', 'development'],
      difficulty: 'intermediate' as const,
      published: true,
      topics: ['bitcoin', 'development'],
      additionalLinks: []
    }
  })
}

export async function getAllResourcesWithContentAsync(): Promise<ResourceDisplay[]> {
  const allResources = await ResourceAdapter.findAll()
  
  return allResources.map(resource => {
    // Find corresponding Nostr event in free content first
    const nostrEvent = nostrFreeContentEvents.find(event => 
      event.id === resource.noteId || event.tags.some(tag => tag[0] === 'd' && tag[1] === resource.id)
    )
    
    if (nostrEvent) {
      const parsedEvent = parseEvent(nostrEvent)
      return createResourceDisplay(resource, parsedEvent)
    }
    
    // If not found in free content, check paid content
    const paidEvent = nostrPaidContentEvents.find(event => 
      event.id === resource.noteId || event.tags.some(tag => tag[0] === 'd' && tag[1] === resource.id)
    )
    
    if (paidEvent) {
      const parsedEvent = parseEvent(paidEvent)
      return createResourceDisplay(resource, parsedEvent)
    }
    
    // Fallback for resources without Nostr events - with better default data
    return {
      ...resource,
      title: `Resource ${resource.id}`,
      description: 'Resource description from database',
      category: 'bitcoin',
      type: resource.videoId ? 'video' : 'document',
      instructor: 'Unknown Instructor',
      instructorPubkey: resource.userId,
      rating: 4.5,
      viewCount: 500,
      isPremium: resource.price > 0,
      currency: 'sats',
      image: '',
      tags: ['bitcoin', 'development'],
      difficulty: 'intermediate' as const,
      published: true,
      topics: ['bitcoin', 'development'],
      additionalLinks: []
    }
  })
}

/**
 * Get course by ID with full content
 */
export function getCourseWithContentById(courseId: string): CourseDisplay | null {
  const courses = getAllCoursesWithContent()
  return courses.find(course => course.id === courseId) || null
}

/**
 * Get resource by ID with full content
 */
export function getResourceWithContentById(resourceId: string): ResourceDisplay | null {
  const resources = getAllResourcesWithContent()
  return resources.find(resource => resource.id === resourceId) || null
}

/**
 * Get course with lessons populated with full content
 */
export function getCourseWithLessonsById(courseId: string): CourseWithLessons | null {
  const course = getCourseWithContentById(courseId)
  if (!course) return null
  
  const lessons = getLessonsByCourseId(courseId)
  
  const lessonDisplays: LessonDisplay[] = lessons.map((lesson: Lesson) => {
    const resource = lesson.resourceId ? getResourceWithContentById(lesson.resourceId) : null
    
    return {
      ...lesson,
      title: resource?.title || 'Unknown Lesson',
      description: resource?.description || 'No description available',
      duration: resource?.duration,
      type: resource?.type === 'video' ? 'video' : 'document',
      isPremium: resource?.isPremium || false,
      topics: resource?.topics || [],
      difficulty: resource?.difficulty || 'intermediate',
      image: resource?.image,
      videoUrl: resource?.videoUrl
    }
  })
  
  return {
    ...course,
    lessons: lessonDisplays
  }
}

/**
 * Get courses by category with full content
 */
export function getCoursesByContentCategory(category: string): CourseDisplay[] {
  const courses = getAllCoursesWithContent()
  return courses.filter(course => course.category === category)
}

/**
 * Get resources by category with full content
 */
export function getResourcesByContentCategory(category: string): ResourceDisplay[] {
  const resources = getAllResourcesWithContent()
  return resources.filter(resource => resource.category === category)
}

/**
 * Get resources by type with full content
 */
export function getResourcesByType(type: 'document' | 'video'): ResourceDisplay[] {
  const resources = getAllResourcesWithContent()
  return resources.filter(resource => resource.type === type)
}

/**
 * Search across all content types
 */
export function searchAllContent(query: string): (CourseDisplay | ResourceDisplay)[] {
  const courses = getAllCoursesWithContent()
  const resources = getAllResourcesWithContent()
  
  const searchLower = query.toLowerCase()
  
  const matchingCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchLower) ||
    course.description.toLowerCase().includes(searchLower) ||
    course.topics.some(topic => topic.toLowerCase().includes(searchLower))
  )
  
  const matchingResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchLower) ||
    resource.description.toLowerCase().includes(searchLower) ||
    resource.topics.some(topic => topic.toLowerCase().includes(searchLower)) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
  )
  
  return [...matchingCourses, ...matchingResources]
}

/**
 * Get trending content (mock implementation)
 */
export function getTrendingContent(limit: number = 10): (CourseDisplay | ResourceDisplay)[] {
  const courses = getAllCoursesWithContent()
  const resources = getAllResourcesWithContent()
  
  // Sort by a combination of rating and enrollment/view count
  const allContent = [...courses, ...resources]
  
  const sortedContent = allContent.sort((a, b) => {
    const aScore = a.rating * (('enrollmentCount' in a ? a.enrollmentCount : 'viewCount' in a ? a.viewCount : 0) + 1)
    const bScore = b.rating * (('enrollmentCount' in b ? b.enrollmentCount : 'viewCount' in b ? b.viewCount : 0) + 1)
    return bScore - aScore
  })
  
  return sortedContent.slice(0, limit)
}

/**
 * Get featured content by type
 */
export function getFeaturedContent(type: 'course' | 'resource' | 'all' = 'all'): (CourseDisplay | ResourceDisplay)[] {
  const courses = getAllCoursesWithContent()
  const resources = getAllResourcesWithContent()
  
  // Filter by highest rated and most popular
  const featuredCourses = courses
    .filter(course => course.rating >= 4.5)
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 5)
  
  const featuredResources = resources
    .filter(resource => resource.rating >= 4.5)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
  
  if (type === 'course') return featuredCourses
  if (type === 'resource') return featuredResources
  return [...featuredCourses, ...featuredResources]
}

/**
 * Get content statistics
 */
export function getContentStats() {
  const courses = getAllCoursesWithContent()
  const resources = getAllResourcesWithContent()
  
  const totalCourses = courses.length
  const totalResources = resources.length
  const totalVideos = resources.filter(r => r.type === 'video').length
  const totalDocuments = resources.filter(r => r.type === 'document').length
  const totalFreeContent = [...courses, ...resources].filter(item => !item.isPremium).length
  const totalPaidContent = [...courses, ...resources].filter(item => item.isPremium).length
  
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollmentCount, 0)
  const totalViews = resources.reduce((sum, resource) => sum + resource.viewCount, 0)
  const averageRating = [...courses, ...resources].reduce((sum, item) => sum + item.rating, 0) / (totalCourses + totalResources)
  
  return {
    totalCourses,
    totalResources,
    totalVideos,
    totalDocuments,
    totalFreeContent,
    totalPaidContent,
    totalEnrollments,
    totalViews,
    averageRating: Math.round(averageRating * 10) / 10
  }
}

// ============================================================================
// LEGACY SUPPORT (for existing frontend components)
// ============================================================================

/**
 * Get all content items unified for display (legacy support)
 */
export function getAllContentItems(): ContentItem[] {
  const courses = getAllCoursesWithContent()
  const resources = getAllResourcesWithContent()
  
  const courseItems: ContentItem[] = courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    type: 'course',
    category: course.category,
    tags: course.tags,
    difficulty: 'intermediate', // Default for courses
    instructor: course.instructor,
    instructorPubkey: course.instructorPubkey,
    rating: course.rating,
    enrollmentCount: course.enrollmentCount,
    price: course.price,
    currency: course.currency,
    image: course.image,
    isPremium: course.isPremium,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    published: course.published,
    topics: course.topics,
    additionalLinks: []
  }))
  
  const resourceItems: ContentItem[] = resources.map(resource => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    type: resource.type === 'video' ? 'video' : 'document',
    category: resource.category,
    tags: [],
    difficulty: resource.difficulty,
    duration: resource.duration,
    instructor: resource.instructor,
    instructorPubkey: resource.instructorPubkey,
    rating: resource.rating,
    viewCount: resource.viewCount,
    price: resource.price,
    currency: resource.currency,
    image: resource.image,
    isPremium: resource.isPremium,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
    published: resource.published,
    topics: resource.topics,
    additionalLinks: resource.additionalLinks
  }))
  
  return [...courseItems, ...resourceItems]
}

/**
 * Get content items (alias for backward compatibility)
 */
export const getContentItems = getAllContentItems

/**
 * Get content by type (legacy support)
 */
export function getContentByType(type: 'course' | 'video' | 'document' | 'guide' | 'cheatsheet'): ContentItem[] {
  const allContent = getAllContentItems()
  return allContent.filter(item => item.type === type)
}

/**
 * Search content (legacy support)
 */
export function searchContent(query: string): ContentItem[] {
  const allContent = getAllContentItems()
  const searchLower = query.toLowerCase()
  
  return allContent.filter(item => 
    item.title.toLowerCase().includes(searchLower) ||
    item.description.toLowerCase().includes(searchLower) ||
    item.topics.some(topic => topic.toLowerCase().includes(searchLower)) ||
    (item.topics && item.topics.some(topic => topic.toLowerCase().includes(searchLower)))
  )
}

/**
 * Get trending content (legacy support)
 */
export function getTrendingContentItems(limit: number = 10): ContentItem[] {
  const allContent = getAllContentItems()
  
  const sortedContent = allContent.sort((a, b) => {
    const aScore = a.rating! * ((a.enrollmentCount || a.viewCount || 0) + 1)
    const bScore = b.rating! * ((b.enrollmentCount || b.viewCount || 0) + 1)
    return bScore - aScore
  })
  
  return sortedContent.slice(0, limit)
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get content by instructor pubkey
 */
export function getContentByInstructor(pubkey: string): (CourseDisplay | ResourceDisplay)[] {
  const courses = getAllCoursesWithContent()
  const resources = getAllResourcesWithContent()
  
  const instructorCourses = courses.filter(course => course.instructorPubkey === pubkey)
  const instructorResources = resources.filter(resource => resource.instructorPubkey === pubkey)
  
  return [...instructorCourses, ...instructorResources]
}

/**
 * Get content by difficulty
 */
export function getContentByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ResourceDisplay[] {
  const resources = getAllResourcesWithContent()
  return resources.filter(resource => resource.difficulty === difficulty)
}

/**
 * Get premium content
 */
export function getPremiumContent(): (CourseDisplay | ResourceDisplay)[] {
  const courses = getAllCoursesWithContent()
  const resources = getAllResourcesWithContent()
  
  const premiumCourses = courses.filter(course => course.isPremium)
  const premiumResources = resources.filter(resource => resource.isPremium)
  
  return [...premiumCourses, ...premiumResources]
}

/**
 * Get free content
 */
export function getFreeContent(): (CourseDisplay | ResourceDisplay)[] {
  const courses = getAllCoursesWithContent()
  const resources = getAllResourcesWithContent()
  
  const freeCourses = courses.filter(course => !course.isPremium)
  const freeResources = resources.filter(resource => !resource.isPremium)
  
  return [...freeCourses, ...freeResources]
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type {
  Course,
  Resource,
  Lesson,
  CourseDisplay,
  ResourceDisplay,
  LessonDisplay,
  CourseWithLessons,
  ContentItem,
  ParsedCourseEvent,
  ParsedResourceEvent
} from './types' 