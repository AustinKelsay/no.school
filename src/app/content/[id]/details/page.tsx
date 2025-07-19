'use client'

import { Suspense, useEffect, useState } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { parseEvent } from '@/data/types'
import { useNostr, type NormalizedProfile } from '@/hooks/useNostr'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { encodePublicKey } from 'snstr'
import { VideoPlayer } from '@/components/ui/video-player'
import { ResourceActions } from '@/components/ui/resource-actions'
import { ZapThreads } from '@/components/ui/zap-threads'
import { useInteractions } from '@/hooks/useInteractions'
import { useCommentThreads, formatCommentCount } from '@/hooks/useCommentThreads'
import { 
  Zap, 
  Clock, 
  Eye, 
  FileText, 
  Play, 
  ExternalLink, 
  ArrowLeft, 
  BookOpen, 
  Video, 
  Calendar,
  User,
  MessageCircle,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import type { NostrEvent } from 'snstr'

interface ResourceDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

function formatNpubWithEllipsis(pubkey: string): string {
  try {
    const npub = encodePublicKey(pubkey as `${string}1${string}`);
    return `${npub.slice(0, 12)}...${npub.slice(-6)}`;
  } catch {
    // Fallback to hex format if encoding fails
    return `${pubkey.slice(0, 6)}...${pubkey.slice(-6)}`;
  }
}

/**
 * Loading component for content
 */
function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
            <div className="h-4 bg-muted rounded w-3/5"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Content metadata component
 */
function ContentMetadata({ event, parsedEvent }: { event: NostrEvent; parsedEvent: ReturnType<typeof parseEvent> }) {
  const { fetchProfile, normalizeKind0 } = useNostr()
  const [authorProfile, setAuthorProfile] = useState<NormalizedProfile | null>(null)

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      if (event.pubkey) {
        try {
          const profileEvent = await fetchProfile(event.pubkey)
          const normalizedProfile = normalizeKind0(profileEvent)
          setAuthorProfile(normalizedProfile)
        } catch (error) {
          console.error('Error fetching author profile:', error)
        }
      }
    }

    fetchAuthorProfile()
  }, [event.pubkey, fetchProfile, normalizeKind0])
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string): number => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const readingTime = parsedEvent.type !== 'video' ? getReadingTime(event.content) : null
  
  // Get enhanced comment thread data with NIP-10 parsing
  const { commentMetrics, interactions } = useCommentThreads(event.id)
  
  // Use only real interaction data - no fallbacks
  const zapsCount = interactions.zaps
  const commentsCount = commentMetrics.totalComments
  const repliesCount = commentMetrics.directReplies
  const reactionsCount = interactions.likes

  return (
    <div className="space-y-4">
      {/* Basic metadata */}
      <div className="flex items-center space-x-6 flex-wrap text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <User className="h-4 w-4" />
          <span>
            {authorProfile?.name || 
             authorProfile?.display_name || 
             parsedEvent.author || 
             formatNpubWithEllipsis(event.pubkey)}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(event.created_at)}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4" />
          <span>1,250 views</span>
        </div>
        
        {readingTime && (
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        )}
        
        {parsedEvent.type === 'video' && (
          <div className="flex items-center space-x-1">
            <Play className="h-4 w-4" />
            <span>15 min</span>
          </div>
        )}
      </div>
      
      {/* Engagement metrics */}
      <div className="flex items-center space-x-6 flex-wrap">
        <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
          <Zap className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
          <span className="font-medium text-foreground group-hover:text-amber-500 transition-colors">
            {interactions.isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
            ) : (
              zapsCount.toLocaleString()
            )}
          </span>
          <span className="text-muted-foreground group-hover:text-amber-500 transition-colors text-sm">zaps</span>
        </div>
        
        <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
          <MessageCircle className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          <span className="font-medium text-foreground group-hover:text-blue-500 transition-colors">
            {interactions.isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            ) : (
              commentsCount
            )}
          </span>
          <span className="text-muted-foreground group-hover:text-blue-500 transition-colors text-sm">comments</span>
        </div>
        
        <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
          <Heart className="h-5 w-5 text-muted-foreground group-hover:text-pink-500 transition-colors" />
          <span className="font-medium text-foreground group-hover:text-pink-500 transition-colors">
            {interactions.isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
            ) : (
              reactionsCount
            )}
          </span>
          <span className="text-muted-foreground group-hover:text-pink-500 transition-colors text-sm">likes</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Resource content component that fetches and displays the actual content
 */
function ResourceContent({ resourceId }: { resourceId: string }) {
  const { fetchSingleEvent } = useNostr()
  const [event, setEvent] = useState<NostrEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const nostrEvent = await fetchSingleEvent({
          kinds: [30023, 30403], // Long-form content and drafts
          '#d': [resourceId]
        })
        
        if (nostrEvent) {
          setEvent(nostrEvent)
        } else {
          setError('Resource not found')
        }
      } catch (err) {
        console.error('Error fetching Nostr event:', err)
        setError('Failed to fetch resource')
      } finally {
        setLoading(false)
      }
    }

    if (resourceId) {
      fetchEvent()
    }
  }, [resourceId, fetchSingleEvent])

  if (loading) {
    return <ContentSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Content not available</p>
      </div>
    )
  }

  const parsedEvent = parseEvent(event)
  const title = parsedEvent.title || 'Unknown Resource'
  const description = parsedEvent.summary || 'No description available'
  const category = parsedEvent.topics[0] || 'general'
  const type = parsedEvent.type || 'document'
  const additionalLinks = parsedEvent.additionalLinks || []
  const difficulty = 'intermediate' // Default
  const isPremium = false // Default

  return (
    <div className="space-y-6">
      {/* Content Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="capitalize">
              {category}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {type}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {difficulty}
            </Badge>
            {isPremium && (
              <Badge variant="outline" className="border-amber-500 text-amber-600">
                Premium
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/content/${resourceId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Link>
            </Button>
          </div>
        </div>

        <h1 className="text-4xl font-bold">{title}</h1>
        
        <ContentMetadata event={event} parsedEvent={parsedEvent} />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {type === 'video' ? (
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: event.content }} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <MarkdownRenderer content={event.content} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Additional Links */}
      {additionalLinks && additionalLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5" />
              <span>Additional Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {additionalLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start"
                  asChild
                >
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Resource {index + 1}
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Comments Section */}
      <ZapThreads
        eventDetails={{
          identifier: resourceId,
          pubkey: event.pubkey,
          kind: event.kind,
          relays: ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band']
        }}
        title="Comments & Discussion"
      />
    </div>
  )
}

/**
 * Resource details page with full content display
 */
function ResourceDetailsContent({ resourceId }: { resourceId: string }) {
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'guide':
        return <BookOpen className="h-4 w-4" />
      case 'cheatsheet':
        return <FileText className="h-4 w-4" />
      case 'reference':
        return <FileText className="h-4 w-4" />
      case 'tutorial':
        return <Play className="h-4 w-4" />
      case 'documentation':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/content/${resourceId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Link>
            </Button>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                Content Details
              </span>
            </div>
          </div>

          {/* Content */}
          <Suspense fallback={<ContentSkeleton />}>
            <ResourceContent resourceId={resourceId} />
          </Suspense>
        </div>
      </Section>
    </MainLayout>
  )
}

export default function ResourceDetailsPage({ params }: ResourceDetailsPageProps) {
  const [resourceId, setResourceId] = useState<string>('')

  useEffect(() => {
    params.then(p => setResourceId(p.id))
  }, [params])

  if (!resourceId) {
    return (
      <MainLayout>
        <Section spacing="lg">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        </Section>
      </MainLayout>
    )
  }

  return <ResourceDetailsContent resourceId={resourceId} />
} 