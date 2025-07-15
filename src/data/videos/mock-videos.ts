/**
 * Video domain mock data
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
  sarahChen: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  mikeRodriguez: 'b2c3d4e5f678901234567890123456789012345678901234567890abcdef1234',
  lisaPark: 'c3d4e5f6789012345678901234567890123456789012345678901234567890ab',
  davidKim: 'd4e5f6789012345678901234567890123456789012345678901234567890abcd',
  emilyWatson: 'e5f6789012345678901234567890123456789012345678901234567890abcdef',
  jackMorrison: 'f6789012345678901234567890123456789012345678901234567890abcdef12',
  annaLee: '789012345678901234567890123456789012345678901234567890abcdef1234',
  kevinZhang: '890123456789012345678901234567890123456789012345678901234567890a',
  lauraMartinez: '901234567890123456789012345678901234567890123456789012345678901',
  robertChen: 'a01234567890123456789012345678901234567890123456789012345678901',
  amyFoster: 'b01234567890123456789012345678901234567890123456789012345678901',
  alexBlockchain: 'c01234567890123456789012345678901234567890123456789012345678901'
}

// ============================================================================
// DATABASE RESOURCE DATA (Videos - Minimal fields only)
// ============================================================================

export const dbVideosMockData: Resource[] = [
  // Free videos - Lightning Workshop (matches real Nostr event)
  {
    id: '6e138ca7-fa4f-470c-9146-fec270a9688e',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: 'abd1b6682aaccbaf4260b0da05db07caa30977f663e33eb36eacc56d85e62fa7',
    videoId: 'M_tVo_9OUIs',
    createdAt: '2024-01-26T10:00:00Z',
    updatedAt: '2024-01-26T10:00:00Z',
  },

  // Bitcoin fundamentals video
  {
    id: 'video-bitcoin-fundamentals',
    userId: mockUserIds.alexJohnson,
    price: 0,
    noteId: 'bitcoin-fundamentals-event-id',
    videoId: 'bitcoin-fundamentals-video',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },

  // Lightning Network intro video
  {
    id: 'video-lightning-intro',
    userId: mockUserIds.mariaSantos,
    price: 0,
    noteId: 'lightning-basics-event-id',
    videoId: 'lightning-intro-video',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },

  // Nostr basics video
  {
    id: 'video-nostr-basics',
    userId: mockUserIds.jackMorrison,
    price: 0,
    noteId: 'nostr-fundamentals-event-id',
    videoId: 'nostr-basics-video',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },

  // Git & GitHub tutorial video
  {
    id: 'video-git-github',
    userId: mockUserIds.austinKelsay,
    price: 0,
    noteId: 'git-github-lesson-event-id',
    videoId: 'git-github-video',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },

  // Bitcoin node setup video
  {
    id: 'video-bitcoin-node-setup',
    userId: mockUserIds.mikeRodriguez,
    price: 0,
    noteId: 'bitcoin-node-setup-event',
    videoId: 'bitcoin-node-setup-video',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },

  // Lightning commands video
  {
    id: 'video-lightning-commands',
    userId: mockUserIds.emilyWatson,
    price: 0,
    noteId: 'lightning-commands-event',
    videoId: 'lightning-commands-video',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },

  // Paid videos (referencing existing paid events)
  {
    id: 'video-advanced-bitcoin-dev',
    userId: mockUserIds.alexJohnson,
    price: 25000,
    noteId: 'advanced-bitcoin-dev-event',
    videoId: 'advanced-bitcoin-dev-video',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },

  {
    id: 'video-lightning-payment-flows',
    userId: mockUserIds.davidKim,
    price: 18000,
    noteId: 'lightning-payment-flows-event',
    videoId: 'lightning-payment-flows-video',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },

  {
    id: 'video-bitcoin-api-integration',
    userId: mockUserIds.lisaPark,
    price: 15000,
    noteId: 'bitcoin-api-integration-event',
    videoId: 'bitcoin-api-integration-video',
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z',
  },

  {
    id: 'video-nostr-relay-dev',
    userId: mockUserIds.mariaSantos,
    price: 20000,
    noteId: 'nostr-relay-dev-event',
    videoId: 'nostr-relay-dev-video',
    createdAt: '2024-01-24T10:00:00Z',
    updatedAt: '2024-01-24T10:00:00Z',
  },

  {
    id: 'video-web3-security',
    userId: mockUserIds.mikeTaylor,
    price: 30000,
    noteId: 'web3-security-event',
    videoId: 'web3-security-video',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
  }
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get video by ID
 */
export function getVideoById(id: string): Resource | undefined {
  return dbVideosMockData.find(video => video.id === id)
}

/**
 * Get videos by category (requires parsing Nostr events)
 */
export function getVideosByCategory(category: string): Resource[] {
  // This would need to be implemented with Nostr event parsing
  // For now, returning all videos
  return dbVideosMockData
}

/**
 * Get free videos
 */
export function getFreeVideos(): Resource[] {
  return dbVideosMockData.filter(video => video.price === 0)
}

/**
 * Get paid videos
 */
export function getPaidVideos(): Resource[] {
  return dbVideosMockData.filter(video => video.price > 0)
}

/**
 * Get videos by user ID
 */
export function getVideosByUserId(userId: string): Resource[] {
  return dbVideosMockData.filter(video => video.userId === userId)
}

/**
 * Get videos by difficulty (requires parsing Nostr events)
 */
export function getVideosByDifficulty(difficulty: string): Resource[] {
  // This would need to be implemented with Nostr event parsing
  // For now, returning all videos
  return dbVideosMockData
}

/**
 * Get videos by duration (requires parsing Nostr events)
 */
export function getVideosByDuration(duration: string): Resource[] {
  // This would need to be implemented with Nostr event parsing
  // For now, returning all videos
  return dbVideosMockData
} 