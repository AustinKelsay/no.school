import { Suspense } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { ResourceRepository } from '@/lib/repositories'
import { getResourceContent, getEstimatedReadingTime, formatContentForDisplay, type ResourceContent } from '@/lib/content-utils'
import { ResourceDisplay } from '@/data/types'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { VideoPlayer } from '@/components/ui/video-player'
import { ResourceActions } from '@/components/ui/resource-actions'
import { 
  Star, 
  Clock, 
  Eye, 
  FileText, 
  Play, 
  ExternalLink, 
  ArrowLeft, 
  BookOpen, 
  Video, 
  Calendar,
  User
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface ResourceDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ResourceDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const resource = await ResourceRepository.findById(id)

  if (!resource) {
    return {
      title: 'Resource Not Found',
      description: 'The requested resource could not be found.',
    }
  }

  const content = getResourceContent(resource)
  const description = content ? content.content.substring(0, 160) + '...' : resource.description

  return {
    title: `${resource.title} - Details - no.school`,
    description,
    keywords: [resource.category, resource.type, 'details', 'content', 'bitcoin', 'lightning', 'nostr', 'development', 'learning'],
    openGraph: {
      title: resource.title,
      description,
      type: 'article',
      images: [
        {
          url: resource.image || '/placeholder.svg',
          width: 1200,
          height: 630,
          alt: resource.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description,
      images: [resource.image || '/placeholder.svg'],
    },
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
function ContentMetadata({ resource, content }: { resource: ResourceDisplay; content: ResourceContent }) {
  const readingTime = content?.isMarkdown ? getEstimatedReadingTime(content.content) : null
  
  return (
    <div className="flex items-center space-x-6 flex-wrap text-sm text-muted-foreground">
      <div className="flex items-center space-x-1">
        <User className="h-4 w-4" />
        <span>{resource.instructor}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <Calendar className="h-4 w-4" />
        <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <Eye className="h-4 w-4" />
        <span>{resource.viewCount || 0} views</span>
      </div>
      
      {readingTime && (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
      )}
      
      {resource.duration && (
        <div className="flex items-center space-x-1">
          <Play className="h-4 w-4" />
          <span>{resource.duration}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Resource content component
 */
async function ResourceContent({ resourceId }: { resourceId: string }) {
  const resource = await ResourceRepository.findById(resourceId)
  
  if (!resource) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Resource not found</p>
      </div>
    )
  }

  const content = getResourceContent(resource)
  
  if (!content) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Content not available</p>
      </div>
    )
  }

  const formattedContent = formatContentForDisplay(content.content)

  return (
    <div className="space-y-6">
      {/* Content Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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
            {resource.isPremium && (
              <Badge variant="outline" className="border-amber-500 text-amber-600">
                Premium
              </Badge>
            )}
          </div>
          
          <ResourceActions resource={resource} content={content} />
        </div>

        <h1 className="text-4xl font-bold">{content.title}</h1>
        
        <ContentMetadata resource={resource} content={content} />
      </div>

      {/* Main Content */}
      {content.type === 'video' && content.hasVideo ? (
        <VideoPlayer
          content={formattedContent}
          title={content.title}
          videoUrl={content.videoUrl}
          duration={resource.duration}
          thumbnailUrl={resource.thumbnailUrl}
        />
      ) : (
        <MarkdownRenderer content={formattedContent} />
      )}
      
      {/* Additional Links */}
      {content.additionalLinks && content.additionalLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5" />
              <span>Additional Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.additionalLinks.map((link, index) => (
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
    </div>
  )
}

/**
 * Resource details page with full content display
 */
export default async function ResourceDetailsPage({ params }: ResourceDetailsPageProps) {
  const { id } = await params
  
  const resource = await ResourceRepository.findById(id)

  if (!resource) {
    notFound()
  }

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
              <Link href={`/content/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Link>
            </Button>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center space-x-2">
              {getResourceTypeIcon(resource.type)}
              <span className="text-sm text-muted-foreground capitalize">
                {resource.type} Details
              </span>
            </div>
          </div>

          {/* Content */}
          <Suspense fallback={<ContentSkeleton />}>
            <ResourceContent resourceId={id} />
          </Suspense>
        </div>
      </Section>
    </MainLayout>
  )
} 