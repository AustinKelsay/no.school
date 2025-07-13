import { Loader2 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { Section } from "@/components/layout/section"

/**
 * Loading component for course detail page
 * Shows while course data is being fetched
 */
export default function Loading() {
  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-8">
          {/* Course Header Skeleton */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="h-10 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-full"></div>
                <div className="h-6 bg-muted rounded w-2/3"></div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-6 bg-muted rounded w-24"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="h-12 bg-muted rounded w-32"></div>
                <div className="h-12 bg-muted rounded w-24"></div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          </div>

          {/* Course Content Skeleton */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-muted rounded w-48"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  )
} 