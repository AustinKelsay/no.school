import { Suspense } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { CourseRepository, LessonRepository } from '@/lib/repositories'
import { CourseEnrollmentForm } from '@/components/forms/course-enrollment-form'
import { Star, Clock, Users, BookOpen, Play } from 'lucide-react'
import type { Metadata } from 'next'

interface CoursePageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Generate metadata for SEO
 * Demonstrates dynamic metadata generation
 */
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params
  const course = await CourseRepository.findById(id)

  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
    }
  }

  return {
    title: `${course.title} - no.school`,
    description: course.description,
    keywords: [course.category, 'bitcoin', 'lightning', 'development', 'programming', 'course', 'learning'],
    openGraph: {
      title: course.title,
      description: course.description,
      type: 'article',
      images: [
        {
          url: course.image || '/placeholder.svg',
          width: 800,
          height: 600,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
      images: [course.image || '/placeholder.svg'],
    },
  }
}

/**
 * Loading component for course lessons
 */
function LessonsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

/**
 * Course lessons component
 */
async function CourseLessons({ courseId }: { courseId: string }) {
  const lessons = await LessonRepository.findByCourseId(courseId)

  if (!lessons || lessons.length === 0) {
    return <div>No lessons available</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Lessons</h2>
      {lessons.map((lesson, index) => (
        <Card key={lesson.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {index + 1}. Lesson {lesson.index + 1}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>30 min</span>
                  <Badge variant="secondary" className="ml-2">
                    Free
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

/**
 * Course detail page with dynamic routing
 */
export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params
  
  const course = await CourseRepository.findById(id)

  if (!course) {
    notFound()
  }

  // Get lessons for the course
  const lessons = await LessonRepository.findByCourseId(id)
  const lessonCount = lessons.length
  
  // Estimate total duration based on lesson count
  const estimatedDuration = lessonCount * 30 // 30 minutes per lesson

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    return `${hours}h ${mins}m`
  }

  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-8">
          {/* Course Header */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="secondary" className="capitalize">{course.category}</Badge>
                <h1 className="text-4xl font-bold">{course.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={`course-${course.id}-star-${i}`} 
                        className={`h-5 w-5 ${
                          i < Math.floor(course.rating) 
                            ? 'fill-rating text-rating' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="font-medium">{course.rating}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{course.enrollmentCount?.toLocaleString()} students</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{formatDuration(estimatedDuration)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
                <CourseEnrollmentForm 
                  courseId={course.id} 
                  courseTitle={course.title}
                />
              </div>
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
                
                {course.image ? (
                  <Image 
                    src={course.image} 
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                        <BookOpen className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-foreground">Course Preview</p>
                      <p className="text-sm text-muted-foreground">{course.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Suspense fallback={<LessonsSkeleton />}>
                <CourseLessons courseId={id} />
              </Suspense>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About this course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Instructor</h4>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Duration</h4>
                    <p className="text-sm text-muted-foreground">{formatDuration(estimatedDuration)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <p className="text-sm text-muted-foreground capitalize">{course.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Lessons</h4>
                    <p className="text-sm text-muted-foreground">{lessonCount} lessons</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Price</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.price > 0 ? `${course.price} sats` : 'Free'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  )
} 