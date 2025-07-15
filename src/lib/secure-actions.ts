/**
 * Secure server actions framework for no.school
 * Provides type-safe, authenticated, and validated server actions
 */

import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { 
  EnrollmentSchema, 
  NewsletterSchema, 
  RatingSchema, 
  SearchSchema,
  sanitizeEmail,
  sanitizeString 
} from './api-utils'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ActionContext {
  // In a real app, this would come from authentication
  user?: {
    id: string
    email: string
    role: 'user' | 'admin' | 'instructor'
  }
  formData: FormData
  headers?: Record<string, string>
}

export type ActionResult<T> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]>; code?: string }

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class ActionError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'ActionError'
  }
}

export class UnauthorizedActionError extends ActionError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedActionError'
  }
}

export class ValidationActionError extends ActionError {
  constructor(
    message: string,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationActionError'
    this.fieldErrors = fieldErrors
  }
}

export class RateLimitActionError extends ActionError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT', 429)
    this.name = 'RateLimitActionError'
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>()

  check(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)

    if (!entry) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (now > entry.resetTime) {
      // Reset window
      this.limits.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (entry.count >= maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingRequests(key: string, maxRequests: number): number {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - entry.count)
  }
}

const rateLimiter = new RateLimiter()

export async function rateLimitCheck(
  identifier: string,
  action: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): Promise<void> {
  const key = `${identifier}:${action}`
  
  if (!rateLimiter.check(key, maxRequests, windowMs)) {
    const remaining = rateLimiter.getRemainingRequests(key, maxRequests)
    throw new RateLimitActionError(
      `Rate limit exceeded. ${remaining} requests remaining.`
    )
  }
}

// ============================================================================
// ACTION FRAMEWORK
// ============================================================================

export function createAction<T extends z.ZodType, R>(
  schema: T,
  handler: (data: z.infer<T>, context: ActionContext) => Promise<R>,
  options: {
    requireAuth?: boolean
    rateLimit?: { maxRequests: number; windowMs: number }
    allowedRoles?: Array<'user' | 'admin' | 'instructor'>
  } = {}
) {
  return async (formData: FormData): Promise<ActionResult<R>> => {
    try {
      // Extract context (in real app, get from session/auth)
      const context: ActionContext = {
        formData,
        // Mock user for development - in production, get from session
        user: options.requireAuth ? {
          id: 'mock-user-id',
          email: 'user@example.com',
          role: 'user' as const
        } : undefined
      }

      // Authentication check
      if (options.requireAuth && !context.user) {
        throw new UnauthorizedActionError('Authentication required')
      }

      // Role-based authorization
      if (options.allowedRoles && context.user) {
        if (!options.allowedRoles.includes(context.user.role)) {
          throw new ActionError('Insufficient permissions', 'FORBIDDEN', 403)
        }
      }

      // Rate limiting
      if (options.rateLimit && context.user) {
        await rateLimitCheck(
          context.user.id,
          handler.name,
          options.rateLimit.maxRequests,
          options.rateLimit.windowMs
        )
      }

      // Input validation
      const rawData = Object.fromEntries(formData.entries())
      const result = schema.safeParse(rawData)

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors
        // Filter out undefined values to match expected type
        const validFieldErrors = Object.fromEntries(
          Object.entries(fieldErrors).filter(([_, value]) => value !== undefined)
        ) as Record<string, string[]>
        
        throw new ValidationActionError(
          'Validation failed',
          validFieldErrors
        )
      }

      // Execute business logic
      const data = await handler(result.data, context)

      return { success: true, data }
    } catch (error) {
      console.error(`Action error in ${handler.name}:`, error)

      if (error instanceof ActionError) {
        return {
          success: false,
          error: error.message,
          code: error.code,
          ...(error instanceof ValidationActionError && {
            fieldErrors: error.fieldErrors
          })
        }
      }

      // Unexpected errors
      return {
        success: false,
        error: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR'
      }
    }
  }
}

// ============================================================================
// SECURE SERVER ACTIONS
// ============================================================================

/**
 * Enhanced course enrollment with security
 */
export const enrollInCourse = createAction(
  EnrollmentSchema,
  async (data, context) => {
    // Sanitize input
    const sanitizedData = {
      courseId: sanitizeString(data.courseId),
      email: sanitizeEmail(data.email)
    }

    // Business logic validation
    const { CourseRepository } = await import('./repositories')
    const courseId = sanitizedData.courseId
    
    if (!courseId) {
      throw new ActionError('Invalid course ID format')
    }

    const course = await CourseRepository.findById(courseId)
    if (!course) {
      throw new ActionError('Course not found')
    }

    // Mock enrollment logic
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

    // In a real app, save to database
    console.log(`Enrolling ${sanitizedData.email} in course ${course.title}`)

    // Cache invalidation
    revalidateTag(`course-${courseId}`)
    revalidatePath('/courses')
    revalidatePath(`/courses/${courseId}`)

    return {
      enrollmentId: `enrollment-${Date.now()}`,
      courseTitle: course.title,
      userEmail: sanitizedData.email
    }
  },
  {
    rateLimit: { maxRequests: 5, windowMs: 3600000 } // 5 enrollments per hour
  }
)

/**
 * Enhanced newsletter subscription with security
 */
export const subscribeToNewsletter = createAction(
  NewsletterSchema,
  async (data) => {
    const sanitizedEmail = sanitizeEmail(data.email)

    // Check for existing subscription (mock)
    const existingSubscriptions = ['test@example.com', 'admin@plebdevs.com']
    if (existingSubscriptions.includes(sanitizedEmail)) {
      throw new ActionError('Email already subscribed')
    }

    // Mock subscription logic
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log(`Subscribing ${sanitizedEmail} to newsletter`)

    return {
      email: sanitizedEmail,
      subscriptionId: `sub-${Date.now()}`
    }
  },
  {
    rateLimit: { maxRequests: 3, windowMs: 3600000 } // 3 subscriptions per hour
  }
)

/**
 * Enhanced course rating with security
 */
export const rateCourse = createAction(
  RatingSchema,
  async (data, context) => {
    const courseId = data.courseId
    
    if (!courseId) {
      throw new ActionError('Invalid course ID format')
    }

    // Verify course exists
    const { CourseRepository } = await import('./repositories')
    const course = await CourseRepository.findById(courseId)
    if (!course) {
      throw new ActionError('Course not found')
    }

    // Check if user already rated (mock check)
    const userId = context.user?.id || 'anonymous'
    const existingRatings = [`${userId}-${courseId}`] // Mock existing ratings
    const ratingKey = `${userId}-${courseId}`
    
    if (existingRatings.includes(ratingKey)) {
      throw new ActionError('You have already rated this course')
    }

    // Mock rating save
    await new Promise(resolve => setTimeout(resolve, 200))
    console.log(`User ${userId} rated course ${courseId} with ${data.rating} stars`)

    // Update course rating (mock update)
    const enrollmentCount = course.enrollmentCount ?? 0
    const newRating = ((course.rating * enrollmentCount) + data.rating) / (enrollmentCount + 1)

    // Cache invalidation
    revalidateTag(`course-${courseId}`)
    revalidatePath('/courses')
    revalidatePath(`/courses/${courseId}`)

    return {
      rating: data.rating,
      courseId,
      courseTitle: course.title,
      newAverageRating: Math.round(newRating * 10) / 10
    }
  },
  {
    requireAuth: true,
    rateLimit: { maxRequests: 10, windowMs: 3600000 } // 10 ratings per hour
  }
)

/**
 * Enhanced search with caching and validation
 */
export const searchCourses = createAction(
  SearchSchema,
  async (data) => {
    const sanitizedQuery = sanitizeString(data.query)
    
    if (sanitizedQuery.length < 2) {
      throw new ValidationActionError(
        'Search query must be at least 2 characters',
        { query: ['Query too short'] }
      )
    }

    // Use the repository for search
    const { CourseRepository } = await import('./repositories')
    const results = await CourseRepository.findAll({
      search: sanitizedQuery,
      category: data.category
    })

    return {
      results,
      query: sanitizedQuery,
      total: results.length,
      category: data.category,
      searchTime: Date.now()
    }
  },
  {
    rateLimit: { maxRequests: 20, windowMs: 60000 } // 20 searches per minute
  }
)

// ============================================================================
// ADMIN ACTIONS
// ============================================================================

/**
 * Admin-only course management actions
 */
export const createCourse = createAction(
  z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(2000),
    category: z.string().min(1),
    instructor: z.string().min(1),
    duration: z.string().optional(),
    image: z.string().url().optional()
  }),
  async (data, context) => {
    const { CourseRepository } = await import('./repositories')
    
    // Create minimal database course record
    const course = await CourseRepository.create({
      userId: context.user?.id || 'anonymous',
      price: 0,
      submissionRequired: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Note: title, description, category, instructor would be stored in Nostr event
      // For now, we'll just create the minimal database record
    })

    // Cache invalidation
    revalidateTag('courses')
    revalidatePath('/courses')
    revalidatePath('/admin/courses')

    return {
      ...course,
      title: sanitizeString(data.title),
      description: sanitizeString(data.description),
      category: data.category,
      instructor: sanitizeString(data.instructor)
    }
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'instructor'],
    rateLimit: { maxRequests: 5, windowMs: 3600000 } // 5 course creations per hour
  }
)

export const updateCourse = createAction(
  z.object({
    id: z.string(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).max(2000).optional(),
    category: z.string().min(1).optional(),
    instructor: z.string().min(1).optional(),
    image: z.string().url().optional()
  }),
  async (data, context) => {
    const { CourseRepository } = await import('./repositories')
    
    const { id, title, description, category, instructor, image } = data
    
    // For now, we can only update minimal database fields
    // In a real app, title, description, category, instructor, image would be updated via Nostr events
    const course = await CourseRepository.update(id, {
      // Only update database fields that exist on the Course type
      updatedAt: new Date().toISOString(),
      // Note: UI fields like title, description, category, instructor would be updated via Nostr events
    })

    // Cache invalidation
    revalidateTag(`course-${id}`)
    revalidateTag('courses')
    revalidatePath('/courses')
    revalidatePath(`/courses/${id}`)
    revalidatePath('/admin/courses')

    return {
      ...course,
      ...(title && { title: sanitizeString(title) }),
      ...(description && { description: sanitizeString(description) }),
      ...(category && { category }),
      ...(instructor && { instructor: sanitizeString(instructor) }),
      ...(image && { image })
    }
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'instructor'],
    rateLimit: { maxRequests: 10, windowMs: 3600000 } // 10 updates per hour
  }
)

export const deleteCourse = createAction(
  z.object({
    id: z.string()
  }),
  async (data, context) => {
    const { CourseRepository } = await import('./repositories')
    
    const success = await CourseRepository.delete(data.id)
    
    if (!success) {
      throw new ActionError('Course not found or could not be deleted')
    }

    // Cache invalidation
    revalidateTag(`course-${data.id}`)
    revalidateTag('courses')
    revalidatePath('/courses')
    revalidatePath('/admin/courses')

    return { deleted: true, courseId: data.id }
  },
  {
    requireAuth: true,
    allowedRoles: ['admin'],
    rateLimit: { maxRequests: 5, windowMs: 3600000 } // 5 deletions per hour
  }
)