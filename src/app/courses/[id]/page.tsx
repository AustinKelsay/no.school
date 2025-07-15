import { Suspense } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { CourseRepository, LessonRepository } from '@/lib/repositories'
import { CourseEnrollmentForm } from '@/components/forms/course-enrollment-form'
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  Play,
  Eye,
  Calendar,
  Tag,
  ExternalLink,
  Download,
  GraduationCap
} from 'lucide-react'
import type { Metadata } from 'next'

interface CoursePageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Generate metadata for SEO
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
    keywords: [course.category, 'course', 'bitcoin', 'lightning', 'nostr', 'development', 'programming', 'learning'],
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
function CourseLessonsSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
      </Card>
      {[...Array(2)].map((_, i) => (
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
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Course Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Course lessons will be available soon. Check back later for updated content.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Course Lessons</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">
                      Lesson {lesson.index + 1}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>30 min</span>
                      <Badge variant="secondary" className="ml-2">
                        Free
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/courses/${courseId}/lessons/${lesson.id}/details`}>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-8">
          {/* Course Header */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="capitalize">
                    {course.category}
                  </Badge>
                  <Badge variant="outline">
                    Course
                  </Badge>
                  {course.isPremium && (
                    <Badge variant="outline" className="border-amber-500 text-amber-600">
                      Premium
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold">{course.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center space-x-6 flex-wrap">
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
                  <span>{course.enrollmentCount?.toLocaleString() || 0} students</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>{lessonCount} lessons</span>
                </div>

                {estimatedDuration > 0 && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{formatDuration(estimatedDuration)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  {course.isPremium ? `Enroll for ${course.price} sats` : 'Start Learning'}
                </Button>
                <CourseEnrollmentForm 
                  courseId={course.id} 
                  courseTitle={course.title}
                />
              </div>

              {/* Topics/Tags */}
              {course.topics && course.topics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Links */}
              {course.additionalLinks && course.additionalLinks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Additional Resources</h4>
                  <div className="space-y-2">
                    {course.additionalLinks.map((link, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Resource {index + 1}
                        </a>
                      </Button>
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
                        <GraduationCap className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-foreground">Course Preview</p>
                      <p className="text-sm text-muted-foreground capitalize">{course.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Suspense fallback={<CourseLessonsSkeleton />}>
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
                    <h4 className="font-semibold mb-2">Category</h4>
                    <p className="text-sm text-muted-foreground capitalize">{course.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Lessons</h4>
                    <p className="text-sm text-muted-foreground">{lessonCount} lessons</p>
                  </div>
                  {estimatedDuration > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <p className="text-sm text-muted-foreground">{formatDuration(estimatedDuration)}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold mb-2">Enrollment</h4>
                    <p className="text-sm text-muted-foreground">{course.enrollmentCount?.toLocaleString() || 0} students</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Price</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.price > 0 ? `${course.price.toLocaleString()} ${course.currency || 'sats'}` : 'Free'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Created</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(course.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Last Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(course.updatedAt)}
                    </p>
                  </div>
                  {course.submissionRequired && (
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <p className="text-sm text-muted-foreground">Submission required for completion</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Related Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    More courses from the same category and instructor coming soon.
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