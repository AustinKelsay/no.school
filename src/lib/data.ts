// Import all types from centralized location
export type { 
  Course, 
  Lesson, 
  ContentItem, 
  CourseStats,
  SearchResult,
  DbCourse,
  DbLesson,
  DbDocument,
  DbVideo,
  CourseWithLessons,
  NostrCourseData,
  NostrDocumentData,
  NostrVideoData,
  ContentStats
} from '@/data/types'

/**
 * Simulated database delay
 */
function simulateDelay(ms: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Transform DbCourse to Course format for backward compatibility
 */
function transformDbCourseToLegacyFormat(dbCourse: import('@/data/types').DbCourse, lessons: import('@/data/types').DbLesson[] = []): import('@/data/types').Course {
  return {
    id: parseInt(dbCourse.id.replace('course-', ''), 10),
    title: dbCourse.title,
    description: dbCourse.description,
    category: dbCourse.category.charAt(0).toUpperCase() + dbCourse.category.slice(1),
    duration: calculateTotalDuration(lessons),
    instructor: dbCourse.instructor,
    rating: dbCourse.rating,
    image: dbCourse.image || "/placeholder.svg",
    lessons: lessons.map(lesson => ({
      id: parseInt(lesson.id.replace('lesson-', '').split('-')[1], 10),
      title: lesson.title,
      duration: lesson.duration,
      completed: false
    })),
    enrollmentCount: dbCourse.enrollmentCount,
    createdAt: dbCourse.createdAt
  }
}

/**
 * Transform DbCourse to ContentItem format
 */
function transformDbCourseToContentItem(dbCourse: import('@/data/types').DbCourse): import('@/data/types').ContentItem {
  return {
    id: parseInt(dbCourse.id.replace('course-', ''), 10),
    title: dbCourse.title,
    description: dbCourse.description,
    type: 'course',
    category: dbCourse.category,
    tags: [dbCourse.category, dbCourse.isPremium ? 'premium' : 'free', 'course'],
    difficulty: 'intermediate' as const, // Default difficulty
    duration: '4 hours', // Default duration
    instructor: dbCourse.instructor,
    rating: dbCourse.rating,
    image: dbCourse.image,
    isPremium: dbCourse.isPremium,
    createdAt: dbCourse.createdAt
  }
}

/**
 * Transform DbDocument to ContentItem format
 */
function transformDbDocumentToContentItem(dbDocument: import('@/data/types').DbDocument): import('@/data/types').ContentItem {
  return {
    id: parseInt(dbDocument.id.replace('doc-', ''), 10),
    title: dbDocument.title,
    description: dbDocument.description,
    type: dbDocument.type === 'cheatsheet' ? 'cheatsheet' : 
          dbDocument.type === 'guide' ? 'guide' : 'document',
    category: dbDocument.category,
    tags: dbDocument.tags,
    difficulty: dbDocument.difficulty,
    instructor: dbDocument.instructor,
    rating: dbDocument.rating,
    image: dbDocument.image,
    isPremium: dbDocument.isPremium,
    createdAt: dbDocument.createdAt
  }
}

/**
 * Transform DbVideo to ContentItem format
 */
function transformDbVideoToContentItem(dbVideo: import('@/data/types').DbVideo): import('@/data/types').ContentItem {
  return {
    id: parseInt(dbVideo.id.replace('video-', ''), 10),
    title: dbVideo.title,
    description: dbVideo.description,
    type: 'video',
    category: dbVideo.category,
    tags: dbVideo.tags,
    difficulty: dbVideo.difficulty,
    duration: dbVideo.duration,
    instructor: dbVideo.instructor,
    rating: dbVideo.rating,
    image: dbVideo.thumbnailUrl,
    isPremium: dbVideo.isPremium,
    createdAt: dbVideo.createdAt
  }
}

/**
 * Calculate total duration from lessons
 */
function calculateTotalDuration(lessons: import('@/data/types').DbLesson[]): string {
  let totalMinutes = 0

  lessons.forEach(lesson => {
    const duration = lesson.duration.toLowerCase()
    const match = duration.match(/(\d+)\s*(min|minutes|hour|hours|h)/)
    
    if (match) {
      const value = parseInt(match[1], 10)
      const unit = match[2]
      
      if (unit.startsWith('h')) {
        totalMinutes += value * 60
      } else {
        totalMinutes += value
      }
    }
  })

  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }

  return `${hours}h ${minutes}m`
}

/**
 * Fetch all courses with caching
 * Now uses the new database course data
 */
export async function getCourses(category?: string) {
  // Simulate API call delay
  await simulateDelay(500)

  // Import data from centralized location
  const { dbCoursesMockData, dbLessonsMockData } = await import('@/data/mock-data')

  // Filter by category if provided
  let filteredCourses = dbCoursesMockData
  if (category) {
    filteredCourses = dbCoursesMockData.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Transform to legacy format with lessons
  return filteredCourses.map(course => {
    const courseLessons = dbLessonsMockData.filter(lesson => lesson.courseId === course.id)
    return transformDbCourseToLegacyFormat(course, courseLessons)
  })
}

/**
 * Cached version of getCourses - returns a promise
 */
export async function getCachedCourses(category?: string) {
  return getCourses(category)
}

/**
 * Fetch a single course by ID with detailed information
 */
export async function getCourseById(id: number) {
  await simulateDelay(300)

  // Import data from centralized location
  const { dbCoursesMockData, dbLessonsMockData } = await import('@/data/mock-data')
  
  const dbCourse = dbCoursesMockData.find(course => course.id === `course-${id}`)
  if (!dbCourse) return null

  const courseLessons = dbLessonsMockData.filter(lesson => lesson.courseId === dbCourse.id)
  return transformDbCourseToLegacyFormat(dbCourse, courseLessons)
}

/**
 * Cached version of getCourseById - returns a promise
 */
export async function getCachedCourseById(id: number) {
  return getCourseById(id)
}

/**
 * Fetch all documents with caching
 */
export async function getDocuments(category?: string) {
  await simulateDelay(400)

  const { dbDocumentsMockData } = await import('@/data/mock-data')

  let filteredDocuments = dbDocumentsMockData
  if (category) {
    filteredDocuments = dbDocumentsMockData.filter(doc => 
      doc.category.toLowerCase() === category.toLowerCase()
    )
  }

  return filteredDocuments
}

/**
 * Cached version of getDocuments - returns a promise
 */
export async function getCachedDocuments(category?: string) {
  return getDocuments(category)
}

/**
 * Fetch a single document by ID
 */
export async function getDocumentById(id: number) {
  await simulateDelay(300)

  const { dbDocumentsMockData } = await import('@/data/mock-data')
  
  return dbDocumentsMockData.find(doc => doc.id === `doc-${id}`) || null
}

/**
 * Cached version of getDocumentById - returns a promise
 */
export async function getCachedDocumentById(id: number) {
  return getDocumentById(id)
}

/**
 * Fetch all videos with caching
 */
export async function getVideos(category?: string) {
  await simulateDelay(400)

  const { dbVideosMockData } = await import('@/data/mock-data')

  let filteredVideos = dbVideosMockData
  if (category) {
    filteredVideos = dbVideosMockData.filter(video => 
      video.category.toLowerCase() === category.toLowerCase()
    )
  }

  return filteredVideos
}

/**
 * Cached version of getVideos - returns a promise
 */
export async function getCachedVideos(category?: string) {
  return getVideos(category)
}

/**
 * Fetch a single video by ID
 */
export async function getVideoById(id: number) {
  await simulateDelay(300)

  const { dbVideosMockData } = await import('@/data/mock-data')
  
  return dbVideosMockData.find(video => video.id === `video-${id}`) || null
}

/**
 * Cached version of getVideoById - returns a promise
 */
export async function getCachedVideoById(id: number) {
  return getVideoById(id)
}

/**
 * Fetch content statistics
 * Now includes documents and videos
 */
export async function getContentStats() {
  await simulateDelay(200)

  // Import data from centralized location
  const { dbCoursesMockData, dbDocumentsMockData, dbVideosMockData } = await import('@/data/mock-data')
  
  const totalCourses = dbCoursesMockData.length
  const totalDocuments = dbDocumentsMockData.length
  const totalVideos = dbVideosMockData.length
  const totalStudents = dbCoursesMockData.reduce((sum, course) => sum + course.enrollmentCount, 0)
  
  // Calculate average rating across all content
  const allContent = [...dbCoursesMockData, ...dbDocumentsMockData, ...dbVideosMockData]
  const averageRating = allContent.reduce((sum, item) => sum + item.rating, 0) / allContent.length

  const categoryStats = allContent.reduce((acc, item) => {
    const category = item.category.charAt(0).toUpperCase() + item.category.slice(1)
    
    if (!acc[category]) {
      acc[category] = { name: category, count: 0, type: 'course' as const }
    }
    acc[category].count++
    return acc
  }, {} as Record<string, { name: string; count: number; type: 'course' | 'document' | 'video' }>)

  const topCategories = Object.values(categoryStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)

  return {
    totalCourses,
    totalDocuments,
    totalVideos,
    totalUsers: totalStudents,
    averageRating: Math.round(averageRating * 10) / 10,
    topCategories
  }
}

/**
 * Fetch course statistics
 * Now uses the new database course data
 */
export async function getCourseStats() {
  await simulateDelay(200)

  // Import data from centralized location
  const { dbCoursesMockData } = await import('@/data/mock-data')
  
  const totalCourses = dbCoursesMockData.length
  const totalStudents = dbCoursesMockData.reduce((sum, course) => sum + course.enrollmentCount, 0)
  const averageRating = dbCoursesMockData.reduce((sum, course) => sum + course.rating, 0) / totalCourses
  const completionRate = 78 // Static completion rate

  const categoryStats = dbCoursesMockData.reduce((acc, course) => {
    const category = course.category.charAt(0).toUpperCase() + course.category.slice(1)
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)

  return {
    totalCourses,
    totalStudents,
    averageRating: Math.round(averageRating * 10) / 10,
    completionRate,
    topCategories
  }
}

/**
 * Cached version of getCourseStats - returns a promise
 */
export async function getCachedCourseStats() {
  return getCourseStats()
}

/**
 * Search courses with debounced results
 * Now uses the new database course data
 */
export async function searchCourses(query: string, category?: string) {
  await simulateDelay(200)

  const allCourses = await getCourses()
  
  const filteredCourses = allCourses.filter(course => {
    const matchesQuery = course.title.toLowerCase().includes(query.toLowerCase()) ||
                        course.description.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = !category || course.category === category
    
    return matchesQuery && matchesCategory
  })

  return {
    results: filteredCourses,
    total: filteredCourses.length,
    query,
    category,
  }
}

/**
 * Search all content (courses, documents, videos)
 */
export async function searchContent(query: string, type?: string, category?: string) {
  await simulateDelay(200)

  const allContent = await getContentItems()
  
  const filteredContent = allContent.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.description.toLowerCase().includes(query.toLowerCase())
    const matchesType = !type || item.type === type
    const matchesCategory = !category || item.category === category
    
    return matchesQuery && matchesType && matchesCategory
  })

  return {
    results: filteredContent,
    total: filteredContent.length,
    query,
    type,
    category,
  }
}

/**
 * Fetch mixed content items for the content page
 * Now includes database courses, documents, and videos
 */
export async function getContentItems() {
  await simulateDelay(300)

  // Import both old and new data
  const { 
    mockContentItems, 
    dbCoursesMockData, 
    dbDocumentsMockData, 
    dbVideosMockData 
  } = await import('@/data/mock-data')
  
  // Convert database items to content items
  const courseContentItems = dbCoursesMockData.map(transformDbCourseToContentItem)
  const documentContentItems = dbDocumentsMockData.map(transformDbDocumentToContentItem)
  const videoContentItems = dbVideosMockData.map(transformDbVideoToContentItem)
  
  // Filter out old content items and add new ones
  const legacyItems = mockContentItems.filter(item => 
    item.type !== 'course' && item.type !== 'video' && 
    item.type !== 'document' && item.type !== 'guide' && item.type !== 'cheatsheet'
  )
  
  return [...courseContentItems, ...documentContentItems, ...videoContentItems, ...legacyItems]
}

/**
 * Cached version of getContentItems - returns a promise
 */
export async function getCachedContentItems() {
  return getContentItems()
}

/**
 * Fetch database courses directly (new function)
 */
export async function getDbCourses(category?: string) {
  await simulateDelay(300)

  const { dbCoursesMockData } = await import('@/data/mock-data')
  
  if (category) {
    return dbCoursesMockData.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    )
  }

  return dbCoursesMockData
}

/**
 * Fetch database courses with lessons (new function)
 */
export async function getDbCoursesWithLessons(category?: string) {
  await simulateDelay(300)

  const { coursesWithLessons } = await import('@/data/mock-data')
  
  if (category) {
    return coursesWithLessons.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    )
  }

  return coursesWithLessons
}

/**
 * Fetch a single database course by ID with lessons
 */
export async function getDbCourseById(id: string) {
  await simulateDelay(300)

  const { coursesWithLessons } = await import('@/data/mock-data')
  
  return coursesWithLessons.find(course => course.id === id) || null
}

/**
 * Cached version of getDbCourseById - returns a promise
 */
export async function getCachedDbCourseById(id: string) {
  return getDbCourseById(id)
}

/**
 * Get content by type and filters
 */
export async function getContentByType(
  type: 'course' | 'document' | 'video',
  filters?: {
    category?: string
    isPremium?: boolean
    difficulty?: string
  }
) {
  await simulateDelay(300)

  let items: (import('@/data/types').DbCourse | import('@/data/types').DbDocument | import('@/data/types').DbVideo)[] = []

  switch (type) {
    case 'course':
      const { dbCoursesMockData } = await import('@/data/mock-data')
      items = dbCoursesMockData
      break
    case 'document':
      const { dbDocumentsMockData } = await import('@/data/mock-data')
      items = dbDocumentsMockData
      break
    case 'video':
      const { dbVideosMockData } = await import('@/data/mock-data')
      items = dbVideosMockData
      break
  }

  // Apply filters
  let filteredItems = items
  
  if (filters?.category) {
    filteredItems = filteredItems.filter(item => 
      item.category.toLowerCase() === filters.category!.toLowerCase()
    )
  }

  if (filters?.isPremium !== undefined) {
    filteredItems = filteredItems.filter(item => item.isPremium === filters.isPremium)
  }

  if (filters?.difficulty) {
    filteredItems = filteredItems.filter(item => 
      'difficulty' in item && item.difficulty === filters.difficulty
    )
  }

  return filteredItems
}

/**
 * Get trending content based on views, ratings, and recency
 */
export async function getTrendingContent(limit: number = 10) {
  await simulateDelay(200)

  const allContent = await getContentItems()

  // Simple trending algorithm: weight by rating and recency
  const trending = allContent
    .map(item => ({
      ...item,
      trendingScore: (item.rating || 0) * 20 + 
                    (new Date(item.createdAt).getTime() / 1000000) * 0.1
    }))
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)

  return trending
} 