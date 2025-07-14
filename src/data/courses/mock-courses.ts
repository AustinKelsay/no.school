/**
 * Course domain mock data
 * Contains all course-related data structures matching the database schema
 * Based on content_data_models.md Course model
 */

import type { Course, Lesson, CourseWithLessons } from '../types'

// Mock user IDs for the database relations
export const mockUserIds = {
  alexJohnson: 'user_7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e',
  mariaSantos: 'user_3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
  davidWilson: 'user_67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa',
  sarahLee: 'user_82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
  mikeTaylor: 'user_91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3'
}

// Mock instructor pubkeys (from nostr-events.ts)
export const mockInstructorPubkeys = {
  alexJohnson: '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e',
  mariaSantos: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
  davidWilson: '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa',
  sarahLee: '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
  mikeTaylor: '91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3'
}

// ============================================================================
// DATABASE COURSE DATA (Primary Data Source)
// ============================================================================

export const coursesMockData: Course[] = [
  {
    // Database fields (from Prisma schema)
    id: 'course-bitcoin-lightning-dev',
    userId: mockUserIds.alexJohnson,
    price: 0, // Free course
    noteId: 'course-bitcoin-lightning-dev-note',
    submissionRequired: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    
    // UI fields (not in database but needed for display)
    title: 'Bitcoin & Lightning Protocol Development',
    description: 'Deep dive into Bitcoin protocol development and Lightning Network implementation. Learn how to build on the most secure blockchain network.',
    category: 'bitcoin',
    instructor: 'Alex Johnson',
    instructorPubkey: mockInstructorPubkeys.alexJohnson,
    rating: 4.8,
    enrollmentCount: 256,
    isPremium: false,
    currency: 'sats',
    image: '/images/courses/bitcoin-dev.jpg',
    published: true
  },
  {
    // Database fields (from Prisma schema)
    id: 'course-nostr-protocol-dev',
    userId: mockUserIds.mariaSantos,
    price: 0, // Free course
    noteId: 'course-nostr-protocol-dev-note',
    submissionRequired: false,
    createdAt: '2024-01-11T09:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
    
    // UI fields (not in database but needed for display)
    title: 'Nostr Protocol Development',
    description: 'Build decentralized applications on the Nostr protocol. Learn about relays, clients, and the core concepts of censorship-resistant communication.',
    category: 'nostr',
    instructor: 'Maria Santos',
    instructorPubkey: mockInstructorPubkeys.mariaSantos,
    rating: 4.7,
    enrollmentCount: 189,
    isPremium: false,
    currency: 'sats',
    image: '/images/courses/nostr-dev.jpg',
    published: true
  },
  {
    // Database fields (from Prisma schema)
    id: 'course-frontend-bitcoin-apps',
    userId: mockUserIds.davidWilson,
    price: 18000, // Paid course
    noteId: 'course-frontend-bitcoin-apps-note',
    submissionRequired: true,
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
    
    // UI fields (not in database but needed for display)
    title: 'Frontend Development for Bitcoin Apps',
    description: 'Build modern React applications that integrate with Bitcoin and Lightning Network. Learn to create beautiful, functional Bitcoin apps.',
    category: 'frontend',
    instructor: 'David Wilson',
    instructorPubkey: mockInstructorPubkeys.davidWilson,
    rating: 4.9,
    enrollmentCount: 134,
    isPremium: true,
    currency: 'sats',
    image: '/images/courses/frontend-bitcoin.jpg',
    published: true
  },
  {
    // Database fields (from Prisma schema)
    id: 'course-lightning-api-integration',
    userId: mockUserIds.sarahLee,
    price: 22000, // Paid course
    noteId: 'course-lightning-api-integration-note',
    submissionRequired: true,
    createdAt: '2024-01-05T13:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
    
    // UI fields (not in database but needed for display)
    title: 'Lightning Network API Integration',
    description: 'Master Lightning Network APIs and build payment processing systems. Learn to integrate Lightning payments into your applications.',
    category: 'lightning',
    instructor: 'Sarah Lee',
    instructorPubkey: mockInstructorPubkeys.sarahLee,
    rating: 4.6,
    enrollmentCount: 98,
    isPremium: true,
    currency: 'sats',
    image: '/images/courses/lightning-api.jpg',
    published: true
  },
  {
    // Database fields (from Prisma schema)
    id: 'course-web3-security-practices',
    userId: mockUserIds.mikeTaylor,
    price: 28000, // Paid course
    noteId: 'course-web3-security-practices-note',
    submissionRequired: true,
    createdAt: '2024-01-02T14:00:00Z',
    updatedAt: '2024-01-09T12:00:00Z',
    
    // UI fields (not in database but needed for display)
    title: 'Web3 Security Best Practices',
    description: 'Learn essential security practices for Bitcoin and Lightning applications. Understand common vulnerabilities and how to prevent them.',
    category: 'security',
    instructor: 'Mike Taylor',
    instructorPubkey: mockInstructorPubkeys.mikeTaylor,
    rating: 4.8,
    enrollmentCount: 76,
    isPremium: true,
    currency: 'sats',
    image: '/images/courses/web3-security.jpg',
    published: true
  }
]

// ============================================================================
// LESSON DATA (connecting courses to resources)
// ============================================================================

export const lessonsMockData: Lesson[] = [
  // Bitcoin & Lightning Protocol Development course lessons
  {
    id: 'lesson-bitcoin-fundamentals',
    courseId: 'course-bitcoin-lightning-dev',
    resourceId: 'resource-bitcoin-fundamentals',
    index: 0,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    
    // UI fields (derived from resource)
    title: 'Bitcoin Fundamentals',
    description: 'Learn the core concepts of Bitcoin including blockchain, proof of work, and the UTXO model.',
    duration: '45:00',
    isPremium: false,
    price: 0,
    currency: 'sats',
    published: true
  },
  {
    id: 'lesson-lightning-basics',
    courseId: 'course-bitcoin-lightning-dev',
    resourceId: 'resource-lightning-basics',
    index: 1,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
    
    // UI fields (derived from resource)
    title: 'Lightning Network Basics',
    description: 'Understanding Lightning Network fundamentals, payment channels, and routing.',
    duration: '52:00',
    isPremium: false,
    price: 0,
    currency: 'sats',
    published: true
  },
  {
    id: 'lesson-advanced-bitcoin-dev',
    courseId: 'course-bitcoin-lightning-dev',
    resourceId: 'resource-advanced-bitcoin-dev',
    index: 2,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    
    // UI fields (derived from resource)
    title: 'Advanced Bitcoin Development',
    description: 'Professional-level Bitcoin development including custom scripts, multisig, and Lightning integration.',
    duration: '90:00',
    isPremium: true,
    price: 25000,
    currency: 'sats',
    published: true
  },
  
  // Nostr Protocol Development course lessons
  {
    id: 'lesson-nostr-fundamentals',
    courseId: 'course-nostr-protocol-dev',
    resourceId: 'resource-nostr-fundamentals',
    index: 0,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
    
    // UI fields (derived from resource)
    title: 'Nostr Protocol Fundamentals',
    description: 'Complete guide to understanding and implementing the Nostr protocol.',
    duration: '38:00',
    isPremium: false,
    price: 0,
    currency: 'sats',
    published: true
  },
  {
    id: 'lesson-relay-development',
    courseId: 'course-nostr-protocol-dev',
    resourceId: 'resource-relay-development',
    index: 1,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
    
    // UI fields (derived from resource)
    title: 'Relay Development',
    description: 'Learn to build and deploy Nostr relays with proper event handling and filtering.',
    duration: '67:00',
    isPremium: false,
    price: 0,
    currency: 'sats',
    published: true
  },
  {
    id: 'lesson-advanced-nostr-patterns',
    courseId: 'course-nostr-protocol-dev',
    resourceId: 'resource-advanced-nostr-patterns',
    index: 2,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
    
    // UI fields (derived from resource)
    title: 'Advanced Nostr Patterns',
    description: 'Advanced patterns for building scalable and secure Nostr applications.',
    duration: '85:00',
    isPremium: true,
    price: 18000,
    currency: 'sats',
    published: true
  }
]

// ============================================================================
// COMBINED COURSE DATA (for UI convenience)
// ============================================================================

export const coursesWithLessons: CourseWithLessons[] = coursesMockData.map(course => ({
  course,
  lessons: lessonsMockData
    .filter(lesson => lesson.courseId === course.id)
    .map(lesson => ({
      ...lesson,
      // Resource will be populated by the application layer
      resource: undefined
    }))
}))

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getCourseById(id: string): Course | undefined {
  return coursesMockData.find(course => course.id === id)
}

export function getCoursesByCategory(category: string): Course[] {
  return coursesMockData.filter(course => course.category === category)
}

export function getFreeCourses(): Course[] {
  return coursesMockData.filter(course => course.price === 0)
}

export function getPaidCourses(): Course[] {
  return coursesMockData.filter(course => course.price > 0)
}

export function getLessonsByCourseId(courseId: string): Lesson[] {
  return lessonsMockData.filter(lesson => lesson.courseId === courseId)
}

export function getLessonById(id: string): Lesson | undefined {
  return lessonsMockData.find(lesson => lesson.id === id)
}

export function getCourseWithLessons(courseId: string): CourseWithLessons | undefined {
  const course = getCourseById(courseId)
  if (!course) return undefined
  
  const lessons = getLessonsByCourseId(courseId)
  return {
    course,
    lessons: lessons.map(lesson => ({
      ...lesson,
      resource: undefined // Will be populated by application layer
    }))
  }
}