/**
 * Document domain mock data
 * Contains all document-related data structures and samples
 * Represents NIP-23 (free) and NIP-99 (paid) content events
 */

import type { DbDocument } from '../types'

// ============================================================================
// DATABASE-STYLE DOCUMENT DATA (Primary Data Source)
// ============================================================================

export const dbDocumentsMockData: DbDocument[] = [
  // Bitcoin Documents
  {
    id: 'doc-1',
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
    documentEventId: 'doc-event-1',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22'
  },
  {
    id: 'doc-2',
    title: 'Bitcoin Script Deep Dive',
    description: 'Comprehensive guide to Bitcoin Script - the stack-based programming language used in Bitcoin transactions. Learn opcodes, script patterns, and security considerations.',
    category: 'bitcoin',
    type: 'guide',
    instructor: 'Sarah Chen',
    instructorPubkey: 'npub1sarahchen1234567890abcdef1234567890abcdef1234567890abcdef123',
    rating: 4.9,
    viewCount: 892,
    isPremium: true,
    price: 15000,
    currency: 'sats',
    image: '/images/documents/bitcoin-script.jpg',
    tags: ['bitcoin', 'script', 'opcodes', 'transactions', 'programming'],
    difficulty: 'advanced',
    documentEventId: 'doc-event-2',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9r',
    published: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-18'
  },
  {
    id: 'doc-3',
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
    documentEventId: 'doc-event-3',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9s',
    published: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: 'doc-4',
    title: 'Bitcoin Core API Reference',
    description: 'Complete reference documentation for Bitcoin Core JSON-RPC API. Includes all endpoints, parameters, return values, and practical examples.',
    category: 'bitcoin',
    type: 'reference',
    instructor: 'Lisa Park',
    instructorPubkey: 'npub1lisapark1234567890abcdef1234567890abcdef1234567890abcdef1234',
    rating: 4.8,
    viewCount: 1567,
    isPremium: true,
    price: 8000,
    currency: 'sats',
    image: '/images/documents/bitcoin-api-reference.jpg',
    tags: ['bitcoin', 'api', 'rpc', 'reference', 'documentation'],
    difficulty: 'intermediate',
    documentEventId: 'doc-event-4',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9t',
    published: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },

  // Lightning Network Documents
  {
    id: 'doc-5',
    title: 'Lightning Network Implementation Guide',
    description: 'Comprehensive guide to implementing Lightning Network features in your applications. Covers LND integration, channel management, and payment flows.',
    category: 'lightning',
    type: 'guide',
    instructor: 'Maria Santos',
    instructorPubkey: 'npub1mariasantos1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.9,
    viewCount: 1892,
    isPremium: true,
    price: 25000,
    currency: 'sats',
    image: '/images/documents/lightning-guide.jpg',
    tags: ['lightning', 'implementation', 'guide', 'payments', 'lnd'],
    difficulty: 'advanced',
    documentEventId: 'doc-event-5',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9u',
    published: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-10'
  },
  {
    id: 'doc-6',
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
    documentEventId: 'doc-event-6',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9v',
    published: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14'
  },
  {
    id: 'doc-7',
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
    documentEventId: 'doc-event-7',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9w',
    published: true,
    createdAt: '2024-01-28',
    updatedAt: '2024-01-28'
  },

  // Nostr Documents
  {
    id: 'doc-8',
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
    documentEventId: 'doc-event-8',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9x',
    published: true,
    createdAt: '2024-01-30',
    updatedAt: '2024-02-01'
  },
  {
    id: 'doc-9',
    title: 'Building Nostr Clients',
    description: 'Complete guide to building Nostr clients from scratch. Covers WebSocket connections, event handling, and user interface patterns.',
    category: 'nostr',
    type: 'tutorial',
    instructor: 'Anna Lee',
    instructorPubkey: 'npub1annalee1234567890abcdef1234567890abcdef1234567890abcdef1234',
    rating: 4.8,
    viewCount: 1234,
    isPremium: true,
    price: 18000,
    currency: 'sats',
    image: '/images/documents/nostr-clients.jpg',
    tags: ['nostr', 'client', 'development', 'websockets', 'ui'],
    difficulty: 'intermediate',
    documentEventId: 'doc-event-9',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9y',
    published: true,
    createdAt: '2024-02-02',
    updatedAt: '2024-02-04'
  },
  {
    id: 'doc-10',
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
    documentEventId: 'doc-event-10',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9z',
    published: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-07'
  },

  // Frontend Development Documents
  {
    id: 'doc-11',
    title: 'React Performance Optimization',
    description: 'Advanced techniques for optimizing React applications. Covers memoization, virtualization, code splitting, and performance monitoring.',
    category: 'frontend',
    type: 'guide',
    instructor: 'Sophie Turner',
    instructorPubkey: 'npub1sophieturner1234567890abcdef1234567890abcdef1234567890abcdef',
    rating: 4.8,
    viewCount: 3456,
    isPremium: true,
    price: 22000,
    currency: 'sats',
    image: '/images/documents/react-performance.jpg',
    tags: ['react', 'performance', 'optimization', 'frontend', 'javascript'],
    difficulty: 'advanced',
    documentEventId: 'doc-event-11',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j90',
    published: true,
    createdAt: '2024-02-08',
    updatedAt: '2024-02-10'
  },
  {
    id: 'doc-12',
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
    documentEventId: 'doc-event-12',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j91',
    published: true,
    createdAt: '2024-02-12',
    updatedAt: '2024-02-12'
  },
  {
    id: 'doc-13',
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
    documentEventId: 'doc-event-13',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j92',
    published: true,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-17'
  },

  // Backend Development Documents
  {
    id: 'doc-14',
    title: 'Node.js API Security Best Practices',
    description: 'Essential security practices for Node.js APIs. Covers authentication, authorization, input validation, and common vulnerability prevention.',
    category: 'backend',
    type: 'guide',
    instructor: 'Marcus Johnson',
    instructorPubkey: 'npub1marcusjohnson1234567890abcdef1234567890abcdef1234567890abcde',
    rating: 4.9,
    viewCount: 2156,
    isPremium: true,
    price: 20000,
    currency: 'sats',
    image: '/images/documents/nodejs-security.jpg',
    tags: ['nodejs', 'security', 'api', 'authentication', 'backend'],
    difficulty: 'advanced',
    documentEventId: 'doc-event-14',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j93',
    published: true,
    createdAt: '2024-02-18',
    updatedAt: '2024-02-20'
  },
  {
    id: 'doc-15',
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
    documentEventId: 'doc-event-15',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j94',
    published: true,
    createdAt: '2024-02-22',
    updatedAt: '2024-02-24'
  },

  // Mobile Development Documents
  {
    id: 'doc-16',
    title: 'React Native Bitcoin Wallet Tutorial',
    description: 'Step-by-step guide to building a Bitcoin wallet app with React Native. Covers key generation, transaction signing, and security best practices.',
    category: 'mobile',
    type: 'tutorial',
    instructor: 'Kevin Zhang',
    instructorPubkey: 'npub1kevinzhang1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.8,
    viewCount: 1345,
    isPremium: true,
    price: 35000,
    currency: 'sats',
    image: '/images/documents/rn-bitcoin-wallet.jpg',
    tags: ['react-native', 'bitcoin', 'wallet', 'mobile', 'tutorial'],
    difficulty: 'advanced',
    documentEventId: 'doc-event-16',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j95',
    published: true,
    createdAt: '2024-02-25',
    updatedAt: '2024-02-28'
  },
  {
    id: 'doc-17',
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
    documentEventId: 'doc-event-17',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j96',
    published: true,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-03'
  },

  // Security Documents
  {
    id: 'doc-18',
    title: 'Cryptographic Key Management',
    description: 'Best practices for managing cryptographic keys in applications. Covers key generation, storage, rotation, and security considerations.',
    category: 'security',
    type: 'guide',
    instructor: 'Dr. Robert Chen',
    instructorPubkey: 'npub1robertchen1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.9,
    viewCount: 765,
    isPremium: true,
    price: 30000,
    currency: 'sats',
    image: '/images/documents/key-management.jpg',
    tags: ['security', 'cryptography', 'keys', 'management', 'best-practices'],
    difficulty: 'advanced',
    documentEventId: 'doc-event-18',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j97',
    published: true,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-07'
  },
  {
    id: 'doc-19',
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
    documentEventId: 'doc-event-19',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j98',
    published: true,
    createdAt: '2024-03-08',
    updatedAt: '2024-03-10'
  },

  // Web3 Documents
  {
    id: 'doc-20',
    title: 'Smart Contract Security Patterns',
    description: 'Common security patterns and anti-patterns in smart contract development. Learn to write secure and gas-efficient contracts.',
    category: 'web3',
    type: 'documentation',
    instructor: 'Alex Blockchain',
    instructorPubkey: 'npub1alexblockchain1234567890abcdef1234567890abcdef1234567890abcd',
    rating: 4.8,
    viewCount: 1456,
    isPremium: true,
    price: 28000,
    currency: 'sats',
    image: '/images/documents/smart-contract-security.jpg',
    tags: ['web3', 'smart-contracts', 'security', 'solidity', 'ethereum'],
    difficulty: 'advanced',
    documentEventId: 'doc-event-20',
    documentNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j99',
    published: true,
    createdAt: '2024-03-12',
    updatedAt: '2024-03-14'
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getDocumentById(id: string): DbDocument | undefined {
  return dbDocumentsMockData.find(doc => doc.id === id)
}

export function getDocumentsByCategory(category: string): DbDocument[] {
  return dbDocumentsMockData.filter(doc => 
    doc.category.toLowerCase() === category.toLowerCase()
  )
}

export function getDocumentsByType(type: DbDocument['type']): DbDocument[] {
  return dbDocumentsMockData.filter(doc => doc.type === type)
}

export function getFreeDocuments(): DbDocument[] {
  return dbDocumentsMockData.filter(doc => !doc.isPremium)
}

export function getPaidDocuments(): DbDocument[] {
  return dbDocumentsMockData.filter(doc => doc.isPremium)
}

export function getDocumentsByDifficulty(difficulty: DbDocument['difficulty']): DbDocument[] {
  return dbDocumentsMockData.filter(doc => doc.difficulty === difficulty)
}

export function getDocumentsByInstructor(instructorPubkey: string): DbDocument[] {
  return dbDocumentsMockData.filter(doc => doc.instructorPubkey === instructorPubkey)
}

export function searchDocuments(query: string): DbDocument[] {
  const searchTerm = query.toLowerCase()
  return dbDocumentsMockData.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm) ||
    doc.description.toLowerCase().includes(searchTerm) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export function getDocumentStatistics(documents: DbDocument[]) {
  const totalDocuments = documents.length
  const totalViews = documents.reduce((sum, doc) => sum + doc.viewCount, 0)
  const averageRating = documents.reduce((sum, doc) => sum + doc.rating, 0) / totalDocuments

  const typeCounts = documents.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1
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

export function getPopularDocuments(limit: number = 10): DbDocument[] {
  return dbDocumentsMockData
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
}

export function getRecentDocuments(limit: number = 10): DbDocument[] {
  return dbDocumentsMockData
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function getTopRatedDocuments(limit: number = 10): DbDocument[] {
  return dbDocumentsMockData
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function getDocumentsByTag(tag: string): DbDocument[] {
  return dbDocumentsMockData.filter(doc => 
    doc.tags.some(docTag => docTag.toLowerCase() === tag.toLowerCase())
  )
}

export function getRelatedDocuments(documentId: string, limit: number = 5): DbDocument[] {
  const document = getDocumentById(documentId)
  if (!document) return []

  return dbDocumentsMockData
    .filter(doc => 
      doc.id !== documentId && 
      (doc.category === document.category ||
       doc.tags.some(tag => document.tags.includes(tag)))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}