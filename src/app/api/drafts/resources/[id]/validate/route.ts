import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DraftService } from '@/lib/draft-service'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const paramsSchema = z.object({
  id: z.string().uuid('Invalid draft ID')
})

/**
 * POST /api/drafts/resources/[id]/validate - Validate a resource draft before publishing
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
        { error: 'Invalid draft ID' },
        { status: 400 }
      )
    }

    const { id } = paramsResult.data

    // Fetch the draft
    const draft = await DraftService.findById(id)
    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (draft.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Validation errors array
    const errors: string[] = []

    // Validate required fields
    if (!draft.title || draft.title.trim().length === 0) {
      errors.push('Title is required')
    }

    if (!draft.summary || draft.summary.trim().length === 0) {
      errors.push('Summary is required')
    }

    if (!draft.content || draft.content.trim().length === 0) {
      errors.push('Content is required')
    }

    if (!draft.type || draft.type.trim().length === 0) {
      errors.push('Content type is required')
    }

    if (!draft.topics || draft.topics.length === 0) {
      errors.push('At least one topic is required')
    }

    // Validate content length (different requirements for different types)
    if (draft.type === 'video') {
      // For videos, content should be a valid URL
      if (draft.content) {
        try {
          new URL(draft.content)
        } catch (e) {
          errors.push('Video content must be a valid URL')
        }
      }
    } else {
      // For other types, require at least 100 characters
      if (draft.content && draft.content.length < 100) {
        errors.push('Content must be at least 100 characters long')
      }
    }

    // Validate price if paid
    if (draft.price && draft.price < 0) {
      errors.push('Price cannot be negative')
    }

    // Validate image URL if provided
    if (draft.image) {
      try {
        new URL(draft.image)
      } catch (e) {
        errors.push('Invalid image URL')
      }
    }

    // Validate additional links if provided
    if (draft.additionalLinks && draft.additionalLinks.length > 0) {
      draft.additionalLinks.forEach((link, index) => {
        try {
          new URL(link)
        } catch (e) {
          errors.push(`Invalid URL at additional link ${index + 1}`)
        }
      })
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
      message: 'Draft is valid and ready to publish',
      data: {
        draftId: draft.id,
        type: draft.type,
        isPaid: (draft.price || 0) > 0,
        topics: draft.topics
      }
    })
  } catch (error) {
    console.error('Failed to validate draft:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}