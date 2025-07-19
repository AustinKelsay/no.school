'use client'

import { Suspense, useEffect, useState } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { getResourceContent, getEstimatedReadingTime, formatContentForDisplay, type ResourceContent } from '@/lib/content-utils'
import { parseCourseEvent, parseEvent } from '@/lib/content-utils'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { VideoPlayer } from '@/components/ui/video-player'
import { ResourceActions } from '@/components/ui/resource-actions'
import { useCourseQuery } from '@/hooks/useCoursesQuery'
import { useLessonsQuery, useLessonQuery } from '@/hooks/useLessonsQuery'
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  User, 
  Calendar, 
  PlayCircle, 
  BookOpen, 
  Video, 
  FileText,
  RotateCcw,
  Zap,
  Eye,
  MessageCircle,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import { Lesson } from '@/data/types'
import type { Metadata } from 'next'
import { useNostr, type NormalizedProfile } from '@/hooks/useNostr'
import { encodePublicKey } from 'snstr'

interface LessonDetailsPageProps {
  params: Promise<{
    id: string
    lessonId: string
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
 * Loading component for lesson content
 */
function LessonContentSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



/**
 * Lesson navigation component
 */
function LessonNavigation({ 
  courseId, 
  currentLessonIndex, 
  lessons 
}: { 
  courseId: string
  currentLessonIndex: number
  lessons: Lesson[]
}) {
  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  return (
    <div className="flex items-center space-x-2">
      {prevLesson && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/courses/${courseId}/lessons/${prevLesson.id}/details`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Link>
        </Button>
      )}
      
      <Button variant="outline" size="sm" asChild>
        <Link href={`/courses/${courseId}`}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Back to Course
        </Link>
      </Button>
      
      {nextLesson && (
        <Button size="sm" asChild>
          <Link href={`/courses/${courseId}/lessons/${nextLesson.id}/details`}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      )}
    </div>
  )
}

/**
 * Client component for displaying instructor with profile data
 */
function InstructorDisplay({ instructorPubkey, fallbackName }: { instructorPubkey?: string; fallbackName: string }) {
  const { fetchProfile, normalizeKind0 } = useNostr()
  const [instructorProfile, setInstructorProfile] = useState<NormalizedProfile | null>(null)

  useEffect(() => {
    const fetchInstructorProfile = async () => {
      if (instructorPubkey) {
        try {
          const profileEvent = await fetchProfile(instructorPubkey)
          const normalizedProfile = normalizeKind0(profileEvent)
          setInstructorProfile(normalizedProfile)
        } catch (error) {
          console.error('Error fetching instructor profile:', error)
        }
      }
    }

    fetchInstructorProfile()
  }, [instructorPubkey, fetchProfile, normalizeKind0])

  const displayName = instructorProfile?.name || 
                      instructorProfile?.display_name || 
                      fallbackName || 
                      (instructorPubkey ? formatNpubWithEllipsis(instructorPubkey) : 'Unknown')

  return (
    <div className="flex items-center space-x-1">
      <User className="h-4 w-4" />
      <span>{displayName}</span>
    </div>
  )
}

/**
 * Lesson metadata component
 */
function LessonMetadata({ 
  instructorPubkey, 
  instructorName,
  content, 
  lesson,
  duration
}: { 
  instructorPubkey: string
  instructorName: string
  content: { content: string; isMarkdown?: boolean }
  lesson: Lesson
  duration?: string
}) {
  const readingTime = content?.isMarkdown ? getEstimatedReadingTime(content.content) : null
  
  return (
    <div className="flex items-center space-x-6 flex-wrap text-sm text-muted-foreground">
      <InstructorDisplay instructorPubkey={instructorPubkey} fallbackName={instructorName} />
      
      <div className="flex items-center space-x-1">
        <Calendar className="h-4 w-4" />
        <span>Lesson {lesson.index + 1}</span>
      </div>
      
      {readingTime && (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
      )}
      
      {duration && (
        <div className="flex items-center space-x-1">
          <PlayCircle className="h-4 w-4" />
          <span>{duration}</span>
        </div>
      )}
      
      {/* Engagement metrics */}
      <div className="flex items-center space-x-6 flex-wrap">
        <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
          <Zap className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
          <span className="font-medium text-foreground group-hover:text-amber-500 transition-colors">{Math.floor(Math.random() * 1500) + 200}</span>
          <span className="text-muted-foreground group-hover:text-amber-500 transition-colors text-sm">zaps</span>
        </div>
        <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
          <MessageCircle className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          <span className="font-medium text-foreground group-hover:text-blue-500 transition-colors">{Math.floor(Math.random() * 50) + 5}</span>
          <span className="text-muted-foreground group-hover:text-blue-500 transition-colors text-sm">comments</span>
        </div>
        <div className="flex items-center space-x-2 transition-colors cursor-pointer group">
          <Heart className="h-5 w-5 text-muted-foreground group-hover:text-pink-500 transition-colors" />
          <span className="font-medium text-foreground group-hover:text-pink-500 transition-colors">{Math.floor(Math.random() * 150) + 10}</span>
          <span className="text-muted-foreground group-hover:text-pink-500 transition-colors text-sm">likes</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Lesson content component
 */
function LessonContent({ 
  courseId, 
  lessonId 
}: { 
  courseId: string
  lessonId: string 
}) {
  // Use the new hooks to fetch lesson and course data with Nostr integration
  const { lesson: lessonData, isLoading: lessonLoading, isError: lessonError } = useLessonQuery(lessonId)
  const { course: courseData, isLoading: courseLoading } = useCourseQuery(courseId)
  const { lessons: lessonsData, isLoading: lessonsDataLoading } = useLessonsQuery(courseId)

  const loading = lessonLoading || courseLoading || lessonsDataLoading

  if (loading) {
    return <LessonContentSkeleton />
  }
  
  if (lessonError || !lessonData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    )
  }
  
  if (!lessonData.resource) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Lesson content not available</p>
      </div>
    )
  }

  // Parse data from database and Nostr notes
  let resourceTitle = 'Unknown Lesson'
  let resourceDescription = 'No description available'
  let resourceType = 'document'
  const resourceDifficulty = 'intermediate' // Default
  let resourceIsPremium = false
  let resourceAuthor = 'Unknown'
  let resourceAuthorPubkey = ''
  let resourceImage = ''
  let resourceTopics: string[] = []
  let resourceAdditionalLinks: string[] = []

  let courseTitle = 'Unknown Course'
  let courseCategory = 'general'
  let courseInstructorPubkey = ''

  // Start with database data
  resourceIsPremium = (lessonData.resource.price ?? 0) > 0
  resourceAuthorPubkey = lessonData.resource.userId

  // Parse resource Nostr data if available
  if (lessonData.resource.note) {
    try {
      const parsedResource = parseEvent(lessonData.resource.note)
      resourceTitle = parsedResource.title || resourceTitle
      resourceDescription = parsedResource.summary || resourceDescription
      resourceType = parsedResource.type || resourceType
      resourceIsPremium = parsedResource.isPremium || resourceIsPremium
      resourceAuthor = parsedResource.author || resourceAuthor
      resourceAuthorPubkey = parsedResource.authorPubkey || resourceAuthorPubkey
      resourceImage = parsedResource.image || resourceImage
      resourceTopics = parsedResource.topics || resourceTopics
      resourceAdditionalLinks = parsedResource.additionalLinks || resourceAdditionalLinks
    } catch (error) {
      console.error('Error parsing resource note:', error)
    }
  }

  // Parse course data if available
  if (courseData) {
    courseInstructorPubkey = courseData.userId
    
    if (courseData.note) {
      try {
        const parsedCourse = parseCourseEvent(courseData.note)
        courseTitle = parsedCourse.title || courseTitle
        courseCategory = parsedCourse.category || courseCategory
        courseInstructorPubkey = parsedCourse.instructorPubkey || courseInstructorPubkey
      } catch (error) {
        console.error('Error parsing course note:', error)
      }
    }
  }

  // Create mock resource content for now - in future this should come from the Nostr event content
  const mockResourceContent = {
    content: lessonData.resource.note?.content || 'No content available',
    isMarkdown: true,
    type: resourceType as 'video' | 'document',
    hasVideo: resourceType === 'video',
    videoUrl: resourceType === 'video' ? '#' : undefined,
    title: resourceTitle,
    additionalLinks: resourceAdditionalLinks
  }

  const content = mockResourceContent
  
  if (!content) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Content not available</p>
      </div>
    )
  }

  const formattedContent = formatContentForDisplay(content.content)
  
  // Use enhanced lesson displays from useLessonsQuery hook
  const lessonDisplays = lessonsData || []
  
  const currentLessonIndex = lessonDisplays.findIndex(l => l.id === lessonId)
  
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'guide':
        return <BookOpen className="h-4 w-4" />
      case 'tutorial':
        return <PlayCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Course Context & Lesson Header */}
      <div className="space-y-4">
        {/* Course Context - Compact */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{courseTitle}</h3>
              <div className="text-sm text-muted-foreground">
                <InstructorDisplay instructorPubkey={courseInstructorPubkey} fallbackName="Unknown" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="capitalize">
              {courseCategory}
            </Badge>
            {/* TODO: Update ResourceActions to work with new data structure */}
            <div className="text-sm text-muted-foreground">
              {resourceIsPremium ? 'Premium' : 'Free'}
            </div>
          </div>
        </div>

        {/* Lesson Title & Badges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getContentTypeIcon(resourceType)}
              <h1 className="text-3xl font-bold">{resourceTitle}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize">
                {resourceType}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {resourceDifficulty}
              </Badge>
              {resourceIsPremium && (
                <Badge variant="outline" className="border-amber-500 text-amber-600">
                  Premium
                </Badge>
              )}
            </div>
          </div>
          
          <LessonMetadata 
            instructorPubkey={resourceAuthorPubkey} 
            instructorName={resourceAuthor}
            content={content} 
            lesson={lessonData}
            duration="30 min"
          />
        </div>
      </div>

      {/* Navigation & Progress - Compact */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <LessonNavigation 
                courseId={courseId} 
                currentLessonIndex={currentLessonIndex} 
                lessons={lessonDisplays}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {lessonDisplays.length}
              </div>
              <div className="w-32">
                <Progress value={((currentLessonIndex + 1) / lessonDisplays.length) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {content.type === 'video' && content.hasVideo ? (
            <VideoPlayer
              content={formattedContent}
              title={content.title}
              videoUrl={content.videoUrl}
              duration="30 min"
              thumbnailUrl={resourceImage}
            />
          ) : (
            <MarkdownRenderer content={formattedContent} />
          )}
        </div>
        
        {/* Lesson Sidebar */}
        <div className="space-y-4">
          {/* Course Lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Course Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lessonDisplays.map((l, index) => (
                  <div
                    key={l.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                      l.id === lessonId 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        l.id === lessonId 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/courses/${courseId}/lessons/${l.id}/details`}
                        className={`block text-sm truncate ${
                          l.id === lessonId 
                            ? 'font-semibold' 
                            : 'hover:underline'
                        }`}
                      >
                        {l.title || `Lesson ${l.index + 1}`}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Additional Resources */}
      {content.additionalLinks && content.additionalLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
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
                    <FileText className="h-4 w-4 mr-2" />
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
 * Lesson details page with full content and course context
 */
export default function LessonDetailsPage({ params }: LessonDetailsPageProps) {
  const [courseId, setCourseId] = useState<string>('')
  const [lessonId, setLessonId] = useState<string>('')

  useEffect(() => {
    params.then(p => {
      setCourseId(p.id)
      setLessonId(p.lessonId)
    })
  }, [params])

  if (!courseId || !lessonId) {
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

  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/content" className="hover:text-foreground">
              Content
            </Link>
            <span>•</span>
            <Link href={`/courses/${courseId}`} className="hover:text-foreground">
              Course
            </Link>
            <span>•</span>
            <span>Lesson Details</span>
          </div>

          {/* Content */}
          <Suspense fallback={<LessonContentSkeleton />}>
            <LessonContent courseId={courseId} lessonId={lessonId} />
          </Suspense>
        </div>
      </Section>
    </MainLayout>
  )
} 