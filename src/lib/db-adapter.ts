/**
 * Database adapter for JSON seed data
 * Simulates database operations with JSON files
 */

import { Course, Resource, Lesson } from '@/data/types'
import { NostrEvent } from 'snstr'
import courseSeedData from '@/data/mockDb/Course.json'
import resourceSeedData from '@/data/mockDb/Resource.json'
import lessonSeedData from '@/data/mockDb/Lesson.json'

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

// Type the imported JSON data with proper transformations
const courseData: Course[] = courseSeedData.map(course => ({
  ...course,
  submissionRequired: course.submissionRequired === 'True' || course.submissionRequired === 'true'
})) as Course[]
const resourceData: Resource[] = resourceSeedData as Resource[]
const lessonData: Lesson[] = lessonSeedData.map(lesson => ({
  ...lesson,
  // Convert NULL strings to undefined for optional fields
  courseId: lesson.courseId === 'NULL' ? undefined : lesson.courseId,
  resourceId: lesson.resourceId === 'NULL' ? undefined : lesson.resourceId,
  draftId: lesson.draftId === 'NULL' ? undefined : lesson.draftId
})) as Lesson[]

// Mock Nostr events data - in a real app, these would be fetched from Nostr relays
// using the noteId references from the database records
const mockNostrEvents: NostrEvent[] = [
  // Course event for the starter course
  {
    id: "d2797459e3f15491b39225a68146d3ec375f71d01b57cfe3a559179777e20912",
    pubkey: "f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741",
    created_at: 1740860353,
    kind: 30004,
    content: "",
    sig: "example_signature",
    tags: [
      ["d", "f538f5c5-1a72-4804-8eb1-3f05cea64874"],
      ["name", "PlebDevs Starter Course"],
      ["about", "Welcome to the PlebDevs starter course! Complete beginner to capable developer course."],
      ["image", "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/plebdevs-starter.png"],
      ["t", "beginner"],
      ["t", "frontend"],
      ["t", "course"]
    ]
  } as NostrEvent
]

// In-memory storage for runtime modifications
let coursesInMemory: Course[] = [...courseData]
let resourcesInMemory: Resource[] = [...resourceData]
let lessonsInMemory: Lesson[] = [...lessonData]

// ============================================================================
// COURSE ADAPTER
// ============================================================================

export class CourseAdapter {
  static async findAll(): Promise<Course[]> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 30))
    return [...coursesInMemory]
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
    await new Promise(resolve => setTimeout(resolve, 30))
    
    const page = options?.page || 1
    const pageSize = options?.pageSize || 50
    const totalItems = coursesInMemory.length
    const totalPages = Math.ceil(totalItems / pageSize)
    
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const data = coursesInMemory.slice(startIndex, endIndex)
    
    return {
      data,
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
    await new Promise(resolve => setTimeout(resolve, 20))
    return coursesInMemory.find(course => course.id === id) || null
  }

  static async findByIdWithNote(id: string): Promise<CourseWithNote | null> {
    await new Promise(resolve => setTimeout(resolve, 20))
    const course = coursesInMemory.find(course => course.id === id)
    if (!course) return null
    
    // Find the associated Nostr note - simulate fetching by noteId
    const note = mockNostrEvents.find(event => event.id === course.noteId) || mockNostrEvents[0]
    
    return {
      ...course,
      note: note || undefined
    }
  }

  static async create(courseData: Omit<Course, 'id'>): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    }
    
    coursesInMemory.push(newCourse)
    return newCourse
  }

  static async update(id: string, updates: Partial<Course>): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const index = coursesInMemory.findIndex(course => course.id === id)
    if (index === -1) return null
    
    coursesInMemory[index] = { ...coursesInMemory[index], ...updates }
    return coursesInMemory[index]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const index = coursesInMemory.findIndex(course => course.id === id)
    if (index === -1) return false
    
    coursesInMemory.splice(index, 1)
    return true
  }

  static async findByUserId(userId: string): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    return coursesInMemory.filter(course => course.userId === userId)
  }

  static async findByNoteId(noteId: string): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 20))
    return coursesInMemory.find(course => course.noteId === noteId) || null
  }
}

// ============================================================================
// RESOURCE ADAPTER
// ============================================================================

export class ResourceAdapter {
  static async findAll(): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    return [...resourcesInMemory]
  }

  static async findAllPaginated(options?: PaginationOptions): Promise<{
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
    await new Promise(resolve => setTimeout(resolve, 30))
    
    const page = options?.page || 1
    const pageSize = options?.pageSize || 50
    const totalItems = resourcesInMemory.length
    const totalPages = Math.ceil(totalItems / pageSize)
    
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const data = resourcesInMemory.slice(startIndex, endIndex)
    
    return {
      data,
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
    await new Promise(resolve => setTimeout(resolve, 20))
    return resourcesInMemory.find(resource => resource.id === id) || null
  }

  static async findByIdWithNote(id: string): Promise<ResourceWithNote | null> {
    await new Promise(resolve => setTimeout(resolve, 20))
    const resource = resourcesInMemory.find(resource => resource.id === id)
    if (!resource) return null
    
    // Find the associated Nostr note - simulate fetching by noteId
    const note = mockNostrEvents.find(event => event.id === resource.noteId)
    
    return {
      ...resource,
      note: note || undefined
    }
  }

  static async create(resourceData: Omit<Resource, 'id'>): Promise<Resource> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const newResource: Resource = {
      ...resourceData,
      id: `resource-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    }
    
    resourcesInMemory.push(newResource)
    return newResource
  }

  static async update(id: string, updates: Partial<Resource>): Promise<Resource | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const index = resourcesInMemory.findIndex(resource => resource.id === id)
    if (index === -1) return null
    
    resourcesInMemory[index] = { ...resourcesInMemory[index], ...updates }
    return resourcesInMemory[index]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const index = resourcesInMemory.findIndex(resource => resource.id === id)
    if (index === -1) return false
    
    resourcesInMemory.splice(index, 1)
    return true
  }

  static async findByUserId(userId: string): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    return resourcesInMemory.filter(resource => resource.userId === userId)
  }

  static async findByNoteId(noteId: string): Promise<Resource | null> {
    await new Promise(resolve => setTimeout(resolve, 20))
    return resourcesInMemory.find(resource => resource.noteId === noteId) || null
  }

  static async findByVideoId(videoId: string): Promise<Resource | null> {
    await new Promise(resolve => setTimeout(resolve, 20))
    return resourcesInMemory.find(resource => resource.videoId === videoId) || null
  }

  static async findFree(): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    return resourcesInMemory.filter(resource => resource.price === 0)
  }

  static async findPaid(): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    return resourcesInMemory.filter(resource => resource.price > 0)
  }

  static async isLesson(resourceId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 20))
    return lessonsInMemory.some(lesson => lesson.resourceId === resourceId && lesson.courseId !== undefined)
  }
}

// ============================================================================
// LESSON ADAPTER
// ============================================================================

export class LessonAdapter {
  static async findAll(): Promise<Lesson[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    return [...lessonsInMemory]
  }

  static async findById(id: string): Promise<Lesson | null> {
    await new Promise(resolve => setTimeout(resolve, 20))
    return lessonsInMemory.find(lesson => lesson.id === id) || null
  }

  static async findByCourseId(courseId: string): Promise<Lesson[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    return lessonsInMemory
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.index - b.index)
  }

  static async findByResourceId(resourceId: string): Promise<Lesson[]> {
    await new Promise(resolve => setTimeout(resolve, 30))
    return lessonsInMemory.filter(lesson => lesson.resourceId === resourceId)
  }

  static async create(lessonData: Omit<Lesson, 'id'>): Promise<Lesson> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    }
    
    lessonsInMemory.push(newLesson)
    return newLesson
  }

  static async update(id: string, updates: Partial<Lesson>): Promise<Lesson | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const index = lessonsInMemory.findIndex(lesson => lesson.id === id)
    if (index === -1) return null
    
    lessonsInMemory[index] = { ...lessonsInMemory[index], ...updates }
    return lessonsInMemory[index]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const index = lessonsInMemory.findIndex(lesson => lesson.id === id)
    if (index === -1) return false
    
    lessonsInMemory.splice(index, 1)
    return true
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function resetSeedData() {
  coursesInMemory = [...courseData]
  resourcesInMemory = [...resourceData]
  lessonsInMemory = [...lessonData]
}

export function getSeedDataStats() {
  return {
    courses: coursesInMemory.length,
    resources: resourcesInMemory.length,
    lessons: lessonsInMemory.length,
    coursesFromSeed: courseData.length,
    resourcesFromSeed: resourceData.length,
    lessonsFromSeed: lessonData.length
  }
}

// Synchronous access for backwards compatibility (temporary)
export function getCoursesSync(): Course[] {
  return [...coursesInMemory]
}

export function getResourcesSync(): Resource[] {
  return [...resourcesInMemory]
}

export function getLessonsSync(): Lesson[] {
  return [...lessonsInMemory]
}