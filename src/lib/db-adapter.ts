/**
 * Database adapter for real database operations using Prisma
 * Provides the same interface as mock-db-adapter for seamless integration
 */

import { prisma } from '@/lib/prisma'
import { Course, Resource, Lesson } from '@/data/types'
import { NostrEvent } from 'snstr'
import { parseCourseEvent, parseEvent } from '@/data/types'
import { NostrFetchService } from '@/lib/nostr-fetch-service'
import type { Prisma } from '@prisma/client'

// Helper functions to transform Prisma data to match TypeScript interfaces
function transformResource(resource: any): Resource {
  return {
    ...resource,
    noteId: resource.noteId ?? undefined,
    videoId: resource.videoId ?? undefined,
    videoUrl: resource.videoUrl ?? undefined,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString()
  }
}

function transformCourse(course: any): Course {
  return {
    ...course,
    noteId: course.noteId ?? undefined,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString()
  }
}

function transformLesson(lesson: any): Lesson {
  return {
    ...lesson,
    courseId: lesson.courseId ?? undefined,
    resourceId: lesson.resourceId ?? undefined,
    draftId: lesson.draftId ?? undefined,
    createdAt: lesson.createdAt.toISOString(),
    updatedAt: lesson.updatedAt.toISOString()
  }
}

// Pagination options for query functions
export interface PaginationOptions {
  page?: number
  pageSize?: number
}

// Extended types with Nostr note data
export interface CourseWithNote extends Course {
  note?: NostrEvent
  noteError?: string
}

export interface ResourceWithNote extends Resource {
  note?: NostrEvent
  noteError?: string
}

// Helper function to fetch Nostr event from relays
async function fetchNostrEvent(noteId: string | null): Promise<NostrEvent | undefined> {
  if (!noteId) return undefined
  
  try {
    // Only fetch on client side
    if (typeof window === 'undefined') {
      return undefined
    }
    
    const event = await NostrFetchService.fetchEventById(noteId)
    return event || undefined
  } catch (error) {
    console.error('Error fetching Nostr event:', error)
    return undefined
  }
}

// ============================================================================
// COURSE ADAPTER
// ============================================================================

export class CourseAdapter {
  static async findAll(): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return courses.map(transformCourse)
  }

  static async findAllPaginated(options?: PaginationOptions): Promise<{
    data: Course[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const page = options?.page || 1
    const pageSize = options?.pageSize || 50
    const skip = (page - 1) * pageSize

    const [courses, totalItems] = await Promise.all([
      prisma.course.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count()
    ])

    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      data: courses.map(course => ({
        ...course,
        noteId: course.noteId || undefined,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString()
      })),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  static async findById(id: string): Promise<Course | null> {
    const course = await prisma.course.findUnique({
      where: { id }
    })
    if (!course) return null
    return {
      ...course,
      noteId: course.noteId || undefined,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString()
    }
  }

  static async findByIdWithNote(id: string): Promise<CourseWithNote | null> {
    const course = await prisma.course.findUnique({
      where: { id }
    })
    
    if (!course) return null
    
    // Fetch the associated Nostr note
    const note = await fetchNostrEvent(course.noteId)
    
    return {
      ...course,
      noteId: course.noteId || undefined,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      note
    }
  }

  static async create(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const course = await prisma.course.create({
      data: {
        ...courseData,
        noteId: courseData.noteId || null,
        id: `course-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
      }
    })
    return {
      ...course,
      noteId: course.noteId || undefined,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString()
    }
  }

  static async update(id: string, updates: Partial<Course>): Promise<Course | null> {
    try {
      const course = await prisma.course.update({
        where: { id },
        data: updates
      })
      return {
        ...course,
        noteId: course.noteId || undefined,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString()
      }
    } catch (error) {
      return null
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.course.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }

  static async findByUserId(userId: string): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return courses.map(transformCourse)
  }

  static async findByNoteId(noteId: string): Promise<Course | null> {
    const course = await prisma.course.findUnique({
      where: { noteId }
    })
    if (!course) return null
    return {
      ...course,
      noteId: course.noteId || undefined,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString()
    }
  }
}

// ============================================================================
// RESOURCE ADAPTER
// ============================================================================

export class ResourceAdapter {
  static async findAll(options?: { includeLessonResources?: boolean }): Promise<Resource[]> {
    const includeLessonResources = options?.includeLessonResources ?? false
    const where: Prisma.ResourceWhereInput | undefined = includeLessonResources
      ? undefined
      : {
          lessons: {
            none: {
              courseId: { not: null }
            }
          }
        }

    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
      ...(where ? { where } : {})
    })
    return resources.map(transformResource)
  }

  static async findAllPaginated(options?: PaginationOptions & { includeLessonResources?: boolean }): Promise<{
    data: Resource[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const page = options?.page || 1
    const pageSize = options?.pageSize || 50
    const includeLessonResources = options?.includeLessonResources ?? false
    const skip = (page - 1) * pageSize
    const where: Prisma.ResourceWhereInput | undefined = includeLessonResources
      ? undefined
      : {
          lessons: {
            none: {
              courseId: { not: null }
            }
          }
        }

    const findManyArgs: Prisma.ResourceFindManyArgs = {
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      ...(where ? { where } : {})
    }

    const countArgs: Prisma.ResourceCountArgs = {
      ...(where ? { where } : {})
    }

    const [resources, totalItems] = await Promise.all([
      prisma.resource.findMany(findManyArgs),
      prisma.resource.count(countArgs)
    ])

    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      data: resources.map(transformResource),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  static async findById(id: string): Promise<Resource | null> {
    const resource = await prisma.resource.findUnique({
      where: { id }
    })
    return resource ? transformResource(resource) : null
  }

  static async findByIdWithNote(id: string): Promise<ResourceWithNote | null> {
    const resource = await prisma.resource.findUnique({
      where: { id }
    })
    
    if (!resource) return null
    
    // Fetch the associated Nostr note
    const note = await fetchNostrEvent(resource.noteId)
    
    return {
      ...transformResource(resource),
      note
    }
  }

  static async create(resourceData: Omit<Resource, 'id'>): Promise<Resource> {
    const resource = await prisma.resource.create({
      data: {
        ...resourceData,
        id: (resourceData as any).id || `resource-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        createdAt: new Date((resourceData as any).createdAt || new Date()),
        updatedAt: new Date((resourceData as any).updatedAt || new Date())
      }
    })
    return transformResource(resource)
  }

  static async update(id: string, updates: Partial<Resource>): Promise<Resource | null> {
    try {
      const resource = await prisma.resource.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      })
      return transformResource(resource)
    } catch (error) {
      return null
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.resource.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }

  static async findByUserId(userId: string): Promise<Resource[]> {
    const resources = await prisma.resource.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return resources.map(transformResource)
  }

  static async findByNoteId(noteId: string): Promise<Resource | null> {
    const resource = await prisma.resource.findUnique({
      where: { noteId }
    })
    return resource ? transformResource(resource) : null
  }

  static async findByVideoId(videoId: string): Promise<Resource | null> {
    const resource = await prisma.resource.findFirst({
      where: { videoId }
    })
    return resource ? transformResource(resource) : null
  }

  static async findFree(): Promise<Resource[]> {
    const resources = await prisma.resource.findMany({
      where: { price: 0 },
      orderBy: { createdAt: 'desc' }
    })
    return resources.map(transformResource)
  }

  static async findPaid(): Promise<Resource[]> {
    const resources = await prisma.resource.findMany({
      where: { price: { gt: 0 } },
      orderBy: { createdAt: 'desc' }
    })
    return resources.map(transformResource)
  }

  static async isLesson(resourceId: string): Promise<boolean> {
    const lesson = await prisma.lesson.findFirst({
      where: { 
        resourceId,
        courseId: { not: null }
      }
    })
    return !!lesson
  }
}

// ============================================================================
// LESSON ADAPTER
// ============================================================================

export class LessonAdapter {
  static async findAll(): Promise<Lesson[]> {
    const lessons = await prisma.lesson.findMany({
      orderBy: [
        { courseId: 'asc' },
        { index: 'asc' }
      ]
    })
    return lessons.map(transformLesson)
  }

  static async findById(id: string): Promise<Lesson | null> {
    const lesson = await prisma.lesson.findUnique({
      where: { id }
    })
    return lesson ? transformLesson(lesson) : null
  }

  static async findByCourseId(courseId: string): Promise<Lesson[]> {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { index: 'asc' }
    })
    return lessons.map(transformLesson)
  }

  static async findByResourceId(resourceId: string): Promise<Lesson[]> {
    const lessons = await prisma.lesson.findMany({
      where: { resourceId },
      orderBy: [
        { courseId: 'asc' },
        { index: 'asc' }
      ]
    })
    return lessons.map(transformLesson)
  }

  static async create(lessonData: Omit<Lesson, 'id'>): Promise<Lesson> {
    const lesson = await prisma.lesson.create({
      data: {
        ...lessonData,
        createdAt: new Date((lessonData as any).createdAt || new Date()),
        updatedAt: new Date((lessonData as any).updatedAt || new Date())
      }
    })
    return transformLesson(lesson)
  }

  static async update(id: string, updates: Partial<Lesson>): Promise<Lesson | null> {
    try {
      const lesson = await prisma.lesson.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      })
      return transformLesson(lesson)
    } catch (error) {
      return null
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.lesson.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }
}

// ============================================================================
// SEARCH FUNCTIONALITY
// ============================================================================

export interface SearchOptions {
  keyword: string
  minLength?: number
  page?: number
  pageSize?: number
}

export class SearchAdapter {
  static async searchCourses(options: SearchOptions): Promise<{
    data: CourseWithNote[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const { keyword, minLength = 3, page = 1, pageSize = 20 } = options
    
    if (!keyword || keyword.length < minLength) {
      return {
        data: [],
        pagination: {
          page,
          pageSize,
          totalItems: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }
    
    // For now, search by course ID only (since we don't have title/description in DB)
    // In production, this would search through Nostr events
    const skip = (page - 1) * pageSize
    
    const [courses, totalItems] = await Promise.all([
      prisma.course.findMany({
        where: {
          OR: [
            { id: { contains: keyword, mode: 'insensitive' } },
            { userId: { contains: keyword, mode: 'insensitive' } }
          ]
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({
        where: {
          OR: [
            { id: { contains: keyword, mode: 'insensitive' } },
            { userId: { contains: keyword, mode: 'insensitive' } }
          ]
        }
      })
    ])
    
    // Fetch Nostr events for courses
    const coursesWithNotes: CourseWithNote[] = await Promise.all(
      courses.map(async (course) => ({
        ...transformCourse(course),
        note: await fetchNostrEvent(course.noteId)
      }))
    )
    
    const totalPages = Math.ceil(totalItems / pageSize)
    
    return {
      data: coursesWithNotes,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }
  
  static async searchResources(options: SearchOptions): Promise<{
    data: ResourceWithNote[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const { keyword, minLength = 3, page = 1, pageSize = 20 } = options
    
    if (!keyword || keyword.length < minLength) {
      return {
        data: [],
        pagination: {
          page,
          pageSize,
          totalItems: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }
    
    const skip = (page - 1) * pageSize
    
    const [resources, totalItems] = await Promise.all([
      prisma.resource.findMany({
        where: {
          OR: [
            { id: { contains: keyword, mode: 'insensitive' } },
            { userId: { contains: keyword, mode: 'insensitive' } }
          ]
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.resource.count({
        where: {
          OR: [
            { id: { contains: keyword, mode: 'insensitive' } },
            { userId: { contains: keyword, mode: 'insensitive' } }
          ]
        }
      })
    ])
    
    // Fetch Nostr events for resources
    const resourcesWithNotes: ResourceWithNote[] = await Promise.all(
      resources.map(async (resource) => ({
        ...transformResource(resource),
        note: await fetchNostrEvent(resource.noteId)
      }))
    )
    
    const totalPages = Math.ceil(totalItems / pageSize)
    
    return {
      data: resourcesWithNotes,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }
  
  static async searchAll(options: SearchOptions): Promise<{
    courses: CourseWithNote[]
    resources: ResourceWithNote[]
    totalResults: number
  }> {
    const [coursesResult, resourcesResult] = await Promise.all([
      this.searchCourses(options),
      this.searchResources(options)
    ])
    
    return {
      courses: coursesResult.data,
      resources: resourcesResult.data,
      totalResults: coursesResult.pagination.totalItems + resourcesResult.pagination.totalItems
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// These functions should only be called from server-side code
export function getCoursesSync(): Course[] {
  console.warn('getCoursesSync() should only be called from server-side code')
  return []
}

export function getResourcesSync(): Resource[] {
  console.warn('getResourcesSync() should only be called from server-side code')
  return []
}

export function getLessonsSync(): Lesson[] {
  console.warn('getLessonsSync() should only be called from server-side code')
  return []
}

export function getSeedDataStats() {
  return {
    courses: 0,
    resources: 0,
    lessons: 0,
    coursesFromSeed: 0,
    resourcesFromSeed: 0,
    lessonsFromSeed: 0
  }
}

// Not applicable for real DB
export function resetSeedData() {
  console.warn('resetSeedData() is not applicable for real database')
}
