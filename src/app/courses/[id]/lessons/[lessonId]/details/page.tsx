import { Suspense } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { CourseRepository, LessonRepository, ResourceRepository } from '@/lib/repositories'
import { getResourceContent, getEstimatedReadingTime, formatContentForDisplay, type ResourceContent } from '@/lib/content-utils'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { VideoPlayer } from '@/components/ui/video-player'
import { ResourceActions } from '@/components/ui/resource-actions'
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
  Star,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { ResourceDisplay, LessonDisplay, CourseDisplay } from '@/data/types'
import { getLessonById, getResourceWithContentById } from '@/data'
import type { Metadata } from 'next'

interface LessonDetailsPageProps {
  params: Promise<{
    id: string
    lessonId: string
  }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: LessonDetailsPageProps): Promise<Metadata> {
  const { id, lessonId } = await params
  const course = await CourseRepository.findById(id)
  const lesson = getLessonById(lessonId)
  
  if (!course || !lesson) {
    return {
      title: 'Lesson Not Found',
      description: 'The requested lesson could not be found.',
    }
  }

  const resource = lesson.resourceId ? getResourceWithContentById(lesson.resourceId) : null
  const content = resource ? getResourceContent(resource) : null
  const title = resource?.title || 'Lesson'
  const description = content ? content.content.substring(0, 160) + '...' : resource?.description || 'Learn with this lesson'

  return {
    title: `${title} - ${course.title} - no.school`,
    description,
    keywords: [course.category, 'lesson', 'course', 'learning', 'bitcoin', 'lightning', 'nostr', 'development'],
    openGraph: {
      title: `${title} - ${course.title}`,
      description,
      type: 'article',
      images: [
        {
          url: resource?.image || course.image || '/placeholder.svg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${course.title}`,
      description,
      images: [resource?.image || course.image || '/placeholder.svg'],
    },
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
  lessons: LessonDisplay[]
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
 * Lesson metadata component
 */
function LessonMetadata({ 
  resource, 
  content, 
  lesson 
}: { 
  resource: ResourceDisplay
  content: ResourceContent
  lesson: LessonDisplay
}) {
  const readingTime = content?.isMarkdown ? getEstimatedReadingTime(content.content) : null
  
  return (
    <div className="flex items-center space-x-6 flex-wrap text-sm text-muted-foreground">
      <div className="flex items-center space-x-1">
        <User className="h-4 w-4" />
        <span>{resource.instructor}</span>
      </div>
      
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
      
      {resource.duration && (
        <div className="flex items-center space-x-1">
          <PlayCircle className="h-4 w-4" />
          <span>{resource.duration}</span>
        </div>
      )}
      
      {resource.rating > 0 && (
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 fill-current text-yellow-400" />
          <span>{resource.rating}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Lesson content component
 */
async function LessonContent({ 
  courseId, 
  lessonId 
}: { 
  courseId: string
  lessonId: string 
}) {
  const [course, lesson] = await Promise.all([
    CourseRepository.findById(courseId),
    Promise.resolve(getLessonById(lessonId))
  ])
  
  if (!course || !lesson) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    )
  }

  const resource = lesson.resourceId ? getResourceWithContentById(lesson.resourceId) : null
  
  if (!resource) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Lesson content not available</p>
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
  
  // Get all course lessons for navigation
  const courseLessons = await LessonRepository.findByCourseId(courseId)
  const lessonDisplays: LessonDisplay[] = courseLessons.map(l => {
    const res = l.resourceId ? getResourceWithContentById(l.resourceId) : null
    return {
      ...l,
      title: res?.title || 'Unknown Lesson',
      description: res?.description || 'No description available',
      duration: res?.duration,
      type: res?.type === 'video' ? 'video' : 'document',
      isPremium: res?.isPremium || false
    } as LessonDisplay
  })
  
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
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.instructor}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="capitalize">
              {course.category}
            </Badge>
            <ResourceActions resource={resource} content={content} />
          </div>
        </div>

        {/* Lesson Title & Badges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getContentTypeIcon(resource.type)}
              <h1 className="text-3xl font-bold">{content.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
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
          </div>
          
          <LessonMetadata resource={resource} content={content} lesson={{
            ...lesson,
            title: resource.title,
            description: resource.description,
            duration: resource.duration,
            type: resource.type === 'video' ? 'video' : 'document',
            isPremium: resource.isPremium
          }} />
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
              duration={resource.duration}
              thumbnailUrl={resource.thumbnailUrl}
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
                        {l.title}
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
export default async function LessonDetailsPage({ params }: LessonDetailsPageProps) {
  const { id, lessonId } = await params
  
  const [course, lesson] = await Promise.all([
    CourseRepository.findById(id),
    Promise.resolve(getLessonById(lessonId))
  ])

  if (!course || !lesson) {
    notFound()
  }

  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/courses" className="hover:text-foreground">
              Courses
            </Link>
            <span>•</span>
            <Link href={`/courses/${id}`} className="hover:text-foreground">
              {course.title}
            </Link>
            <span>•</span>
            <span>Lesson Details</span>
          </div>

          {/* Content */}
          <Suspense fallback={<LessonContentSkeleton />}>
            <LessonContent courseId={id} lessonId={lessonId} />
          </Suspense>
        </div>
      </Section>
    </MainLayout>
  )
} 