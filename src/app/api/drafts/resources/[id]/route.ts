import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DraftService } from '@/lib/draft-service'
import { z } from 'zod'

// Validation schemas
const updateDraftSchema = z.object({
  type: z.enum(['document', 'video', 'guide', 'tutorial', 'cheatsheet', 'reference']).optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  summary: z.string().min(1, 'Summary is required').max(1000, 'Summary too long').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  image: z.string().url().optional().or(z.literal('')).optional(),
  price: z.number().int().min(0).optional(),
  topics: z.array(z.string()).min(1, 'At least one topic is required').optional(),
  additionalLinks: z.array(z.string().url()).optional()
})

const paramsSchema = z.object({
  id: z.string().uuid('Invalid draft ID')
})

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/drafts/resources/[id] - Get a specific resource draft
 */
export async function GET(
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

    const draft = await DraftService.findById(id)
    if (!draft) {
      return NextResponse.json(
        { error: 'Resource draft not found' },
        { status: 404 }
      )
    }

    // Check ownership - users can only access their own drafts unless admin
    if ( draft.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: draft
    })
  } catch (error) {
    console.error('Failed to fetch resource draft:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/drafts/resources/[id] - Update a resource draft
 */
export async function PUT(
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

    // Check if draft exists and user has access
    const existingDraft = await DraftService.findById(id)
    if (!existingDraft) {
      return NextResponse.json(
        { error: 'Resource draft not found' },
        { status: 404 }
      )
    }

    if ( existingDraft.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validationResult = updateDraftSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const updateData = validationResult.data
    const draft = await DraftService.update(id, updateData)

    return NextResponse.json({
      success: true,
      data: draft,
      message: 'Resource draft updated successfully'
    })
  } catch (error) {
    console.error('Failed to update resource draft:', error)
    return NextResponse.json(
      { error: 'Failed to update resource draft' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/drafts/resources/[id] - Delete a resource draft
 */
export async function DELETE(
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

    // Check if draft exists and user has access
    const existingDraft = await DraftService.findById(id)
    if (!existingDraft) {
      return NextResponse.json(
        { error: 'Resource draft not found' },
        { status: 404 }
      )
    }

    if ( existingDraft.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    await DraftService.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Resource draft deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete resource draft:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource draft' },
      { status: 500 }
    )
  }
}