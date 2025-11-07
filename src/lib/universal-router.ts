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

import { Prefix, type AddressData, type EventData, type ProfileData } from "snstr"
import { isNip19String, tryDecodeNip19Entity, type SafeDecodedEntity } from "@/lib/nip19-utils"

export interface UniversalIdResult {
  /** The resolved identifier that can be used for data queries */
  resolvedId: string
  /** The type of ID that was provided */
  idType: 'database' | 'hex' | 'npub' | 'nsec' | 'note' | 'nevent' | 'naddr' | 'nprofile'
  /** The original input ID */
  originalId: string
  /** For NIP-19 entities, the decoded data */
  decodedData?: SafeDecodedEntity["data"]
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
/**
 * Extracts the content type from various ID formats
 */
function extractContentType(id: string, decodedData?: SafeDecodedEntity["data"]): 'course' | 'resource' | 'lesson' | 'unknown' {
  // Check database ID patterns
  if (id.startsWith('course-')) return 'course'
  if (id.startsWith('resource-')) return 'resource'
  if (id.startsWith('lesson-')) return 'lesson'
  
  // Check decoded NIP-19 data
  if (decodedData && typeof decodedData === 'object') {
    // Type guard for EventData
    if ('kind' in decodedData && typeof decodedData.kind === 'number') {
      const eventData = decodedData as EventData
      // NIP-51 course lists
      if (eventData.kind === 30004) return 'course'
      // NIP-23 free content or NIP-99 paid content
      if (eventData.kind === 30023 || eventData.kind === 30402) return 'resource'
    }
    
    // Type guard for AddressData
    if ('identifier' in decodedData && typeof decodedData.identifier === 'string') {
      const addressData = decodedData as AddressData
      if (addressData.identifier.startsWith('course-')) return 'course'
      if (addressData.identifier.startsWith('resource-')) return 'resource'
      if (addressData.identifier.startsWith('lesson-')) return 'lesson'
    }
  }
  
  return 'unknown'
}

/**
 * Resolves a universal ID to a format usable for data queries
 */
export function resolveUniversalId(id: string): UniversalIdResult | null {
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
  if (isNip19String(originalId)) {
    const decoded = tryDecodeNip19Entity(originalId)

    if (decoded) {
      if (decoded.type === Prefix.PrivateKey) {
        console.warn('Ignored unsupported nsec identifier in resolveUniversalId')
        return null
      }

      const { resolvedId, idType } = determineResolvedId(originalId, decoded)
      const decodedData = decoded.data

      return {
        resolvedId,
        idType,
        originalId,
        decodedData,
        contentType: extractContentType(resolvedId, decodedData)
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

function determineResolvedId(originalId: string, decoded: SafeDecodedEntity): { resolvedId: string; idType: UniversalIdResult["idType"] } {
  switch (decoded.type) {
    case Prefix.PublicKey:
      return { resolvedId: decoded.data, idType: decoded.type }
    case Prefix.Note:
      return { resolvedId: decoded.data, idType: decoded.type }
    case Prefix.Event:
      return {
        resolvedId: decoded.data.id,
        idType: decoded.type
      }
    case Prefix.Address: {
      const identifier = decoded.data.identifier || originalId
      return {
        resolvedId: identifier,
        idType: decoded.type
      }
    }
    case Prefix.Profile:
      return {
        resolvedId: decoded.data.pubkey,
        idType: decoded.type
      }
    default:
      return {
        resolvedId: originalId,
        idType: 'database'
      }
  }
}

/**
 * Determines the appropriate route path based on content type and ID
 */
export function getRoutePath(result: UniversalIdResult | null): string {
  if (!result) {
    return '/content'
  }
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
  const resolvedResult = resolveUniversalId(id)
  const fallbackResult: UniversalIdResult = {
    resolvedId: id,
    idType: 'database',
    originalId: id,
    contentType: extractContentType(id)
  }
  const result = resolvedResult ?? fallbackResult
  const route = getRoutePath(resolvedResult)
  
  return {
    ...result,
    route,
    isValidId: Boolean(resolvedResult) && (resolvedResult.idType !== 'database' || isDatabaseId(id)),
    canRoute: Boolean(resolvedResult) && resolvedResult.contentType !== 'unknown'
  }
}

/**
 * Utility to check if an ID is valid for routing
 */
export function isValidUniversalId(id: string): boolean {
  try {
    const result = resolveUniversalId(id)
    return Boolean(result && (result.idType !== 'database' || isDatabaseId(id)))
  } catch {
    return false
  }
}

/**
 * Utility to normalize IDs for consistent comparison
 */
export function normalizeId(id: string): string {
  const result = resolveUniversalId(id)
  if (!result) {
    return id.trim()
  }
  return result.resolvedId
}

/**
 * Utility to extract all possible IDs from NIP-19 entities for search
 */
export function extractAllIds(id: string): string[] {
  const result = resolveUniversalId(id)
  const trimmed = id.trim()
  if (!result) {
    return trimmed ? [trimmed] : []
  }

  const ids = [result.resolvedId, result.originalId]
  
  // Add additional IDs from decoded data
  if (result.decodedData && typeof result.decodedData === 'object' && result.decodedData !== null) {
    // Type guard for EventData
    if ('id' in result.decodedData) {
      const eventData = result.decodedData as EventData
      if (eventData.id) ids.push(eventData.id)
    }
    // Type guard for ProfileData or AddressData (both have pubkey)
    if ('pubkey' in result.decodedData) {
      const profileOrAddress = result.decodedData as ProfileData | AddressData
      if (profileOrAddress.pubkey) ids.push(profileOrAddress.pubkey)
    }
    // Type guard for AddressData (has identifier)
    if ('identifier' in result.decodedData) {
      const addressData = result.decodedData as AddressData
      if (addressData.identifier) ids.push(addressData.identifier)
    }
  }
  
  // Remove duplicates
  return [...new Set(ids)]
}
