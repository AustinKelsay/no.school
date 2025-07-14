import type { LucideIcon } from "lucide-react"

/**
 * Core data types matching the database schema from content_data_models.md
 * Database models (Course, Resource, Lesson) + Nostr event types
 */

// ============================================================================
// DATABASE MODELS (matching Prisma schema from content_data_models.md)
// ============================================================================

/**
 * Course model - matches Prisma schema
 */
export interface Course {
  id: string          // @id (client generates UUID)
  userId: string      // User relation
  price: number       // @default(0)
  noteId?: string     // @unique (optional)
  submissionRequired: boolean // @default(false)
  createdAt: string   // @default(now())
  updatedAt: string   // @updatedAt
  
  // UI-specific fields (not in Prisma but needed for display)
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
}

/**
 * Resource model - matches Prisma schema
 * Both videos and documents are stored as Resources
 */
export interface Resource {
  id: string          // @id (client generates UUID)
  userId: string      // User relation
  price: number       // @default(0)
  noteId?: string     // @unique (optional)
  videoId?: string    // Optional video ID
  createdAt: string   // @default(now())
  updatedAt: string   // @updatedAt
  
  // UI-specific fields (not in Prisma but needed for display)
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
  
  // Video-specific fields
  duration?: string
  thumbnailUrl?: string
  videoUrl?: string
}

/**
 * Lesson model - matches Prisma schema
 * Connects courses to resources
 */
export interface Lesson {
  id: string          // @id @default(uuid())
  courseId?: string   // Optional course relation
  resourceId?: string // Optional resource relation
  draftId?: string    // Optional draft relation
  index: number       // Lesson order in course
  createdAt: string   // @default(now())
  updatedAt: string   // @updatedAt
  
  // UI-specific fields (derived from resource)
  title?: string
  description?: string
  duration?: string
  isPremium?: boolean
  price?: number
  currency?: string
  published?: boolean
}

// ============================================================================
// NOSTR EVENT TYPES (NIP-51, NIP-23, NIP-99)
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
 * NIP-51 Course List Event (kind 30001)
 * Courses are lists of resources (lessons)
 */
export interface NostrCourseListEvent extends NostrEvent {
  kind: 30001
  content: string // Empty for lists
}

/**
 * NIP-23 Free Content Event (kind 30023)
 * Free resources (documents, videos, lessons)
 */
export interface NostrFreeContentEvent extends NostrEvent {
  kind: 30023
  content: string // Markdown content
}

/**
 * NIP-99 Paid Content Event (kind 30402)
 * Paid resources (documents, videos, lessons)
 */
export interface NostrPaidContentEvent extends NostrEvent {
  kind: 30402
  content: string // Markdown content
}

// ============================================================================
// PARSED EVENT DATA (from Nostr to UI)
// ============================================================================

/**
 * Parsed course data from NIP-51 events
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
  price?: string
}

/**
 * Parsed resource data from NIP-23/NIP-99 events
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
  d?: string
}

// ============================================================================
// LEGACY TYPES (for backward compatibility)
// ============================================================================

export interface ContentItem {
  id: string
  title: string
  description: string
  type: 'course' | 'video' | 'document' | 'guide' | 'cheatsheet'
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  instructor?: string
  instructorPubkey?: string
  rating?: number
  enrollmentCount?: number
  price?: number
  currency?: string
  image?: string
  isPremium: boolean
  createdAt: string
  lessons?: {
    id: string
    title: string
    description: string
    type: string
    duration: string
    order: number
    isPremium: boolean
    price: number
    currency: string
    videoUrl: string
    documentUrl: string
    createdAt: string
  }[]
}

export interface Video {
  id: number
  title: string
  description: string
  duration: string
  instructor: string
  rating: number
  category: string
  tags: string[]
  isPremium: boolean
  createdAt: string
}

export interface Document {
  id: number
  title: string
  description: string
  type: 'cheatsheet' | 'guide' | 'cookbook' | 'checklist' | 'reference'
  category: string
  tags: string[]
  isPremium: boolean
  createdAt: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface CategoryConfig {
  id: string
  name: string
  icon: LucideIcon
  color: string
  description: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SearchFilters {
  category?: string
  difficulty?: string
  type?: string
  isPremium?: boolean
  query?: string
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// ============================================================================
// COMBINED DATA STRUCTURES
// ============================================================================

/**
 * Course with its lessons (resources)
 */
export interface CourseWithLessons {
  course: Course
  lessons: (Lesson & { resource?: Resource })[]
}

/**
 * Full course data with Nostr events
 */
export interface NostrCourseData {
  courseListEvent: NostrCourseListEvent
  resourceEvents: (NostrFreeContentEvent | NostrPaidContentEvent)[]
}

// ============================================================================
// PARSING FUNCTIONS (from content_data_models.md)
// ============================================================================

/**
 * Parse NIP-51 course list event to UI-friendly format
 * Based on parseCourseEvent from content_data_models.md
 */
export function parseCourseEvent(event: NostrEvent): ParsedCourseEvent {
  const eventData: ParsedCourseEvent = {
    id: event.id,
    pubkey: event.pubkey || '',
    content: event.content || '',
    kind: event.kind || 0,
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
        eventData.price = tag[1]
        break
      case 'l':
        tag.slice(1).forEach(topic => {
          eventData.topics.push(topic)
        })
        break
      case 'r':
        // Additional links - not used in course events but keeping for completeness
        break
      case 't':
        eventData.topics.push(tag[1])
        break
    }
  })

  return eventData
}

/**
 * Parse NIP-23/NIP-99 resource event to UI-friendly format
 * Based on parseEvent from content_data_models.md
 */
export function parseResourceEvent(event: NostrEvent): ParsedResourceEvent {
  const eventData: ParsedResourceEvent = {
    id: event.id,
    pubkey: event.pubkey || '',
    content: event.content || '',
    kind: event.kind || 0,
    additionalLinks: [],
    title: '',
    summary: '',
    image: '',
    published_at: '',
    topics: [],
    type: 'document', // Default type
  }

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
    }
  })

  // If published_at is empty, use created_at
  if (!eventData.published_at) {
    eventData.published_at = event.created_at.toString()
  }

  return eventData
}