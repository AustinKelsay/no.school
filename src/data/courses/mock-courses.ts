/**
 * Course domain mock data
 * Contains all course-related data structures and samples
 */

import type { Course, DbCourse, DbLesson, CourseWithLessons } from '../types'

// ============================================================================
// DATABASE-STYLE COURSE DATA (Primary Data Source)
// ============================================================================

export const dbCoursesMockData: DbCourse[] = [
  {
    id: 'course-1',
    title: 'Bitcoin & Lightning Protocol Development',
    description: 'Deep dive into Bitcoin protocol development and Lightning Network implementation. Learn how to build on the most secure blockchain network.',
    category: 'bitcoin',
    instructor: 'Alex Johnson',
    instructorPubkey: 'npub1alexjohnson1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.8,
    enrollmentCount: 256,
    isPremium: false,
    image: '/images/courses/bitcoin-dev.jpg',
    courseListEventId: 'course-list-event-1',
    courseListNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 'course-2',
    title: 'Lightning Network Integration',
    description: 'Build Lightning Network applications from scratch. Learn to integrate Lightning payments into web and mobile applications.',
    category: 'lightning',
    instructor: 'Maria Santos',
    instructorPubkey: 'npub1mariasantos1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.7,
    enrollmentCount: 189,
    isPremium: true,
    price: 25000,
    currency: 'sats',
    image: '/images/courses/lightning-integration.jpg',
    courseListEventId: 'course-list-event-2',
    courseListNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 'course-3',
    title: 'Nostr Protocol & Social Networks',
    description: 'Build decentralized social applications using the Nostr protocol. Create censorship-resistant apps that put users in control.',
    category: 'nostr',
    instructor: 'David Kim',
    instructorPubkey: 'npub1davidkim1234567890abcdef1234567890abcdef1234567890abcdef1234',
    rating: 4.9,
    enrollmentCount: 324,
    isPremium: false,
    image: '/images/courses/nostr-dev.jpg',
    courseListEventId: 'course-list-event-3',
    courseListNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-22'
  },
  {
    id: 'course-4',
    title: 'React & TypeScript Mastery',
    description: 'Master modern React development with TypeScript. Build scalable web applications with the latest React patterns and best practices.',
    category: 'frontend',
    instructor: 'Sarah Chen',
    instructorPubkey: 'npub1sarahchen1234567890abcdef1234567890abcdef1234567890abcdef123',
    rating: 4.6,
    enrollmentCount: 412,
    isPremium: true,
    price: 15000,
    currency: 'sats',
    image: '/images/courses/react-typescript.jpg',
    courseListEventId: 'course-list-event-4',
    courseListNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-19'
  },
  {
    id: 'course-5',
    title: 'Mobile Bitcoin Wallets',
    description: 'Build secure Bitcoin wallets for iOS and Android. Learn mobile security best practices and Bitcoin key management.',
    category: 'mobile',
    instructor: 'Jake Wilson',
    instructorPubkey: 'npub1jakewilson1234567890abcdef1234567890abcdef1234567890abcdef12',
    rating: 4.5,
    enrollmentCount: 178,
    isPremium: true,
    price: 30000,
    currency: 'sats',
    image: '/images/courses/mobile-wallets.jpg',
    courseListEventId: 'course-list-event-5',
    courseListNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-21'
  }
]

// ============================================================================
// DATABASE-STYLE LESSON DATA
// ============================================================================

export const dbLessonsMockData: DbLesson[] = [
  // Course 1 lessons (Bitcoin & Lightning Protocol Development)
  {
    id: 'lesson-1-1',
    title: 'Bitcoin Protocol Fundamentals',
    description: 'Understanding the core concepts of Bitcoin: blocks, transactions, and consensus.',
    courseId: 'course-1',
    duration: '45 min',
    isPremium: false,
    lessonEventId: 'lesson-event-1-1',
    lessonNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
    order: 1
  },
  {
    id: 'lesson-1-2',
    title: 'Transaction Scripts & OpCodes',
    description: 'Deep dive into Bitcoin scripting language and transaction validation.',
    courseId: 'course-1',
    duration: '50 min',
    isPremium: false,
    lessonEventId: 'lesson-event-1-2',
    lessonNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-17',
    order: 2
  },
  {
    id: 'lesson-1-3',
    title: 'Lightning Network Basics',
    description: 'Introduction to payment channels and the Lightning Network architecture.',
    courseId: 'course-1',
    duration: '40 min',
    isPremium: false,
    lessonEventId: 'lesson-event-1-3',
    lessonNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-18',
    order: 3
  },

  // Course 2 lessons (Lightning Network Integration)
  {
    id: 'lesson-2-1',
    title: 'Setting Up Lightning Development Environment',
    description: 'Configure your development environment for Lightning Network applications.',
    courseId: 'course-2',
    duration: '30 min',
    isPremium: true,
    price: 5000,
    currency: 'sats',
    lessonEventId: 'lesson-event-2-1',
    lessonNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-11',
    order: 1
  },
  {
    id: 'lesson-2-2',
    title: 'Lightning Payment Flow',
    description: 'Understand how Lightning payments work and implement basic payment flows.',
    courseId: 'course-2',
    duration: '55 min',
    isPremium: true,
    price: 8000,
    currency: 'sats',
    lessonEventId: 'lesson-event-2-2',
    lessonNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-11',
    updatedAt: '2024-01-12',
    order: 2
  },

  // Course 3 lessons (Nostr Protocol & Social Networks)
  {
    id: 'lesson-3-1',
    title: 'Nostr Protocol Overview',
    description: 'Learn the fundamentals of the Nostr protocol and its architecture.',
    courseId: 'course-3',
    duration: '35 min',
    isPremium: false,
    lessonEventId: 'lesson-event-3-1',
    lessonNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-09',
    order: 1
  },
  {
    id: 'lesson-3-2',
    title: 'Building Your First Nostr Client',
    description: 'Create a simple Nostr client application with basic functionality.',
    courseId: 'course-3',
    duration: '60 min',
    isPremium: false,
    lessonEventId: 'lesson-event-3-2',
    lessonNaddr: 'naddr1qqxnzd3cxqmr2wphxucrzd3exgunqvphx5cnwwp5kyfnqv3kxvenqd3hxgezyq5j9qg5j9qg5j9qg5j9q',
    published: true,
    createdAt: '2024-01-09',
    updatedAt: '2024-01-10',
    order: 2
  }
]

// ============================================================================
// LEGACY COURSE FORMAT (for backward compatibility)
// ============================================================================

export const coursesDatabase: Course[] = dbCoursesMockData.map((dbCourse, index) => {
  const courseLessons = dbLessonsMockData
    .filter(lesson => lesson.courseId === dbCourse.id)
    .map((lesson, lessonIndex) => ({
      id: lessonIndex + 1,
      title: lesson.title,
      duration: lesson.duration,
      completed: false
    }))

  return {
    id: index + 1,
    title: dbCourse.title,
    description: dbCourse.description,
    category: dbCourse.category.charAt(0).toUpperCase() + dbCourse.category.slice(1),
    duration: calculateTotalDuration(courseLessons.map(l => l.duration)),
    instructor: dbCourse.instructor,
    rating: dbCourse.rating,
    image: dbCourse.image || "/placeholder.svg",
    lessons: courseLessons,
    enrollmentCount: dbCourse.enrollmentCount,
    createdAt: dbCourse.createdAt
  }
})

// ============================================================================
// COMBINED COURSES WITH LESSONS
// ============================================================================

export const coursesWithLessons: CourseWithLessons[] = dbCoursesMockData.map(course => ({
  ...course,
  lessons: dbLessonsMockData.filter(lesson => lesson.courseId === course.id)
}))

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function calculateTotalDuration(durations: string[]): string {
  let totalMinutes = 0

  durations.forEach(duration => {
    const match = duration.match(/(\d+)\s*(min|minutes|hour|hours|h)/)
    if (match) {
      const value = parseInt(match[1], 10)
      const unit = match[2]
      
      if (unit.startsWith('h')) {
        totalMinutes += value * 60
      } else {
        totalMinutes += value
      }
    }
  })

  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }

  return `${hours}h ${minutes}m`
}

// ============================================================================
// HELPER FUNCTIONS FOR DATA ACCESS
// ============================================================================

export function getCourseById(id: string): DbCourse | undefined {
  return dbCoursesMockData.find(course => course.id === id)
}

export function getLessonsByCourseId(courseId: string): DbLesson[] {
  return dbLessonsMockData.filter(lesson => lesson.courseId === courseId)
}

export function getCoursesByCategory(category: string): DbCourse[] {
  return dbCoursesMockData.filter(course => 
    course.category.toLowerCase() === category.toLowerCase()
  )
}

export function getFreeCourses(): DbCourse[] {
  return dbCoursesMockData.filter(course => !course.isPremium)
}

export function getPaidCourses(): DbCourse[] {
  return dbCoursesMockData.filter(course => course.isPremium)
}

export function getFreeLessons(): DbLesson[] {
  return dbLessonsMockData.filter(lesson => !lesson.isPremium)
}

export function getPaidLessons(): DbLesson[] {
  return dbLessonsMockData.filter(lesson => lesson.isPremium)
}

export function getCourseStatistics(courses: DbCourse[]) {
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollmentCount, 0)
  const averageRating = courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
  
  const categoryCounts = courses.reduce((acc, course) => {
    acc[course.category] = (acc[course.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalCourses: courses.length,
    totalEnrollments,
    averageRating: Math.round(averageRating * 10) / 10,
    categoryCounts,
    premiumCourses: courses.filter(c => c.isPremium).length,
    freeCourses: courses.filter(c => !c.isPremium).length
  }
}