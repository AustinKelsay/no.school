/**
 * Document domain mock data
 * Minimal Resource database fields only - UI data comes from Nostr events
 * Based on content_data_models.md Resource model
 */

import type { Resource } from '../types'

// Mock user IDs (same as in courses/mock-courses.ts)
export const mockUserIds = {
  austinKelsay: 'f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741',
  alexJohnson: '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e',
  mariaSantos: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
  davidWilson: '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa',
  sarahLee: '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
  mikeTaylor: '91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3',
  sarahChen: 'user-sarah-chen',
  mikeRodriguez: 'user-mike-rodriguez',
  lisaPark: 'user-lisa-park',
  davidKim: 'user-david-kim',
  emilyWatson: 'user-emily-watson',
  jackMorrison: 'user-jack-morrison',
  annaLee: 'user-anna-lee'
}

// ============================================================================
// DATABASE RESOURCE DATA (Documents - Minimal fields only)
// ============================================================================

export const dbDocumentsMockData: Resource[] = [
  // PlebDevs Starter Course Lessons (as resources)
  {
    id: 'f93827ed-68ad-4b5e-af33-f7424b37f0d6',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: 'd3ac1f40bf07c045e97c43b6cbdf6f274de464d1c9d5a5c04d04d50fc12156c0',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '6d8260b3-c902-46ec-8aed-f3b8c8f1229b',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: 'git-github-lesson-event-id',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '80aac9d4-8bef-4a92-9ee9-dea1c2d66c3a',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: 'bitcoin-fundamentals-event-id',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: '6fe3cb4b-2571-4e3b-9159-db78325ee5cc',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: 'lightning-basics-event-id',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
  {
    id: 'e5399c72-9b95-46d6-a594-498e673b6c58',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: 'javascript-fundamentals-event-id',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'a3083ab5-0187-4b77-83d1-29ae1f644559',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: 'nostr-fundamentals-event-id',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },

  // Free document resources
  {
    id: 'e25f3d3b-f28b-4edd-a325-380564e6db7d',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: '758149694299ce464c299f9b97a2c6a3e94536eeeeb939fa981d3b09dbf1cf11',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-21T15:00:00Z',
  },
  {
    id: 'bitcoin-fundamentals',
    userId: mockUserIds.alexJohnson,
    price: 0,
    noteId: 'bitcoin-fundamentals-event-id',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-21T15:00:00Z',
  },
  {
    id: 'lightning-basics',
    userId: mockUserIds.alexJohnson,
    price: 0,
    noteId: 'lightning-basics-event-id',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
  {
    id: 'nostr-fundamentals',
    userId: mockUserIds.jackMorrison,
    price: 0,
    noteId: 'nostr-fundamentals-event-id',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },

  // Paid document resources
  {
    id: 'bitcoin-api-integration',
    userId: mockUserIds.lisaPark,
    price: 8000,
    noteId: 'bitcoin-api-integration-event',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: 'advanced-bitcoin-dev',
    userId: mockUserIds.mikeTaylor,
    price: 32000,
    noteId: 'advanced-bitcoin-dev-event',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
  {
    id: 'bitcoin-js-integration',
    userId: mockUserIds.alexJohnson,
    price: 24000,
    noteId: 'bitcoin-js-integration-event',
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-24T00:00:00Z',
  }
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get document by ID
 */
export function getDocumentById(id: string): Resource | undefined {
  return dbDocumentsMockData.find(doc => doc.id === id)
}

/**
 * Get documents by category (requires parsing Nostr events)
 */
export function getDocumentsByCategory(category: string): Resource[] {
  // This would need to be implemented with Nostr event parsing
  // For now, returning all documents
  return dbDocumentsMockData
}

/**
 * Get documents by type (requires parsing Nostr events)
 */
export function getDocumentsByType(type: string): Resource[] {
  // This would need to be implemented with Nostr event parsing
  // For now, returning all documents
  return dbDocumentsMockData
}

/**
 * Get free documents
 */
export function getFreeDocuments(): Resource[] {
  return dbDocumentsMockData.filter(doc => doc.price === 0)
}

/**
 * Get paid documents
 */
export function getPaidDocuments(): Resource[] {
  return dbDocumentsMockData.filter(doc => doc.price > 0)
}

/**
 * Get documents by difficulty (requires parsing Nostr events)
 */
export function getDocumentsByDifficulty(difficulty: string): Resource[] {
  // This would need to be implemented with Nostr event parsing
  // For now, returning all documents
  return dbDocumentsMockData
}

/**
 * Get documents by user ID
 */
export function getDocumentsByUserId(userId: string): Resource[] {
  return dbDocumentsMockData.filter(doc => doc.userId === userId)
}