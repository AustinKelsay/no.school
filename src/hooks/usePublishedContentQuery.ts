/**
 * React Query hook for fetching the current user's published content summary.
 * Returns published courses, resources, and aggregated stats for admin views.
 */

import { useQuery } from '@tanstack/react-query'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import type { Course, Resource } from '@/data/types'

export interface PublishedContentStats {
  totalResources: number
  totalCourses: number
  paidResources: number
  freeResources: number
  paidCourses: number
  freeCourses: number
  totalPurchases: number
  totalRevenueSats: number
  lastUpdatedAt: string | null
}

export interface PublishedContentPayload {
  resources: Resource[]
  courses: Course[]
  stats: PublishedContentStats
}

export interface FetchPublishedContentParams {
  type?: 'all' | 'courses' | 'resources'
  limit?: number
}

export interface UsePublishedContentOptions extends FetchPublishedContentParams {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: boolean | number
  retryDelay?: number
}

export interface PublishedContentQueryResult {
  data: PublishedContentPayload | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PublishedContentPayload, Error>>
}

export const publishedContentQueryKeys = {
  all: ['profile', 'published-content'] as const,
  summary: (params?: FetchPublishedContentParams) => [
    ...publishedContentQueryKeys.all,
    params?.type ?? 'all',
    params?.limit ?? 'default',
  ] as const,
}

/**
 * Fetches published content from the API.
 * This function runs in the browser and uses standard fetch options.
 *
 * @param params - Optional parameters to filter the content
 * @returns The published content payload with resources, courses, and stats
 */
export async function fetchPublishedContent(
  params?: FetchPublishedContentParams
): Promise<PublishedContentPayload> {
  const queryParams = new URLSearchParams()
  if (params?.type && params.type !== 'all') {
    queryParams.append('type', params.type)
  }
  if (typeof params?.limit === 'number') {
    queryParams.append('limit', params.limit.toString())
  }

  const url = `/api/profile/content${queryParams.toString() ? `?${queryParams}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = typeof errorBody.error === 'string'
      ? errorBody.error
      : 'Failed to fetch published content'
    throw new Error(message)
  }

  const result = await response.json()
  if (!result?.data) {
    throw new Error('Malformed response when fetching published content')
  }

  return result.data as PublishedContentPayload
}

export function usePublishedContentQuery(
  options: UsePublishedContentOptions = {}
): PublishedContentQueryResult {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    gcTime = 15 * 60 * 1000,
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    retry = 1,
    retryDelay = 1000,
    type,
    limit,
  } = options

  const query = useQuery({
    queryKey: publishedContentQueryKeys.summary({ type, limit }),
    queryFn: () => fetchPublishedContent({ type, limit }),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}
