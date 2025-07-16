/**
 * TanStack Query hook for fetching video resources with their associated Nostr notes
 * Combines data from fake DB and Nostr network with intelligent caching
 * Filters resources by video type using Nostr note tags
 */

import { useQuery } from '@tanstack/react-query'
import { ResourceAdapter } from '@/lib/db-adapter'
import { useSnstrContext } from '@/contexts/snstr-context'
import { Resource } from '@/data/types'
import { NostrEvent, RelayPool, decodeAddress } from 'snstr'

// Types for enhanced video resource data
export interface VideoResourceWithNote extends Resource {
  note?: NostrEvent
  noteError?: string
}

export interface VideosQueryResult {
  videos: VideoResourceWithNote[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

// Query keys factory for better cache management
export const videosQueryKeys = {
  all: ['videos'] as const,
  lists: () => [...videosQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...videosQueryKeys.lists(), { filters }] as const,
  details: () => [...videosQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...videosQueryKeys.details(), id] as const,
  notes: () => [...videosQueryKeys.all, 'notes'] as const,
  note: (noteId: string) => [...videosQueryKeys.notes(), noteId] as const,
}

// Options for the hook
export interface UseVideosQueryOptions {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: boolean | number
  retryDelay?: number
  select?: (data: VideoResourceWithNote[]) => VideoResourceWithNote[]
}

/**
 * Check if a resource is a video based on its Nostr note tags
 */
function isVideoResource(note?: NostrEvent): boolean {
  if (!note || !note.tags) return false
  return note.tags.some(tag => tag[0] === 't' && tag[1] === 'video')
}

/**
 * Fetch video resources with their associated Nostr notes efficiently
 * Uses batch querying to fetch all notes at once, then filters for video resources
 */
async function fetchVideosWithNotes(relayPool: RelayPool): Promise<VideoResourceWithNote[]> {
  // First, fetch all resources from the fake DB
  const resources = await ResourceAdapter.findAll()

  console.log("resources", resources);
  
  const noteIds = resources
    .filter(resource => resource.id)
    .map(resource => resource.id)
  
  // If no notes to fetch, return empty array
  if (noteIds.length === 0) {
    return []
  }

  console.log(`Fetching ${noteIds.length} resource notes in batch:`, noteIds);
  
  // Fetch all notes at once using RelayPool's querySync method
  let notes: NostrEvent[] = []
  let noteError: string | undefined

  try {
    notes = await relayPool.querySync(
      ['wss://relay.primal.net', 'wss://relay.damus.io', 'wss://nos.lol'],
      { "#d": noteIds, kinds: [30023, 30403] } // Batch query by IDs
    )
    console.log(`Successfully fetched ${notes.length} resource notes`);
  } catch (error) {
    console.error('Failed to fetch resource notes in batch:', error)
    noteError = error instanceof Error ? error.message : 'Failed to fetch notes'
  }

  // Create a Map for O(1) lookup of notes by ID
  const notesMap = new Map<string, NostrEvent>()
  notes.forEach(note => notesMap.set(note.tags.find(tag => tag[0] === "d")?.[1] || '', note))

  // Combine resources with their notes and filter for videos only
  const resourcesWithNotes = await Promise.all(resources
    .map(async (resource) => {
      // filter out if it is a lesson
      // todo: eventually we want to do this right in the UI component since only homepage carousels will filter out lessons later on.
      const isLesson = await ResourceAdapter.isLesson(resource.id)
      if (isLesson) {
        return null
      }
      const note = resource.id ? notesMap.get(resource.id) : undefined
      
      return {
        ...resource,
        note,
        noteError: resource.noteId && !note ? noteError : undefined,
      }
    }))

  const videosWithNotes = resourcesWithNotes
    .filter(resource => resource !== null && isVideoResource(resource.note)) as VideoResourceWithNote[]

  console.log(`Filtered ${videosWithNotes.length} video resources from ${resources.length} total resources`);

  return videosWithNotes
}

/**
 * Main hook for fetching video resources with their Nostr notes
 */
export function useVideosQuery(options: UseVideosQueryOptions = {}): VideosQueryResult {
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
    queryKey: videosQueryKeys.lists(),
    queryFn: () => fetchVideosWithNotes(relayPool),
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
    videos: finalData,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}



