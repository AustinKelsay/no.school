"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { Section } from "@/components/layout/section"
import { ContentCard } from "@/components/ui/content-card"

import { useCoursesQuery } from '@/hooks/useCoursesQuery'
import { useVideosQuery } from '@/hooks/useVideosQuery'
import { useDocumentsQuery } from '@/hooks/useDocumentsQuery'
import type { ContentItem } from '@/data/types'
import { 
  contentTypeFilters, 
  difficultyFilters, 
  popularTags 
} from "@/data/config"
import { 
  Crown,
  Filter,
  X,
  FileText,
  Loader2
} from "lucide-react"
import { useCopy, getCopy } from "@/lib/copy"
import { NostrFetchService } from "@/lib/nostr-fetch-service"
import { getNoteImage } from "@/lib/note-image"
import { Prefix, type NostrEvent } from "snstr"
import { isNip19String, tryDecodeNip19Entity } from "@/lib/nip19-utils"

const HEX_EVENT_ID_REGEX = /^[0-9a-f]{64}$/i

async function fetchEventForIdentifier(identifier: string): Promise<NostrEvent | null> {
  const trimmed = identifier?.trim()
  if (!trimmed) return null

  const fetchById = async (eventId: string, relays?: string[]) => {
    if (relays && relays.length > 0) {
      return (await NostrFetchService.fetchEventById(eventId, undefined, relays)) ?? null
    }
    return (await NostrFetchService.fetchEventById(eventId)) ?? null
  }

  if (HEX_EVENT_ID_REGEX.test(trimmed)) {
    return fetchById(trimmed.toLowerCase())
  }

  if (isNip19String(trimmed)) {
    const decoded = tryDecodeNip19Entity(trimmed)
    if (!decoded) {
      return fetchById(trimmed)
    }

    if (decoded.type === Prefix.Note) {
      return fetchById(decoded.data.toLowerCase())
    }

    if (decoded.type === Prefix.Event) {
      return fetchById(decoded.data.id.toLowerCase(), decoded.data.relays)
    }

    if (decoded.type === Prefix.Address) {
      const { identifier: dTag, kind, pubkey, relays } = decoded.data
      const events = relays && relays.length > 0
        ? await NostrFetchService.fetchEventsByDTags(
            [dTag],
            [kind],
            pubkey,
            undefined,
            relays
          )
        : await NostrFetchService.fetchEventsByDTags(
            [dTag],
            [kind],
            pubkey
          )
      return events.get(dTag) ?? null
    }
  }

  return fetchById(trimmed)
}

export default function ContentPage() {
  const { contentLibrary, loading: loadingCopy, pricing } = useCopy()
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set(['all']))
  const [noteImageCache, setNoteImageCache] = useState<Record<string, string>>({})
  const attemptedNoteIds = useRef<Set<string>>(new Set())
  
  // Fetch data from all hooks
  const { courses, isLoading: coursesLoading } = useCoursesQuery()
  const { videos, isLoading: videosLoading } = useVideosQuery()
  const { documents, isLoading: documentsLoading } = useDocumentsQuery()
  
  // Combine loading states
  const loading = coursesLoading || videosLoading || documentsLoading
  
  useEffect(() => {
    const noteIdsToFetch: string[] = []

    const considerNote = (
      note?: { tags?: string[][]; content?: string } | null,
      noteId?: string | null
    ) => {
      if (!noteId) return
      const normalizedNote = note ?? undefined
      if (getNoteImage(normalizedNote)) return
      if (noteImageCache[noteId]) return
      if (attemptedNoteIds.current.has(noteId)) return

      attemptedNoteIds.current.add(noteId)
      noteIdsToFetch.push(noteId)
    }

    courses?.forEach(course => considerNote(course.note, course.noteId))
    videos?.forEach(video => considerNote(video.note, video.noteId))
    documents?.forEach(document => considerNote(document.note, document.noteId))

    if (noteIdsToFetch.length === 0) {
      return
    }

    let isCancelled = false

    const fetchImages = async () => {
      try {
        const results = await Promise.all(
          noteIdsToFetch.map(async (noteId) => {
            try {
              const event = await fetchEventForIdentifier(noteId)
              const image = getNoteImage(event ?? undefined)
              return { noteId, image }
            } catch (error) {
              console.error(`Failed to fetch note ${noteId} for image`, error)
              return { noteId, image: undefined }
            }
          })
        )

        if (isCancelled) return

        setNoteImageCache(prev => {
          const next = { ...prev }
          let changed = false
          results.forEach(({ noteId, image }) => {
            if (image && !next[noteId]) {
              next[noteId] = image
              changed = true
            }
          })
          return changed ? next : prev
        })
      } catch (error) {
        console.error('Failed to fetch note images', error)
      }
    }

    fetchImages()

    return () => {
      isCancelled = true
    }
  }, [courses, videos, documents, noteImageCache])
  
  // Transform data to ContentItem format
  const contentItems = useMemo(() => {
    const allItems: ContentItem[] = []
    
    // Add courses
    if (courses) {
      courses.forEach(course => {
        const courseItem = {
          id: course.id,
          type: 'course' as const,
          title: course.note?.tags.find(tag => tag[0] === "name")?.[1] || `Course ${course.id}`,
          description: course.note?.tags.find(tag => tag[0] === "about")?.[1] || '',
          category: course.price > 0 ? pricing.premium : pricing.free,
          difficulty: 'beginner' as const,
          image: getNoteImage(course.note) ?? (course.noteId ? noteImageCache[course.noteId] : undefined),
          tags: course.note?.tags.filter(tag => tag[0] === "t") || [],
          instructor: course.userId,
          instructorPubkey: course.note?.pubkey || '',
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          price: course.price,
          isPremium: course.price > 0,
          rating: 4.5,
          published: true,
          topics: course.note?.tags.filter(tag => tag[0] === "t").map(tag => tag[1]) || [],
          additionalLinks: course.note?.tags.filter(tag => tag[0] === "r").map(tag => tag[1]) || [],
          noteId: course.note?.id || course.noteId,
        }
        allItems.push(courseItem)
      })
    }
    
    // Add videos
    if (videos) {
      videos.forEach(video => {
        const videoItem = {
          id: video.id,
          type: 'video' as const,
          title: video.note?.tags.find(tag => tag[0] === "title")?.[1] || 
                 video.note?.tags.find(tag => tag[0] === "name")?.[1] || 
                 `Video ${video.id}`,
          description: video.note?.tags.find(tag => tag[0] === "summary")?.[1] || 
                      video.note?.tags.find(tag => tag[0] === "description")?.[1] || 
                      video.note?.tags.find(tag => tag[0] === "about")?.[1] || '',
          category: video.price > 0 ? pricing.premium : pricing.free,
          difficulty: 'beginner' as const,
          image: getNoteImage(video.note, video.videoId ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg` : undefined) ?? (video.noteId ? noteImageCache[video.noteId] : undefined),
          tags: video.note?.tags.filter(tag => tag[0] === "t") || [],
          instructor: video.userId,
          instructorPubkey: video.note?.pubkey || '',
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
          price: video.price,
          isPremium: video.price > 0,
          rating: 4.5,
          published: true,
          topics: video.note?.tags.filter(tag => tag[0] === "t").map(tag => tag[1]) || [],
          additionalLinks: video.note?.tags.filter(tag => tag[0] === "r").map(tag => tag[1]) || [],
          noteId: video.note?.id || video.noteId,
        }
        allItems.push(videoItem)
      })
    }
    
    // Add documents
    if (documents) {
      documents.forEach(document => {
        const documentItem = {
          id: document.id,
          type: 'document' as const,
          title: document.note?.tags.find(tag => tag[0] === "title")?.[1] || 
                 document.note?.tags.find(tag => tag[0] === "name")?.[1] || 
                 `Document ${document.id}`,
          description: document.note?.tags.find(tag => tag[0] === "summary")?.[1] || 
                      document.note?.tags.find(tag => tag[0] === "description")?.[1] || 
                      document.note?.tags.find(tag => tag[0] === "about")?.[1] || '',
          category: document.price > 0 ? pricing.premium : pricing.free,
          difficulty: 'beginner' as const,
          image: getNoteImage(document.note) ?? (document.noteId ? noteImageCache[document.noteId] : undefined),
          tags: document.note?.tags.filter(tag => tag[0] === "t") || [],
          instructor: document.userId,
          instructorPubkey: document.note?.pubkey || '',
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
          price: document.price,
          isPremium: document.price > 0,
          rating: 4.5,
          published: true,
          topics: document.note?.tags.filter(tag => tag[0] === "t").map(tag => tag[1]) || [],
          additionalLinks: document.note?.tags.filter(tag => tag[0] === "r").map(tag => tag[1]) || [],
          noteId: document.note?.id || document.noteId,
        }
        allItems.push(documentItem)
      })
    }
    
    return allItems
  }, [courses, videos, documents, pricing.free, pricing.premium, noteImageCache])

  // Filter content based on selected filters
  const filteredContent = useMemo(() => {
    if (selectedFilters.has('all') || selectedFilters.size === 0) {
      return contentItems
    }

    return contentItems.filter(item => {
      const itemAttributes = [
        item.type,
        item.category,
        item.difficulty,
        ...item.topics,
        item.isPremium ? 'premium' : 'free'
      ]
      
      return Array.from(selectedFilters).some(filter => 
        itemAttributes.includes(filter)
      )
    })
  }, [contentItems, selectedFilters])

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{getCopy('loading.content')}</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(selectedFilters)
    
    if (filter === 'all') {
      setSelectedFilters(new Set(['all']))
    } else {
      newFilters.delete('all')
      if (newFilters.has(filter)) {
        newFilters.delete(filter)
      } else {
        newFilters.add(filter)
      }
      
      if (newFilters.size === 0) {
        newFilters.add('all')
      }
      
      setSelectedFilters(newFilters)
    }
  }

  const clearAllFilters = () => {
    setSelectedFilters(new Set(['all']))
  }

  if (loading) {
    return (
      <MainLayout>
        <Section spacing="lg">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{getCopy('loading.content')}</p>
            </div>
          </div>
        </Section>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Header Section */}
      <Section spacing="lg" className="border-b">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{contentLibrary.title}</h1>
            <p className="text-muted-foreground">
              {contentLibrary.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {getCopy('contentLibrary.resultsCounter', { count: filteredContent.length, total: contentItems.length })}
            </p>
            {selectedFilters.size > 1 || !selectedFilters.has('all') ? (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                {contentLibrary.filters.clearFilters}
              </Button>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Filter Tags */}
      <Section spacing="sm" className="border-b bg-secondary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{contentLibrary.filters.label}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* All filter */}
            <Badge
              variant={selectedFilters.has('all') ? 'default' : 'outline'}
              className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleFilter('all')}
            >
              {contentLibrary.filters.allContent}
            </Badge>
            
            {/* Type filters */}
            <div key="type-filters" className="flex flex-wrap gap-2">
              {contentTypeFilters.map(({ type, icon: Icon, label }) => (
                <Badge
                  key={type}
                  variant={selectedFilters.has(type) ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleFilter(type)}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
            
            {/* Difficulty filters */}
            <div key="difficulty-filters" className="flex flex-wrap gap-2">
              {difficultyFilters.map(({ difficulty, label }) => (
                <Badge
                  key={difficulty}
                  variant={selectedFilters.has(difficulty) ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleFilter(difficulty)}
                >
                  {label}
                </Badge>
              ))}
            </div>
            
            {/* Premium/Free filters */}
            <div key="premium-filters" className="flex flex-wrap gap-2">
              <Badge
                key="free"
                variant={selectedFilters.has('free') ? 'default' : 'outline'}
                className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleFilter('free')}
              >
                {pricing.free}
              </Badge>
              <Badge
                key="premium"
                variant={selectedFilters.has('premium') ? 'default' : 'outline'}
                className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleFilter('premium')}
              >
                <Crown className="h-3 w-3 mr-1" />
                {pricing.premium}
              </Badge>
            </div>

            {/* Popular tags */}
            <div key="popular-tags" className="flex flex-wrap gap-2">
              {popularTags.slice(0, 8).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedFilters.has(tag) ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Content Grid */}
      <Section spacing="lg">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{contentLibrary.emptyState.title}</h3>
            <p className="text-muted-foreground mb-4">
              {contentLibrary.emptyState.description}
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              {contentLibrary.emptyState.button}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <ContentCard 
                key={item.id} 
                item={item} 
                variant="content"
                onTagClick={toggleFilter}
                showContentTypeTags={true}
              />
            ))}
          </div>
        )}
      </Section>
    </MainLayout>
  )
}
