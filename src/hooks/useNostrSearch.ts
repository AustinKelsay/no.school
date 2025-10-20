"use client";

import { useQuery } from '@tanstack/react-query'
import { useSnstrContext } from '@/contexts/snstr-context'
import { NostrEvent, RelayPool } from 'snstr'
import { parseCourseEvent, parseEvent } from '@/data/types'
import { SearchResult } from '@/lib/search'

// Import mock database data to get all valid noteIds
import coursesData from '@/data/mockDb/Course.json'
import resourcesData from '@/data/mockDb/Resource.json'

// Options for the hook
export interface UseNostrSearchOptions {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  refetchOnMount?: boolean
  retry?: boolean | number
  retryDelay?: number
}

// Result interface
export interface NostrSearchResult {
  results: SearchResult[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
  isFetching: boolean
}

// Extract all valid IDs from mock database for 'd' tag queries
function getAllValidIds(): string[] {
  const courseIds = coursesData.map(course => course.id)
  const resourceIds = resourcesData.map(resource => resource.id)
  
  return [...courseIds, ...resourceIds]
}

// Get all valid IDs to filter search results using 'd' tag queries
const VALID_IDS = getAllValidIds()

// Query keys factory for better cache management
export const nostrSearchQueryKeys = {
  all: ['nostr-search'] as const,
  searches: () => [...nostrSearchQueryKeys.all, 'search'] as const,
  search: (keyword: string) => [...nostrSearchQueryKeys.searches(), keyword] as const,
}

/**
 * Calculate match score based on keyword relevance
 */
function calculateMatchScore(keyword: string, title: string, description: string, content: string): number {
  const lowerKeyword = keyword.toLowerCase()
  const lowerTitle = title.toLowerCase()
  const lowerDescription = description.toLowerCase()
  const lowerContent = content.toLowerCase()
  
  let score = 0
  
  // Exact match in title (highest score)
  if (lowerTitle === lowerKeyword) {
    score += 100
  }
  // Title starts with keyword
  else if (lowerTitle.startsWith(lowerKeyword)) {
    score += 50
  }
  // Title contains keyword
  else if (lowerTitle.includes(lowerKeyword)) {
    score += 30
  }
  
  // Description contains keyword
  if (lowerDescription.includes(lowerKeyword)) {
    const matches = lowerDescription.match(new RegExp(lowerKeyword, 'g'))
    score += (matches?.length || 1) * 8
  }
  
  // Content contains keyword
  if (lowerContent.includes(lowerKeyword)) {
    const matches = lowerContent.match(new RegExp(lowerKeyword, 'g'))
    score += (matches?.length || 1) * 3
  }
  
  // Word boundary matches (whole word)
  const wordBoundaryRegex = new RegExp(`\\b${lowerKeyword}\\b`, 'gi')
  if (wordBoundaryRegex.test(title)) {
    score += 25
  }
  if (wordBoundaryRegex.test(description)) {
    score += 15
  }
  if (wordBoundaryRegex.test(content)) {
    score += 5
  }
  
  return score
}

/**
 * Highlight matched keywords in text
 */
function highlightKeyword(text: string, keyword: string): string {
  if (!text || !keyword) return text
  
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

/**
 * Convert Nostr course event to SearchResult
 */
function courseEventToSearchResult(event: NostrEvent, keyword: string): SearchResult | null {
  try {
    const parsedEvent = parseCourseEvent(event)
    
    const title = parsedEvent.title || parsedEvent.name || ''
    const description = parsedEvent.description || ''
    const content = parsedEvent.content || ''
    
    // Skip if no searchable content
    if (!title && !description && !content) return null
    
    const score = calculateMatchScore(keyword, title, description, content)
    
    // Only include results with a score > 0
    if (score <= 0) return null
    
    return {
      id: parsedEvent.d || event.id,
      type: 'course',
      title,
      description,
      category: parsedEvent.topics[0] || 'general',
      instructor: event.pubkey,
      image: parsedEvent.image,
      rating: 0,
      price: 0, // Default price, real price comes from database
      isPremium: false,
      matchScore: score,
      keyword,
      tags: parsedEvent.topics || [],
      highlights: {
        title: highlightKeyword(title, keyword),
        description: highlightKeyword(description, keyword)
      }
    }
  } catch (error) {
    console.error('Error parsing course event:', error)
    return null
  }
}

/**
 * Convert Nostr resource event to SearchResult
 */
function resourceEventToSearchResult(event: NostrEvent, keyword: string): SearchResult | null {
  try {
    const parsedEvent = parseEvent(event)
    
    const title = parsedEvent.title || ''
    const description = parsedEvent.summary || ''
    const content = parsedEvent.content || ''
    
    // Skip if no searchable content
    if (!title && !description && !content) return null
    
    const score = calculateMatchScore(keyword, title, description, content)
    
    // Only include results with a score > 0
    if (score <= 0) return null
    
    return {
      id: parsedEvent.d || event.id,
      type: 'resource',
      title,
      description,
      category: parsedEvent.topics[0] || parsedEvent.type || 'general',
      instructor: parsedEvent.author || event.pubkey,
      image: parsedEvent.image,
      rating: 0,
      price: parsedEvent.price ? parseInt(parsedEvent.price) : 0,
      isPremium: (parsedEvent.price && parseInt(parsedEvent.price) > 0) || event.kind === 30402,
      matchScore: score,
      keyword,
      tags: parsedEvent.topics || [],
      highlights: {
        title: highlightKeyword(title, keyword),
        description: highlightKeyword(description, keyword)
      }
    }
  } catch (error) {
    console.error('Error parsing resource event:', error)
    return null
  }
}

/**
 * Search Nostr events for content matching keywords
 * Uses 'd' tag queries to fetch only events from our mock database, then does client-side filtering
 */
async function searchNostrContent(
  keyword: string,
  relayPool: RelayPool,
  relays: string[]
): Promise<SearchResult[]> {
  if (!keyword || keyword.length < 3) return []
  
  const results: SearchResult[] = []
  
  try {
    console.log(`Searching Nostr for keyword: "${keyword}" in ${VALID_IDS.length} items from mock database`)
    
    // Fetch all events for items in our mock database using 'd' tag queries
    // This follows the same pattern as useCoursesQuery and useDocumentsQuery
    const events = await relayPool.querySync(
      relays,
      { 
        kinds: [30004, 30023, 30402],
        "#d": VALID_IDS, // Query by 'd' tag for items in our mock database
        limit: 100 // Limit initial results
      },
      { timeout: 15000 } // 15 second timeout
    )
    
    console.log(`Found ${events.length} events from Nostr, now filtering by keyword "${keyword}"`)
    
    // Use a Map to deduplicate results by ID
    const resultsMap = new Map<string, SearchResult>()
    
    // Process each event and do client-side keyword matching
    for (const event of events) {
      let searchResult: SearchResult | null = null
      
      if (event.kind === 30004) {
        // Course event
        searchResult = courseEventToSearchResult(event, keyword)
      } else if (event.kind === 30023 || event.kind === 30402) {
        // Resource event (free or paid)
        searchResult = resourceEventToSearchResult(event, keyword)
      }
      
      if (searchResult) {
        // Only keep the result with the highest match score for each ID
        const existingResult = resultsMap.get(searchResult.id)
        if (!existingResult || searchResult.matchScore > existingResult.matchScore) {
          resultsMap.set(searchResult.id, searchResult)
        }
      }
    }
    
    // Convert Map to array
    const deduplicatedResults = Array.from(resultsMap.values())
    
    console.log(`Processed ${deduplicatedResults.length} unique search results (${events.length - deduplicatedResults.length} duplicates removed)`)
    
    // Sort by match score (highest first)
    deduplicatedResults.sort((a, b) => b.matchScore - a.matchScore)
    
    return deduplicatedResults
    
  } catch (error) {
    console.error('Error searching Nostr content:', error)
    throw new Error(`Failed to search Nostr content: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Hook for searching content on Nostr relays using React Query
 * 
 * Features:
 * - Searches both course events (kind 30004) and resource events (kinds 30023, 30402)
 * - Uses existing parser functions for consistent data structure
 * - Returns results compatible with existing search UI
 * - Includes proper loading states and error handling
 * - Uses React Query for caching and state management
 * - Minimum 3 character keyword requirement
 */
export function useNostrSearch(
  keyword: string,
  options: UseNostrSearchOptions = {}
): NostrSearchResult {
  const { relayPool, relays } = useSnstrContext()
  
  const {
    enabled = true,
    staleTime = 2 * 60 * 1000, // 2 minutes (shorter for search)
    gcTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = false,
    retry = 2,
    retryDelay = 1000,
  } = options

  const query = useQuery({
    queryKey: nostrSearchQueryKeys.search(keyword),
    queryFn: () => searchNostrContent(keyword, relayPool, relays),
    enabled: enabled && keyword.length >= 3,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  return {
    results: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  }
}

/**
 * Hook for searching specific event kinds on Nostr
 */
export function useNostrSearchByKind(
  keyword: string,
  kinds: number[],
  options: UseNostrSearchOptions = {}
): NostrSearchResult {
  const { relayPool, relays } = useSnstrContext()
  
  const {
    enabled = true,
    staleTime = 2 * 60 * 1000,
    gcTime = 5 * 60 * 1000,
    refetchOnWindowFocus = false,
    refetchOnMount = false,
    retry = 2,
    retryDelay = 1000,
  } = options

  const query = useQuery({
    queryKey: [...nostrSearchQueryKeys.search(keyword), kinds],
    queryFn: async () => {
      if (!keyword || keyword.length < 3) return []
      
      try {
        const events = await relayPool.querySync(
          relays,
          { 
            kinds,
            search: keyword,
            limit: 50
          },
          { timeout: 15000 }
        )
        
        const results: SearchResult[] = []
        
        for (const event of events) {
          let searchResult: SearchResult | null = null
          
          if (event.kind === 30004) {
            searchResult = courseEventToSearchResult(event, keyword)
          } else if (event.kind === 30023 || event.kind === 30402) {
            searchResult = resourceEventToSearchResult(event, keyword)
          }
          
          if (searchResult) {
            results.push(searchResult)
          }
        }
        
        return results.sort((a, b) => b.matchScore - a.matchScore)
        
      } catch (error) {
        console.error('Error searching Nostr by kind:', error)
        throw new Error(`Failed to search Nostr: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    enabled: enabled && keyword.length >= 3,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  })

  return {
    results: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  }
}
