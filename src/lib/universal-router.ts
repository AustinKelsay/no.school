/**
 * Universal ID Router
 * 
 * Handles routing for multiple ID formats:
 * - Database IDs (string UUIDs like "course-1", "resource-1")
 * - Hex Nostr IDs (64-character hex strings)
 * - NIP-19 encoded entities (npub, nsec, note, nevent, naddr, nprofile)
 * 
 * This allows content to be accessed via any valid identifier format.
 */

import { decode } from 'snstr'

export interface UniversalIdResult {
  /** The resolved identifier that can be used for data queries */
  resolvedId: string
  /** The type of ID that was provided */
  idType: 'database' | 'hex' | 'npub' | 'nsec' | 'note' | 'nevent' | 'naddr' | 'nprofile'
  /** The original input ID */
  originalId: string
  /** For NIP-19 entities, the decoded data */
  decodedData?: unknown
  /** Whether this ID represents a course or resource */
  contentType?: 'course' | 'resource' | 'lesson' | 'unknown'
}

/**
 * Determines if a string is a valid hex ID (64 characters, hex only)
 */
function isHexId(id: string): boolean {
  return /^[a-fA-F0-9]{64}$/.test(id)
}

/**
 * Determines if a string is a database ID (our internal format)
 */
function isDatabaseId(id: string): boolean {
  // Database IDs can be UUIDs or our custom format like "course-1", "resource-1"
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const customIdRegex = /^(course|resource|lesson)-\w+$/
  return uuidRegex.test(id) || customIdRegex.test(id)
}

/**
 * Determines if a string is a NIP-19 encoded entity
 */
function isNip19Entity(id: string): boolean {
  return /^(npub|nsec|note|nevent|naddr|nprofile)1[a-zA-Z0-9]+$/.test(id)
}

/**
 * Extracts the content type from various ID formats
 */
function extractContentType(id: string, decodedData?: unknown): 'course' | 'resource' | 'lesson' | 'unknown' {
  // Check database ID patterns
  if (id.startsWith('course-')) return 'course'
  if (id.startsWith('resource-')) return 'resource'
  if (id.startsWith('lesson-')) return 'lesson'
  
  // Check decoded NIP-19 data
  if (decodedData && typeof decodedData === 'object' && decodedData !== null) {
    const data = decodedData as Record<string, unknown>
    
    // For nevent and naddr, check the kind
    if (typeof data.kind === 'number') {
      // NIP-51 course lists
      if (data.kind === 30004) return 'course'
      // NIP-23 free content or NIP-99 paid content
      if (data.kind === 30023 || data.kind === 30402) return 'resource'
    }
    
    // For naddr, check the identifier pattern
    if (typeof data.identifier === 'string') {
      if (data.identifier.startsWith('course-')) return 'course'
      if (data.identifier.startsWith('resource-')) return 'resource'
      if (data.identifier.startsWith('lesson-')) return 'lesson'
    }
  }
  
  return 'unknown'
}

/**
 * Resolves a universal ID to a format usable for data queries
 */
export function resolveUniversalId(id: string): UniversalIdResult {
  const originalId = id.trim()
  
  // Handle database IDs
  if (isDatabaseId(originalId)) {
    return {
      resolvedId: originalId,
      idType: 'database',
      originalId,
      contentType: extractContentType(originalId)
    }
  }
  
  // Handle hex IDs
  if (isHexId(originalId)) {
    return {
      resolvedId: originalId,
      idType: 'hex',
      originalId,
      contentType: 'unknown' // Can't determine type from hex alone
    }
  }
  
  // Handle NIP-19 entities
  if (isNip19Entity(originalId)) {
    try {
      const decoded = decode(originalId as `${string}1${string}`)
      
      let resolvedId: string
      const decodedData: unknown = decoded.data
      
      switch (decoded.type) {
        case 'npub':
        case 'nsec':
          // Public/private keys - use the hex key as resolved ID
          resolvedId = decoded.data as string
          break
          
        case 'note':
          // Note ID - use the hex event ID as resolved ID
          resolvedId = decoded.data as string
          break
          
        case 'nevent':
          // Event with metadata - use the event ID as resolved ID
          resolvedId = (decoded.data as unknown as Record<string, unknown>).id as string
          break
          
        case 'naddr':
          // Addressable event - use the identifier as resolved ID
          resolvedId = ((decoded.data as unknown as Record<string, unknown>).identifier as string) || originalId
          break
          
        case 'nprofile':
          // Profile with metadata - use the pubkey as resolved ID
          resolvedId = (decoded.data as unknown as Record<string, unknown>).pubkey as string
          break
          
        default:
          // Fallback to original ID
          resolvedId = originalId
      }
      
      return {
        resolvedId,
        idType: decoded.type as 'npub' | 'nsec' | 'note' | 'nevent' | 'naddr' | 'nprofile',
        originalId,
        decodedData,
        contentType: extractContentType(resolvedId, decodedData)
      }
    } catch (error) {
      console.error('Failed to decode NIP-19 entity:', error)
      // Fallback: treat as database ID
      return {
        resolvedId: originalId,
        idType: 'database',
        originalId,
        contentType: extractContentType(originalId)
      }
    }
  }
  
  // Fallback: treat as database ID
  return {
    resolvedId: originalId,
    idType: 'database',
    originalId,
    contentType: extractContentType(originalId)
  }
}

/**
 * Determines the appropriate route path based on content type and ID
 */
export function getRoutePath(result: UniversalIdResult): string {
  const { contentType, resolvedId } = result
  
  switch (contentType) {
    case 'course':
      return `/courses/${resolvedId}`
    case 'resource':
      return `/content/${resolvedId}`
    case 'lesson':
      // For lessons, we need course context - this might need additional logic
      return `/content/${resolvedId}`
    default:
      // Default to content route for unknown types
      return `/content/${resolvedId}`
  }
}

/**
 * High-level function to get route for any universal ID
 */
export function getUniversalRoute(id: string): string {
  const result = resolveUniversalId(id)
  return getRoutePath(result)
}

/**
 * Hook-friendly version for use in React components
 */
export function useUniversalRouter(id: string) {
  const result = resolveUniversalId(id)
  const route = getRoutePath(result)
  
  return {
    ...result,
    route,
    isValidId: result.idType !== 'database' || isDatabaseId(id),
    canRoute: result.contentType !== 'unknown'
  }
}

/**
 * Utility to check if an ID is valid for routing
 */
export function isValidUniversalId(id: string): boolean {
  try {
    const result = resolveUniversalId(id)
    return result.idType !== 'database' || isDatabaseId(id)
  } catch {
    return false
  }
}

/**
 * Utility to normalize IDs for consistent comparison
 */
export function normalizeId(id: string): string {
  const result = resolveUniversalId(id)
  return result.resolvedId
}

/**
 * Utility to extract all possible IDs from NIP-19 entities for search
 */
export function extractAllIds(id: string): string[] {
  const result = resolveUniversalId(id)
  const ids = [result.resolvedId, result.originalId]
  
  // Add additional IDs from decoded data
  if (result.decodedData && typeof result.decodedData === 'object' && result.decodedData !== null) {
    const data = result.decodedData as Record<string, unknown>
    if (typeof data.id === 'string') ids.push(data.id)
    if (typeof data.pubkey === 'string') ids.push(data.pubkey)
    if (typeof data.identifier === 'string') ids.push(data.identifier)
  }
  
  // Remove duplicates
  return [...new Set(ids)]
}