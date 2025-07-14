/**
 * Reusable skeleton components for consistent loading states
 * Supports different layouts and content types
 */

interface ContentSkeletonProps {
  variant: 'grid' | 'list' | 'detail' | 'stats'
  count?: number
  className?: string
}

export function ContentSkeleton({ variant, count = 3, className = '' }: ContentSkeletonProps) {
  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4" />
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2" />
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="animate-pulse flex space-x-4 p-4 border rounded-lg">
            <div className="bg-gray-200 dark:bg-gray-700 h-16 w-16 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4" />
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2" />
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div className={`animate-pulse ${className}`}>
        {/* Header section */}
        <div className="mb-8">
          <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded w-2/3 mb-4" />
          <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2 mb-6" />
          <div className="space-y-3">
            <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full" />
            <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-4/5" />
            <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-3/4" />
          </div>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full" />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'stats') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="animate-pulse p-6 border rounded-lg">
            <div className="bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded mb-4" />
            <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-16 mb-2" />
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-24" />
          </div>
        ))}
      </div>
    )
  }

  return null
}

// Specific skeleton components for common use cases
export function CourseCardSkeleton({ count = 6 }: { count?: number }) {
  return <ContentSkeleton variant="grid" count={count} />
}

export function LessonsSkeleton({ count = 5 }: { count?: number }) {
  return <ContentSkeleton variant="list" count={count} />
}

export function CourseDetailSkeleton() {
  return <ContentSkeleton variant="detail" />
}

export function StatsSkeleton() {
  return <ContentSkeleton variant="stats" />
}

// Combined loading skeleton for course page
export function CoursePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats skeleton */}
      <StatsSkeleton />
      
      {/* Course cards skeleton */}
      <div>
        <div className="animate-pulse mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded w-48" />
        </div>
        <CourseCardSkeleton count={6} />
      </div>
    </div>
  )
}

// Loading skeleton for content page
export function ContentPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Filter bar skeleton */}
      <div className="animate-pulse flex space-x-4">
        <div className="bg-gray-200 dark:bg-gray-700 h-10 rounded w-32" />
        <div className="bg-gray-200 dark:bg-gray-700 h-10 rounded w-32" />
        <div className="bg-gray-200 dark:bg-gray-700 h-10 rounded w-40" />
      </div>
      
      {/* Content grid skeleton */}
      <ContentSkeleton variant="grid" count={9} />
    </div>
  )
}