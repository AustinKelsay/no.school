/**
 * Document domain mock data
 * Contains all document-related data structures and samples
 * Represents NIP-23 (free) and NIP-99 (paid) content events
 */

import type { Resource } from '../types'

// ============================================================================
// DATABASE-STYLE DOCUMENT DATA (Primary Data Source)
// ============================================================================

export const dbDocumentsMockData: Resource[] = [
  // Bitcoin Documents
  {
    id: 'doc-1',
    userId: 'user-alex-johnson',
    price: 0,
    noteId: 'doc-1-note',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-21T15:00:00Z',
    title: 'Bitcoin Development Cheatsheet',
    description: 'Quick reference for Bitcoin Core development including RPC commands, data structures, and common patterns. Essential commands for working with bitcoind, wallet operations, and blockchain queries.',
    category: 'bitcoin',
    type: 'cheatsheet',
    instructor: 'Alex Johnson',
    instructorPubkey: 'npub1alexjohnson1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.7,
    viewCount: 1247,
    isPremium: false,
    image: '/images/documents/bitcoin-cheatsheet.jpg',
    tags: ['bitcoin', 'development', 'rpc', 'core', 'reference'],
    difficulty: 'intermediate',
    published: true
  },
  {
    id: 'doc-2',
    userId: 'user-sarah-chen',
    price: 15000,
    noteId: 'doc-2-note',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    title: 'Bitcoin Script Deep Dive',
    description: 'Comprehensive guide to Bitcoin Script - the stack-based programming language used in Bitcoin transactions. Learn opcodes, script patterns, and security considerations.',
    category: 'bitcoin',
    type: 'guide',
    instructor: 'Sarah Chen',
    instructorPubkey: 'npub1sarahchen1234567890abcdef1234567890abcdef1234567890abcdef123',
    rating: 4.9,
    viewCount: 892,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/bitcoin-script.jpg',
    tags: ['bitcoin', 'script', 'opcodes', 'transactions', 'programming'],
    difficulty: 'advanced',
    published: true
  },
  {
    id: 'doc-3',
    userId: 'user-mike-rodriguez',
    price: 0,
    noteId: 'doc-3-note',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    title: 'Setting Up Your First Bitcoin Node',
    description: 'Step-by-step tutorial for setting up and running a Bitcoin full node. Covers installation, configuration, initial sync, and ongoing maintenance.',
    category: 'bitcoin',
    type: 'tutorial',
    instructor: 'Mike Rodriguez',
    instructorPubkey: 'npub1mikerodriguez1234567890abcdef1234567890abcdef1234567890abcdef',
    rating: 4.5,
    viewCount: 2341,
    isPremium: false,
    image: '/images/documents/bitcoin-node-setup.jpg',
    tags: ['bitcoin', 'node', 'setup', 'tutorial', 'infrastructure'],
    difficulty: 'beginner',
    published: true
  },
  {
    id: 'doc-4',
    userId: 'user-lisa-park',
    price: 8000,
    noteId: 'doc-4-note',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    title: 'Bitcoin Core API Reference',
    description: 'Complete reference documentation for Bitcoin Core JSON-RPC API. Includes all endpoints, parameters, return values, and practical examples.',
    category: 'bitcoin',
    type: 'reference',
    instructor: 'Lisa Park',
    instructorPubkey: 'npub1lisapark1234567890abcdef1234567890abcdef1234567890abcdef1234',
    rating: 4.8,
    viewCount: 1567,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/bitcoin-api-reference.jpg',
    tags: ['bitcoin', 'api', 'rpc', 'reference', 'documentation'],
    difficulty: 'intermediate',
    published: true
  },

  // Lightning Network Documents
  {
    id: 'doc-5',
    userId: 'user-maria-santos',
    price: 25000,
    noteId: 'doc-5-note',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    title: 'Lightning Network Implementation Guide',
    description: 'Comprehensive guide to implementing Lightning Network features in your applications. Covers LND integration, channel management, and payment flows.',
    category: 'lightning',
    type: 'guide',
    instructor: 'Maria Santos',
    instructorPubkey: 'npub1mariasantos1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.9,
    viewCount: 1892,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/lightning-guide.jpg',
    tags: ['lightning', 'implementation', 'guide', 'payments', 'lnd'],
    difficulty: 'advanced',
    published: true
  },
  {
    id: 'doc-6',
    userId: 'user-david-kim',
    price: 0,
    noteId: 'doc-6-note',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
    title: 'Lightning Network Routing Algorithms',
    description: 'Deep dive into pathfinding and routing algorithms used in Lightning Network. Understanding how payments find their way across the network.',
    category: 'lightning',
    type: 'documentation',
    instructor: 'David Kim',
    instructorPubkey: 'npub1davidkim1234567890abcdef1234567890abcdef1234567890abcdef123',
    rating: 4.6,
    viewCount: 743,
    isPremium: false,
    image: '/images/documents/lightning-routing.jpg',
    tags: ['lightning', 'routing', 'pathfinding', 'algorithms', 'network'],
    difficulty: 'advanced',
    published: true
  },
  {
    id: 'doc-7',
    userId: 'user-emily-watson',
    price: 0,
    noteId: 'doc-7-note',
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
    title: 'Lightning Network Quick Commands',
    description: 'Essential LND, CLN, and Eclair commands for Lightning Network node operators. Quick reference for common operations and troubleshooting.',
    category: 'lightning',
    type: 'cheatsheet',
    instructor: 'Emily Watson',
    instructorPubkey: 'npub1emilywatson1234567890abcdef1234567890abcdef1234567890abcdef1',
    rating: 4.4,
    viewCount: 1156,
    isPremium: false,
    image: '/images/documents/lightning-commands.jpg',
    tags: ['lightning', 'commands', 'lnd', 'cln', 'reference'],
    difficulty: 'beginner',
    published: true
  },

  // Nostr Documents
  {
    id: 'doc-8',
    userId: 'user-jack-morrison',
    price: 0,
    noteId: 'doc-8-note',
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    title: 'Nostr Protocol Fundamentals',
    description: 'Introduction to the Nostr protocol - a simple, open protocol for decentralized social networks. Learn about events, relays, and NIPs.',
    category: 'nostr',
    type: 'guide',
    instructor: 'Jack Morrison',
    instructorPubkey: 'npub1jackmorrison1234567890abcdef1234567890abcdef1234567890abcdef',
    rating: 4.7,
    viewCount: 2890,
    isPremium: false,
    image: '/images/documents/nostr-fundamentals.jpg',
    tags: ['nostr', 'protocol', 'decentralized', 'social', 'fundamentals'],
    difficulty: 'beginner',
    published: true
  },
  {
    id: 'doc-9',
    userId: 'user-anna-lee',
    price: 18000,
    noteId: 'doc-9-note',
    createdAt: '2024-02-02T00:00:00Z',
    updatedAt: '2024-02-04T00:00:00Z',
    title: 'Building Nostr Clients',
    description: 'Complete guide to building Nostr clients from scratch. Covers WebSocket connections, event handling, and user interface patterns.',
    category: 'nostr',
    type: 'tutorial',
    instructor: 'Anna Lee',
    instructorPubkey: 'npub1annalee1234567890abcdef1234567890abcdef1234567890abcdef1234',
    rating: 4.8,
    viewCount: 1234,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/nostr-clients.jpg',
    tags: ['nostr', 'client', 'development', 'websockets', 'ui'],
    difficulty: 'intermediate',
    published: true
  },
  {
    id: 'doc-10',
    userId: 'user-carlos-mendez',
    price: 0,
    noteId: 'doc-10-note',
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-07T00:00:00Z',
    title: 'Nostr NIPs Reference',
    description: 'Comprehensive reference of all Nostr Implementation Possibilities (NIPs). Quick lookup for event kinds, tags, and protocol specifications.',
    category: 'nostr',
    type: 'reference',
    instructor: 'Carlos Mendez',
    instructorPubkey: 'npub1carlosmendez1234567890abcdef1234567890abcdef1234567890abcdef',
    rating: 4.9,
    viewCount: 987,
    isPremium: false,
    image: '/images/documents/nostr-nips.jpg',
    tags: ['nostr', 'nips', 'reference', 'specification', 'protocol'],
    difficulty: 'intermediate',
    published: true
  },

  // Frontend Development Documents
  {
    id: 'doc-11',
    userId: 'user-sophie-turner',
    price: 22000,
    noteId: 'doc-11-note',
    createdAt: '2024-02-08T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    title: 'React Performance Optimization',
    description: 'Advanced techniques for optimizing React applications. Covers memoization, virtualization, code splitting, and performance monitoring.',
    category: 'frontend',
    type: 'guide',
    instructor: 'Sophie Turner',
    instructorPubkey: 'npub1sophieturner1234567890abcdef1234567890abcdef1234567890abcdef',
    rating: 4.8,
    viewCount: 3456,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/react-performance.jpg',
    tags: ['react', 'performance', 'optimization', 'frontend', 'javascript'],
    difficulty: 'advanced',
    published: true
  },
  {
    id: 'doc-12',
    userId: 'user-tom-wilson',
    price: 0,
    noteId: 'doc-12-note',
    createdAt: '2024-02-12T00:00:00Z',
    updatedAt: '2024-02-12T00:00:00Z',
    title: 'CSS Grid Layout Cheatsheet',
    description: 'Quick reference for CSS Grid properties and values. Visual examples of common layout patterns and responsive design techniques.',
    category: 'frontend',
    type: 'cheatsheet',
    instructor: 'Tom Wilson',
    instructorPubkey: 'npub1tomwilson1234567890abcdef1234567890abcdef1234567890abcdef123',
    rating: 4.5,
    viewCount: 2789,
    isPremium: false,
    image: '/images/documents/css-grid.jpg',
    tags: ['css', 'grid', 'layout', 'responsive', 'design'],
    difficulty: 'intermediate',
    published: true
  },
  {
    id: 'doc-13',
    userId: 'user-rachel-green',
    price: 0,
    noteId: 'doc-13-note',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-17T00:00:00Z',
    title: 'Modern JavaScript ES2024 Features',
    description: 'Comprehensive overview of the latest JavaScript features including async/await improvements, decorators, and new array methods.',
    category: 'frontend',
    type: 'documentation',
    instructor: 'Rachel Green',
    instructorPubkey: 'npub1rachelgreen1234567890abcdef1234567890abcdef1234567890abcdef1',
    rating: 4.6,
    viewCount: 1890,
    isPremium: false,
    image: '/images/documents/js-es2024.jpg',
    tags: ['javascript', 'es2024', 'features', 'modern', 'programming'],
    difficulty: 'intermediate',
    published: true
  },

  // Backend Development Documents
  {
    id: 'doc-14',
    userId: 'user-marcus-johnson',
    price: 20000,
    noteId: 'doc-14-note',
    createdAt: '2024-02-18T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    title: 'Node.js API Security Best Practices',
    description: 'Essential security practices for Node.js APIs. Covers authentication, authorization, input validation, and common vulnerability prevention.',
    category: 'backend',
    type: 'guide',
    instructor: 'Marcus Johnson',
    instructorPubkey: 'npub1marcusjohnson1234567890abcdef1234567890abcdef1234567890abcde',
    rating: 4.9,
    viewCount: 2156,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/nodejs-security.jpg',
    tags: ['nodejs', 'security', 'api', 'authentication', 'backend'],
    difficulty: 'advanced',
    published: true
  },
  {
    id: 'doc-15',
    userId: 'user-jennifer-davis',
    price: 0,
    noteId: 'doc-15-note',
    createdAt: '2024-02-22T00:00:00Z',
    updatedAt: '2024-02-24T00:00:00Z',
    title: 'Database Schema Design Patterns',
    description: 'Common database design patterns for web applications. Covers normalization, indexing strategies, and performance considerations.',
    category: 'backend',
    type: 'documentation',
    instructor: 'Jennifer Davis',
    instructorPubkey: 'npub1jenniferdavis1234567890abcdef1234567890abcdef1234567890abcde',
    rating: 4.7,
    viewCount: 1678,
    isPremium: false,
    image: '/images/documents/database-patterns.jpg',
    tags: ['database', 'schema', 'design', 'patterns', 'sql'],
    difficulty: 'intermediate',
    published: true
  },

  // Mobile Development Documents
  {
    id: 'doc-16',
    userId: 'user-kevin-zhang',
    price: 35000,
    noteId: 'doc-16-note',
    createdAt: '2024-02-25T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    title: 'React Native Bitcoin Wallet Tutorial',
    description: 'Step-by-step guide to building a Bitcoin wallet app with React Native. Covers key generation, transaction signing, and security best practices.',
    category: 'mobile',
    type: 'tutorial',
    instructor: 'Kevin Zhang',
    instructorPubkey: 'npub1kevinzhang1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.8,
    viewCount: 1345,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/rn-bitcoin-wallet.jpg',
    tags: ['react-native', 'bitcoin', 'wallet', 'mobile', 'tutorial'],
    difficulty: 'advanced',
    published: true
  },
  {
    id: 'doc-17',
    userId: 'user-laura-martinez',
    price: 0,
    noteId: 'doc-17-note',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-03T00:00:00Z',
    title: 'Mobile App State Management',
    description: 'Comprehensive guide to state management in mobile applications. Covers Redux, Context API, and modern patterns for React Native and Flutter.',
    category: 'mobile',
    type: 'guide',
    instructor: 'Laura Martinez',
    instructorPubkey: 'npub1lauramartinez1234567890abcdef1234567890abcdef1234567890abcd',
    rating: 4.6,
    viewCount: 987,
    isPremium: false,
    image: '/images/documents/mobile-state.jpg',
    tags: ['mobile', 'state-management', 'redux', 'react-native', 'flutter'],
    difficulty: 'intermediate',
    published: true
  },

  // Security Documents
  {
    id: 'doc-18',
    userId: 'user-robert-chen',
    price: 30000,
    noteId: 'doc-18-note',
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-07T00:00:00Z',
    title: 'Cryptographic Key Management',
    description: 'Best practices for managing cryptographic keys in applications. Covers key generation, storage, rotation, and security considerations.',
    category: 'security',
    type: 'guide',
    instructor: 'Dr. Robert Chen',
    instructorPubkey: 'npub1robertchen1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.9,
    viewCount: 765,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/key-management.jpg',
    tags: ['security', 'cryptography', 'keys', 'management', 'best-practices'],
    difficulty: 'advanced',
    published: true
  },
  {
    id: 'doc-19',
    userId: 'user-amy-foster',
    price: 0,
    noteId: 'doc-19-note',
    createdAt: '2024-03-08T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    title: 'Web Application Security Checklist',
    description: 'Comprehensive security checklist for web applications. Covers OWASP Top 10, secure coding practices, and vulnerability assessment.',
    category: 'security',
    type: 'cheatsheet',
    instructor: 'Amy Foster',
    instructorPubkey: 'npub1amyfoster1234567890abcdef1234567890abcdef1234567890abcdef123',
    rating: 4.7,
    viewCount: 2234,
    isPremium: false,
    image: '/images/documents/security-checklist.jpg',
    tags: ['security', 'web', 'checklist', 'owasp', 'vulnerabilities'],
    difficulty: 'intermediate',
    published: true
  },

  // Web3 Documents
  {
    id: 'doc-20',
    userId: 'user-alex-blockchain',
    price: 28000,
    noteId: 'doc-20-note',
    createdAt: '2024-03-12T00:00:00Z',
    updatedAt: '2024-03-14T00:00:00Z',
    title: 'Smart Contract Security Patterns',
    description: 'Common security patterns and anti-patterns in smart contract development. Learn to write secure and gas-efficient contracts.',
    category: 'web3',
    type: 'documentation',
    instructor: 'Alex Blockchain',
    instructorPubkey: 'npub1alexblockchain1234567890abcdef1234567890abcdef1234567890abcd',
    rating: 4.8,
    viewCount: 1456,
    isPremium: true,
    currency: 'sats',
    image: '/images/documents/smart-contract-security.jpg',
    tags: ['web3', 'smart-contracts', 'security', 'solidity', 'ethereum'],
    difficulty: 'advanced',
    published: true
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getDocumentById(id: string): Resource | undefined {
  return dbDocumentsMockData.find(doc => doc.id === id)
}

export function getDocumentsByCategory(category: string): Resource[] {
  return dbDocumentsMockData.filter(doc => 
    doc.category.toLowerCase() === category.toLowerCase()
  )
}

export function getDocumentsByType(type: Resource['type']): Resource[] {
  return dbDocumentsMockData.filter(doc => doc.type === type)
}

export function getFreeDocuments(): Resource[] {
  return dbDocumentsMockData.filter(doc => !doc.isPremium)
}

export function getPaidDocuments(): Resource[] {
  return dbDocumentsMockData.filter(doc => doc.isPremium)
}

export function getDocumentsByDifficulty(difficulty: Resource['difficulty']): Resource[] {
  return dbDocumentsMockData.filter(doc => doc.difficulty === difficulty)
}

export function getDocumentsByInstructor(instructorPubkey: string): Resource[] {
  return dbDocumentsMockData.filter(doc => doc.instructorPubkey === instructorPubkey)
}

export function searchDocuments(query: string): Resource[] {
  const searchTerm = query.toLowerCase()
  return dbDocumentsMockData.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm) ||
    doc.description.toLowerCase().includes(searchTerm) ||
    doc.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
  )
}

export function getDocumentStatistics(documents: Resource[]) {
  const totalDocuments = documents.length
  const totalViews = documents.reduce((sum, doc) => sum + doc.viewCount, 0)
  const averageRating = documents.reduce((sum, doc) => sum + doc.rating, 0) / totalDocuments

  const typeCounts = documents.reduce((acc, doc) => {
    if (doc.type) {
      acc[doc.type] = (acc[doc.type] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const categoryCounts = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const difficultyCounts = documents.reduce((acc, doc) => {
    acc[doc.difficulty] = (acc[doc.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const premiumDocuments = documents.filter(doc => doc.isPremium).length
  const freeDocuments = documents.filter(doc => !doc.isPremium).length

  return {
    totalDocuments,
    totalViews,
    averageRating: Math.round(averageRating * 10) / 10,
    typeCounts,
    categoryCounts,
    difficultyCounts,
    premiumDocuments,
    freeDocuments
  }
}

export function getPopularDocuments(limit: number = 10): Resource[] {
  return dbDocumentsMockData
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
}

export function getRecentDocuments(limit: number = 10): Resource[] {
  return dbDocumentsMockData
    .sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bDate - aDate
    })
    .slice(0, limit)
}

export function getTopRatedDocuments(limit: number = 10): Resource[] {
  return dbDocumentsMockData
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function getDocumentsByTag(tag: string): Resource[] {
  return dbDocumentsMockData.filter(doc => 
    doc.tags.some((docTag: string) => docTag.toLowerCase() === tag.toLowerCase())
  )
}

export function getRelatedDocuments(documentId: string, limit: number = 5): Resource[] {
  const document = getDocumentById(documentId)
  if (!document) return []

  return dbDocumentsMockData
    .filter(doc => 
      doc.id !== documentId && 
      (doc.category === document.category ||
       doc.tags.some((tag: string) => document.tags.includes(tag)))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}