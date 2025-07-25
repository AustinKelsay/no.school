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
    content: draft.content,
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
    content: draft.content,
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