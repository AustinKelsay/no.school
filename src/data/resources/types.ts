/**
 * Resource domain types
 * Resources represent both videos and documents in the database
 * Based on content_data_models.md Resource model
 */

import { Resource } from '../types'

// ============================================================================
// RESOURCE TYPES (extending the base Resource type)
// ============================================================================

/**
 * Document-specific resource
 */
export interface DocumentResource extends Resource {
  type: 'document' | 'guide' | 'cheatsheet' | 'reference' | 'tutorial' | 'documentation'
}

/**
 * Video-specific resource
 */
export interface VideoResource extends Resource {
  type: 'video'
  duration: string
  thumbnailUrl?: string
  videoUrl?: string
}

// ============================================================================
// RESOURCE FILTERING TYPES
// ============================================================================

export interface ResourceFilter {
  category?: string
  type?: Resource['type']
  difficulty?: Resource['difficulty']
  isPremium?: boolean
  priceRange?: {
    min: number
    max: number
  }
  tags?: string[]
  instructor?: string
}

export interface ResourceSearchOptions {
  query?: string
  filters?: ResourceFilter
  sortBy?: 'rating' | 'viewCount' | 'createdAt' | 'price'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// ============================================================================
// RESOURCE CREATION TYPES
// ============================================================================

export interface CreateResourceData {
  title: string
  description: string
  category: string
  type: Resource['type']
  instructor: string
  instructorPubkey: string
  tags: string[]
  difficulty: Resource['difficulty']
  isPremium: boolean
  price?: number
  currency?: string
  image?: string
  
  // Video-specific fields
  duration?: string
  thumbnailUrl?: string
  videoUrl?: string
  
  // Content (stored on Nostr)
  content: string
} 