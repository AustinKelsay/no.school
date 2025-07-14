/**
 * Video domain mock data
 * Contains all video-related data structures and samples
 * Represents NIP-23 (free) and NIP-99 (paid) content events
 */

import type { DbVideo } from '../types'

// ============================================================================
// DATABASE-STYLE VIDEO DATA (Primary Data Source)
// ============================================================================

export const dbVideosMockData: DbVideo[] = [
  // Bitcoin Videos
  {
    id: 'video-1',
    title: 'Bitcoin Transaction Deep Dive',
    description: 'Visual explanation of how Bitcoin transactions work, from creation to confirmation on the blockchain. Learn about inputs, outputs, signatures, and the UTXO model.',
    category: 'bitcoin',
    instructor: 'Alex Johnson',
    instructorPubkey: 'npub1alexjohnson1234567890abcdef1234567890abcdef1234567890abcdef12',
    duration: '25:30',
    rating: 4.8,
    viewCount: 3247,
    isPremium: false,
    thumbnailUrl: '/images/videos/bitcoin-transaction-thumb.jpg',
    videoUrl: '/videos/bitcoin-transaction.mp4',
    tags: ['bitcoin', 'transactions', 'blockchain', 'tutorial'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-1',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-22',
    updatedAt: '2024-01-23'
  },
  {
    id: 'video-2',
    title: 'Bitcoin Script Programming Masterclass',
    description: 'Comprehensive guide to Bitcoin Script programming. Learn to write custom scripts, understand opcodes, and implement advanced transaction types.',
    category: 'bitcoin',
    instructor: 'Sarah Chen',
    instructorPubkey: 'npub1sarahchen1234567890abcdef1234567890abcdef1234567890abcdef123',
    duration: '42:15',
    rating: 4.9,
    viewCount: 1456,
    isPremium: true,
    price: 25000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/bitcoin-script-thumb.jpg',
    videoUrl: '/videos/bitcoin-script.mp4',
    tags: ['bitcoin', 'script', 'programming', 'opcodes', 'advanced'],
    difficulty: 'advanced',
    videoEventId: 'video-event-2',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9r',
    published: true,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20'
  },
  {
    id: 'video-3',
    title: 'Setting Up Bitcoin Core: Complete Guide',
    description: 'Step-by-step tutorial for installing and configuring Bitcoin Core. Covers initial sync, wallet setup, and basic RPC commands.',
    category: 'bitcoin',
    instructor: 'Mike Rodriguez',
    instructorPubkey: 'npub1mikerodriguez1234567890abcdef1234567890abcdef1234567890abcdef',
    duration: '18:45',
    rating: 4.6,
    viewCount: 5432,
    isPremium: false,
    thumbnailUrl: '/images/videos/bitcoin-core-setup-thumb.jpg',
    videoUrl: '/videos/bitcoin-core-setup.mp4',
    tags: ['bitcoin', 'core', 'setup', 'installation', 'beginner'],
    difficulty: 'beginner',
    videoEventId: 'video-event-3',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9s',
    published: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: 'video-4',
    title: 'Bitcoin Mining Pool Setup',
    description: 'Learn how to set up and manage a Bitcoin mining pool. Covers stratum protocol, pool software, and profit distribution mechanisms.',
    category: 'bitcoin',
    instructor: 'Lisa Park',
    instructorPubkey: 'npub1lisapark1234567890abcdef1234567890abcdef1234567890abcdef1234',
    duration: '35:20',
    rating: 4.7,
    viewCount: 892,
    isPremium: true,
    price: 18000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/mining-pool-thumb.jpg',
    videoUrl: '/videos/mining-pool.mp4',
    tags: ['bitcoin', 'mining', 'pool', 'stratum', 'advanced'],
    difficulty: 'advanced',
    videoEventId: 'video-event-4',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9t',
    published: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14'
  },

  // Lightning Network Videos
  {
    id: 'video-5',
    title: 'Lightning Payment Channel Setup',
    description: 'Step-by-step tutorial on setting up and managing Lightning Network payment channels. Learn channel funding, closing, and best practices.',
    category: 'lightning',
    instructor: 'Maria Santos',
    instructorPubkey: 'npub1mariasantos1234567890abcdef1234567890abcdef1234567890abcdef12',
    duration: '28:45',
    rating: 4.9,
    viewCount: 1892,
    isPremium: true,
    price: 22000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/lightning-channels-thumb.jpg',
    videoUrl: '/videos/lightning-channels.mp4',
    tags: ['lightning', 'channels', 'payments', 'setup'],
    difficulty: 'advanced',
    videoEventId: 'video-event-5',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9u',
    published: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: 'video-6',
    title: 'Lightning Network Routing Explained',
    description: 'Deep dive into how Lightning Network routing works. Understand pathfinding algorithms, fee structures, and liquidity management.',
    category: 'lightning',
    instructor: 'David Kim',
    instructorPubkey: 'npub1davidkim1234567890abcdef1234567890abcdef1234567890abcdef123',
    duration: '22:30',
    rating: 4.8,
    viewCount: 1234,
    isPremium: false,
    thumbnailUrl: '/images/videos/lightning-routing-thumb.jpg',
    videoUrl: '/videos/lightning-routing.mp4',
    tags: ['lightning', 'routing', 'pathfinding', 'algorithms'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-6',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9v',
    published: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-17'
  },
  {
    id: 'video-7',
    title: 'Building Lightning Apps with LND',
    description: 'Complete tutorial on building applications with Lightning Network Daemon (LND). Covers gRPC API, invoices, and payment flows.',
    category: 'lightning',
    instructor: 'Emily Watson',
    instructorPubkey: 'npub1emilywatson1234567890abcdef1234567890abcdef1234567890abcdef1',
    duration: '45:15',
    rating: 4.7,
    viewCount: 987,
    isPremium: true,
    price: 30000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/lnd-apps-thumb.jpg',
    videoUrl: '/videos/lnd-apps.mp4',
    tags: ['lightning', 'lnd', 'development', 'api', 'applications'],
    difficulty: 'advanced',
    videoEventId: 'video-event-7',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9w',
    published: true,
    createdAt: '2024-01-28',
    updatedAt: '2024-01-30'
  },
  {
    id: 'video-8',
    title: 'Lightning Network for Beginners',
    description: 'Introduction to Lightning Network concepts for beginners. Learn about layer 2, instant payments, and why Lightning matters.',
    category: 'lightning',
    instructor: 'Tom Wilson',
    instructorPubkey: 'npub1tomwilson1234567890abcdef1234567890abcdef1234567890abcdef123',
    duration: '15:20',
    rating: 4.5,
    viewCount: 3456,
    isPremium: false,
    thumbnailUrl: '/images/videos/lightning-intro-thumb.jpg',
    videoUrl: '/videos/lightning-intro.mp4',
    tags: ['lightning', 'introduction', 'beginner', 'layer2'],
    difficulty: 'beginner',
    videoEventId: 'video-event-8',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9x',
    published: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },

  // Nostr Videos
  {
    id: 'video-9',
    title: 'Nostr Protocol Fundamentals',
    description: 'Complete introduction to the Nostr protocol. Learn about events, relays, keys, and how decentralized social networks work.',
    category: 'nostr',
    instructor: 'Jack Morrison',
    instructorPubkey: 'npub1jackmorrison1234567890abcdef1234567890abcdef1234567890abcdef',
    duration: '32:10',
    rating: 4.8,
    viewCount: 2890,
    isPremium: false,
    thumbnailUrl: '/images/videos/nostr-fundamentals-thumb.jpg',
    videoUrl: '/videos/nostr-fundamentals.mp4',
    tags: ['nostr', 'protocol', 'decentralized', 'social'],
    difficulty: 'beginner',
    videoEventId: 'video-event-9',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9y',
    published: true,
    createdAt: '2024-02-03',
    updatedAt: '2024-02-05'
  },
  {
    id: 'video-10',
    title: 'Building Your First Nostr Client',
    description: 'Hands-on tutorial for building a Nostr client from scratch. Covers WebSocket connections, event handling, and user interfaces.',
    category: 'nostr',
    instructor: 'Anna Lee',
    instructorPubkey: 'npub1annalee1234567890abcdef1234567890abcdef1234567890abcdef1234',
    duration: '52:30',
    rating: 4.9,
    viewCount: 1567,
    isPremium: true,
    price: 28000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/nostr-client-thumb.jpg',
    videoUrl: '/videos/nostr-client.mp4',
    tags: ['nostr', 'client', 'development', 'websockets', 'tutorial'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-10',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9z',
    published: true,
    createdAt: '2024-02-08',
    updatedAt: '2024-02-10'
  },
  {
    id: 'video-11',
    title: 'Nostr Relay Implementation',
    description: 'Learn how to implement a Nostr relay from scratch. Covers WebSocket handling, event storage, and filtering mechanisms.',
    category: 'nostr',
    instructor: 'Carlos Mendez',
    instructorPubkey: 'npub1carlosmendez1234567890abcdef1234567890abcdef1234567890abcdef',
    duration: '38:45',
    rating: 4.6,
    viewCount: 743,
    isPremium: true,
    price: 24000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/nostr-relay-thumb.jpg',
    videoUrl: '/videos/nostr-relay.mp4',
    tags: ['nostr', 'relay', 'implementation', 'websockets', 'backend'],
    difficulty: 'advanced',
    videoEventId: 'video-event-11',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j90',
    published: true,
    createdAt: '2024-02-12',
    updatedAt: '2024-02-14'
  },

  // Frontend Development Videos
  {
    id: 'video-12',
    title: 'React Performance Optimization Techniques',
    description: 'Advanced React optimization strategies. Learn about memoization, virtualization, code splitting, and performance monitoring.',
    category: 'frontend',
    instructor: 'Sophie Turner',
    instructorPubkey: 'npub1sophieturner1234567890abcdef1234567890abcdef1234567890abcdef',
    duration: '48:20',
    rating: 4.9,
    viewCount: 4567,
    isPremium: true,
    price: 32000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/react-performance-thumb.jpg',
    videoUrl: '/videos/react-performance.mp4',
    tags: ['react', 'performance', 'optimization', 'memoization'],
    difficulty: 'advanced',
    videoEventId: 'video-event-12',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j91',
    published: true,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-17'
  },
  {
    id: 'video-13',
    title: 'CSS Grid Layout Mastery',
    description: 'Complete guide to CSS Grid. Learn layout techniques, responsive design patterns, and advanced grid features.',
    category: 'frontend',
    instructor: 'Rachel Green',
    instructorPubkey: 'npub1rachelgreen1234567890abcdef1234567890abcdef1234567890abcdef1',
    duration: '29:15',
    rating: 4.7,
    viewCount: 3210,
    isPremium: false,
    thumbnailUrl: '/images/videos/css-grid-thumb.jpg',
    videoUrl: '/videos/css-grid.mp4',
    tags: ['css', 'grid', 'layout', 'responsive', 'design'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-13',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j92',
    published: true,
    createdAt: '2024-02-18',
    updatedAt: '2024-02-18'
  },
  {
    id: 'video-14',
    title: 'Modern JavaScript ES2024 Features',
    description: 'Explore the latest JavaScript features in ES2024. Learn about decorators, pattern matching, and new array methods.',
    category: 'frontend',
    instructor: 'Kevin Zhang',
    instructorPubkey: 'npub1kevinzhang1234567890abcdef1234567890abcdef1234567890abcdef12',
    duration: '33:40',
    rating: 4.8,
    viewCount: 2156,
    isPremium: false,
    thumbnailUrl: '/images/videos/js-es2024-thumb.jpg',
    videoUrl: '/videos/js-es2024.mp4',
    tags: ['javascript', 'es2024', 'features', 'modern'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-14',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j93',
    published: true,
    createdAt: '2024-02-20',
    updatedAt: '2024-02-22'
  },
  {
    id: 'video-15',
    title: 'Vue.js 3 Composition API Deep Dive',
    description: 'Master Vue.js 3 Composition API. Learn reactivity, composables, and advanced patterns for building modern Vue applications.',
    category: 'frontend',
    instructor: 'Laura Martinez',
    instructorPubkey: 'npub1lauramartinez1234567890abcdef1234567890abcdef1234567890abcd',
    duration: '41:25',
    rating: 4.6,
    viewCount: 1789,
    isPremium: true,
    price: 26000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/vue3-composition-thumb.jpg',
    videoUrl: '/videos/vue3-composition.mp4',
    tags: ['vue', 'composition-api', 'reactivity', 'frontend'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-15',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j94',
    published: true,
    createdAt: '2024-02-25',
    updatedAt: '2024-02-27'
  },

  // Backend Development Videos
  {
    id: 'video-16',
    title: 'Node.js API Security Best Practices',
    description: 'Essential security practices for Node.js APIs. Learn authentication, authorization, input validation, and threat prevention.',
    category: 'backend',
    instructor: 'Marcus Johnson',
    instructorPubkey: 'npub1marcusjohnson1234567890abcdef1234567890abcdef1234567890abcde',
    duration: '44:30',
    rating: 4.9,
    viewCount: 2345,
    isPremium: true,
    price: 29000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/nodejs-security-thumb.jpg',
    videoUrl: '/videos/nodejs-security.mp4',
    tags: ['nodejs', 'security', 'api', 'authentication'],
    difficulty: 'advanced',
    videoEventId: 'video-event-16',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j95',
    published: true,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-03'
  },
  {
    id: 'video-17',
    title: 'Database Design Patterns',
    description: 'Learn common database design patterns. Covers normalization, indexing strategies, and performance optimization techniques.',
    category: 'backend',
    instructor: 'Jennifer Davis',
    instructorPubkey: 'npub1jenniferdavis1234567890abcdef1234567890abcdef1234567890abcde',
    duration: '36:15',
    rating: 4.7,
    viewCount: 1678,
    isPremium: false,
    thumbnailUrl: '/images/videos/database-patterns-thumb.jpg',
    videoUrl: '/videos/database-patterns.mp4',
    tags: ['database', 'design', 'patterns', 'sql'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-17',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j96',
    published: true,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-07'
  },
  {
    id: 'video-18',
    title: 'Microservices Architecture with Docker',
    description: 'Build scalable microservices with Docker and Kubernetes. Learn containerization, orchestration, and service communication.',
    category: 'backend',
    instructor: 'Dr. Robert Chen',
    instructorPubkey: 'npub1robertchen1234567890abcdef1234567890abcdef1234567890abcdef12',
    duration: '55:45',
    rating: 4.8,
    viewCount: 1234,
    isPremium: true,
    price: 35000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/microservices-thumb.jpg',
    videoUrl: '/videos/microservices.mp4',
    tags: ['microservices', 'docker', 'kubernetes', 'architecture'],
    difficulty: 'advanced',
    videoEventId: 'video-event-18',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j97',
    published: true,
    createdAt: '2024-03-08',
    updatedAt: '2024-03-10'
  },

  // Mobile Development Videos
  {
    id: 'video-19',
    title: 'React Native Bitcoin Wallet Development',
    description: 'Complete tutorial for building a Bitcoin wallet app with React Native. Covers key management, transactions, and security.',
    category: 'mobile',
    instructor: 'Amy Foster',
    instructorPubkey: 'npub1amyfoster1234567890abcdef1234567890abcdef1234567890abcdef123',
    duration: '67:20',
    rating: 4.9,
    viewCount: 987,
    isPremium: true,
    price: 45000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/rn-bitcoin-wallet-thumb.jpg',
    videoUrl: '/videos/rn-bitcoin-wallet.mp4',
    tags: ['react-native', 'bitcoin', 'wallet', 'mobile'],
    difficulty: 'advanced',
    videoEventId: 'video-event-19',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j98',
    published: true,
    createdAt: '2024-03-12',
    updatedAt: '2024-03-15'
  },
  {
    id: 'video-20',
    title: 'Flutter State Management with Riverpod',
    description: 'Master state management in Flutter using Riverpod. Learn providers, state notifiers, and dependency injection patterns.',
    category: 'mobile',
    instructor: 'Alex Blockchain',
    instructorPubkey: 'npub1alexblockchain1234567890abcdef1234567890abcdef1234567890abcd',
    duration: '39:10',
    rating: 4.6,
    viewCount: 1456,
    isPremium: false,
    thumbnailUrl: '/images/videos/flutter-riverpod-thumb.jpg',
    videoUrl: '/videos/flutter-riverpod.mp4',
    tags: ['flutter', 'riverpod', 'state-management', 'mobile'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-20',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j99',
    published: true,
    createdAt: '2024-03-18',
    updatedAt: '2024-03-20'
  },
  {
    id: 'video-21',
    title: 'iOS App Development with Swift',
    description: 'Introduction to iOS development with Swift. Learn UIKit, SwiftUI, and building your first iOS application.',
    category: 'mobile',
    instructor: 'Jessica White',
    instructorPubkey: 'npub1jessicawhite1234567890abcdef1234567890abcdef1234567890abcde',
    duration: '51:35',
    rating: 4.7,
    viewCount: 2109,
    isPremium: true,
    price: 28000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/ios-swift-thumb.jpg',
    videoUrl: '/videos/ios-swift.mp4',
    tags: ['ios', 'swift', 'mobile', 'development'],
    difficulty: 'beginner',
    videoEventId: 'video-event-21',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9a',
    published: true,
    createdAt: '2024-03-22',
    updatedAt: '2024-03-24'
  },

  // Security Videos
  {
    id: 'video-22',
    title: 'Cryptographic Key Management in Practice',
    description: 'Best practices for cryptographic key management. Learn key generation, storage, rotation, and security implementation.',
    category: 'security',
    instructor: 'Dr. Sarah Thompson',
    instructorPubkey: 'npub1sarahthompson1234567890abcdef1234567890abcdef1234567890abcd',
    duration: '42:50',
    rating: 4.9,
    viewCount: 765,
    isPremium: true,
    price: 38000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/key-management-thumb.jpg',
    videoUrl: '/videos/key-management.mp4',
    tags: ['security', 'cryptography', 'keys', 'management'],
    difficulty: 'advanced',
    videoEventId: 'video-event-22',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9b',
    published: true,
    createdAt: '2024-03-25',
    updatedAt: '2024-03-27'
  },
  {
    id: 'video-23',
    title: 'Web Application Security Testing',
    description: 'Comprehensive guide to security testing for web applications. Learn about OWASP Top 10, penetration testing, and vulnerability assessment.',
    category: 'security',
    instructor: 'Michael Brown',
    instructorPubkey: 'npub1michaelbrown1234567890abcdef1234567890abcdef1234567890abcde',
    duration: '37:25',
    rating: 4.8,
    viewCount: 1543,
    isPremium: false,
    thumbnailUrl: '/images/videos/security-testing-thumb.jpg',
    videoUrl: '/videos/security-testing.mp4',
    tags: ['security', 'testing', 'owasp', 'penetration'],
    difficulty: 'intermediate',
    videoEventId: 'video-event-23',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9c',
    published: true,
    createdAt: '2024-03-28',
    updatedAt: '2024-03-30'
  },

  // Web3 Videos
  {
    id: 'video-24',
    title: 'Smart Contract Security Audit Process',
    description: 'Learn how to audit smart contracts for security vulnerabilities. Covers common attack vectors, testing frameworks, and best practices.',
    category: 'web3',
    instructor: 'Elena Rodriguez',
    instructorPubkey: 'npub1elenarodriguez1234567890abcdef1234567890abcdef1234567890abc',
    duration: '49:15',
    rating: 4.9,
    viewCount: 891,
    isPremium: true,
    price: 42000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/smart-contract-audit-thumb.jpg',
    videoUrl: '/videos/smart-contract-audit.mp4',
    tags: ['web3', 'smart-contracts', 'security', 'audit'],
    difficulty: 'advanced',
    videoEventId: 'video-event-24',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9d',
    published: true,
    createdAt: '2024-04-01',
    updatedAt: '2024-04-03'
  },
  {
    id: 'video-25',
    title: 'DeFi Protocol Development',
    description: 'Build decentralized finance protocols from scratch. Learn about AMMs, yield farming, and liquidity mining mechanisms.',
    category: 'web3',
    instructor: 'James Wilson',
    instructorPubkey: 'npub1jameswilson1234567890abcdef1234567890abcdef1234567890abcdef',
    duration: '58:40',
    rating: 4.7,
    viewCount: 654,
    isPremium: true,
    price: 48000,
    currency: 'sats',
    thumbnailUrl: '/images/videos/defi-protocol-thumb.jpg',
    videoUrl: '/videos/defi-protocol.mp4',
    tags: ['web3', 'defi', 'protocol', 'amm', 'yield'],
    difficulty: 'advanced',
    videoEventId: 'video-event-25',
    videoNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9e',
    published: true,
    createdAt: '2024-04-05',
    updatedAt: '2024-04-08'
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getVideoById(id: string): DbVideo | undefined {
  return dbVideosMockData.find(video => video.id === id)
}

export function getVideosByCategory(category: string): DbVideo[] {
  return dbVideosMockData.filter(video => 
    video.category.toLowerCase() === category.toLowerCase()
  )
}

export function getFreeVideos(): DbVideo[] {
  return dbVideosMockData.filter(video => !video.isPremium)
}

export function getPaidVideos(): DbVideo[] {
  return dbVideosMockData.filter(video => video.isPremium)
}

export function getVideosByDifficulty(difficulty: DbVideo['difficulty']): DbVideo[] {
  return dbVideosMockData.filter(video => video.difficulty === difficulty)
}

export function getVideosByInstructor(instructorPubkey: string): DbVideo[] {
  return dbVideosMockData.filter(video => video.instructorPubkey === instructorPubkey)
}

export function searchVideos(query: string): DbVideo[] {
  const searchTerm = query.toLowerCase()
  return dbVideosMockData.filter(video =>
    video.title.toLowerCase().includes(searchTerm) ||
    video.description.toLowerCase().includes(searchTerm) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export function getVideoStatistics(videos: DbVideo[]) {
  const totalVideos = videos.length
  const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0)
  const averageRating = videos.reduce((sum, video) => sum + video.rating, 0) / totalVideos

  // Calculate total duration
  const totalMinutes = videos.reduce((sum, video) => {
    return sum + parseDuration(video.duration)
  }, 0)
  const totalDurationFormatted = formatVideoDuration(totalMinutes)

  const categoryCounts = videos.reduce((acc, video) => {
    acc[video.category] = (acc[video.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const difficultyCounts = videos.reduce((acc, video) => {
    acc[video.difficulty] = (acc[video.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const premiumVideos = videos.filter(video => video.isPremium).length
  const freeVideos = videos.filter(video => !video.isPremium).length

  return {
    totalVideos,
    totalViews,
    averageRating: Math.round(averageRating * 10) / 10,
    totalDurationMinutes: totalMinutes,
    totalDurationFormatted,
    categoryCounts,
    difficultyCounts,
    premiumVideos,
    freeVideos
  }
}

export function getPopularVideos(limit: number = 10): DbVideo[] {
  return dbVideosMockData
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
}

export function getRecentVideos(limit: number = 10): DbVideo[] {
  return dbVideosMockData
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function getTopRatedVideos(limit: number = 10): DbVideo[] {
  return dbVideosMockData
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function getVideosByDuration(minMinutes?: number, maxMinutes?: number): DbVideo[] {
  return dbVideosMockData.filter(video => {
    const duration = parseDuration(video.duration)
    if (minMinutes && duration < minMinutes) return false
    if (maxMinutes && duration > maxMinutes) return false
    return true
  })
}

export function getShortVideos(): DbVideo[] {
  return getVideosByDuration(undefined, 20) // Under 20 minutes
}

export function getMediumVideos(): DbVideo[] {
  return getVideosByDuration(20, 45) // 20-45 minutes
}

export function getLongVideos(): DbVideo[] {
  return getVideosByDuration(45) // Over 45 minutes
}

export function getVideosByTag(tag: string): DbVideo[] {
  return dbVideosMockData.filter(video => 
    video.tags.some(videoTag => videoTag.toLowerCase() === tag.toLowerCase())
  )
}

export function getRelatedVideos(videoId: string, limit: number = 5): DbVideo[] {
  const video = getVideoById(videoId)
  if (!video) return []

  return dbVideosMockData
    .filter(v => 
      v.id !== videoId && 
      (v.category === video.category ||
       v.tags.some(tag => video.tags.includes(tag)))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

// Utility functions for duration parsing and formatting
function parseDuration(duration: string): number {
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60 // minutes + seconds/60
  }
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60 // hours*60 + minutes + seconds/60
  }
  return 0
}

export function formatVideoDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.floor(totalMinutes % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function getTotalWatchTime(): string {
  const totalMinutes = dbVideosMockData.reduce((sum, video) => {
    return sum + parseDuration(video.duration)
  }, 0)
  
  return formatVideoDuration(totalMinutes)
}

export function getVideoDurationStats() {
  const durations = dbVideosMockData.map(video => parseDuration(video.duration))
  
  return {
    shortest: Math.min(...durations),
    longest: Math.max(...durations),
    average: durations.reduce((sum, d) => sum + d, 0) / durations.length,
    total: durations.reduce((sum, d) => sum + d, 0)
  }
}