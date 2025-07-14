/**
 * Resource domain mock data
 * Contains all resource-related data (videos + documents) matching the database schema
 * Based on content_data_models.md Resource model
 */

import type { Resource } from '../types'

// Mock user IDs and instructor pubkeys (consistent with courses)
export const mockUserIds = {
  alexJohnson: 'user_7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e',
  mariaSantos: 'user_3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
  davidWilson: 'user_67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa',
  sarahLee: 'user_82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
  mikeTaylor: 'user_91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3'
}

export const mockInstructorPubkeys = {
  alexJohnson: '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e',
  mariaSantos: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
  davidWilson: '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa',
  sarahLee: '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
  mikeTaylor: '91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3'
}

// ============================================================================
// RESOURCE DATA (Primary Data Source)
// ============================================================================

export const resourcesMockData: Resource[] = [
  // ============================================================================
  // LESSON RESOURCES (referenced by courses)
  // ============================================================================
  
  // Bitcoin Fundamentals (Free lesson)
  {
    // Database fields (from Prisma schema)
    id: 'resource-bitcoin-fundamentals',
    userId: mockUserIds.alexJohnson,
    price: 0,
    noteId: 'resource-bitcoin-fundamentals-note',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    
    // UI fields
    title: 'Bitcoin Fundamentals',
    description: 'Learn the core concepts of Bitcoin including blockchain, proof of work, and the UTXO model.',
    category: 'bitcoin',
    type: 'document',
    instructor: 'Alex Johnson',
    instructorPubkey: mockInstructorPubkeys.alexJohnson,
    rating: 4.8,
    viewCount: 3247,
    isPremium: false,
    currency: 'sats',
    image: '/images/lessons/bitcoin-fundamentals.jpg',
    tags: ['bitcoin', 'fundamentals', 'blockchain'],
    difficulty: 'beginner',
    published: true,
    duration: '45:00'
  },
  
  // Lightning Network Basics (Free lesson)
  {
    // Database fields (from Prisma schema)
    id: 'resource-lightning-basics',
    userId: mockUserIds.alexJohnson,
    price: 0,
    noteId: 'resource-lightning-basics-note',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
    
    // UI fields
    title: 'Lightning Network Basics',
    description: 'Understanding Lightning Network fundamentals, payment channels, and routing.',
    category: 'lightning',
    type: 'document',
    instructor: 'Alex Johnson',
    instructorPubkey: mockInstructorPubkeys.alexJohnson,
    rating: 4.7,
    viewCount: 2156,
    isPremium: false,
    currency: 'sats',
    image: '/images/lessons/lightning-basics.jpg',
    tags: ['lightning', 'payments', 'scaling'],
    difficulty: 'intermediate',
    published: true,
    duration: '52:00'
  },
  
  // Advanced Bitcoin Development (Paid lesson)
  {
    // Database fields (from Prisma schema)
    id: 'resource-advanced-bitcoin-dev',
    userId: mockUserIds.alexJohnson,
    price: 25000,
    noteId: 'resource-advanced-bitcoin-dev-note',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    
    // UI fields
    title: 'Advanced Bitcoin Development',
    description: 'Professional-level Bitcoin development including custom scripts, multisig, and Lightning integration.',
    category: 'bitcoin',
    type: 'document',
    instructor: 'Alex Johnson',
    instructorPubkey: mockInstructorPubkeys.alexJohnson,
    rating: 4.9,
    viewCount: 892,
    isPremium: true,
    currency: 'sats',
    image: '/images/lessons/advanced-bitcoin-dev.jpg',
    tags: ['bitcoin', 'advanced', 'development', 'professional'],
    difficulty: 'advanced',
    published: true,
    duration: '90:00'
  },
  
  // Nostr Protocol Fundamentals (Free lesson)
  {
    // Database fields (from Prisma schema)
    id: 'resource-nostr-fundamentals',
    userId: mockUserIds.mariaSantos,
    price: 0,
    noteId: 'resource-nostr-fundamentals-note',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
    
    // UI fields
    title: 'Nostr Protocol Fundamentals',
    description: 'Complete guide to understanding and implementing the Nostr protocol.',
    category: 'nostr',
    type: 'document',
    instructor: 'Maria Santos',
    instructorPubkey: mockInstructorPubkeys.mariaSantos,
    rating: 4.6,
    viewCount: 1834,
    isPremium: false,
    currency: 'sats',
    image: '/images/lessons/nostr-fundamentals.jpg',
    tags: ['nostr', 'protocol', 'decentralized'],
    difficulty: 'beginner',
    published: true,
    duration: '38:00'
  },
  
  // ============================================================================
  // STANDALONE DOCUMENT RESOURCES
  // ============================================================================
  
  // Bitcoin Development Cheatsheet (Free)
  {
    // Database fields (from Prisma schema)
    id: 'resource-bitcoin-cheatsheet',
    userId: mockUserIds.alexJohnson,
    price: 0,
    noteId: 'resource-bitcoin-cheatsheet-note',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-21T15:00:00Z',
    
    // UI fields
    title: 'Bitcoin Development Cheatsheet',
    description: 'Quick reference for Bitcoin Core development including RPC commands, data structures, and common patterns.',
    category: 'bitcoin',
    type: 'cheatsheet',
    instructor: 'Alex Johnson',
    instructorPubkey: mockInstructorPubkeys.alexJohnson,
    rating: 4.7,
    viewCount: 1247,
    isPremium: false,
    currency: 'sats',
    image: '/images/documents/bitcoin-cheatsheet.jpg',
    tags: ['bitcoin', 'development', 'rpc', 'core', 'reference'],
    difficulty: 'intermediate',
    published: true
  },
  
  // Lightning Network API Reference (Free)
  {
    // Database fields (from Prisma schema)
    id: 'resource-lightning-api-reference',
    userId: mockUserIds.sarahLee,
    price: 0,
    noteId: 'resource-lightning-api-reference-note',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-19T09:00:00Z',
    
    // UI fields
    title: 'Lightning Network API Reference',
    description: 'Complete API documentation for Lightning Network development including LND, c-lightning, and Eclair.',
    category: 'lightning',
    type: 'reference',
    instructor: 'Sarah Lee',
    instructorPubkey: mockInstructorPubkeys.sarahLee,
    rating: 4.8,
    viewCount: 1456,
    isPremium: false,
    currency: 'sats',
    image: '/images/documents/lightning-api-ref.jpg',
    tags: ['lightning', 'api', 'reference', 'lnd', 'development'],
    difficulty: 'intermediate',
    published: true
  },
  
  // Bitcoin Script Programming Reference (Paid)
  {
    // Database fields (from Prisma schema)
    id: 'resource-bitcoin-script-reference',
    userId: mockUserIds.davidWilson,
    price: 15000,
    noteId: 'resource-bitcoin-script-reference-note',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
    
    // UI fields
    title: 'Bitcoin Script Programming Reference',
    description: 'Complete reference manual for Bitcoin Script programming with advanced patterns and real-world examples.',
    category: 'bitcoin',
    type: 'reference',
    instructor: 'David Wilson',
    instructorPubkey: mockInstructorPubkeys.davidWilson,
    rating: 4.9,
    viewCount: 634,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/bitcoin-script-ref.jpg',
    tags: ['bitcoin', 'script', 'programming', 'reference', 'advanced'],
    difficulty: 'advanced',
    published: true
  },
  
  // ============================================================================
  // VIDEO RESOURCES
  // ============================================================================
  
  // Bitcoin Transaction Tutorial (Free)
  {
    // Database fields (from Prisma schema)
    id: 'resource-bitcoin-transaction-tutorial',
    userId: mockUserIds.alexJohnson,
    price: 0,
    noteId: 'resource-bitcoin-transaction-tutorial-note',
    videoId: 'bitcoin-transaction-video',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-23T15:00:00Z',
    
    // UI fields
    title: 'Bitcoin Transaction Deep Dive',
    description: 'Visual explanation of Bitcoin transactions, UTXO model, and confirmation process.',
    category: 'bitcoin',
    type: 'video',
    instructor: 'Alex Johnson',
    instructorPubkey: mockInstructorPubkeys.alexJohnson,
    rating: 4.8,
    viewCount: 3247,
    isPremium: false,
    currency: 'sats',
    image: '/images/videos/bitcoin-transaction-thumb.jpg',
    tags: ['bitcoin', 'transactions', 'blockchain', 'tutorial'],
    difficulty: 'intermediate',
    published: true,
    duration: '25:30',
    thumbnailUrl: '/images/videos/bitcoin-transaction-thumb.jpg',
    videoUrl: '/videos/bitcoin-transaction-tutorial.mp4'
  },
  
  // Lightning Network Node Management (Paid)
  {
    // Database fields (from Prisma schema)
    id: 'resource-lightning-node-management',
    userId: mockUserIds.sarahLee,
    price: 35000,
    noteId: 'resource-lightning-node-management-note',
    videoId: 'lightning-node-management-video',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
    
    // UI fields
    title: 'Lightning Network Node Management',
    description: 'Professional Lightning Network node operations including setup, management, and optimization.',
    category: 'lightning',
    type: 'video',
    instructor: 'Sarah Lee',
    instructorPubkey: mockInstructorPubkeys.sarahLee,
    rating: 4.7,
    viewCount: 1234,
    isPremium: true,
    currency: 'sats',
    image: '/images/videos/lightning-node-thumb.jpg',
    tags: ['lightning', 'node', 'management', 'professional', 'operations'],
    difficulty: 'advanced',
    published: true,
    duration: '2:55:00',
    thumbnailUrl: '/images/videos/lightning-node-thumb.jpg',
    videoUrl: '/videos/lightning-node-management.mp4'
  },
  
  // Nostr Client Development (Free)
  {
    // Database fields (from Prisma schema)
    id: 'resource-nostr-client-development',
    userId: mockUserIds.mariaSantos,
    price: 0,
    noteId: 'resource-nostr-client-development-note',
    videoId: 'nostr-client-development-video',
    createdAt: '2024-01-19T11:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z',
    
    // UI fields
    title: 'Building Nostr Clients',
    description: 'Learn to build Nostr clients from scratch with practical examples and best practices.',
    category: 'nostr',
    type: 'video',
    instructor: 'Maria Santos',
    instructorPubkey: mockInstructorPubkeys.mariaSantos,
    rating: 4.6,
    viewCount: 1987,
    isPremium: false,
    currency: 'sats',
    image: '/images/videos/nostr-client-thumb.jpg',
    tags: ['nostr', 'client', 'development', 'tutorial'],
    difficulty: 'intermediate',
    published: true,
    duration: '45:15',
    thumbnailUrl: '/images/videos/nostr-client-thumb.jpg',
    videoUrl: '/videos/nostr-client-development.mp4'
  },
  
  // Frontend Bitcoin Apps (Paid)
  {
    // Database fields (from Prisma schema)
    id: 'resource-frontend-bitcoin-apps',
    userId: mockUserIds.davidWilson,
    price: 28000,
    noteId: 'resource-frontend-bitcoin-apps-note',
    videoId: 'frontend-bitcoin-apps-video',
    createdAt: '2024-01-16T13:00:00Z',
    updatedAt: '2024-01-16T13:00:00Z',
    
    // UI fields
    title: 'Frontend Bitcoin App Development',
    description: 'Build beautiful React applications that integrate with Bitcoin and Lightning Network.',
    category: 'frontend',
    type: 'video',
    instructor: 'David Wilson',
    instructorPubkey: mockInstructorPubkeys.davidWilson,
    rating: 4.9,
    viewCount: 967,
    isPremium: true,
    currency: 'sats',
    image: '/images/videos/frontend-bitcoin-thumb.jpg',
    tags: ['frontend', 'react', 'bitcoin', 'lightning', 'ui'],
    difficulty: 'intermediate',
    published: true,
    duration: '1:45:30',
    thumbnailUrl: '/images/videos/frontend-bitcoin-thumb.jpg',
    videoUrl: '/videos/frontend-bitcoin-apps.mp4'
  }
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getResourceById(id: string): Resource | undefined {
  return resourcesMockData.find(resource => resource.id === id)
}

export function getResourcesByCategory(category: string): Resource[] {
  return resourcesMockData.filter(resource => resource.category === category)
}

export function getResourcesByType(type: Resource['type']): Resource[] {
  return resourcesMockData.filter(resource => resource.type === type)
}

export function getDocumentResources(): Resource[] {
  return resourcesMockData.filter(resource => 
    resource.type === 'document' || 
    resource.type === 'guide' || 
    resource.type === 'cheatsheet' || 
    resource.type === 'reference' || 
    resource.type === 'tutorial' || 
    resource.type === 'documentation'
  )
}

export function getVideoResources(): Resource[] {
  return resourcesMockData.filter(resource => resource.type === 'video')
}

export function getFreeResources(): Resource[] {
  return resourcesMockData.filter(resource => resource.price === 0)
}

export function getPaidResources(): Resource[] {
  return resourcesMockData.filter(resource => resource.price > 0)
}

export function getResourcesByDifficulty(difficulty: Resource['difficulty']): Resource[] {
  return resourcesMockData.filter(resource => resource.difficulty === difficulty)
}

export function getResourcesByInstructor(instructorPubkey: string): Resource[] {
  return resourcesMockData.filter(resource => resource.instructorPubkey === instructorPubkey)
}

export function searchResources(query: string): Resource[] {
  const lowerQuery = query.toLowerCase()
  return resourcesMockData.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.description.toLowerCase().includes(lowerQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    resource.instructor.toLowerCase().includes(lowerQuery)
  )
}

export function getResourcesByTags(tags: string[]): Resource[] {
  return resourcesMockData.filter(resource => 
    tags.some(tag => resource.tags.includes(tag))
  )
} 