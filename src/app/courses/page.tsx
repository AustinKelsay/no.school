import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { getCachedCourses, getCachedCourseStats } from '@/lib/data'
import { CourseEnrollmentForm } from '@/components/forms/course-enrollment-form'
import { Star, Clock, Users, BookOpen } from 'lucide-react'

/**
 * Loading component for course cards
 */
function CourseCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Course cards component with server-side data fetching
 */
async function CourseCards({ category }: { category?: string }) {
  const courses = await getCachedCourses(category)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="relative overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="mt-1">
                  {course.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="ml-2">
                {course.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.enrollmentCount?.toLocaleString()} students</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < Math.floor(course.rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{course.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({course.enrollmentCount} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button className="flex-1" size="sm">
                View Course
              </Button>
              <CourseEnrollmentForm 
                courseId={course.id.toString()} 
                courseTitle={course.title}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Course statistics component
 */
async function CourseStats() {
  const stats = await getCachedCourseStats()

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">{stats.totalCourses}</CardTitle>
          <CardDescription>Total Courses</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</CardTitle>
          <CardDescription>Students</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">{stats.averageRating}</CardTitle>
          <CardDescription>Average Rating</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">{stats.completionRate}%</CardTitle>
          <CardDescription>Completion Rate</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

/**
 * Courses page with server-side data fetching and Suspense
 */
export default function CoursesPage() {
  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Our Courses</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive collection of programming courses designed to take you from beginner to expert.
            </p>
          </div>

          <Suspense fallback={<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-8 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </CardHeader>
              </Card>
            ))}
          </div>}>
            <CourseStats />
          </Suspense>

          <Suspense fallback={<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>}>
            <CourseCards />
          </Suspense>
        </div>
      </Section>
    </MainLayout>
  )
} 