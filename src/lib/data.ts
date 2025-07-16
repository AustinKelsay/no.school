/**
 * Data access layer for the application
 * Uses unified data access functions that combine database + Nostr data
 * This is the main interface for frontend components
 */

import { 
  getAllCoursesWithContent,
  getAllContentItems as getContentItems
} from '@/data'

import type { 
  CourseDisplay, 
  ResourceDisplay, 
  ContentItem 
} from '@/data/types'

// Re-export types for consumers
export type { 
  CourseDisplay, 
  ResourceDisplay, 
  ContentItem 
} from '@/data/types'

// ============================================================================
// CACHED DATA ACCESS FUNCTIONS
// ============================================================================

/**
 * Get all courses with full content data (cached)
 */
export async function getCachedCourses(category?: string): Promise<CourseDisplay[]> {
  // Simulate async operation (in real app this would use actual caching)
  await new Promise(resolve => setTimeout(resolve, 10))
  
  const courses = getAllCoursesWithContent()
  
  if (category) {
    return courses.filter(course => course.category === category)
  }
  
  return courses
}


/**
 * Get course statistics (cached)
 */
export async function getCachedCourseStats() {
  await new Promise(resolve => setTimeout(resolve, 10))
  
  const courses = getAllCoursesWithContent()
  const totalCourses = courses.length
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollmentCount, 0)
  const averageRating = courses.reduce((sum, course) => sum + course.rating, 0) / totalCourses
  
  return {
    totalCourses,
    totalEnrollments,
    averageRating: Math.round(averageRating * 10) / 10
  }
}


// ============================================================================
// LEGACY EXPORT FUNCTIONS (for backward compatibility)
// ============================================================================

/**
 * Get all content items (legacy)
 */
export async function getAllContentItems(): Promise<ContentItem[]> {
  return getContentItems()
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if content is premium
 */
export function isContentPremium(content: CourseDisplay | ResourceDisplay): boolean {
  return content.isPremium
}

/**
 * Get content price display
 */
export function getContentPriceDisplay(content: CourseDisplay | ResourceDisplay): string {
  if (!content.isPremium) return 'Free'
  return `${content.price} ${content.currency}`
}

/**
 * Get content type display
 */
export function getContentTypeDisplay(content: CourseDisplay | ResourceDisplay): string {
  if ('enrollmentCount' in content) return 'Course'
  if ('type' in content) return content.type === 'video' ? 'Video' : 'Document'
  return 'Content'
}

/**
 * Get content duration display
 */
export function getContentDurationDisplay(content: ResourceDisplay): string {
  if (!content.duration) return 'Unknown duration'
  return content.duration
}

/**
 * Get content rating display
 */
export function getContentRatingDisplay(content: CourseDisplay | ResourceDisplay): string {
  return `${content.rating}/5`
}

/**
 * Get content engagement display
 */
export function getContentEngagementDisplay(content: CourseDisplay | ResourceDisplay): string {
  if ('enrollmentCount' in content) {
    return `${content.enrollmentCount.toLocaleString()} students`
  }
  if ('viewCount' in content) {
    return `${content.viewCount.toLocaleString()} views`
  }
  return 'No engagement data'
}

/**
 * Format content date
 */
export function formatContentDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get content categories
 */
export function getContentCategories(): string[] {
  const allContent = getContentItems()
  const categories = new Set<string>()
  
  allContent.forEach(item => {
    categories.add(item.category)
  })
  
  return Array.from(categories).sort()
}

/**
 * Get content difficulties
 */
export function getContentDifficulties(): string[] {
  const allContent = getContentItems()
  const difficulties = new Set<string>()
  
  allContent.forEach(item => {
    if (item.difficulty) {
      difficulties.add(item.difficulty)
    }
  })
  
  return Array.from(difficulties).sort()
}

/**
 * Get content tags
 */
export function getContentTags(): string[] {
  const allContent = getContentItems()
  const tags = new Set<string>()
  
  allContent.forEach(item => {
    item.topics?.forEach(topic => tags.add(topic))
  })
  
  return Array.from(tags).sort()
}

/**
 * Get popular tags
 */
export function getPopularTags(limit: number = 20): string[] {
  const allContent = getContentItems()
  const tagCounts = new Map<string, number>()
  
  allContent.forEach(item => {
    item.topics.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
    item.topics?.forEach(topic => {
      tagCounts.set(topic, (tagCounts.get(topic) || 0) + 1)
    })
  })
  
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}

 