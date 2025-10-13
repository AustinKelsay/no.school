/**
 * Nostr Event Builder Utilities
 * 
 * This module provides functions for creating, signing, and publishing
 * Nostr events according to various NIPs:
 * - NIP-23: Long-form content (free resources)
 * - NIP-99: Classified listings (paid resources)
 * - NIP-51: Lists (course curation sets)
 */

import { 
  getPublicKey, 
  createEvent,
  type NostrEvent
} from 'snstr'
import type { Draft, CourseDraft } from '@prisma/client'
import type { DraftWithIncludes, CourseDraftWithIncludes } from './draft-service'

// Event kinds for different content types
export const EVENT_KINDS = {
  LONG_FORM_CONTENT: 30023,    // NIP-23 (free resources)
  CLASSIFIED_LISTING: 30402,    // NIP-99 (paid resources)
  CURATION_SET: 30004,          // NIP-51 (course lists)
} as const

const YOUTUBE_REGEX = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
const VIMEO_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/
const DIRECT_VIDEO_REGEX = /\.(mp4|webm|mov|m4v|mkv)(?:\?.*)?$/i

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => {
    switch (char) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return char
    }
  })
}

function buildVideoEmbedHtml(originalUrl: string, title: string): string {
  const sanitizedTitle = escapeHtml(title)
  const trimmedUrl = originalUrl.trim()

  const youtubeMatch = trimmedUrl.match(YOUTUBE_REGEX)
  if (youtubeMatch) {
    const videoId = youtubeMatch[1]
    const embedUrl = `https://www.youtube.com/embed/${videoId}`
    return [
      '<div class="video-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;box-shadow:0 12px 24px rgba(15,23,42,0.25);">',
      `<iframe src="${embedUrl}" title="${sanitizedTitle}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
      '</div>'
    ].join('\n')
  }

  const vimeoMatch = trimmedUrl.match(VIMEO_REGEX)
  if (vimeoMatch) {
    const videoId = vimeoMatch[1]
    const embedUrl = `https://player.vimeo.com/video/${videoId}`
    return [
      '<div class="video-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;box-shadow:0 12px 24px rgba(15,23,42,0.25);">',
      `<iframe src="${embedUrl}" title="${sanitizedTitle}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`,
      '</div>'
    ].join('\n')
  }

  if (DIRECT_VIDEO_REGEX.test(trimmedUrl)) {
    return [
      '<div class="video-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;box-shadow:0 12px 24px rgba(15,23,42,0.25);">',
      `<video controls src="${escapeHtml(trimmedUrl)}" style="position:absolute;top:0;left:0;width:100%;height:100%;" preload="metadata">`,
      '  Your browser does not support the video tag.',
      '</video>',
      '</div>'
    ].join('\n')
  }

  // Fallback to a simple link if we can't determine the provider
  return `>[!TIP]\n> Watch the video here: [${sanitizedTitle}](${trimmedUrl})`
}

function formatDraftContent(draft: Draft | DraftWithIncludes): string {
  if (draft.type !== 'video') {
    return draft.content
  }

  const title = draft.title?.trim() || 'Video Resource'
  const videoUrl = draft.videoUrl?.trim()
  const body = draft.content?.trim()

  const sections: string[] = [`# ${title}`]

  if (videoUrl) {
    sections.push('', buildVideoEmbedHtml(videoUrl, title))
  }

  if (body) {
    sections.push('', body)
  }

  return sections.join('\n').replace(/\n{3,}/g, '\n\n')
}

/**
 * Create and sign a resource event from a draft (server-side signing)
 * Uses NIP-23 for free content or NIP-99 for paid content
 * Note: This is only for server-side signing. NIP-07 users sign on the client.
 */
export function createResourceEvent(
  draft: Draft | DraftWithIncludes,
  privateKey: string
): NostrEvent {
  const isPaid = (draft.price || 0) > 0
  const kind = isPaid ? EVENT_KINDS.CLASSIFIED_LISTING : EVENT_KINDS.LONG_FORM_CONTENT
  const formattedContent = formatDraftContent(draft)
  
  // Build tags array
  const tags: string[][] = [
    ['d', draft.id], // Use draft ID as the 'd' tag identifier
    ['title', draft.title],
    ['summary', draft.summary],
    ['published_at', Math.floor(Date.now() / 1000).toString()],
  ]
  
  // Add image if present
  if (draft.image) {
    tags.push(['image', draft.image])
  }
  
  // Add price tag for paid content
  if (isPaid) {
    tags.push(['price', draft.price!.toString(), 'SATS'])
  }
  
  // Add topics as 't' tags
  draft.topics.forEach(topic => {
    tags.push(['t', topic.toLowerCase()])
  })
  
  // Add content type as 't' tag
  if (draft.type) {
    tags.push(['t', draft.type])
  }
  
  if (draft.type === 'video' && draft.videoUrl) {
    tags.push(['video', draft.videoUrl])
  }

  // Add additional links as 'r' tags
  if (draft.additionalLinks && draft.additionalLinks.length > 0) {
    draft.additionalLinks.forEach(link => {
      tags.push(['r', link])
    })
  }
  
  // Create and sign the event using snstr's createEvent
  // This is for server-side signing only (OAuth users)
  const event = createEvent({
    kind,
    content: formattedContent,
    tags
  }, privateKey) as NostrEvent
  
  return event
}

/**
 * Create and sign a course event from a course draft (server-side signing)
 * Uses NIP-51 curation set (kind 30004)
 * Note: This is only for server-side signing. NIP-07 users sign on the client.
 */
export function createCourseEvent(
  courseDraft: CourseDraft | CourseDraftWithIncludes,
  lessonReferences: Array<{ resourceId: string; pubkey: string }>,
  privateKey: string
): NostrEvent {
  // Build tags array
  const tags: string[][] = [
    ['d', courseDraft.id], // Use course draft ID as the 'd' tag identifier
    ['name', courseDraft.title],
    ['about', courseDraft.summary],
    ['published_at', Math.floor(Date.now() / 1000).toString()],
  ]
  
  // Add image if present
  if (courseDraft.image) {
    tags.push(['image', courseDraft.image])
  }
  
  // Add price tag if paid
  if ((courseDraft.price || 0) > 0) {
    tags.push(['price', courseDraft.price!.toString(), 'SATS'])
  }
  
  // Add topics as 't' tags
  courseDraft.topics.forEach(topic => {
    tags.push(['t', topic.toLowerCase()])
  })
  
  // Add course type tag
  tags.push(['t', 'course'])
  
  // Add lesson references as 'a' tags
  // Format: ["a", "<kind>:<pubkey>:<d-tag>", "<optional-relay>"]
  lessonReferences.forEach(lesson => {
    // Determine the kind based on whether it's a free or paid resource
    // This would need to be passed in or determined from the resource
    const resourceKind = EVENT_KINDS.LONG_FORM_CONTENT // Default to free content
    tags.push(['a', `${resourceKind}:${lesson.pubkey}:${lesson.resourceId}`])
  })
  
  // Create and sign the event using snstr's createEvent
  // This is for server-side signing only (OAuth users)
  const event = createEvent({
    kind: EVENT_KINDS.CURATION_SET,
    content: '', // Course events typically have empty content
    tags
  }, privateKey) as NostrEvent
  
  return event
}

/**
 * Create unsigned resource event data (for NIP-07 signing)
 * Returns the event structure without id and signature
 */
export function createUnsignedResourceEvent(
  draft: Draft | DraftWithIncludes,
  pubkey: string
): Omit<NostrEvent, 'id' | 'sig'> {
  const isPaid = (draft.price || 0) > 0
  const kind = isPaid ? EVENT_KINDS.CLASSIFIED_LISTING : EVENT_KINDS.LONG_FORM_CONTENT
  const formattedContent = formatDraftContent(draft)
  
  // Build tags array
  const tags: string[][] = [
    ['d', draft.id], // Use draft ID as the 'd' tag identifier
    ['title', draft.title],
    ['summary', draft.summary],
    ['published_at', Math.floor(Date.now() / 1000).toString()],
  ]
  
  // Add image if present
  if (draft.image) {
    tags.push(['image', draft.image])
  }
  
  // Add price tag for paid content
  if (isPaid) {
    tags.push(['price', draft.price!.toString(), 'SATS'])
  }
  
  // Add topics as 't' tags
  draft.topics.forEach(topic => {
    tags.push(['t', topic.toLowerCase()])
  })
  
  // Add content type as 't' tag
  if (draft.type) {
    tags.push(['t', draft.type])
  }
  
  if (draft.type === 'video' && draft.videoUrl) {
    tags.push(['video', draft.videoUrl])
  }

  // Add additional links as 'r' tags
  if (draft.additionalLinks && draft.additionalLinks.length > 0) {
    draft.additionalLinks.forEach(link => {
      tags.push(['r', link])
    })
  }
  
  return {
    pubkey,
    created_at: Math.floor(Date.now() / 1000),
    kind,
    tags,
    content: formattedContent,
  }
}

/**
 * Create unsigned course event data (for NIP-07 signing)
 * Returns the event structure without id and signature
 */
export function createUnsignedCourseEvent(
  courseDraft: CourseDraft | CourseDraftWithIncludes,
  lessonReferences: Array<{ resourceId: string; pubkey: string }>,
  pubkey: string
): Omit<NostrEvent, 'id' | 'sig'> {
  // Build tags array
  const tags: string[][] = [
    ['d', courseDraft.id], // Use course draft ID as the 'd' tag identifier
    ['name', courseDraft.title],
    ['about', courseDraft.summary],
    ['published_at', Math.floor(Date.now() / 1000).toString()],
  ]
  
  // Add image if present
  if (courseDraft.image) {
    tags.push(['image', courseDraft.image])
  }
  
  // Add price tag if paid
  if ((courseDraft.price || 0) > 0) {
    tags.push(['price', courseDraft.price!.toString(), 'SATS'])
  }
  
  // Add topics as 't' tags
  courseDraft.topics.forEach(topic => {
    tags.push(['t', topic.toLowerCase()])
  })
  
  // Add course type tag
  tags.push(['t', 'course'])
  
  // Add lesson references as 'a' tags
  // Format: ["a", "<kind>:<pubkey>:<d-tag>", "<optional-relay>"]
  lessonReferences.forEach(lesson => {
    // Determine the kind based on whether it's a free or paid resource
    // This would need to be passed in or determined from the resource
    const resourceKind = EVENT_KINDS.LONG_FORM_CONTENT // Default to free content
    tags.push(['a', `${resourceKind}:${lesson.pubkey}:${lesson.resourceId}`])
  })
  
  return {
    pubkey,
    created_at: Math.floor(Date.now() / 1000),
    kind: EVENT_KINDS.CURATION_SET,
    tags,
    content: '', // Course events typically have empty content
  }
}

/**
 * Check if a user is using NIP-07 (browser extension)
 * These users will sign events client-side
 */
export function isNip07User(provider?: string): boolean {
  return provider === 'nostr' || provider === 'anonymous'
}

/**
 * Extract the noteId from a Nostr event
 * This is the 'd' tag value that serves as the unique identifier
 */
export function extractNoteId(event: NostrEvent): string | undefined {
  const dTag = event.tags.find(tag => tag[0] === 'd')
  return dTag?.[1]
}
