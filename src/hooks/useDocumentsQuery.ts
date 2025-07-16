/**
 * TanStack Query hook for fetching document resources with their associated Nostr notes
 * Combines data from fake DB and Nostr network with intelligent caching
 * Filters resources by document type using Nostr note tags
 */

import { useQuery } from '@tanstack/react-query'
import { ResourceAdapter } from '@/lib/db-adapter'
import { useSnstrContext } from '@/contexts/snstr-context'
import { Resource } from '@/data/types'
import { NostrEvent, RelayPool, decodeAddress } from 'snstr'

// Types for enhanced document resource data
export interface DocumentResourceWithNote extends Resource {
  note?: NostrEvent
  noteError?: string
}

export interface DocumentsQueryResult {
  documents: DocumentResourceWithNote[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

// Query keys factory for better cache management
export const documentsQueryKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...documentsQueryKeys.lists(), { filters }] as const,
  details: () => [...documentsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentsQueryKeys.details(), id] as const,
  notes: () => [...documentsQueryKeys.all, 'notes'] as const,
  note: (noteId: string) => [...documentsQueryKeys.notes(), noteId] as const,
}

// Options for the hook
export interface UseDocumentsQueryOptions {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: boolean | number
  retryDelay?: number
  select?: (data: DocumentResourceWithNote[]) => DocumentResourceWithNote[]
}

/**
 * Check if a resource is a document based on its Nostr note tags
 */
function isDocumentResource(note?: NostrEvent): boolean {
  if (!note || !note.tags) return false
  return note.tags.some(tag => tag[0] === 't' && tag[1] === 'document')
}

/**
 * Fetch document resources with their associated Nostr notes efficiently
 * Uses batch querying to fetch all notes at once, then filters for document resources
 */
async function fetchDocumentsWithNotes(relayPool: RelayPool): Promise<DocumentResourceWithNote[]> {
  // First, fetch all resources from the fake DB
  const resources = await ResourceAdapter.findAll()

  const noteIds = resources
    .filter(resource => resource.noteId && resource.noteId.startsWith('naddr1'))
    .map(resource => decodeAddress(resource.noteId! as `${string}1${string}`))
    .map(address => address.identifier)
  
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
      ['wss://relay.primal.net', 'wss://relay.damus.io'],
      { "#d": noteIds, kinds: [30023, 30403] } // Batch query by IDs
    )
    console.log(`Successfully fetched ${notes.length} resource notes`);
  } catch (error) {
    console.error('Failed to fetch resource notes in batch:', error)
    noteError = error instanceof Error ? error.message : 'Failed to fetch notes'
  }

  // Create a Map for O(1) lookup of notes by the "d" tag
  const notesMap = new Map<string, NostrEvent>()
  notes.forEach(note => notesMap.set(note.tags.find(tag => tag[0] === "d")?.[1] || '', note))

  // Combine resources with their notes and filter for documents only
  const resourcesWithNotes = await Promise.all(resources
    .map(async (resource) => {
      const note = resource.id ? notesMap.get(resource.id) : undefined
      // filter out if it is a lesson
      // todo: eventually we want to do this right in the UI component since only homepage carousels will filter out lessons later on.
      const isLesson = await ResourceAdapter.isLesson(resource.id)
      if (isLesson) {
        return null
      }

      return {
        ...resource,
        note,
        noteError: resource.noteId && !note ? noteError : undefined,
      }
    }))

  const documentsWithNotes = resourcesWithNotes
    .filter(resource => resource !== null && isDocumentResource(resource.note)) as DocumentResourceWithNote[]

  console.log(`Filtered ${documentsWithNotes.length} document resources from ${resources.length} total resources`);

  return documentsWithNotes
}

/**
 * Main hook for fetching document resources with their Nostr notes
 */
export function useDocumentsQuery(options: UseDocumentsQueryOptions = {}): DocumentsQueryResult {
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
    queryKey: documentsQueryKeys.lists(),
    queryFn: () => fetchDocumentsWithNotes(relayPool),
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
    documents: finalData,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for fetching a single document resource with its note
 */
export function useDocumentQuery(
  resourceId: string,
  options: UseDocumentsQueryOptions = {}
) {
  const { relayPool } = useSnstrContext()
  
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    gcTime = 10 * 60 * 1000,
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
  } = options

  return useQuery({
    queryKey: documentsQueryKeys.detail(resourceId),
    queryFn: async (): Promise<DocumentResourceWithNote | null> => {
      const resource = await ResourceAdapter.findById(resourceId)
      if (!resource) return null

      let note: NostrEvent | null = null
      let noteError: string | undefined

      if (resource.noteId) {
        try {
          const notes = await relayPool.querySync(
            ['wss://relay.primal.net', 'wss://relay.damus.io'],
            { ids: [resource.noteId] }
          )
          note = notes.length > 0 ? notes[0] : null
        } catch (error) {
          noteError = error instanceof Error ? error.message : 'Failed to fetch note'
        }
      }

      const resourceWithNote = {
        ...resource,
        note: note || undefined,
        noteError,
      }

      // Only return if it's a document resource
      if (!isDocumentResource(resourceWithNote.note)) {
        return null
      }

      return resourceWithNote
    },
    enabled: enabled && !!resourceId,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    retryDelay,
  })
}

/**
 * Hook for fetching document resources by user ID
 */
export function useUserDocumentsQuery(
  userId: string,
  options: UseDocumentsQueryOptions = {}
) {
  const { relayPool } = useSnstrContext()
  
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    gcTime = 10 * 60 * 1000,
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
    select,
  } = options

  return useQuery({
    queryKey: documentsQueryKeys.list(`user:${userId}`),
    queryFn: async (): Promise<DocumentResourceWithNote[]> => {
      const resources = await ResourceAdapter.findByUserId(userId)
      
      // Extract all noteIds that exist for this user's resources
      const noteIds = resources
        .filter(resource => resource.noteId)
        .map(resource => resource.noteId!)
      
      // If no notes to fetch, return empty array
      if (noteIds.length === 0) {
        return []
      }

      // Fetch all notes at once using batch query
      let notes: NostrEvent[] = []
      let noteError: string | undefined

      try {
        notes = await relayPool.querySync(
          ['wss://relay.primal.net', 'wss://relay.damus.io'],
          { ids: noteIds }
        )
        console.log(`Fetched ${notes.length} notes for user ${userId} resources`);
      } catch (error) {
        console.error(`Failed to fetch notes for user ${userId} resources:`, error)
        noteError = error instanceof Error ? error.message : 'Failed to fetch notes'
      }

      // Create a Map for O(1) lookup of notes by ID
      const notesMap = new Map<string, NostrEvent>()
      notes.forEach(note => notesMap.set(note.id, note))

      // Combine resources with their notes and filter for documents only
      const documentsWithNotes = resources
        .map(resource => {
          const note = resource.noteId ? notesMap.get(resource.noteId) : undefined

          return {
            ...resource,
            note,
            noteError: resource.noteId && !note ? noteError : undefined,
          }
        })
        .filter(resource => isDocumentResource(resource.note))

      return select ? select(documentsWithNotes) : documentsWithNotes
    },
    enabled: enabled && !!userId,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    retryDelay,
  })
}

/**
 * Utility function to get query keys for cache invalidation
 */
export function getDocumentsQueryKeys() {
  return documentsQueryKeys
}
