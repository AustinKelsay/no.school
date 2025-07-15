import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'

/**
 * Loading component for resource detail page
 * Shows skeleton UI while resource data is being fetched
 */
export default function ResourceLoading() {
  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-8">
          {/* Resource Header Skeleton */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-6 bg-muted rounded-full w-20 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded-full w-16 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded-full w-24 animate-pulse"></div>
                </div>
                <div className="h-10 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-2/3 animate-pulse"></div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="h-5 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-5 bg-muted rounded w-8 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-5 bg-muted rounded w-12 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-5 bg-muted rounded w-12 animate-pulse"></div>
                  <div className="h-5 bg-muted rounded w-10 animate-pulse"></div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="h-12 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-12 bg-muted rounded w-40 animate-pulse"></div>
              </div>

              {/* Tags Skeleton */}
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 bg-muted rounded-full w-16 animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-lg bg-muted animate-pulse"></div>
            </div>
          </div>

          {/* Resource Content Skeleton */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-32"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-12 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-40"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-36"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  )
} 