/**
 * Core data types matching the database schema from content_data_models.md
 * Database models store minimal data, full content comes from Nostr events
 */

import type { LucideIcon } from "lucide-react"

// ============================================================================
// DATABASE MODELS (minimal fields only - matching Prisma schema)
// ============================================================================

/**
 * Course model - minimal database fields only
 * Full content comes from NIP-51 course list events (kind 30004)
 */
export interface Course {
  id: string              // @id (client generates UUID)
  userId: string          // User relation
  price: number           // @default(0) - price in sats
  noteId?: string         // @unique (optional) - references Nostr event
  submissionRequired: boolean // @default(false)
  createdAt: string       // @default(now())
  updatedAt: string       // @updatedAt
}

/**
 * Resource model - minimal database fields only
 * Both videos and documents are stored as Resources
 * Full content comes from NIP-23 (free) or NIP-99 (paid) events
 */
export interface Resource {
  id: string              // @id (client generates UUID)  
  userId: string          // User relation
  price: number           // @default(0) - price in sats
  noteId?: string         // @unique (optional) - references Nostr event
  videoId?: string        // Optional video ID for video resources
  createdAt: string       // @default(now())
  updatedAt: string       // @updatedAt
}

/**
 * Lesson model - connects courses to resources
 */
export interface Lesson {
  id: string              // @id @default(uuid())
  courseId?: string       // Optional course relation
  resourceId?: string     // Optional resource relation
  draftId?: string        // Optional draft relation (for future use)
  index: number           // Lesson order in course
  createdAt: string       // @default(now())
  updatedAt: string       // @updatedAt
}

// ============================================================================
// NOSTR EVENT TYPES (matching content_data_models.md)
// ============================================================================

/**
 * Base Nostr event structure (NIP-01)
 */
export interface NostrEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

/**
 * NIP-51 Course List Event (kind 30004) - CORRECTED KIND
 * Courses as curation sets referencing lesson resources
 */
export interface NostrCourseListEvent extends NostrEvent {
  kind: 30004
  content: string // Course description (usually empty)
}

/**
 * NIP-23 Free Content Event (kind 30023)
 * Free resources (documents, videos, lessons)
 */
export interface NostrFreeContentEvent extends NostrEvent {
  kind: 30023
  content: string // Full markdown content
}

/**
 * NIP-99 Paid Content Event (kind 30402)
 * Paid resources (documents, videos, lessons)
 */
export interface NostrPaidContentEvent extends NostrEvent {
  kind: 30402
  content: string // Full markdown content
}

// ============================================================================
// PARSED EVENT DATA (from Nostr events to UI) - matching content_data_models.md
// ============================================================================

/**
 * Parsed course event data (from parseCourseEvent function)
 */
export interface ParsedCourseEvent {
  id: string
  pubkey: string
  content: string
  kind: number
  name: string
  description: string
  image: string
  published_at: string
  created_at: number
  topics: string[]
  d: string
  tags: string[][]
  type: 'course'
}

/**
 * Parsed resource event data (from parseEvent function)
 */
export interface ParsedResourceEvent {
  id: string
  pubkey: string
  content: string
  kind: number
  additionalLinks: string[]
  title: string
  summary: string
  image: string
  published_at: string
  topics: string[]
  type: 'document' | 'video'
  author?: string
  price?: string
  d: string
}

// ============================================================================
// UTILITY TYPES AND FUNCTIONS
// ============================================================================

/**
 * Parse course event function signature (from content_data_models.md)
 */
export function parseCourseEvent(event: NostrCourseListEvent): ParsedCourseEvent {
  const eventData: ParsedCourseEvent = {
    id: event.id,
    pubkey: event.pubkey || '',
    content: event.content || '',
    kind: event.kind || 30004,
    name: '',
    description: '',
    image: '',
    published_at: '',
    created_at: event.created_at,
    topics: [],
    d: '',
    tags: event.tags,
    type: 'course',
  }

  // Iterate over the tags array to extract data
  event.tags.forEach(tag => {
    switch (tag[0]) {
      case 'name':
        eventData.name = tag[1]
        break
      case 'title':
        eventData.name = tag[1]
        break
      case 'description':
        eventData.description = tag[1]
        break
      case 'about':
        eventData.description = tag[1]
        break
      case 'image':
        eventData.image = tag[1]
        break
      case 'picture':
        eventData.image = tag[1]
        break
      case 'published_at':
        eventData.published_at = tag[1]
        break
      case 'd':
        eventData.d = tag[1]
        break
      case 'price':
        // Price is handled in database model
        break
      case 'l':
        // Grab index 1 and any subsequent elements in the array
        tag.slice(1).forEach(topic => {
          eventData.topics.push(topic)
        })
        break
      case 't':
        eventData.topics.push(tag[1])
        break
      default:
        break
    }
  })

  return eventData
}

/**
 * Parse resource event function signature (from content_data_models.md)
 */
export function parseEvent(event: NostrFreeContentEvent | NostrPaidContentEvent): ParsedResourceEvent {
  const eventData: ParsedResourceEvent = {
    id: event.id,
    pubkey: event.pubkey || '',
    content: event.content || '',
    kind: event.kind || 30023,
    additionalLinks: [],
    title: '',
    summary: '',
    image: '',
    published_at: '',
    topics: [],
    type: 'document', // Default type
    d: ''
  }

  // Iterate over the tags array to extract data
  event.tags.forEach(tag => {
    switch (tag[0]) {
      case 'title':
        eventData.title = tag[1]
        break
      case 'summary':
        eventData.summary = tag[1]
        break
      case 'description':
        eventData.summary = tag[1]
        break
      case 'name':
        eventData.title = tag[1]
        break
      case 'image':
        eventData.image = tag[1]
        break
      case 'published_at':
        eventData.published_at = tag[1]
        break
      case 'author':
        eventData.author = tag[1]
        break
      case 'price':
        eventData.price = tag[1]
        break
      case 'l':
        // Grab index 1 and any subsequent elements in the array
        tag.slice(1).forEach(topic => {
          eventData.topics.push(topic)
        })
        break
      case 'd':
        eventData.d = tag[1]
        break
      case 't':
        if (tag[1] === 'video') {
          eventData.type = 'video'
          eventData.topics.push(tag[1])
        } else if (tag[1] !== 'plebdevs') {
          eventData.topics.push(tag[1])
        }
        break
      case 'r':
        eventData.additionalLinks.push(tag[1])
        break
      default:
        break
    }
  })

  // if published_at is an empty string, then set it to event.created_at
  if (!eventData.published_at) {
    eventData.published_at = event.created_at.toString()
  }

  return eventData
}

// ============================================================================
// DISPLAY INTERFACES (for UI components)
// ============================================================================

// Keep existing display interfaces for backwards compatibility
export interface CourseDisplay extends Course {
  title: string
  description: string
  category: string
  instructor: string
  instructorPubkey: string
  rating: number
  enrollmentCount: number
  isPremium: boolean
  currency?: string
  image?: string
  published: boolean
  tags: string[][]
  topics: string[]
  lessonReferences: string[]
  additionalLinks?: string[]
}

export interface ResourceDisplay extends Resource {
  title: string
  description: string
  category: string
  type: 'document' | 'video' | 'guide' | 'cheatsheet' | 'reference' | 'tutorial' | 'documentation'
  instructor: string
  instructorPubkey: string
  rating: number
  viewCount: number
  isPremium: boolean
  currency?: string
  image?: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  published: boolean
  topics: string[]
  additionalLinks: string[]
  duration?: string
  thumbnailUrl?: string
  videoUrl?: string
}

export interface LessonDisplay extends Lesson {
  title: string
  description: string
  duration?: string
  type: 'video' | 'document'
  isPremium: boolean
  completed?: boolean
}

export interface CourseWithLessons extends CourseDisplay {
  lessons: LessonDisplay[]
}

export interface ContentItem {
  id: string
  type: 'course' | 'document' | 'video'
  title: string
  description: string
  category: string
  instructor: string
  instructorPubkey: string
  rating: number
  isPremium: boolean
  price: number
  currency?: string
  image?: string
  published: boolean
  tags: string[][]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
  updatedAt: string
  duration?: string
  enrollmentCount?: number
  viewCount?: number
  topics: string[]
  additionalLinks: string[]
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function createCourseDisplay(course: Course, parsedEvent: ParsedCourseEvent): CourseDisplay {
  return {
    ...course,
    title: parsedEvent.name || 'Unknown Course',
    description: parsedEvent.description || 'No description available',
    category: parsedEvent.topics[0] || 'general',
    instructor: 'Unknown', // Would come from user table in real implementation
    instructorPubkey: parsedEvent.pubkey,
    rating: 0, // Would come from ratings table
    enrollmentCount: 0, // Would come from enrollments table
    isPremium: course.price > 0,
    currency: 'sats',
    image: parsedEvent.image || '',
    tags: parsedEvent.tags,
    published: true,
    topics: parsedEvent.topics,
    lessonReferences: [], // Would extract from 'a' tags
    additionalLinks: []
  }
}

export function createResourceDisplay(resource: Resource, parsedEvent: ParsedResourceEvent): ResourceDisplay {
  return {
    ...resource,
    title: parsedEvent.title || 'Unknown Resource',
    description: parsedEvent.summary || 'No description available',
    category: parsedEvent.topics[0] || 'general',
    type: parsedEvent.type === 'video' ? 'video' : 'document',
    instructor: parsedEvent.author || 'Unknown',
    instructorPubkey: parsedEvent.pubkey,
    rating: 0, // Would come from ratings table
    viewCount: 0, // Would come from views table
    isPremium: resource.price > 0,
    currency: 'sats',
    image: parsedEvent.image || '',
    tags: parsedEvent.topics,
    difficulty: 'intermediate', // Would need to be inferred or stored
    published: true,
    topics: parsedEvent.topics,
    additionalLinks: parsedEvent.additionalLinks
  }
}

// Types are already exported above