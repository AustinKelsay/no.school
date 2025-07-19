'use client'

import { Suspense, useEffect, useState } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { parseEvent } from '@/data/types'
import { useNostr, type NormalizedProfile } from '@/hooks/useNostr'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { encodePublicKey } from 'snstr'
import { ZapThreads } from '@/components/ui/zap-threads'
import { 
  Zap, 
  Clock, 
  FileText, 
  Play, 
  ExternalLink,
  Eye,
  BookOpen,
  Video,
  Tag,
  MessageCircle,
  Heart
} from 'lucide-react'
import type { NostrEvent } from 'snstr'

interface ResourcePageProps {
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
 * Loading component for resource content
 */
function ResourceContentSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Resource overview component - shows metadata and description, not the actual content
 */
function ResourceOverview({ resourceId }: { resourceId: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>About this Resource</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">
              Ready to dive into the content?
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Click below to access the full resource content.
            </p>
            <Button size="lg" asChild>
              <Link href={`/content/${resourceId}/details`}>
                <Eye className="h-4 w-4 mr-2" />
                View Content
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Main resource page component
 */
function ResourcePageContent({ resourceId }: { resourceId: string }) {
  const { fetchSingleEvent, fetchProfile, normalizeKind0 } = useNostr()
  const [event, setEvent] = useState<NostrEvent | null>(null)
  const [authorProfile, setAuthorProfile] = useState<NormalizedProfile | null>(null)
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
          
          // Fetch author profile
          try {
            const profileEvent = await fetchProfile(nostrEvent.pubkey)
            const normalizedProfile = normalizeKind0(profileEvent)
            setAuthorProfile(normalizedProfile)
          } catch (profileError) {
            console.error('Error fetching author profile:', profileError)
          }
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
  }, [resourceId, fetchSingleEvent, fetchProfile, normalizeKind0])

  if (loading) {
    return (
      <MainLayout>
        <Section spacing="lg">
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
                <div className="aspect-video bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </Section>
      </MainLayout>
    )
  }

  if (error || !event) {
    notFound()
  }

  const parsedEvent = parseEvent(event)
  const title = parsedEvent.title || 'Unknown Resource'
  const description = parsedEvent.summary || 'No description available'
  const topics = parsedEvent.topics || []
  const additionalLinks = parsedEvent.additionalLinks || []
  const image = parsedEvent.image || '/placeholder.svg'
  const author = authorProfile?.name || 
                 authorProfile?.display_name || 
                 parsedEvent.author || 
                 formatNpubWithEllipsis(event.pubkey)
  const type = parsedEvent.type || 'document'
  const difficulty = 'intermediate' // Default since it's not in parseEvent
  const viewCount = 1250 // Mock data
  const duration = type === 'video' ? '15 min' : undefined
  
  // Generate mock engagement metrics
  const generateMockZapsCount = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const normalized = Math.abs(hash) % 4000;
    return normalized + 500;
  }
  
  const generateMockCommentsCount = (id: string): number => {
    let hash = 0;
    const seed = id + 'comments';
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const normalized = Math.abs(hash) % 145;
    return normalized + 5;
  }
  
  const generateMockReactionsCount = (id: string): number => {
    let hash = 0;
    const seed = id + 'reactions';
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const normalized = Math.abs(hash) % 780;
    return normalized + 20;
  }
  
  const mockZapsCount = generateMockZapsCount(resourceId)
  const mockCommentsCount = generateMockCommentsCount(resourceId)
  const mockReactionsCount = generateMockReactionsCount(resourceId)

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />
      case 'guide':
        return <BookOpen className="h-5 w-5" />
      case 'cheatsheet':
        return <FileText className="h-5 w-5" />
      case 'reference':
        return <FileText className="h-5 w-5" />
      case 'tutorial':
        return <Play className="h-5 w-5" />
      case 'documentation':
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-8">
          {/* Resource Header */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="capitalize">
                    {topics[0] || 'general'}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {type}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {difficulty}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="text-lg text-muted-foreground">
                  {description}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
                  <Zap className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                  <span className="font-medium text-foreground group-hover:text-amber-500 transition-colors">{mockZapsCount.toLocaleString()}</span>
                  <span className="text-muted-foreground group-hover:text-amber-500 transition-colors text-sm">zaps</span>
                </div>
                
                <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
                  <MessageCircle className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  <span className="font-medium text-foreground group-hover:text-blue-500 transition-colors">{mockCommentsCount}</span>
                  <span className="text-muted-foreground group-hover:text-blue-500 transition-colors text-sm">comments</span>
                </div>
                
                <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
                  <Heart className="h-5 w-5 text-muted-foreground group-hover:text-pink-500 transition-colors" />
                  <span className="font-medium text-foreground group-hover:text-pink-500 transition-colors">{mockReactionsCount}</span>
                  <span className="text-muted-foreground group-hover:text-pink-500 transition-colors text-sm">likes</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <span>{viewCount?.toLocaleString() || 0} views</span>
                </div>
                
                {duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{duration}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link href={`/content/${resourceId}/details`}>
                    {getResourceTypeIcon(type)}
                    <span className="ml-2">
                      {type === 'video' ? 'Watch Now' : 'Read Now'}
                    </span>
                  </Link>
                </Button>
              </div>

              {/* Tags */}
              {topics && topics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
                {/* Background pattern for visual interest */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div 
                    className="absolute inset-0" 
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                      backgroundSize: '20px 20px'
                    } as React.CSSProperties}
                  />
                </div>
                
                {image && image !== '/placeholder.svg' ? (
                  <OptimizedImage 
                    src={image} 
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                        {getResourceTypeIcon(type)}
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        {type === 'video' ? 'Video Preview' : 'Resource Preview'}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{type} • {topics[0] || 'general'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resource Overview */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Suspense fallback={<ResourceContentSkeleton />}>
                <ResourceOverview resourceId={resourceId} />
              </Suspense>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About this {type}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Author</h4>
                    <p className="text-sm text-muted-foreground">{author}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Type</h4>
                    <p className="text-sm text-muted-foreground capitalize">{type}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <p className="text-sm text-muted-foreground capitalize">{topics[0] || 'general'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Difficulty</h4>
                    <p className="text-sm text-muted-foreground capitalize">{difficulty}</p>
                  </div>
                  {duration && (
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <p className="text-sm text-muted-foreground">{duration}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold mb-2">Views</h4>
                    <p className="text-sm text-muted-foreground">{viewCount?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Created</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(event.created_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Related Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    More resources from the same category and difficulty level coming soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="mt-8">
            <ZapThreads
              eventDetails={{
                identifier: resourceId,
                pubkey: event.pubkey,
                kind: event.kind,
                relays: ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band']
              }}
              title="Resource Discussion"
            />
          </div>
        </div>
      </Section>
    </MainLayout>
  )
}

/**
 * Resource detail page with dynamic routing
 */
export default function ResourcePage({ params }: ResourcePageProps) {
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

  return <ResourcePageContent resourceId={resourceId} />
} 