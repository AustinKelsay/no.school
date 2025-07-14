import { Suspense } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/ui/content-card'
import { getCachedCourses, getCachedCourseStats } from '@/lib/data'

/**
 * Loading component for course cards
 */
function CourseCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="aspect-video bg-muted"></div>
      <CardHeader>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </CardHeader>
      <div className="p-6 pt-0 space-y-2">
        <div className="h-3 bg-muted rounded"></div>
        <div className="h-3 bg-muted rounded w-5/6"></div>
      </div>
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
        <ContentCard 
          key={course.id} 
          item={course} 
          variant="course"
          showEnrollment={true}
        />
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
          <CardTitle className="text-2xl font-bold">{stats.totalEnrollments.toLocaleString()}</CardTitle>
          <CardDescription>Students</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</CardTitle>
          <CardDescription>Average Rating</CardDescription>
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
            <h1 className="text-4xl font-bold">Bitcoin & Lightning Courses</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master Bitcoin and Lightning Network development with our comprehensive courses. From fundamentals to advanced topics, built by developers for developers.
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