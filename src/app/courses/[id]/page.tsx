'use client'

import { useEffect, useState } from 'react'
import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
// Removed repository imports - using API endpoints instead
import { OptimizedImage } from '@/components/ui/optimized-image'
import { useNostr, type NormalizedProfile } from '@/hooks/useNostr'
import { encodePublicKey } from 'snstr'
import { 
  Zap, 
  Clock, 
  BookOpen, 
  Play,
  Tag,
  ExternalLink,
  GraduationCap,
  User,
  MessageCircle,
  Heart
} from 'lucide-react'
import type { Metadata } from 'next'

interface CoursePageProps {
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
 * Course lessons component - now using lessons from props
 */
interface Lesson {
  id: string
  index: number
  title?: string
  resourceId?: string
}

function CourseLessons({ lessons, courseId }: { lessons: Lesson[]; courseId: string }) {
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-nowrap">
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">30 min</span>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
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
 * Course content component
 */
function CoursePageContent({ courseId }: { courseId: string }) {
  const { fetchProfile, normalizeKind0 } = useNostr()
  const [course, setCourse] = useState<{
    title?: string
    description?: string
    category?: string
    topics?: string[]
    additionalLinks?: string[]
    image?: string
    instructor?: string
    instructorPubkey?: string
    isPremium?: boolean
    price?: number
    currency?: string
    createdAt?: string
    updatedAt?: string
    submissionRequired?: boolean
  } | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [instructorProfile, setInstructorProfile] = useState<NormalizedProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, lessonsResponse] = await Promise.all([
          fetch(`/api/courses/${courseId}`),
          fetch(`/api/courses/${courseId}/lessons`)
        ])
        
        const courseResult = await courseResponse.json()
        const lessonsResult = await lessonsResponse.json()
        
        setCourse(courseResult.course)
        setLessons(lessonsResult.lessons)
        
        // Fetch instructor profile if available
        if (courseResult.course?.instructorPubkey) {
          try {
            const profileEvent = await fetchProfile(courseResult.course.instructorPubkey)
            const normalizedProfile = normalizeKind0(profileEvent)
            setInstructorProfile(normalizedProfile)
          } catch (profileError) {
            console.error('Error fetching instructor profile:', profileError)
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, fetchProfile, normalizeKind0])

  if (loading) {
    return (
      <MainLayout>
        <Section spacing="lg">
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
        </Section>
      </MainLayout>
    )
  }

  if (!course) {
    notFound()
  }

  const id = courseId
  const lessonCount = lessons.length
  
  // Estimate total duration based on lesson count
  const estimatedDuration = lessonCount * 30 // 30 minutes per lesson

  // Use basic course data for now - detailed parsing can be added later
  const title = course.title || 'Unknown Course'
  const description = course.description || 'No description available'
  const category = course.category || 'general'
  const topics = course.topics || []
  const additionalLinks = course.additionalLinks || []
  const image = course.image || '/placeholder.svg'
  const instructor = instructorProfile?.name || 
                     instructorProfile?.display_name || 
                     course.instructor || 
                     (course.instructorPubkey ? formatNpubWithEllipsis(course.instructorPubkey) : 'Unknown')
  const isPremium = course.isPremium || (course.price ?? 0) > 0
  const currency = course.currency || 'sats'
  
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
  
  const mockZapsCount = generateMockZapsCount(id)
  const mockCommentsCount = generateMockCommentsCount(id)
  const mockReactionsCount = generateMockReactionsCount(id)

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
                    {category}
                  </Badge>
                  <Badge variant="outline">
                    Course
                  </Badge>
                  {isPremium && (
                    <Badge variant="outline" className="border-amber-500 text-amber-600">
                      Premium
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="text-lg text-muted-foreground">
                  {description}
                </p>
              </div>

              <div className="flex items-center space-x-6 flex-wrap">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-amber-500">{mockZapsCount.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm">zaps</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-blue-500">{mockCommentsCount}</span>
                  <span className="text-muted-foreground text-sm">comments</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span className="font-medium text-pink-500">{mockReactionsCount}</span>
                  <span className="text-muted-foreground text-sm">likes</span>
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
                {!isPremium ? (
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <Link href={lessons.length > 0 ? `/courses/${id}/lessons/${lessons[0].id}/details` : `/courses/${id}`}>
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Start Learning
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/auth/signin">
                      <User className="h-5 w-5 mr-2" />
                      Login to Access
                    </Link>
                  </Button>
                )}
              </div>

              {/* Topics/Tags */}
              {topics && topics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Links */}
              {additionalLinks && additionalLinks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Additional Resources</h4>
                  <div className="space-y-2">
                    {additionalLinks.map((link: string, index: number) => (
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
                
                {/* Always show the placeholder content */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                      <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Course Preview</p>
                    <p className="text-sm text-muted-foreground capitalize">{category}</p>
                  </div>
                </div>
                
                {/* Overlay image if available */}
                {image && (
                  <div className="absolute inset-0">
                    <OptimizedImage 
                      src={image} 
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CourseLessons lessons={lessons} courseId={id} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About this course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Instructor</h4>
                    <p className="text-sm text-muted-foreground">{instructor}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <p className="text-sm text-muted-foreground capitalize">{category}</p>
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
                    <h4 className="font-semibold mb-2">Price</h4>
                    <p className="text-sm text-muted-foreground">
                      {(course.price ?? 0) > 0 ? `${(course.price ?? 0).toLocaleString()} ${currency}` : 'Free'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Created</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(course.createdAt || new Date().toISOString())}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Last Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(course.updatedAt || new Date().toISOString())}
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

/**
 * Course detail page with dynamic routing
 */
export default function CoursePage({ params }: CoursePageProps) {
  const [courseId, setCourseId] = useState<string>('')

  useEffect(() => {
    params.then(p => setCourseId(p.id))
  }, [params])

  if (!courseId) {
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

  return <CoursePageContent courseId={courseId} />
}