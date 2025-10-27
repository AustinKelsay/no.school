'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { usePublishedContentQuery } from '@/hooks/usePublishedContentQuery'
import { useResourceNotes } from '@/hooks/useResourceNotes'
import { useCourseNotes } from '@/hooks/useCourseNotes'
import { OptimizedImage } from '@/components/ui/optimized-image'
import {
  parseEvent,
  parseCourseEvent,
  createResourceDisplay,
  createCourseDisplay,
  type Resource,
  type Course,
} from '@/data/types'
import DraftsClient from '@/app/drafts/drafts-client'
import { getNoteImage } from '@/lib/note-image'
import { formatNoteIdentifier } from '@/lib/note-identifiers'
import {
  BookOpen,
  ExternalLink,
  FileText,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Video as VideoIcon,
} from 'lucide-react'

type AdminContentManagerProps = {
  userId: string
}

type PublishedItemType = 'course' | 'video' | 'document'

type PublishedItem = {
  id: string
  type: PublishedItemType
  title: string
  summary: string
  price: number
  isPremium: boolean
  topics: string[]
  updatedAt: string
  createdAt: string
  href: string
  noteId?: string
  noteStatus?: 'synced' | 'missing'
  noteError?: string
  image?: string
  displayNoteId?: string
}

const EMPTY_RESOURCES: Resource[] = []
const EMPTY_COURSES: Course[] = []

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)

  if (diffSeconds < 60) return 'just now'
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
  if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 86400)}d ago`
  if (diffSeconds < 31536000) return `${Math.floor(diffSeconds / 2592000)}mo ago`
  return `${Math.floor(diffSeconds / 31536000)}y ago`
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Not available'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatSats(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount)
}

function resolveImage(...sources: Array<string | undefined | null>): string | undefined {
  for (const source of sources) {
    if (typeof source === 'string' && source.trim().length > 0) {
      return source
    }
  }
  return undefined
}

function buildResourceItems(
  resources: Resource[],
  notesMap: ReturnType<typeof useResourceNotes>['notes']
): PublishedItem[] {
  return resources.map(resource => {
    const noteResult = notesMap.get(resource.id)
    const note = noteResult?.note
    const parsed = note ? parseEvent(note) : undefined
    const display = parsed ? createResourceDisplay(resource, parsed) : undefined
    const fallbackThumbnail =
      display?.type === 'video' && resource.videoId
        ? `https://img.youtube.com/vi/${resource.videoId}/hqdefault.jpg`
        : undefined
    const image = resolveImage(
      display?.image,
      parsed?.image,
      getNoteImage(note, fallbackThumbnail),
      fallbackThumbnail
    )

    return {
      id: resource.id,
      type: display?.type === 'video' ? 'video' : 'document',
      title: display?.title || parsed?.title || resource.noteId || 'Untitled resource',
      summary: display?.description || parsed?.summary || 'No summary available.',
      price: resource.price,
      isPremium: resource.price > 0,
      topics: display?.topics || parsed?.topics || [],
      updatedAt: resource.updatedAt,
      createdAt: resource.createdAt,
      href: `/content/${resource.id}`,
      noteId: resource.noteId || note?.id,
      noteStatus: note ? 'synced' : 'missing',
      noteError: noteResult?.noteError,
      image,
      displayNoteId: formatNoteIdentifier(note, resource.noteId || note?.id),
    }
  })
}

function buildCourseItems(
  courses: Course[],
  notesMap: ReturnType<typeof useCourseNotes>['notes']
): PublishedItem[] {
  return courses.map(course => {
    const noteResult = notesMap.get(course.id)
    const note = noteResult?.note
    const parsed = note ? parseCourseEvent(note) : undefined
    const display = parsed ? createCourseDisplay(course, parsed) : undefined
    const image = resolveImage(display?.image, parsed?.image, getNoteImage(note))

    return {
      id: course.id,
      type: 'course' as PublishedItemType,
      title: display?.title || parsed?.title || course.noteId || 'Untitled course',
      summary: display?.description || parsed?.description || 'No description available.',
      price: course.price,
      isPremium: course.price > 0,
      topics: display?.topics || parsed?.topics || [],
      updatedAt: course.updatedAt,
      createdAt: course.createdAt,
      href: `/courses/${course.id}`,
      noteId: course.noteId || note?.id,
      noteStatus: note ? 'synced' : 'missing',
      noteError: noteResult?.noteError,
      image,
      displayNoteId: formatNoteIdentifier(note, course.noteId || note?.id),
    }
  })
}

function PublishedContentView() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'courses' | 'resources'>('all')

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchPublished,
  } = usePublishedContentQuery({ type: 'all', limit: 200 })

  const resources = data?.resources ?? EMPTY_RESOURCES
  const courses = data?.courses ?? EMPTY_COURSES

  const resourceIds = useMemo(() => resources.map(resource => resource.id), [resources])
  const courseIds = useMemo(() => courses.map(course => course.id), [courses])

  const resourceNotes = useResourceNotes(resourceIds, {
    enabled: resourceIds.length > 0,
  })
  const courseNotes = useCourseNotes(courseIds, {
    enabled: courseIds.length > 0,
  })

  const combinedItems = useMemo(() => {
    const resourceItems = buildResourceItems(resources, resourceNotes.notes)
    const courseItems = buildCourseItems(courses, courseNotes.notes)
    return [...resourceItems, ...courseItems].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [resources, courses, resourceNotes.notes, courseNotes.notes])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return combinedItems.filter(item => {
      const matchesType =
        filterType === 'all' ||
        (filterType === 'courses' && item.type === 'course') ||
        (filterType === 'resources' && item.type !== 'course')

      if (!matchesType) return false
      if (!query) return true

      const inTitle = item.title.toLowerCase().includes(query)
      const inSummary = item.summary.toLowerCase().includes(query)
      const inTopics = item.topics.some(topic => topic.toLowerCase().includes(query))

      return inTitle || inSummary || inTopics
    })
  }, [combinedItems, filterType, search])

  const stats = data?.stats
  const isNotesLoading = resourceNotes.isLoading || courseNotes.isLoading
  const combinedLoading = isLoading || isNotesLoading
  const combinedError = isError || resourceNotes.isError || courseNotes.isError
  const combinedErrorMessage =
    error?.message ||
    resourceNotes.error?.message ||
    courseNotes.error?.message ||
    'Failed to load published content'

  const refetchAll = () => {
    refetchPublished()
    resourceNotes.refetch()
    courseNotes.refetch()
  }

  if (combinedLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading published content…</p>
        </div>
      </div>
    )
  }

  if (combinedError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load published content</CardTitle>
          <CardDescription>{combinedErrorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button onClick={refetchAll}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Published Resources</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {stats?.totalResources ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {stats
              ? `${stats.freeResources} free · ${stats.paidResources} paid`
              : 'No resources yet'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Published Courses</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {stats?.totalCourses ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {stats
              ? `${stats.freeCourses} free · ${stats.paidCourses} paid`
              : 'No courses yet'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Purchases</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {stats?.totalPurchases ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {stats?.totalPurchases
              ? 'Total sales across resources and courses'
              : 'No purchases recorded yet'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue (sats)</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {formatSats(stats?.totalRevenueSats ?? 0)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Last updated {formatDate(stats?.lastUpdatedAt)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Published Content</CardTitle>
              <CardDescription>
                Review and manage content that has already been published to Nostr.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={refetchAll}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search by title, summary, or topic"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <div className="flex items-center gap-1 rounded-md border bg-background p-1">
                <Button
                  variant={filterType === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'resources' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('resources')}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  Resources
                </Button>
                <Button
                  variant={filterType === 'courses' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('courses')}
                >
                  <BookOpen className="mr-1 h-4 w-4" />
                  Courses
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <Filter className="h-10 w-10 text-muted-foreground/60" />
              <div className="space-y-1">
                <p className="text-sm font-medium">No published content found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters, or publish new content from your drafts.
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/create?type=resource">Create Resource</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/create?type=course">Create Course</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map(item => {
                const Icon =
                  item.type === 'course' ? BookOpen : item.type === 'video' ? VideoIcon : FileText

                return (
                  <Card key={item.id} className="overflow-hidden border-muted-foreground/20">
                    <div className="relative aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
                      {item.image ? (
                        <OptimizedImage
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 480px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="h-12 w-12 text-primary/60" />
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />
                    </div>
                    <CardHeader className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {item.type}
                        </Badge>
                        <Badge variant={item.isPremium ? 'default' : 'outline'} className="capitalize">
                          {item.isPremium ? 'Paid' : 'Free'}
                        </Badge>
                        {item.noteStatus === 'missing' && (
                          <Badge variant="destructive">Nostr note unavailable</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-semibold leading-tight">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {item.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <span>Updated {formatTimeAgo(item.updatedAt)}</span>
                          <Separator orientation="vertical" className="hidden h-4 md:flex" />
                          <span>Created {formatDate(item.createdAt)}</span>
                          {(item.displayNoteId || item.noteId) && (
                            <>
                              <Separator orientation="vertical" className="hidden h-4 md:flex" />
                              <span className="break-all text-xs">
                                Note ID: {item.displayNoteId || item.noteId}
                                {item.noteError ? ` (${item.noteError})` : ''}
                              </span>
                            </>
                          )}
                        </div>
                        {item.topics.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.topics.slice(0, 4).map(topic => (
                              <Badge key={topic} variant="outline">
                                #{topic}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm">
                          <Link href={item.href}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Published {item.type === 'course' ? 'Course' : 'Content'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminContentManager({ userId: _userId }: AdminContentManagerProps) {
  const [activeTab, setActiveTab] = useState<'drafts' | 'published'>('drafts')

  return (
    <Tabs value={activeTab} onValueChange={value => setActiveTab(value as typeof activeTab)} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
        <TabsTrigger value="published">Published</TabsTrigger>
      </TabsList>
      <TabsContent value="drafts">
        <DraftsClient />
      </TabsContent>
      <TabsContent value="published">
        <PublishedContentView />
      </TabsContent>
    </Tabs>
  )
}
