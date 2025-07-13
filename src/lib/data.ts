import { unstable_cache } from 'next/cache'

/**
 * Type definitions for course data
 */
export interface Course {
  id: number
  title: string
  description: string
  category: string
  duration: string
  instructor: string
  rating: number
  image: string
  lessons?: Lesson[]
  enrollmentCount?: number
  createdAt?: string
}

export interface Lesson {
  id: number
  title: string
  duration: string
  videoUrl?: string
  completed?: boolean
}

/**
 * Simulated database delay
 */
function simulateDelay(ms: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch all courses with caching
 * Demonstrates server-side data fetching with Next.js caching
 */
export async function getCourses(category?: string): Promise<Course[]> {
  // Simulate API call delay
  await simulateDelay(500)

  const mockCourses: Course[] = [
    {
      id: 1,
      title: "PlebDevs Starter",
      description: "Get started with the fundamentals of web development",
      category: "beginner",
      duration: "2 hours",
      instructor: "John Doe",
      rating: 4.8,
      image: "/api/placeholder/course-1.jpg",
      enrollmentCount: 1250,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Frontend Development",
      description: "Master modern frontend technologies",
      category: "frontend",
      duration: "6 hours",
      instructor: "Jane Smith",
      rating: 4.9,
      image: "/api/placeholder/course-2.jpg",
      enrollmentCount: 890,
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      title: "Backend Development",
      description: "Build scalable server-side applications",
      category: "backend",
      duration: "8 hours",
      instructor: "Mike Johnson",
      rating: 4.7,
      image: "/api/placeholder/course-3.jpg",
      enrollmentCount: 675,
      createdAt: "2024-01-25",
    },
  ]

  // Filter by category if provided
  if (category) {
    return mockCourses.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    )
  }

  return mockCourses
}

/**
 * Cached version of getCourses
 * Uses Next.js unstable_cache for performance
 */
export const getCachedCourses = unstable_cache(
  async (category?: string) => {
    return getCourses(category)
  },
  ['courses'],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['courses'],
  }
)

/**
 * Fetch a single course by ID with detailed information
 */
export async function getCourseById(id: number): Promise<Course | null> {
  await simulateDelay(300)

  const mockCourse: Course = {
    id,
    title: "PlebDevs Starter",
    description: "Get started with the fundamentals of web development. Learn HTML, CSS, JavaScript, and modern frameworks.",
    category: "beginner",
    duration: "2 hours",
    instructor: "John Doe",
    rating: 4.8,
    image: "/api/placeholder/course-1.jpg",
    enrollmentCount: 1250,
    createdAt: "2024-01-15",
    lessons: [
      {
        id: 1,
        title: "Introduction to Web Development",
        duration: "30 min",
        videoUrl: "/videos/lesson-1.mp4",
      },
      {
        id: 2,
        title: "Setting up Your Development Environment",
        duration: "45 min",
        videoUrl: "/videos/lesson-2.mp4",
      },
      {
        id: 3,
        title: "HTML Fundamentals",
        duration: "45 min",
        videoUrl: "/videos/lesson-3.mp4",
      },
    ],
  }

  return mockCourse
}

/**
 * Cached version of getCourseById
 */
export const getCachedCourseById = unstable_cache(
  async (id: number) => {
    return getCourseById(id)
  },
  ['course-details'],
  {
    revalidate: 300, // Revalidate every 5 minutes
    tags: ['course-details'],
  }
)

/**
 * Fetch course statistics
 * Demonstrates different caching strategies
 */
export async function getCourseStats() {
  await simulateDelay(200)

  return {
    totalCourses: 25,
    totalStudents: 3500,
    averageRating: 4.8,
    completionRate: 85,
    topCategories: [
      { name: 'Frontend', count: 8 },
      { name: 'Backend', count: 6 },
      { name: 'Beginner', count: 5 },
    ],
  }
}

/**
 * Cached course statistics with longer revalidation
 */
export const getCachedCourseStats = unstable_cache(
  getCourseStats,
  ['course-stats'],
  {
    revalidate: 600, // Revalidate every 10 minutes
    tags: ['course-stats'],
  }
)

/**
 * Search courses with debounced results
 * Demonstrates search functionality with caching
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