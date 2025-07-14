/**
 * Course, Document, and Video Utility Functions
 * Includes Nostr event parsing, generation, and data manipulation
 * 
 * NOTE: This file contains utilities for future Nostr protocol integration.
 * These functions are NOT currently used in the application but are kept
 * for when we implement NIP-23/99 and NIP-51 support for:
 * - Course list events (NIP-51) 
 * - Free content events (NIP-23)
 * - Paid content events (NIP-99)
 * 
 * Current implementation uses domain-separated mock data in:
 * - src/data/courses/
 * - src/data/documents/
 * - src/data/videos/
 */

import type {
  DbCourse,
  DbLesson,
  DbDocument,
  DbVideo,
  NostrCourseListEvent,
  NostrFreeLessonEvent,
  NostrPaidLessonEvent,
  NostrFreeDocumentEvent,
  NostrPaidDocumentEvent,
  NostrFreeVideoEvent,
  NostrPaidVideoEvent,
  CreateCourseData,
  CreateLessonData,
  CreateDocumentData,
  CreateVideoData,
  ContentStats
} from './types'

/**
 * Parse NIP-51 course list event to database course format
 */
export function parseCourseListEvent(event: NostrCourseListEvent): Partial<DbCourse> {
  const course: Partial<DbCourse> = {
    id: '',
    title: '',
    description: '',
    category: '',
    instructor: '',
    instructorPubkey: event.pubkey,
    rating: 0,
    enrollmentCount: 0,
    isPremium: false,
    courseListEventId: event.id,
    published: true,
    createdAt: new Date(event.created_at * 1000).toISOString(),
    updatedAt: new Date(event.created_at * 1000).toISOString()
  }

  event.tags.forEach(tag => {
    switch (tag[0]) {
      case 'd':
        course.id = `course-${tag[1]}`
        break
      case 'title':
        course.title = tag[1]
        break
      case 'description':
        course.description = tag[1]
        break
      case 'image':
        course.image = tag[1]
        break
      case 'l':
        course.category = tag[1]
        break
      case 'price':
        if (tag[1] && parseInt(tag[1]) > 0) {
          course.isPremium = true
          course.price = parseInt(tag[1])
          course.currency = tag[2] || 'sats'
        }
        break
    }
  })

  return course
}

/**
 * Parse NIP-23/99 lesson event to database lesson format
 */
export function parseLessonEvent(
  event: NostrFreeLessonEvent | NostrPaidLessonEvent
): Partial<DbLesson> {
  const lesson: Partial<DbLesson> = {
    id: '',
    courseId: '',
    title: '',
    description: '',
    duration: '30 min',
    order: 1,
    isPremium: event.kind === 30402,
    lessonEventId: event.id,
    published: true,
    createdAt: new Date(event.created_at * 1000).toISOString(),
    updatedAt: new Date(event.created_at * 1000).toISOString()
  }

  event.tags.forEach(tag => {
    switch (tag[0]) {
      case 'd':
        lesson.id = `lesson-${tag[1]}`
        break
      case 'title':
        lesson.title = tag[1]
        break
      case 'summary':
      case 'description':
        lesson.description = tag[1]
        break
      case 'duration':
        lesson.duration = tag[1]
        break
      case 'price':
        if (tag[1] && parseInt(tag[1]) > 0) {
          lesson.isPremium = true
          lesson.price = parseInt(tag[1])
          lesson.currency = tag[2] || 'sats'
        }
        break
      case 'a':
        // Extract course ID from course reference
        const courseRef = tag[1].split(':')
        if (courseRef.length >= 3) {
          lesson.courseId = `course-${courseRef[2]}`
        }
        break
    }
  })

  return lesson
}

/**
 * Parse NIP-23/99 document event to database document format
 */
export function parseDocumentEvent(
  event: NostrFreeDocumentEvent | NostrPaidDocumentEvent
): Partial<DbDocument> {
  const document: Partial<DbDocument> = {
    id: '',
    title: '',
    description: '',
    category: '',
    type: 'guide',
    instructor: '',
    instructorPubkey: event.pubkey,
    rating: 0,
    viewCount: 0,
    isPremium: event.kind === 30402,
    tags: [],
    difficulty: 'intermediate',
    documentEventId: event.id,
    published: true,
    createdAt: new Date(event.created_at * 1000).toISOString(),
    updatedAt: new Date(event.created_at * 1000).toISOString()
  }

  const tags: string[] = []

  event.tags.forEach(tag => {
    switch (tag[0]) {
      case 'd':
        document.id = `doc-${tag[1]}`
        break
      case 'title':
        document.title = tag[1]
        break
      case 'summary':
      case 'description':
        document.description = tag[1]
        break
      case 'image':
        document.image = tag[1]
        break
      case 'price':
        if (tag[1] && parseInt(tag[1]) > 0) {
          document.isPremium = true
          document.price = parseInt(tag[1])
          document.currency = tag[2] || 'sats'
        }
        break
      case 't':
        tags.push(tag[1])
        break
    }
  })

  document.tags = tags

  // Infer category and type from tags
  if (tags.includes('bitcoin')) document.category = 'bitcoin'
  else if (tags.includes('lightning')) document.category = 'lightning'
  else if (tags.includes('nostr')) document.category = 'nostr'
  else if (tags.includes('frontend')) document.category = 'frontend'

  if (tags.includes('cheatsheet')) document.type = 'cheatsheet'
  else if (tags.includes('reference')) document.type = 'reference'
  else if (tags.includes('tutorial')) document.type = 'tutorial'
  else if (tags.includes('documentation')) document.type = 'documentation'

  return document
}

/**
 * Parse NIP-23/99 video event to database video format
 */
export function parseVideoEvent(
  event: NostrFreeVideoEvent | NostrPaidVideoEvent
): Partial<DbVideo> {
  const video: Partial<DbVideo> = {
    id: '',
    title: '',
    description: '',
    category: '',
    instructor: '',
    instructorPubkey: event.pubkey,
    duration: '30:00',
    rating: 0,
    viewCount: 0,
    isPremium: event.kind === 30402,
    tags: [],
    difficulty: 'intermediate',
    videoEventId: event.id,
    published: true,
    createdAt: new Date(event.created_at * 1000).toISOString(),
    updatedAt: new Date(event.created_at * 1000).toISOString()
  }

  const tags: string[] = []

  event.tags.forEach(tag => {
    switch (tag[0]) {
      case 'd':
        video.id = `video-${tag[1]}`
        break
      case 'title':
        video.title = tag[1]
        break
      case 'summary':
      case 'description':
        video.description = tag[1]
        break
      case 'duration':
        video.duration = tag[1]
        break
      case 'price':
        if (tag[1] && parseInt(tag[1]) > 0) {
          video.isPremium = true
          video.price = parseInt(tag[1])
          video.currency = tag[2] || 'sats'
        }
        break
      case 't':
        tags.push(tag[1])
        break
      case 'r':
        // Video URL from reference tag
        if (tag[1].includes('video') || tag[1].includes('.mp4')) {
          video.videoUrl = tag[1]
        } else {
          video.thumbnailUrl = tag[1]
        }
        break
    }
  })

  video.tags = tags

  // Infer category from tags
  if (tags.includes('bitcoin')) video.category = 'bitcoin'
  else if (tags.includes('lightning')) video.category = 'lightning'
  else if (tags.includes('nostr')) video.category = 'nostr'
  else if (tags.includes('security')) video.category = 'security'

  // Infer difficulty from tags
  if (tags.includes('beginner')) video.difficulty = 'beginner'
  else if (tags.includes('advanced')) video.difficulty = 'advanced'

  return video
}

/**
 * Generate NIP-51 course list event from course data
 */
export function generateCourseListEvent(course: CreateCourseData): NostrCourseListEvent {
  const courseId = course.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const timestamp = Math.floor(Date.now() / 1000)

  const tags: string[][] = [
    ['d', courseId],
    ['title', course.title],
    ['description', course.description],
    ['l', course.category],
    ['published_at', timestamp.toString()]
  ]

  if (course.image) {
    tags.push(['image', course.image])
  }

  if (course.isPremium && course.price) {
    tags.push(['price', course.price.toString(), course.currency || 'sats'])
  }

  // Add lesson references
  course.lessons.forEach(lesson => {
    const lessonId = lesson.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const kind = lesson.isPremium ? '30402' : '30023'
    tags.push(['a', `${kind}:${course.instructorPubkey}:${lessonId}`])
  })

  return {
    id: '', // Will be generated when signing
    pubkey: course.instructorPubkey,
    created_at: timestamp,
    kind: 30001,
    content: '',
    tags,
    sig: '' // Will be generated when signing
  }
}

/**
 * Generate NIP-23/99 lesson event from lesson data
 */
export function generateLessonEvent(
  lesson: CreateLessonData,
  instructorPubkey: string
): NostrFreeLessonEvent | NostrPaidLessonEvent {
  const lessonId = lesson.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const timestamp = Math.floor(Date.now() / 1000)
  const kind = lesson.isPremium ? 30402 : 30023

  const tags: string[][] = [
    ['d', lessonId],
    ['title', lesson.title],
    ['summary', lesson.description],
    ['duration', lesson.duration],
    ['published_at', timestamp.toString()]
  ]

  if (lesson.isPremium && lesson.price) {
    tags.push(['price', lesson.price.toString(), lesson.currency || 'sats'])
  }

  const baseEvent = {
    id: '', // Will be generated when signing
    pubkey: instructorPubkey,
    created_at: timestamp,
    tags,
    content: lesson.content,
    sig: '' // Will be generated when signing
  }

  if (lesson.isPremium) {
    return { ...baseEvent, kind: 30402 } as NostrPaidLessonEvent
  } else {
    return { ...baseEvent, kind: 30023 } as NostrFreeLessonEvent
  }
}

/**
 * Generate NIP-23/99 document event from document data
 */
export function generateDocumentEvent(
  document: CreateDocumentData
): NostrFreeDocumentEvent | NostrPaidDocumentEvent {
  const documentId = document.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const timestamp = Math.floor(Date.now() / 1000)
  const kind = document.isPremium ? 30402 : 30023

  const tags: string[][] = [
    ['d', documentId],
    ['title', document.title],
    ['summary', document.description],
    ['published_at', timestamp.toString()]
  ]

  if (document.image) {
    tags.push(['image', document.image])
  }

  if (document.isPremium && document.price) {
    tags.push(['price', document.price.toString(), document.currency || 'sats'])
  }

  // Add category and type tags
  document.tags.forEach(tag => {
    tags.push(['t', tag])
  })

  const baseEvent = {
    id: '', // Will be generated when signing
    pubkey: document.instructorPubkey,
    created_at: timestamp,
    tags,
    content: document.content,
    sig: '' // Will be generated when signing
  }

  if (document.isPremium) {
    return { ...baseEvent, kind: 30402 } as NostrPaidDocumentEvent
  } else {
    return { ...baseEvent, kind: 30023 } as NostrFreeDocumentEvent
  }
}

/**
 * Generate NIP-23/99 video event from video data
 */
export function generateVideoEvent(
  video: CreateVideoData
): NostrFreeVideoEvent | NostrPaidVideoEvent {
  const videoId = video.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const timestamp = Math.floor(Date.now() / 1000)
  const kind = video.isPremium ? 30402 : 30023

  const tags: string[][] = [
    ['d', videoId],
    ['title', video.title],
    ['summary', video.description],
    ['duration', video.duration],
    ['published_at', timestamp.toString()]
  ]

  if (video.thumbnailUrl) {
    tags.push(['image', video.thumbnailUrl])
  }

  if (video.videoUrl) {
    tags.push(['r', video.videoUrl])
  }

  if (video.isPremium && video.price) {
    tags.push(['price', video.price.toString(), video.currency || 'sats'])
  }

  // Add category and type tags
  video.tags.forEach(tag => {
    tags.push(['t', tag])
  })

  const baseEvent = {
    id: '', // Will be generated when signing
    pubkey: video.instructorPubkey,
    created_at: timestamp,
    tags,
    content: video.content,
    sig: '' // Will be generated when signing
  }

  if (video.isPremium) {
    return { ...baseEvent, kind: 30402 } as NostrPaidVideoEvent
  } else {
    return { ...baseEvent, kind: 30023 } as NostrFreeVideoEvent
  }
}

/**
 * Extract lesson references from course list event
 */
export function extractLessonReferences(event: NostrCourseListEvent): string[] {
  return event.tags
    .filter(tag => tag[0] === 'a')
    .map(tag => tag[1])
}

/**
 * Generate NIP-19 naddr identifier
 */
export function generateNaddr(
  pubkey: string,
  kind: number,
  identifier: string,
  relays?: string[]
): string {
  // This would normally use nostr-tools nip19.naddrEncode
  // For mock data, we'll return a placeholder
  return `naddr1qq${pubkey.slice(0, 8)}${kind}${identifier.slice(0, 8)}`
}

/**
 * Parse NIP-19 naddr identifier
 */
export function parseNaddr(naddr: string): {
  pubkey: string
  kind: number
  identifier: string
  relays?: string[]
} | null {
  // This would normally use nostr-tools nip19.decode
  // For mock data, we'll return a placeholder
  if (!naddr.startsWith('naddr1')) return null
  
  return {
    pubkey: 'mock-pubkey',
    kind: 30023,
    identifier: 'mock-identifier'
  }
}

/**
 * Validate course data before publishing
 */
export function validateCourseData(course: CreateCourseData): boolean {
  if (!course.title || course.title.length < 3) return false
  if (!course.description || course.description.length < 10) return false
  if (!course.instructorPubkey) return false
  if (course.lessons.length === 0) return false
  
  return course.lessons.every(lesson => 
    lesson.title && lesson.description && lesson.content
  )
}

/**
 * Validate document data before publishing
 */
export function validateDocumentData(document: CreateDocumentData): boolean {
  if (!document.title || document.title.length < 3) return false
  if (!document.description || document.description.length < 10) return false
  if (!document.content || document.content.length < 50) return false
  if (!document.instructorPubkey) return false
  
  return true
}

/**
 * Validate video data before publishing
 */
export function validateVideoData(video: CreateVideoData): boolean {
  if (!video.title || video.title.length < 3) return false
  if (!video.description || video.description.length < 10) return false
  if (!video.content || video.content.length < 50) return false
  if (!video.instructorPubkey) return false
  if (!video.duration) return false
  
  return true
}

/**
 * Calculate total course duration from lessons
 */
export function calculateCourseDuration(lessons: DbLesson[]): string {
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
 * Filter courses by criteria
 */
export function filterCourses(
  courses: DbCourse[],
  criteria: {
    category?: string
    isPremium?: boolean
    rating?: number
  }
): DbCourse[] {
  return courses.filter(course => {
    if (criteria.category && course.category !== criteria.category) return false
    if (criteria.isPremium !== undefined && course.isPremium !== criteria.isPremium) return false
    if (criteria.rating && course.rating < criteria.rating) return false
    return true
  })
}

/**
 * Filter documents by criteria
 */
export function filterDocuments(
  documents: DbDocument[],
  criteria: {
    category?: string
    type?: string
    isPremium?: boolean
    difficulty?: string
  }
): DbDocument[] {
  return documents.filter(doc => {
    if (criteria.category && doc.category !== criteria.category) return false
    if (criteria.type && doc.type !== criteria.type) return false
    if (criteria.isPremium !== undefined && doc.isPremium !== criteria.isPremium) return false
    if (criteria.difficulty && doc.difficulty !== criteria.difficulty) return false
    return true
  })
}

/**
 * Filter videos by criteria
 */
export function filterVideos(
  videos: DbVideo[],
  criteria: {
    category?: string
    isPremium?: boolean
    difficulty?: string
  }
): DbVideo[] {
  return videos.filter(video => {
    if (criteria.category && video.category !== criteria.category) return false
    if (criteria.isPremium !== undefined && video.isPremium !== criteria.isPremium) return false
    if (criteria.difficulty && video.difficulty !== criteria.difficulty) return false
    return true
  })
}

/**
 * Sort courses by field
 */
export function sortCourses(
  courses: DbCourse[],
  field: keyof DbCourse,
  order: 'asc' | 'desc' = 'desc'
): DbCourse[] {
  return [...courses].sort((a, b) => {
    const aVal = a[field]
    const bVal = b[field]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    return 0
  })
}

/**
 * Get course statistics
 */
export function getCourseStatistics(courses: DbCourse[]): ContentStats {
  const totalCourses = courses.length
  const premiumCourses = courses.filter(c => c.isPremium).length
  const freeCourses = totalCourses - premiumCourses
  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrollmentCount, 0)
  const averageRating = courses.reduce((sum, c) => sum + c.rating, 0) / totalCourses

  const categoryStats = courses.reduce((acc, course) => {
    const category = course.category.charAt(0).toUpperCase() + course.category.slice(1)
    if (!acc[category]) {
      acc[category] = { name: category, count: 0, type: 'course' as const }
    }
    acc[category].count++
    return acc
  }, {} as Record<string, { name: string; count: number; type: 'course' | 'document' | 'video' }>)

  return {
    totalCourses,
    totalDocuments: 0,
    totalVideos: 0,
    totalUsers: totalEnrollments,
    averageRating: Math.round(averageRating * 10) / 10,
    topCategories: Object.values(categoryStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)
  }
} 