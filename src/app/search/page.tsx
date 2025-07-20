"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SearchResultCard } from "@/components/ui/search-result-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { HighlightText, SubtleHighlightText } from "@/components/ui/highlight-text"
import { CourseWithNote, ResourceWithNote } from "@/lib/db-adapter"
import { cn } from "@/lib/utils"

interface SearchResult extends CourseWithNote, ResourceWithNote {
  type: 'course' | 'resource'
  keyword?: string
}

interface SearchResponse {
  data: {
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
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [searchType, setSearchType] = useState<'all' | 'courses' | 'resources'>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [summary, setSummary] = useState<{ courses: number; resources: number; total: number } | null>(null)
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  
  // Perform search
  const performSearch = useCallback(async (query: string, type: string = 'all', page: number = 1) => {
    if (!query || query.length < 3) {
      setResults([])
      setError(null)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}&pageSize=20`
      )
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data: SearchResponse = await response.json()
      
      setResults(data.data.results)
      setPagination(data.data.pagination)
      setSummary(data.data.summary || null)
    } catch (err) {
      setError('Failed to search. Please try again.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Update URL when search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('q', debouncedSearchQuery)
      router.push(`/search?${params.toString()}`, { scroll: false })
    }
  }, [debouncedSearchQuery, router, searchParams])
  
  // Perform search when debounced query or type changes
  useEffect(() => {
    performSearch(debouncedSearchQuery, searchType, pagination.page)
  }, [debouncedSearchQuery, searchType, performSearch, pagination.page])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery, searchType, 1)
  }
  
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <Container className="py-8">
      <Section>
        <div className="space-y-6">
          {/* Search Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Search Content</h1>
            <p className="text-muted-foreground">
              Find courses and resources by keyword
            </p>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                searchQuery.length >= 3 ? "text-primary" : "text-muted-foreground"
              )} />
              <Input
                type="search"
                placeholder="Search for courses, resources, topics... (min 3 characters)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 pr-4 h-12 text-lg transition-all duration-200",
                  searchQuery.length >= 3 && "border-primary/50 ring-1 ring-primary/20",
                  isLoading && "animate-pulse"
                )}
                autoFocus
              />
              
              {/* Loading indicator inside input */}
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          </form>
          
          {/* Search Type Tabs */}
          {searchQuery.length >= 3 && (
            <div className="max-w-2xl mx-auto">
              <Tabs value={searchType} onValueChange={(value) => setSearchType(value as 'all' | 'courses' | 'resources')}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All {summary && `(${summary.total})`}
                  </TabsTrigger>
                  <TabsTrigger value="courses">
                    Courses {summary && `(${summary.courses})`}
                  </TabsTrigger>
                  <TabsTrigger value="resources">
                    Resources {summary && `(${summary.resources})`}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
          
          {/* Search Results */}
          <div className="mt-8">
            {searchQuery.length > 0 && searchQuery.length < 3 && (
              <p className="text-center text-muted-foreground">
                Please enter at least 3 characters to search
              </p>
            )}
            
            {error && (
              <p className="text-center text-destructive">{error}</p>
            )}
            
            {isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {!isLoading && results.length > 0 && (
              <>
                {/* Search Results Summary */}
                <div className="text-center mb-6">
                  <p className="text-muted-foreground">
                    Found {pagination.totalItems} result{pagination.totalItems !== 1 ? 's' : ''} for{' '}
                    <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                      &quot;{searchQuery}&quot;
                    </span>
                  </p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {results.map((result) => (
                    <SearchResultCard
                      key={result.id}
                      id={result.id}
                      type={result.type}
                      title={result.note?.tags.find(t => t[0] === 'name' || t[0] === 'title')?.[1] || 'Untitled'}
                      description={result.note?.tags.find(t => t[0] === 'about' || t[0] === 'description' || t[0] === 'summary')?.[1] || ''}
                      category={result.note?.tags.find(t => t[0] === 'l' || t[0] === 't')?.[1] || 'general'}
                      instructor={result.userId}
                      image={result.note?.tags.find(t => t[0] === 'image')?.[1]}
                      price={result.price}
                      isPremium={result.price > 0}
                      keyword={searchQuery}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {!isLoading && searchQuery.length >= 3 && results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No results found for &quot;{searchQuery}&quot;
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </Container>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Container className="py-8">
        <Section>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Section>
      </Container>
    }>
      <SearchContent />
    </Suspense>
  )
}