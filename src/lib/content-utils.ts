/**
 * Content utilities for extracting and processing content from Nostr events
 * Handles both documents (markdown) and videos (embedded content)
 */

import { nostrFreeContentEvents, nostrPaidContentEvents } from '@/data/nostr-events'
import { ResourceDisplay, NostrFreeContentEvent, NostrPaidContentEvent } from '@/data/types'
import { NostrEvent } from 'snstr'

export interface ResourceContent {
  id: string
  title: string
  content: string
  type: 'document' | 'video'
  isMarkdown: boolean
  hasVideo: boolean
  videoUrl?: string
  additionalLinks: string[]
  author: string
  pubkey: string
  publishedAt: string
}

/**
 * Extract content from Nostr events for a resource
 */
export function getResourceContent(resource: ResourceDisplay): ResourceContent | null {
  // First check free content events
  const freeEvent = nostrFreeContentEvents.find(event => 
    event.id === resource.noteId || event.tags.some(tag => tag[0] === 'd' && tag[1] === resource.id)
  )
  
  if (freeEvent) {
    return parseNostrEventContent(freeEvent, resource)
  }
  
  // Then check paid content events
  const paidEvent = nostrPaidContentEvents.find(event => 
    event.id === resource.noteId || event.tags.some(tag => tag[0] === 'd' && tag[1] === resource.id)
  )
  
  if (paidEvent) {
    return parseNostrEventContent(paidEvent, resource)
  }
  
  // Fallback for resources without Nostr events - create basic content structure
  return {
    id: resource.id,
    title: resource.title || 'Unknown Resource',
    content: resource.type === 'video' ? 
      `<div class="video-placeholder">
        <h2>${resource.title}</h2>
        <p>${resource.description}</p>
        <div class="video-info">
          <p><strong>Duration:</strong> ${resource.duration || 'Unknown'}</p>
          <p><strong>Category:</strong> ${resource.category}</p>
          <p><strong>Instructor:</strong> ${resource.instructor}</p>
        </div>
      </div>` : 
      resource.description || 'Content not available',
    type: resource.type === 'video' ? 'video' : 'document',
    isMarkdown: resource.type !== 'video',
    hasVideo: resource.type === 'video',
    videoUrl: resource.type === 'video' && resource.videoId ? `/videos/${resource.videoId}` : undefined,
    additionalLinks: resource.additionalLinks || [],
    author: resource.instructor || 'Unknown',
    pubkey: resource.instructorPubkey || resource.userId || '',
    publishedAt: resource.createdAt
  }
}

/**
 * Parse Nostr event content into ResourceContent format
 */
function parseNostrEventContent(event: NostrFreeContentEvent | NostrPaidContentEvent, resource: ResourceDisplay): ResourceContent {
  const content = event.content || ''
  const hasVideo = detectVideoContent(content)
  const isMarkdown = !hasVideo || content.includes('#') || content.includes('```')
  
  // Extract additional links from tags
  const additionalLinks: string[] = []
  event.tags.forEach((tag: string[]) => {
    if (tag[0] === 'r') {
      additionalLinks.push(tag[1])
    }
  })
  
  // Extract title from tags
  let title = resource.title
  event.tags.forEach((tag: string[]) => {
    if (tag[0] === 'title') {
      title = tag[1]
    }
  })
  
  // Extract author from tags
  let author = resource.instructor
  event.tags.forEach((tag: string[]) => {
    if (tag[0] === 'author') {
      author = tag[1]
    }
  })
  
  // Extract published date
  let publishedAt = new Date(event.created_at * 1000).toISOString()
  event.tags.forEach((tag: string[]) => {
    if (tag[0] === 'published_at') {
      publishedAt = new Date(parseInt(tag[1]) * 1000).toISOString()
    }
  })
  
  return {
    id: event.id,
    title,
    content,
    type: resource.type === 'video' ? 'video' : 'document',
    isMarkdown,
    hasVideo,
    videoUrl: extractVideoUrl(content),
    additionalLinks,
    author,
    pubkey: event.pubkey,
    publishedAt
  }
}

/**
 * Detect if content contains video elements
 */
function detectVideoContent(content: string): boolean {
  return content.includes('<video') || 
         content.includes('<iframe') || 
         content.includes('youtube.com') ||
         content.includes('vimeo.com')
}

/**
 * Extract video URL from content
 */
function extractVideoUrl(content: string): string | undefined {
  // Extract YouTube URL from iframe
  const youtubeMatch = content.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i)
  if (youtubeMatch) {
    return `https://www.youtube.com/watch?v=${youtubeMatch[1]}`
  }
  
  // Extract direct video URL from source tags
  const videoMatch = content.match(/src="([^"]+\.(mp4|webm|mov))"/i)
  if (videoMatch) {
    return videoMatch[1]
  }
  
  return undefined
}

/**
 * Clean HTML content for safe display
 */
export function sanitizeContent(content: string): string {
  // Remove script tags for security
  return content.replace(/<script[^>]*>.*?<\/script>/gi, '')
}

/**
 * Extract plain text content from markdown/HTML
 */
export function extractPlainText(content: string): string {
  // Remove HTML tags
  const withoutHtml = content.replace(/<[^>]*>/g, '')
  
  // Remove markdown syntax
  const withoutMarkdown = withoutHtml
    .replace(/^#{1,6}\s+/gm, '')  // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
    .replace(/\*(.*?)\*/g, '$1')  // Remove italic
    .replace(/`(.*?)`/g, '$1')  // Remove inline code
    .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')  // Remove images
  
  return withoutMarkdown.trim()
}

/**
 * Get estimated reading time for content
 */
export function getEstimatedReadingTime(content: string): number {
  const plainText = extractPlainText(content)
  const words = plainText.split(/\s+/).filter(word => word.length > 0).length
  const wordsPerMinute = 200 // Average reading speed
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Format content for display (remove excessive whitespace, etc.)
 */
export function formatContentForDisplay(content: string): string {
  return content
    .replace(/\n\s*\n\s*\n/g, '\n\n')  // Collapse multiple blank lines
    .replace(/^\s+|\s+$/g, '')  // Trim whitespace
    .replace(/\t/g, '  ')  // Convert tabs to spaces
} 

/**
 * Content utilities for parsing Nostr events
 * Based on content_data_models.md parsing logic
 */

/**
 * Parse course event from Nostr
 */
export interface ParsedCourseEvent {
  id: string
  pubkey: string
  content: string
  kind: string
  title: string
  description: string
  image: string
  published_at: string
  created_at: number
  topics: string[]
  additionalLinks: string[]
  d: string
  tags: string[][]
  type: 'course'
  instructor?: string
  instructorPubkey?: string
  price?: string
  currency?: string
  isPremium?: boolean
  category?: string
}

/**
 * Parse resource event from Nostr
 */
export interface ParsedResourceEvent {
  id: string
  pubkey: string
  content: string
  kind: string
  title: string
  summary: string
  image: string
  published_at: string
  created_at: number
  topics: string[]
  additionalLinks: string[]
  d: string
  tags: string[][]
  type: 'document' | 'video'
  author?: string
  authorPubkey?: string
  price?: string
  currency?: string
  isPremium?: boolean
  category?: string
}

export const parseCourseEvent = (event: NostrEvent): ParsedCourseEvent => {
  // Initialize an object to store the extracted data
  const eventData: ParsedCourseEvent = {
    id: event.id,
    pubkey: event.pubkey || '',
    content: event.content || '',
    kind: event.kind?.toString() || '',
    title: '',
    description: '',
    image: '',
    published_at: '',
    created_at: event.created_at || 0,
    topics: [],
    additionalLinks: [],
    d: '',
    tags: event.tags || [],
    type: 'course',
  }

  // Iterate over the tags array to extract data
  if (event.tags) {
    event.tags.forEach(tag => {
      if (!Array.isArray(tag) || tag.length === 0) return
      
      switch (tag[0]) {
        case 'name':
        case 'title':
          eventData.title = tag[1] || ''
          break
        case 'description':
        case 'about':
          eventData.description = tag[1] || ''
          break
        case 'image':
        case 'picture':
          eventData.image = tag[1] || ''
          break
        case 'published_at':
          eventData.published_at = tag[1] || ''
          break
        case 'd':
          eventData.d = tag[1] || ''
          break
        case 'price':
          eventData.price = tag[1] || ''
          eventData.isPremium = parseFloat(tag[1] || '0') > 0
          break
        case 'currency':
          eventData.currency = tag[1] || ''
          break
        case 'l':
          // Grab index 1 and any subsequent elements in the array
          tag.slice(1).forEach(topic => {
            if (topic) eventData.topics.push(topic)
          })
          break
        case 'r':
          if (tag[1]) eventData.additionalLinks.push(tag[1])
          break
        case 't':
          if (tag[1]) eventData.topics.push(tag[1])
          break
        case 'instructor':
          eventData.instructor = tag[1] || ''
          break
        case 'p':
          // Assuming instructor pubkey is in p tag
          eventData.instructorPubkey = tag[1] || ''
          break
        default:
          break
      }
    })
  }

  // Set instructor pubkey to event pubkey if not specified
  if (!eventData.instructorPubkey) {
    eventData.instructorPubkey = eventData.pubkey
  }

  // Determine category from topics
  if (eventData.topics.length > 0) {
    eventData.category = eventData.topics[0]
  }

  return eventData
}

export const parseEvent = (event: NostrEvent): ParsedResourceEvent => {
  // Initialize an object to store the extracted data
  const eventData: ParsedResourceEvent = {
    id: event.id,
    pubkey: event.pubkey || '',
    content: event.content || '',
    kind: event.kind?.toString() || '',
    title: '',
    summary: '',
    image: '',
    published_at: '',
    created_at: event.created_at || 0,
    topics: [],
    additionalLinks: [],
    d: '',
    tags: event.tags || [],
    type: 'document', // Default type
  }

  // Iterate over the tags array to extract data
  if (event.tags) {
    event.tags.forEach(tag => {
      if (!Array.isArray(tag) || tag.length === 0) return
      
      switch (tag[0]) {
        case 'title':
          eventData.title = tag[1] || ''
          break
        case 'summary':
        case 'description':
          eventData.summary = tag[1] || ''
          break
        case 'name':
          eventData.title = tag[1] || ''
          break
        case 'image':
          eventData.image = tag[1] || ''
          break
        case 'published_at':
          eventData.published_at = tag[1] || ''
          break
        case 'author':
          eventData.author = tag[1] || ''
          break
        case 'price':
          eventData.price = tag[1] || ''
          eventData.isPremium = parseFloat(tag[1] || '0') > 0
          break
        case 'currency':
          eventData.currency = tag[1] || ''
          break
        case 'l':
          // Grab index 1 and any subsequent elements in the array
          tag.slice(1).forEach(topic => {
            if (topic) eventData.topics.push(topic)
          })
          break
        case 'd':
          eventData.d = tag[1] || ''
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
          if (tag[1]) eventData.additionalLinks.push(tag[1])
          break
        case 'p':
          // Assuming author pubkey is in p tag
          eventData.authorPubkey = tag[1] || ''
          break
        default:
          break
      }
    })
  }

  // Set author pubkey to event pubkey if not specified
  if (!eventData.authorPubkey) {
    eventData.authorPubkey = eventData.pubkey
  }

  // if published_at is an empty string, then set it to event.created_at
  if (!eventData.published_at) {
    eventData.published_at = eventData.created_at.toString()
  }

  // Determine category from topics
  if (eventData.topics.length > 0) {
    eventData.category = eventData.topics.find(topic => topic !== 'video') || eventData.topics[0]
  }

  return eventData
} 