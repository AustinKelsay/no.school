import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CourseDraftService } from '@/lib/draft-service'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const paramsSchema = z.object({
  id: z.string().uuid('Invalid course draft ID')
})

/**
 * POST /api/drafts/courses/[id]/validate - Validate a course draft before publishing
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const paramsResult = paramsSchema.safeParse(resolvedParams)

    if (!paramsResult.success) {
      return NextResponse.json(
        { error: 'Invalid course draft ID' },
        { status: 400 }
      )
    }

    const { id } = paramsResult.data

    // Fetch the course draft with lessons
    const courseDraft = await CourseDraftService.findById(id)
    if (!courseDraft) {
      return NextResponse.json(
        { error: 'Course draft not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (courseDraft.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Validation errors array
    const errors: string[] = []

    // Validate course metadata
    if (!courseDraft.title || courseDraft.title.trim().length === 0) {
      errors.push('Course title is required')
    }

    if (!courseDraft.summary || courseDraft.summary.trim().length === 0) {
      errors.push('Course summary is required')
    }

    if (!courseDraft.topics || courseDraft.topics.length === 0) {
      errors.push('At least one topic is required')
    }

    // Validate lessons
    if (!courseDraft.draftLessons || courseDraft.draftLessons.length === 0) {
      errors.push('Course must have at least one lesson')
    } else {
      // Check each lesson
      courseDraft.draftLessons.forEach((lesson, index) => {
        if (!lesson.resourceId && !lesson.draftId) {
          errors.push(`Lesson ${index + 1} must have either a published resource or a draft`)
        }
        
        // If it's a draft, validate the draft content
        if (lesson.draft) {
          if (!lesson.draft.title || lesson.draft.title.trim().length === 0) {
            errors.push(`Lesson ${index + 1} draft is missing a title`)
          }
          if (!lesson.draft.content || lesson.draft.content.trim().length === 0) {
            errors.push(`Lesson ${index + 1} draft is missing content`)
          }
          if (!lesson.draft.summary || lesson.draft.summary.trim().length === 0) {
            errors.push(`Lesson ${index + 1} draft is missing a summary`)
          }
        }
      })

      // Check for duplicate indices
      const indices = courseDraft.draftLessons.map(l => l.index)
      const uniqueIndices = new Set(indices)
      if (uniqueIndices.size !== indices.length) {
        errors.push('Duplicate lesson indices found')
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed',
          details: errors 
        },
        { status: 400 }
      )
    }

    // Validation passed
    return NextResponse.json({
      success: true,
      message: 'Course draft is valid and ready to publish',
      data: {
        courseId: courseDraft.id,
        lessonCount: courseDraft.draftLessons.length,
        draftLessonCount: courseDraft.draftLessons.filter(l => l.draftId).length,
        publishedLessonCount: courseDraft.draftLessons.filter(l => l.resourceId).length
      }
    })
  } catch (error) {
    console.error('Failed to validate course draft:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}