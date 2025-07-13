/**
 * @fileoverview Mock courses data matching production schema exactly
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type {
  Course,
  CourseWithDetails,
  Lesson,
  UserCourse,
  CourseDraft,
  DraftLesson,
} from '@/types';
import { mockUsers } from '../users';

/**
 * Mock courses matching production schema
 */
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    userId: 'user-2', // bitcoinbob
    price: 50000, // 50,000 sats
    noteId: 'note1abcdef123456789bitcoinbasics',
    submissionRequired: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'course-2',
    userId: 'user-2', // bitcoinbob
    price: 0, // Free course
    noteId: 'note1xyz789012345678lightningintro',
    submissionRequired: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'course-3',
    userId: 'user-3', // lightning_charlie
    price: 75000, // 75,000 sats
    noteId: 'note1advanced987654321lightningdev',
    submissionRequired: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'course-4',
    userId: 'user-5', // nostr_only_user
    price: 25000, // 25,000 sats
    noteId: 'note1nostr111222333444555666777',
    submissionRequired: false,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: 'course-5',
    userId: 'user-2', // bitcoinbob
    price: 100000, // 100,000 sats
    noteId: 'note1masterclass888999000111222',
    submissionRequired: true,
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-30'),
  },
];

/**
 * Mock lessons within courses
 */
export const mockLessons: Lesson[] = [
  // Course 1 lessons (Bitcoin Basics)
  {
    id: 'lesson-1-1',
    courseId: 'course-1',
    resourceId: null,
    draftId: null,
    index: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'lesson-1-2',
    courseId: 'course-1',
    resourceId: null,
    draftId: null,
    index: 2,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'lesson-1-3',
    courseId: 'course-1',
    resourceId: null,
    draftId: null,
    index: 3,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'lesson-1-4',
    courseId: 'course-1',
    resourceId: null,
    draftId: null,
    index: 4,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },

  // Course 2 lessons (Lightning Intro)
  {
    id: 'lesson-2-1',
    courseId: 'course-2',
    resourceId: null,
    draftId: null,
    index: 1,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'lesson-2-2',
    courseId: 'course-2',
    resourceId: null,
    draftId: null,
    index: 2,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: 'lesson-2-3',
    courseId: 'course-2',
    resourceId: null,
    draftId: null,
    index: 3,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },

  // Course 3 lessons (Advanced Lightning)
  {
    id: 'lesson-3-1',
    courseId: 'course-3',
    resourceId: null,
    draftId: null,
    index: 1,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'lesson-3-2',
    courseId: 'course-3',
    resourceId: null,
    draftId: null,
    index: 2,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: 'lesson-3-3',
    courseId: 'course-3',
    resourceId: null,
    draftId: null,
    index: 3,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'lesson-3-4',
    courseId: 'course-3',
    resourceId: null,
    draftId: null,
    index: 4,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'lesson-3-5',
    courseId: 'course-3',
    resourceId: null,
    draftId: null,
    index: 5,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },

  // Course 4 lessons (Nostr Fundamentals)
  {
    id: 'lesson-4-1',
    courseId: 'course-4',
    resourceId: null,
    draftId: null,
    index: 1,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'lesson-4-2',
    courseId: 'course-4',
    resourceId: null,
    draftId: null,
    index: 2,
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: 'lesson-4-3',
    courseId: 'course-4',
    resourceId: null,
    draftId: null,
    index: 3,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
  },

  // Course 5 lessons (Bitcoin Development Masterclass)
  {
    id: 'lesson-5-1',
    courseId: 'course-5',
    resourceId: null,
    draftId: null,
    index: 1,
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: 'lesson-5-2',
    courseId: 'course-5',
    resourceId: null,
    draftId: null,
    index: 2,
    createdAt: new Date('2023-12-21'),
    updatedAt: new Date('2023-12-21'),
  },
  {
    id: 'lesson-5-3',
    courseId: 'course-5',
    resourceId: null,
    draftId: null,
    index: 3,
    createdAt: new Date('2023-12-22'),
    updatedAt: new Date('2023-12-22'),
  },
  {
    id: 'lesson-5-4',
    courseId: 'course-5',
    resourceId: null,
    draftId: null,
    index: 4,
    createdAt: new Date('2023-12-23'),
    updatedAt: new Date('2023-12-23'),
  },
  {
    id: 'lesson-5-5',
    courseId: 'course-5',
    resourceId: null,
    draftId: null,
    index: 5,
    createdAt: new Date('2023-12-24'),
    updatedAt: new Date('2023-12-24'),
  },
  {
    id: 'lesson-5-6',
    courseId: 'course-5',
    resourceId: null,
    draftId: null,
    index: 6,
    createdAt: new Date('2023-12-25'),
    updatedAt: new Date('2023-12-25'),
  },
];

/**
 * Mock user course enrollments and progress
 */
export const mockUserCourses: UserCourse[] = [
  {
    id: 'user-course-1',
    userId: 'user-1', // alice_dev
    courseId: 'course-1', // Bitcoin Basics
    started: true,
    completed: false,
    startedAt: new Date('2024-01-20'),
    completedAt: null,
    submittedRepoLink: null,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'user-course-2',
    userId: 'user-1', // alice_dev
    courseId: 'course-2', // Lightning Intro
    started: true,
    completed: true,
    startedAt: new Date('2024-01-18'),
    completedAt: new Date('2024-01-25'),
    submittedRepoLink: null,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'user-course-3',
    userId: 'user-4', // diana_learner
    courseId: 'course-1', // Bitcoin Basics
    started: true,
    completed: false,
    startedAt: new Date('2024-01-22'),
    completedAt: null,
    submittedRepoLink: null,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: 'user-course-4',
    userId: 'user-4', // diana_learner
    courseId: 'course-2', // Lightning Intro
    started: false,
    completed: false,
    startedAt: null,
    completedAt: null,
    submittedRepoLink: null,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'user-course-5',
    userId: 'user-3', // lightning_charlie
    courseId: 'course-5', // Bitcoin Development Masterclass
    started: true,
    completed: true,
    startedAt: new Date('2024-01-08'),
    completedAt: new Date('2024-01-30'),
    submittedRepoLink:
      'https://github.com/lightning_charlie/bitcoin-masterclass-project',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-30'),
  },
];

/**
 * Mock course drafts
 */
export const mockCourseDrafts: CourseDraft[] = [
  {
    id: 'course-draft-1',
    userId: 'user-2', // bitcoinbob
    title: 'Advanced Bitcoin Script Development',
    summary:
      'Deep dive into Bitcoin Script and smart contract development on Bitcoin',
    image: 'https://images.unsplash.com/photo-1640826356870-b4d88eb6c1bb?w=800',
    price: 125000, // 125,000 sats
    topics: ['bitcoin', 'script', 'smart-contracts', 'advanced'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: 'course-draft-2',
    userId: 'user-3', // lightning_charlie
    title: 'Lightning Network Channel Management',
    summary:
      'Master the art of Lightning channel management and liquidity optimization',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    price: 80000, // 80,000 sats
    topics: ['lightning', 'channels', 'liquidity', 'management'],
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-01'),
  },
];

/**
 * Mock draft lessons
 */
export const mockDraftLessons: DraftLesson[] = [
  {
    id: 'draft-lesson-1-1',
    courseDraftId: 'course-draft-1',
    title: 'Introduction to Bitcoin Script',
    content:
      '# Introduction to Bitcoin Script\n\nBitcoin Script is a stack-based programming language...',
    index: 1,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
  },
  {
    id: 'draft-lesson-1-2',
    courseDraftId: 'course-draft-1',
    title: 'Script Opcodes and Operations',
    content:
      '# Script Opcodes and Operations\n\nBitcoin Script uses various opcodes...',
    index: 2,
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-27'),
  },
  {
    id: 'draft-lesson-2-1',
    courseDraftId: 'course-draft-2',
    title: 'Understanding Lightning Channels',
    content:
      '# Understanding Lightning Channels\n\nLightning channels are the foundation...',
    index: 1,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-29'),
  },
];

/**
 * Get course by ID with optional relationships
 */
export function getCourseById(
  id: string,
  includeDetails = false,
): Course | CourseWithDetails | null {
  const course = mockCourses.find(c => c.id === id);
  if (!course) return null;

  if (includeDetails) {
    const user = mockUsers.find(u => u.id === course.userId)!;
    const lessons = mockLessons.filter(l => l.courseId === id);
    const userCourses = mockUserCourses.filter(uc => uc.courseId === id);

    return {
      ...course,
      user,
      lessons,
      badge: null, // Will be added when we create badges data
      userCourses,
      purchases: [], // Will be added when we create purchases data
    } as CourseWithDetails;
  }

  return course;
}

/**
 * Get courses with pagination and filtering
 */
export function getCourses(params?: {
  page?: number;
  pageSize?: number;
  userId?: string;
  includeDetails?: boolean;
  search?: string;
}) {
  const {
    page = 1,
    pageSize = 10,
    userId,
    includeDetails = false,
    search,
  } = params || {};

  let filteredCourses = [...mockCourses];

  // Filter by user
  if (userId) {
    filteredCourses = filteredCourses.filter(c => c.userId === userId);
  }

  // Search filter (would search in titles/descriptions in real implementation)
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredCourses = filteredCourses.filter(c =>
      c.noteId?.toLowerCase().includes(searchTerm),
    );
  }

  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedCourses = filteredCourses.slice(start, end);

  // Add details if requested
  const courses = includeDetails
    ? paginatedCourses.map(course => getCourseById(course.id, true)!)
    : paginatedCourses;

  return {
    items: courses,
    totalCount: filteredCourses.length,
    page,
    pageSize,
    totalPages: Math.ceil(filteredCourses.length / pageSize),
    hasNextPage: end < filteredCourses.length,
    hasPreviousPage: page > 1,
  };
}

/**
 * Get lessons for a course
 */
export function getLessonsByCourseId(courseId: string) {
  return mockLessons.filter(lesson => lesson.courseId === courseId);
}

/**
 * Get user's course progress
 */
export function getUserCourseProgress(userId: string, courseId?: string) {
  if (courseId) {
    return (
      mockUserCourses.find(
        uc => uc.userId === userId && uc.courseId === courseId,
      ) || null
    );
  }
  return mockUserCourses.filter(uc => uc.userId === userId);
}

/**
 * Get course draft by ID
 */
export function getCourseDraftById(id: string) {
  const draft = mockCourseDrafts.find(cd => cd.id === id);
  if (!draft) return null;

  const draftLessons = mockDraftLessons.filter(dl => dl.courseDraftId === id);
  return {
    ...draft,
    draftLessons,
  };
}
