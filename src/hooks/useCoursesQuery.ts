/**
 * TanStack Query hook for fetching courses with their associated Nostr notes
 * Combines data from fake DB and Nostr network with intelligent caching
 */

import { useQuery } from '@tanstack/react-query'
import { CourseAdapter, LessonAdapter, ResourceAdapter } from '@/lib/db-adapter'
import { useSnstrContext } from '@/contexts/snstr-context'
import { Course, Lesson, Resource } from '@/data/types'
import { NostrEvent, RelayPool } from 'snstr'

// Types for enhanced course data
export interface CourseWithNote extends Course {
  note?: NostrEvent
  noteError?: string
}

export interface LessonWithResource extends Lesson {
  resource?: ResourceWithNote
}

export interface CourseWithLessons extends CourseWithNote {
  lessons: LessonWithResource[]
}

export interface ResourceWithNote extends Resource {
  note?: NostrEvent
  noteError?: string
}

export interface LessonWithDetails extends Lesson {
  resource?: ResourceWithNote
  course?: CourseWithNote
}

export interface CoursesQueryResult {
  courses: CourseWithNote[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export interface CourseQueryResult {
  course: CourseWithLessons | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export interface LessonQueryResult {
  lesson: LessonWithDetails | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

// Query keys factory for better cache management
export const coursesQueryKeys = {
  all: ['courses'] as const,
  lists: () => [...coursesQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...coursesQueryKeys.lists(), { filters }] as const,
  details: () => [...coursesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...coursesQueryKeys.details(), id] as const,
  notes: () => [...coursesQueryKeys.all, 'notes'] as const,
  note: (noteId: string) => [...coursesQueryKeys.notes(), noteId] as const,
  lessons: () => [...coursesQueryKeys.all, 'lessons'] as const,
  lesson: (courseId: string, lessonId: string) => [...coursesQueryKeys.lessons(), courseId, lessonId] as const,
}

// Options for the hook
export interface UseCoursesQueryOptions {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: boolean | number
  retryDelay?: number
  select?: (data: CourseWithNote[]) => CourseWithNote[]
}

// Options for single course query
export interface UseCourseQueryOptions {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: boolean | number
  retryDelay?: number
}

// Options for single lesson query
export interface UseLessonQueryOptions {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: boolean | number
  retryDelay?: number
}

/**
 * Fetch a single lesson with its resource and course details
 */
async function fetchLessonWithDetails(
  courseId: string, 
  lessonId: string, 
  relayPool: RelayPool
): Promise<LessonWithDetails | null> {
  // First, fetch the lesson
  const lesson = await LessonAdapter.findById(lessonId)
  if (!lesson) {
    return null
  }

  // Verify the lesson belongs to the course
  if (lesson.courseId !== courseId) {
    return null
  }

  // Fetch course and resource in parallel
  const [course, resource] = await Promise.all([
    CourseAdapter.findByIdWithNote(courseId),
    lesson.resourceId ? ResourceAdapter.findByIdWithNote(lesson.resourceId) : null
  ])

  // Collect IDs that need Nostr notes fetched using 'd' tag queries
  const idsToFetch = []
  if (course?.id && !course.note) {
    idsToFetch.push(course.id)
  }
  if (resource?.id && !resource.note) {
    idsToFetch.push(resource.id)
  }

  if (idsToFetch.length > 0) {
    try {
      console.log(`Fetching ${idsToFetch.length} notes for lesson using real Nostr data`)
      
      const notes = await relayPool.querySync(
        ['wss://relay.primal.net', 'wss://relay.damus.io', 'wss://nos.lol'],
        { "#d": idsToFetch, kinds: [30004, 30023, 30402] },
        { timeout: 10000 }
      )
      
      console.log(`Successfully fetched ${notes.length} notes for lesson from real Nostr`)
      
      const notesMap = new Map<string, NostrEvent>()
      notes.forEach(note => {
        const dTag = note.tags.find(tag => tag[0] === 'd')
        if (dTag && dTag[1]) {
          notesMap.set(dTag[1], note)
        }
      })
      
      // Update course note if found
      if (course?.id && notesMap.has(course.id)) {
        course.note = notesMap.get(course.id)
      }
      
      // Update resource note if found
      if (resource?.id && notesMap.has(resource.id)) {
        resource.note = notesMap.get(resource.id)
      }
    } catch (error) {
      console.error('Failed to fetch notes for lesson:', error)
      if (course?.id && !course.note) {
        course.noteError = error instanceof Error ? error.message : 'Failed to fetch note'
      }
      if (resource?.id && !resource.note) {
        resource.noteError = error instanceof Error ? error.message : 'Failed to fetch note'
      }
    }
  }

  return {
    ...lesson,
    resource: resource || undefined,
    course: course || undefined
  }
}

/**
 * Hook for fetching a single lesson with its resource and course details
 */
export function useLessonQuery(
  courseId: string, 
  lessonId: string, 
  options: UseLessonQueryOptions = {}
): LessonQueryResult {
  const { relayPool } = useSnstrContext()
  
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    retry = 3,
    retryDelay = 1000,
  } = options

  const query = useQuery({
    queryKey: coursesQueryKeys.lesson(courseId, lessonId),
    queryFn: () => fetchLessonWithDetails(courseId, lessonId, relayPool),
    enabled: enabled && !!courseId && !!lessonId,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  return {
    lesson: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Fetch courses with their associated Nostr notes efficiently
 * Uses batch querying to fetch all notes at once instead of individual requests
 */
async function fetchCoursesWithNotes(relayPool: RelayPool): Promise<CourseWithNote[]> {
  // First, fetch all courses from the fake DB
  const courses = await CourseAdapter.findAll()

  console.log("courses", courses);
  
  // Extract all course IDs for 'd' tag queries
  const courseIds = courses.map(course => course.id)
  
  // If no courses to fetch, return courses as-is
  if (courseIds.length === 0) {
    return courses.map(course => ({ ...course }))
  }

  console.log(`Fetching ${courseIds.length} course notes from real Nostr relays using 'd' tags:`, courseIds);
  
  // Fetch all notes at once using RelayPool's querySync method with 'd' tag queries
  let notes: NostrEvent[] = []
  let noteError: string | undefined

  try {
    notes = await relayPool.querySync(
      ['wss://relay.primal.net', 'wss://relay.damus.io', 'wss://nos.lol'],
      { "#d": courseIds, kinds: [30004, 30023, 30402] }, // Query by 'd' tag for course list and content events
      { timeout: 10000 }
    )
    console.log(`Successfully fetched ${notes.length} course notes from real Nostr`);
  } catch (error) {
    console.error('Failed to fetch course notes from real Nostr:', error)
    noteError = error instanceof Error ? error.message : 'Failed to fetch notes'
  }

  // Create a Map for O(1) lookup of notes by 'd' tag value
  const notesMap = new Map<string, NostrEvent>()
  notes.forEach(note => {
    const dTag = note.tags.find(tag => tag[0] === 'd')
    if (dTag && dTag[1]) {
      notesMap.set(dTag[1], note)
    }
  })

  // Combine courses with their notes
  const coursesWithNotes = courses.map(course => {
    const note = notesMap.get(course.id)
    
    return {
      ...course,
      note,
      noteError: !note ? noteError : undefined,
    }
  })

  return coursesWithNotes
}

/**
 * Fetch a single course with its lessons and Nostr note
 */
async function fetchCourseWithLessons(courseId: string, relayPool: RelayPool): Promise<CourseWithLessons | null> {
  // Fetch course with note and lessons in parallel
  const [courseWithNote, lessons] = await Promise.all([
    CourseAdapter.findByIdWithNote(courseId),
    LessonAdapter.findByCourseId(courseId)
  ])

  if (!courseWithNote) {
    return null
  }

  // Fetch resources for all lessons that have resourceId
  const resourceIds = lessons.filter(lesson => lesson.resourceId).map(lesson => lesson.resourceId!)
  const resourcePromises = resourceIds.map(id => ResourceAdapter.findByIdWithNote(id))
  const resourceResults = await Promise.all(resourcePromises)
  const resources = resourceResults.filter((resource): resource is ResourceWithNote => resource !== null)

  // Create a map of resources by ID for quick lookup
  const resourcesMap = new Map<string, ResourceWithNote>()
  resources.forEach((resource: ResourceWithNote) => resourcesMap.set(resource.id, resource))

  // Collect all IDs that need Nostr notes fetched (course ID + resource IDs)
  const idsToFetch = [courseId, ...resourceIds]

  // Fetch notes by 'd' tag in one batch query
  if (idsToFetch.length > 0) {
    try {
      console.log(`Fetching ${idsToFetch.length} notes from real Nostr relays for course`)
      
      const notes = await relayPool.querySync(
        ['wss://relay.primal.net', 'wss://relay.damus.io', 'wss://nos.lol'],
        { "#d": idsToFetch, kinds: [30004, 30023, 30402] }, // Course lists and content events
        { timeout: 10000 }
      )
      
      console.log(`Successfully fetched ${notes.length} notes from real Nostr for course`)
      
      const notesMap = new Map<string, NostrEvent>()
      notes.forEach(note => {
        const dTag = note.tags.find(tag => tag[0] === 'd')
        if (dTag && dTag[1]) {
          notesMap.set(dTag[1], note)
        }
      })
      
      // Update course note if found
      if (notesMap.has(courseId)) {
        courseWithNote.note = notesMap.get(courseId)
      }
      
      // Update resource notes if found
      resources.forEach((resource: ResourceWithNote) => {
        if (notesMap.has(resource.id)) {
          resource.note = notesMap.get(resource.id)
          resourcesMap.set(resource.id, resource)
        }
      })
    } catch (error) {
      console.error('Failed to fetch notes for course and lessons:', error)
      if (courseWithNote.noteId && !courseWithNote.note) {
        courseWithNote.noteError = error instanceof Error ? error.message : 'Failed to fetch note'
      }
      resources.forEach((resource: ResourceWithNote) => {
        if (resource.noteId && !resource.note) {
          resource.noteError = error instanceof Error ? error.message : 'Failed to fetch note'
          resourcesMap.set(resource.id, resource)
        }
      })
    }
  }

  // Create lessons with their associated resources
  const lessonsWithResources: LessonWithResource[] = lessons.map(lesson => ({
    ...lesson,
    resource: lesson.resourceId ? resourcesMap.get(lesson.resourceId) : undefined
  }))

  return {
    ...courseWithNote,
    lessons: lessonsWithResources.sort((a, b) => a.index - b.index)
  }
}

/**
 * Hook for fetching a single course with its lessons and Nostr note
 */
export function useCourseQuery(courseId: string, options: UseCourseQueryOptions = {}): CourseQueryResult {
  const { relayPool } = useSnstrContext()
  
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    retry = 3,
    retryDelay = 1000,
  } = options

  const query = useQuery({
    queryKey: coursesQueryKeys.detail(courseId),
    queryFn: () => fetchCourseWithLessons(courseId, relayPool),
    enabled: enabled && !!courseId,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  return {
    course: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Main hook for fetching courses with their Nostr notes
 */
export function useCoursesQuery(options: UseCoursesQueryOptions = {}): CoursesQueryResult {
  const { relayPool } = useSnstrContext()
  
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    retry = 3,
    retryDelay = 1000,
    select,
  } = options

  const query = useQuery({
    queryKey: coursesQueryKeys.lists(),
    queryFn: () => fetchCoursesWithNotes(relayPool),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  // Apply select transformation if provided
  const finalData = select && query.data ? select(query.data) : query.data || []

  return {
    courses: finalData,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}



