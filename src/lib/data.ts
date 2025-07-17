/**
 * Data access layer for the application
 * Uses unified data access functions that combine database + Nostr data
 * This is the main interface for frontend components
 */

import { 
  getAllContentItems as getContentItems
} from '@/data'

import type { 
  ContentItem 
} from '@/data/types'

// Re-export types for consumers
export type { 
  ContentItem 
} from '@/data/types'

// ============================================================================
// LEGACY EXPORT FUNCTIONS (for backward compatibility)
// ============================================================================

/**
 * Get all content items (legacy)
 */
export async function getAllContentItems(): Promise<ContentItem[]> {
  return getContentItems()
}

 