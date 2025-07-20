import { useQuery } from '@tanstack/react-query'
import { CourseWithNote, ResourceWithNote } from '@/lib/db-adapter'

interface SearchResult extends Partial<CourseWithNote>, Partial<ResourceWithNote> {
  type: 'course' | 'resource'
}

interface SearchResponse {
  results: SearchResult[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  query: string
  type: string
  summary?: {
    courses: number
    resources: number
    total: number
  }
}

interface UseSearchQueryOptions {
  keyword: string
  type?: 'all' | 'courses' | 'resources'
  page?: number
  pageSize?: number
  enabled?: boolean
}

/**
 * Custom hook for searching content using TanStack Query
 * Provides caching, loading states, and error handling
 */
export function useSearchQuery({
  keyword,
  type = 'all',
  page = 1,
  pageSize = 20,
  enabled = true
}: UseSearchQueryOptions) {
  return useQuery<SearchResponse, Error>({
    queryKey: ['search', keyword, type, page, pageSize],
    queryFn: async () => {
      // Don't search if keyword is too short
      if (!keyword || keyword.length < 3) {
        return {
          results: [],
          pagination: {
            page,
            pageSize,
            totalItems: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          },
          query: keyword,
          type,
          summary: {
            courses: 0,
            resources: 0,
            total: 0
          }
        }
      }
      
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(keyword)}&type=${type}&page=${page}&pageSize=${pageSize}`
      )
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      return data.data
    },
    enabled: enabled && keyword.length >= 3,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Hook for search suggestions (autocomplete)
 */
export function useSearchSuggestions(partialKeyword: string, limit: number = 5) {
  return useQuery<string[], Error>({
    queryKey: ['search-suggestions', partialKeyword, limit],
    queryFn: async () => {
      if (!partialKeyword || partialKeyword.length < 2) {
        return []
      }
      
      // For now, return empty array as we don't have a suggestions endpoint
      // In production, this would call a dedicated suggestions API
      return []
    },
    enabled: partialKeyword.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  })
}