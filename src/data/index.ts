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

/**
 * Get all resources with full UI data (database + parsed Nostr events)  
 */
export function getAllResourcesWithContent(): ResourceDisplay[] {
  // Temporary sync bridge - you should use getAllResourcesWithContentAsync for new code
  const resources = getResourcesSync()
  
  return resources.map(resource => {
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
      title: 'Resource Title',
      description: 'Resource description from database',
      category: 'bitcoin',
      instructor: 'Unknown Instructor',
      instructorPubkey: resource.userId,
      rating: 4.5,
      viewCount: 100,
      type: 'document',
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
 * Get resource by ID with full content
 */
export function getResourceWithContentById(resourceId: string): ResourceDisplay | null {
  const resources = getAllResourcesWithContent()
  return resources.find(resource => resource.id === resourceId) || null
}

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

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type {
  Course,
  Resource,
  Lesson,
  CourseDisplay,
  ResourceDisplay,
  ContentItem,
  ParsedCourseEvent,
  ParsedResourceEvent
} from './types' 