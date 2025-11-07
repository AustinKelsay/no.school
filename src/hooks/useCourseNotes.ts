/**
 * Hook for fetching Nostr course notes (kind 30004) with batching support
 * Mirrors the API of useResourceNotes so content views can combine results
 */

import { useQuery } from '@tanstack/react-query'
import type {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from '@tanstack/react-query'
import { useSnstrContext } from '@/contexts/snstr-context'
import { NostrEvent, RelayPool } from 'snstr'

export interface CourseNoteResult {
  note?: NostrEvent
  noteError?: string
}

export interface CourseNotesQueryResult {
  notes: Map<string, CourseNoteResult>
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: (
    courseId?: string,
    options?: RefetchOptions &
      RefetchQueryFilters<Map<string, CourseNoteResult>>
  ) => Promise<QueryObserverResult<Map<string, CourseNoteResult>, Error>>
}

export interface UseCourseNotesOptions {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: boolean | number
  retryDelay?: number
}

export const courseNotesQueryKeys = {
  all: ['course-notes'] as const,
  batch: (courseIds: string[]) => [
    ...courseNotesQueryKeys.all,
    'batch',
    [...courseIds].sort().join(','),
  ] as const,
}

async function fetchCourseNotesBatch(
  courseIds: string[],
  relayPool: RelayPool,
  relays: string[]
): Promise<Map<string, CourseNoteResult>> {
  const results = new Map<string, CourseNoteResult>()

  const validIds = courseIds.filter(id => id && id.length > 0)
  if (validIds.length === 0) {
    return results
  }

  try {
    const notes = await relayPool.querySync(
      relays,
      { '#d': validIds, kinds: [30004] },
      { timeout: 5000 }
    )

    const notesMap = new Map<string, NostrEvent>()
    notes.forEach(note => {
      const dTag = note.tags.find(tag => tag[0] === 'd')
      if (dTag && dTag[1]) {
        notesMap.set(dTag[1], note)
      }
    })

    validIds.forEach(id => {
      const note = notesMap.get(id)
      results.set(id, {
        note,
        noteError: note ? undefined : 'Note not found',
      })
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch course notes'
    validIds.forEach(id => {
      results.set(id, {
        noteError: errorMessage,
      })
    })
  }

  return results
}

export function useCourseNotes(
  courseIds: string[],
  options: UseCourseNotesOptions = {}
): CourseNotesQueryResult {
  const { relayPool, relays } = useSnstrContext()
  const {
    enabled = true,
    staleTime = 10 * 60 * 1000,
    gcTime = 30 * 60 * 1000,
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    retry = 3,
    retryDelay = 1000,
  } = options

  const sortedIds = [...courseIds].sort()

  const query = useQuery({
    queryKey: courseNotesQueryKeys.batch(sortedIds),
    queryFn: () => fetchCourseNotesBatch(sortedIds, relayPool, relays),
    enabled: enabled && sortedIds.length > 0,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  const refetch: CourseNotesQueryResult['refetch'] = (courseId, options) => {
    void courseId // allow hook consumers to pass course-specific identifiers
    return query.refetch(options)
  }

  return {
    notes: query.data || new Map(),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch,
  }
}

export function useCourseNote(
  courseId: string,
  options: UseCourseNotesOptions = {}
): {
  note?: NostrEvent
  noteError?: string
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: CourseNotesQueryResult['refetch']
} {
  const result = useCourseNotes(courseId ? [courseId] : [], options)
  const noteResult = result.notes.get(courseId)

  return {
    note: noteResult?.note,
    noteError: noteResult?.noteError,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}
