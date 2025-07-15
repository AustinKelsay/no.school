/**
 * Data access layer for the application
 * Uses unified data access functions that combine database + Nostr data
 * This is the main interface for frontend components
 */

import { 
  getAllCoursesWithContent,
  getCourseWithContentById,
  getCourseWithLessonsById,
  getAllResourcesWithContent,
  getResourceWithContentById,
  getAllContentItems as getContentItems,
  searchAllContent,
  getTrendingContent,
  getFeaturedContent,
  getContentStats,
  getCoursesByContentCategory,
  getResourcesByContentCategory,
  getResourcesByType,
  getContentByInstructor,
  getContentByDifficulty,
  getPremiumContent,
  getFreeContent
} from '@/data'

import type { 
  CourseDisplay, 
  ResourceDisplay, 
  CourseWithLessons, 
  ContentItem 
} from '@/data/types'

// Re-export types for consumers
export type { 
  CourseDisplay, 
  ResourceDisplay, 
  CourseWithLessons, 
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
 * Get course by ID with full content data (cached)
 */
export async function getCachedCourseById(id: string): Promise<CourseDisplay | null> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getCourseWithContentById(id)
}

/**
 * Get course with lessons by ID (cached)
 */
export async function getCachedCourseWithLessons(id: string): Promise<CourseWithLessons | null> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getCourseWithLessonsById(id)
}

/**
 * Get all resources with full content data (cached)
 */
export async function getCachedResources(type?: 'document' | 'video', category?: string): Promise<ResourceDisplay[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  
  let resources = getAllResourcesWithContent()
  
  if (type) {
    resources = resources.filter(resource => resource.type === type)
  }
  
  if (category) {
    resources = resources.filter(resource => resource.category === category)
  }
  
  return resources
}

/**
 * Get resource by ID with full content data (cached)
 */
export async function getCachedResourceById(id: string): Promise<ResourceDisplay | null> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getResourceWithContentById(id)
}

/**
 * Get all content items for display (cached)
 */
export async function getCachedAllContentItems(): Promise<ContentItem[]> {
  // Simulate async operation (in real app this would use actual caching)
  await new Promise(resolve => setTimeout(resolve, 10))
  return getContentItems()
}

/**
 * Search all content (cached)
 */
export async function searchContent(query: string): Promise<(CourseDisplay | ResourceDisplay)[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return searchAllContent(query)
}

/**
 * Get trending content (cached)
 */
export async function getTrendingContentCached(limit: number = 10): Promise<(CourseDisplay | ResourceDisplay)[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getTrendingContent(limit)
}

/**
 * Get featured content (cached)
 */
export async function getFeaturedContentCached(type: 'course' | 'resource' | 'all' = 'all'): Promise<(CourseDisplay | ResourceDisplay)[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getFeaturedContent(type)
}

/**
 * Get content statistics (cached)
 */
export async function getCachedContentStats() {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getContentStats()
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

/**
 * Get videos by category (cached)
 */
export async function getCachedVideosByCategory(category: string): Promise<ResourceDisplay[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  
  const resources = getAllResourcesWithContent()
  return resources.filter(resource => resource.type === 'video' && resource.category === category)
}

/**
 * Get documents by category (cached)
 */
export async function getCachedDocumentsByCategory(category: string): Promise<ResourceDisplay[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  
  const resources = getAllResourcesWithContent()
  return resources.filter(resource => resource.type === 'document' && resource.category === category)
}

/**
 * Get content by instructor (cached)
 */
export async function getCachedContentByInstructor(pubkey: string): Promise<(CourseDisplay | ResourceDisplay)[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getContentByInstructor(pubkey)
}

/**
 * Get content by difficulty (cached)
 */
export async function getCachedContentByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<ResourceDisplay[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getContentByDifficulty(difficulty)
}

/**
 * Get premium content (cached)
 */
export async function getCachedPremiumContent(): Promise<(CourseDisplay | ResourceDisplay)[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getPremiumContent()
}

/**
 * Get free content (cached)
 */
export async function getCachedFreeContent(): Promise<(CourseDisplay | ResourceDisplay)[]> {
  await new Promise(resolve => setTimeout(resolve, 10))
  return getFreeContent()
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

/**
 * Get content by type (legacy)
 */
export async function getContentByType(type: 'course' | 'video' | 'document'): Promise<ContentItem[]> {
  const allContent = getContentItems()
  return allContent.filter(item => item.type === type)
}

/**
 * Get content by category (legacy)
 */
export async function getContentByCategory(category: string): Promise<ContentItem[]> {
  const allContent = getContentItems()
  return allContent.filter(item => item.category === category)
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
    item.tags.forEach(tag => tags.add(tag))
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
    item.tags.forEach(tag => {
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

/**
 * Get related content
 */
export function getRelatedContent(content: CourseDisplay | ResourceDisplay, limit: number = 5): (CourseDisplay | ResourceDisplay)[] {
  const allContent = [...getAllCoursesWithContent(), ...getAllResourcesWithContent()]
  
  // Filter out the current content
  const otherContent = allContent.filter(item => item.id !== content.id)
  
  // Score based on shared topics and category
  const scoredContent = otherContent.map(item => {
    let score = 0
    
    // Same category = +3 points
    if (item.category === content.category) score += 3
    
    // Shared topics = +1 point each
    const sharedTopics = item.topics.filter(topic => content.topics.includes(topic))
    score += sharedTopics.length
    
    // Same difficulty (for resources) = +1 point
    if ('difficulty' in item && 'difficulty' in content && item.difficulty === content.difficulty) {
      score += 1
    }
    
    return { content: item, score }
  })
  
  // Sort by score and return top results
  return scoredContent
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.content)
} 