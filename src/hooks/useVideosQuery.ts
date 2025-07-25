/**
 * TanStack Query hook for fetching video resources with their associated Nostr notes
 * Combines data from fake DB and Nostr network with intelligent caching
 * Filters resources by video type using Nostr note tags
 */

import { useQuery } from '@tanstack/react-query'
import { PaginationOptions } from '@/lib/db-adapter'
import { Resource } from '@/data/types'
import { useResourceNotes, filterNotesByContentType } from './useResourceNotes'
import { NostrEvent } from 'snstr'

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
export const videosQueryKeys = {
  all: ['videos'] as const,
  lists: () => [...videosQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...videosQueryKeys.lists(), { filters }] as const,
  listPaginated: (page: number, pageSize: number) => [...videosQueryKeys.lists(), { page, pageSize }] as const,
  details: () => [...videosQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...videosQueryKeys.details(), id] as const,
  notes: () => [...videosQueryKeys.all, 'notes'] as const,
  note: (noteId: string) => [...videosQueryKeys.notes(), noteId] as const,
}

// Options for the hook
export interface UseVideosQueryOptions {
  // Pagination options
  page?: number
  pageSize?: number
  // Query options
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
 * Fetch video resources using unified resource notes fetching
 * Now leverages shared caching and deduplication via useResourceNotes
 */
export async function fetchVideoResources(options?: PaginationOptions): Promise<{ 
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
  // Fetch resources from API
  const queryParams = new URLSearchParams()
  if (options?.page) queryParams.append('page', options.page.toString())
  if (options?.pageSize) queryParams.append('pageSize', options.pageSize.toString())
  
  const response = await fetch(`/api/resources/list${queryParams.toString() ? `?${queryParams}` : ''}`)
  if (!response.ok) {
    throw new Error('Failed to fetch resources')
  }

  const data = await response.json()
  const resources = data.data || data.resources || []
  const pagination = data.pagination

  return {
    resources,
    pagination
  }
}

/**
 * Main hook for fetching video resources with their Nostr notes
 * Now uses unified resource fetching for better efficiency
 */
export function useVideosQuery(options: UseVideosQueryOptions = {}): VideosQueryResult {
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
      ? videosQueryKeys.listPaginated(page || 1, pageSize || 50)
      : videosQueryKeys.lists(),
    queryFn: () => fetchVideoResources({ page, pageSize }),
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

  // Filter notes to only include videos
  const videoNotes = filterNotesByContentType(notesQuery.notes, 'video')

  // Combine resources with their notes, filtering for videos only
  const videosWithNotes: VideoResourceWithNote[] = resources
    .map(resource => {
      const noteResult = videoNotes.get(resource.id)
      if (!noteResult) return null // Not a video

      return {
        ...resource,
        note: noteResult.note,
        noteError: noteResult.noteError,
      }
    })
    .filter(resource => resource !== null) as VideoResourceWithNote[]

  // Apply select transformation if provided
  const finalData = select ? select(videosWithNotes) : videosWithNotes

  const isLoading = resourcesQuery.isLoading || notesQuery.isLoading
  const isError = resourcesQuery.isError || notesQuery.isError
  const error = resourcesQuery.error || notesQuery.error

  return {
    videos: finalData,
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



