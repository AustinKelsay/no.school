import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { getCachedCourseById, getCachedCourseWithLessons } from '@/lib/data'
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
  const course = await getCachedCourseById(id)

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
  const courseWithLessons = await getCachedCourseWithLessons(courseId)

  if (!courseWithLessons || !courseWithLessons.lessons) {
    return <div>No lessons available</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Lessons</h2>
      {courseWithLessons.lessons.map((lesson, index) => (
        <Card key={lesson.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {index + 1}. {lesson.title || 'Untitled Lesson'}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration || '30 min'}</span>
                  {lesson.isPremium && (
                    <Badge variant="secondary" className="ml-2">
                      Premium
                    </Badge>
                  )}
                </CardDescription>
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
  
  const course = await getCachedCourseById(id)

  if (!course) {
    notFound()
  }

  // Calculate total duration from lessons
  const courseWithLessons = await getCachedCourseWithLessons(id)
  const totalDuration = courseWithLessons?.lessons?.reduce((total, lesson) => {
    if (!lesson.duration) return total
    
    const match = lesson.duration.match(/(\d+):(\d+)/)
    if (match) {
      const hours = parseInt(match[1], 10)
      const minutes = parseInt(match[2], 10)
      return total + hours * 60 + minutes
    }
    return total
  }, 0) || 0

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    return `${hours}h ${mins}m`
  }

  const lessonCount = courseWithLessons?.lessons?.length || 0

  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-8">
          {/* Course Header */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
                  <span>{formatDuration(totalDuration)}</span>
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
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                {course.image ? (
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                        <BookOpen className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground">Course Preview</p>
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
                    <p className="text-sm text-muted-foreground">{formatDuration(totalDuration)}</p>
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
                      {course.isPremium ? `${course.price} ${course.currency || 'sats'}` : 'Free'}
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