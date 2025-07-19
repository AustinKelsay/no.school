/**
 * TanStack Query hook for fetching document resources with their associated Nostr notes
 * Combines data from fake DB and Nostr network with intelligent caching
 * Filters resources by document type using Nostr note tags
 */

import { useQuery } from '@tanstack/react-query'
import { ResourceAdapter, PaginationOptions } from '@/lib/db-adapter'
import { Resource } from '@/data/types'
import { useResourceNotes, filterNotesByContentType } from './useResourceNotes'
import { NostrEvent } from 'snstr'

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
  pagination?: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Query keys factory for better cache management
export const documentsQueryKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...documentsQueryKeys.lists(), { filters }] as const,
  listPaginated: (page: number, pageSize: number) => [...documentsQueryKeys.lists(), { page, pageSize }] as const,
  details: () => [...documentsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentsQueryKeys.details(), id] as const,
  notes: () => [...documentsQueryKeys.all, 'notes'] as const,
  note: (noteId: string) => [...documentsQueryKeys.notes(), noteId] as const,
}

// Options for the hook
export interface UseDocumentsQueryOptions extends PaginationOptions {
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
 * Fetch document resources using unified resource notes fetching
 * Now leverages shared caching and deduplication via useResourceNotes
 */
export async function fetchDocumentResources(options?: PaginationOptions): Promise<{ 
  resources: Resource[], 
  pagination?: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  // If pagination options provided, use paginated method
  if (options?.page !== undefined || options?.pageSize !== undefined) {
    const result = await ResourceAdapter.findAllPaginated(options)
    
    // Filter out lessons at the resource level
    const resourcesWithoutLessons = await Promise.all(
      result.data.map(async (resource: Resource) => {
        const isLesson = await ResourceAdapter.isLesson(resource.id)
        return isLesson ? null : resource
      })
    )
    
    return {
      resources: resourcesWithoutLessons.filter((resource: Resource | null): resource is Resource => resource !== null),
      pagination: result.pagination
    }
  }
  
  // Legacy: fetch all resources
  const resources = await ResourceAdapter.findAll()
  const resourcesWithoutLessons = await Promise.all(
    resources.map(async (resource) => {
      const isLesson = await ResourceAdapter.isLesson(resource.id)
      return isLesson ? null : resource
    })
  )

  return {
    resources: resourcesWithoutLessons.filter(resource => resource !== null) as Resource[]
  }
}

/**
 * Main hook for fetching document resources with their Nostr notes
 * Now uses unified resource fetching for better efficiency
 */
export function useDocumentsQuery(options: UseDocumentsQueryOptions = {}): DocumentsQueryResult {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    retry = 3,
    retryDelay = 1000,
    select,
    page,
    pageSize,
  } = options

  // First, fetch all resources (without notes)
  const resourcesQuery = useQuery({
    queryKey: page !== undefined || pageSize !== undefined 
      ? documentsQueryKeys.listPaginated(page || 1, pageSize || 50)
      : documentsQueryKeys.lists(),
    queryFn: () => fetchDocumentResources({ page, pageSize }),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  // Extract resource IDs for note fetching
  const resources = resourcesQuery.data?.resources || []
  const resourceIds = resources.map(resource => resource.id)

  // Fetch notes using unified hook (this provides deduplication)
  const notesQuery = useResourceNotes(resourceIds, {
    enabled: enabled && resourceIds.length > 0,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  // Filter notes to only include documents
  const documentNotes = filterNotesByContentType(notesQuery.notes, 'document')

  // Combine resources with their notes, filtering for documents only
  const documentsWithNotes: DocumentResourceWithNote[] = resources
    .map(resource => {
      const noteResult = documentNotes.get(resource.id)
      if (!noteResult) return null // Not a document

      return {
        ...resource,
        note: noteResult.note,
        noteError: noteResult.noteError,
      }
    })
    .filter(resource => resource !== null) as DocumentResourceWithNote[]

  // Apply select transformation if provided
  const finalData = select ? select(documentsWithNotes) : documentsWithNotes

  const isLoading = resourcesQuery.isLoading || notesQuery.isLoading
  const isError = resourcesQuery.isError || notesQuery.isError
  const error = resourcesQuery.error || notesQuery.error

  return {
    documents: finalData,
    isLoading,
    isError,
    error,
    pagination: resourcesQuery.data?.pagination,
    refetch: () => {
      resourcesQuery.refetch()
      notesQuery.refetch()
    },
  }
}



