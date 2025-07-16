import { Suspense } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { ResourceRepository } from '@/lib/repositories'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { 
  Star, 
  Clock, 
  Users, 
  FileText, 
  Play, 
  ExternalLink,
  Download,
  Eye,
  BookOpen,
  Video,
  Calendar,
  Tag
} from 'lucide-react'
import type { Metadata } from 'next'

interface ResourcePageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Generate metadata for SEO
 * Demonstrates dynamic metadata generation for resources
 */
export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { id } = await params
  const resource = await ResourceRepository.findById(id)

  if (!resource) {
    return {
      title: 'Resource Not Found',
      description: 'The requested resource could not be found.',
    }
  }

  return {
    title: `${resource.title} - no.school`,
    description: resource.description,
    keywords: [resource.category, resource.type, 'bitcoin', 'lightning', 'nostr', 'development', 'programming', 'learning'],
    openGraph: {
      title: resource.title,
      description: resource.description,
      type: 'article',
      images: [
        {
          url: resource.image || '/placeholder.svg',
          width: 800,
          height: 600,
          alt: resource.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description: resource.description,
      images: [resource.image || '/placeholder.svg'],
    },
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
 * Resource content component
 */
async function ResourceContent({ resourceId }: { resourceId: string }) {
  const resource = await ResourceRepository.findById(resourceId)

  if (!resource) {
    return <div>Resource content not available</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {resource.type === 'video' ? (
              <Video className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <span>Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-4">
              {resource.description}
            </p>
            
            {resource.type === 'video' && resource.videoUrl && (
              <div className="mb-4">
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Video
                </Button>
              </div>
            )}
            
            {resource.additionalLinks && resource.additionalLinks.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Additional Resources</h4>
                <div className="space-y-2">
                  {resource.additionalLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        External Resource {index + 1}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Resource detail page with dynamic routing
 */
export default async function ResourcePage({ params }: ResourcePageProps) {
  const { id } = await params
  
  const resource = await ResourceRepository.findById(id)

  if (!resource) {
    notFound()
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
                    {resource.category}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {resource.type}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {resource.difficulty}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold">{resource.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {resource.description}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={`resource-${resource.id}-star-${i}`} 
                        className={`h-5 w-5 ${
                          i < Math.floor(resource.rating) 
                            ? 'fill-rating text-rating' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="font-medium">{resource.rating}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <span>{resource.viewCount?.toLocaleString() || 0} views</span>
                </div>
                
                {resource.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{resource.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link href={`/content/${resource.id}/details`}>
                    {getResourceTypeIcon(resource.type)}
                    <span className="ml-2">
                      {resource.type === 'video' ? 'Watch Now' : 'Read Now'}
                    </span>
                  </Link>
                </Button>
                {resource.isPremium && (
                  <Button variant="outline" size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Access Premium
                  </Button>
                )}
              </div>

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
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
                
                {resource.image || resource.thumbnailUrl ? (
                  <OptimizedImage 
                    src={resource.image || resource.thumbnailUrl || '/placeholder.svg'} 
                    alt={resource.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                        {getResourceTypeIcon(resource.type)}
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        {resource.type === 'video' ? 'Video Preview' : 'Resource Preview'}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{resource.type} • {resource.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resource Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Suspense fallback={<ResourceContentSkeleton />}>
                <ResourceContent resourceId={id} />
              </Suspense>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About this {resource.type}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Author</h4>
                    <p className="text-sm text-muted-foreground">{resource.instructor}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Type</h4>
                    <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <p className="text-sm text-muted-foreground capitalize">{resource.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Difficulty</h4>
                    <p className="text-sm text-muted-foreground capitalize">{resource.difficulty}</p>
                  </div>
                  {resource.duration && (
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <p className="text-sm text-muted-foreground">{resource.duration}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold mb-2">Views</h4>
                    <p className="text-sm text-muted-foreground">{resource.viewCount?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Price</h4>
                    <p className="text-sm text-muted-foreground">
                      {resource.price > 0 ? `${resource.price} sats` : 'Free'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Created</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(resource.createdAt)}
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
        </div>
      </Section>
    </MainLayout>
  )
} 