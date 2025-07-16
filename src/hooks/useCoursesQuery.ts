/**
 * TanStack Query hook for fetching courses with their associated Nostr notes
 * Combines data from fake DB and Nostr network with intelligent caching
 */

import { useQuery } from '@tanstack/react-query'
import { CourseAdapter } from '@/lib/db-adapter'
import { useSnstrContext } from '@/contexts/snstr-context'
import { Course } from '@/data/types'
import { NostrEvent, RelayPool } from 'snstr'

// Types for enhanced course data
export interface CourseWithNote extends Course {
  note?: NostrEvent
  noteError?: string
}

export interface CoursesQueryResult {
  courses: CourseWithNote[]
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


/**
 * Fetch courses with their associated Nostr notes efficiently
 * Uses batch querying to fetch all notes at once instead of individual requests
 */
async function fetchCoursesWithNotes(relayPool: RelayPool): Promise<CourseWithNote[]> {
  // First, fetch all courses from the fake DB
  const courses = await CourseAdapter.findAll()

  console.log("courses", courses);
  
  // Extract all noteIds that exist
  const noteIds = courses
    .filter(course => course.noteId)
    .map(course => course.noteId!)
  
  // If no notes to fetch, return courses as-is
  if (noteIds.length === 0) {
    return courses.map(course => ({ ...course }))
  }

  console.log(`Fetching ${noteIds.length} notes in batch:`, noteIds);
  
  // Fetch all notes at once using RelayPool's querySync method
  let notes: NostrEvent[] = []
  let noteError: string | undefined

  try {
    notes = await relayPool.querySync(
      ['wss://relay.primal.net', 'wss://relay.damus.io', 'wss://nos.lol'],
      { ids: noteIds }, // Batch query by IDs
      { timeout: 10000 }
    )
    console.log(`Successfully fetched ${notes.length} notes`);
  } catch (error) {
    console.error('Failed to fetch notes in batch:', error)
    noteError = error instanceof Error ? error.message : 'Failed to fetch notes'
  }

  // Create a Map for O(1) lookup of notes by ID
  const notesMap = new Map<string, NostrEvent>()
  notes.forEach(note => notesMap.set(note.id, note))

  // Combine courses with their notes
  const coursesWithNotes = courses.map(course => {
    const note = course.noteId ? notesMap.get(course.noteId) : undefined
    
    return {
      ...course,
      note,
      noteError: course.noteId && !note ? noteError : undefined,
    }
  })

  return coursesWithNotes
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



