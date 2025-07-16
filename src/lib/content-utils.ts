/**
 * Content utilities for extracting and processing content from Nostr events
 * Handles both documents (markdown) and videos (embedded content)
 */

import { nostrFreeContentEvents, nostrPaidContentEvents } from '@/data/nostr-events'
import { ResourceDisplay, NostrFreeContentEvent, NostrPaidContentEvent } from '@/data/types'

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