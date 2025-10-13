import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DraftService } from '@/lib/draft-service'
import { z } from 'zod'

// Validation schemas
const createDraftSchema = z.object({
  type: z.enum(['document', 'video', 'guide', 'tutorial', 'cheatsheet', 'reference']),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  summary: z.string().min(1, 'Summary is required').max(1000, 'Summary too long'),
  content: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  price: z.number().int().min(0).optional(),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
  additionalLinks: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional()
})

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  pageSize: z.string().optional().transform(val => val ? Math.min(parseInt(val), 50) : 10),
  userId: z.string().optional(),
  type: z.string().optional()
})

/**
 * GET /api/drafts/resources - Fetch all resource drafts
 * Supports pagination, user filtering, and type filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const queryResult = querySchema.safeParse({
      page: searchParams.get('page') || undefined,
      pageSize: searchParams.get('pageSize') || undefined,
      userId: searchParams.get('userId') || undefined,
      type: searchParams.get('type') || undefined
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.issues },
        { status: 400 }
      )
    }

    const { page, pageSize, userId, type } = queryResult.data

    // Non-admin users can only see their own drafts
    const filterUserId = session.user.id

    const result = await DraftService.findAll({
      page,
      pageSize,
      userId: filterUserId
    })

    // Filter by type if specified (client-side filtering for now)
    let filteredData = result.data
    if (type) {
      filteredData = result.data.filter(draft => draft.type === type)
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('Failed to fetch resource drafts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/drafts/resources - Create a new resource draft
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = createDraftSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { type, title, summary, content, image, price, topics, additionalLinks, videoUrl } = validationResult.data

    if (type === 'video') {
      if (!videoUrl) {
        return NextResponse.json(
          { error: 'Video URL is required for video content' },
          { status: 400 }
        )
      }
    } else if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required for non-video resources' },
        { status: 400 }
      )
    }

    const draft = await DraftService.create({
      type,
      title,
      summary,
      content: type === 'video' ? (content ?? '') : content!,
      image: image || undefined,
      price,
      topics,
      additionalLinks: additionalLinks || [],
      videoUrl,
      userId: session.user.id
    })

    return NextResponse.json({
      success: true,
      data: draft,
      message: 'Resource draft created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create resource draft:', error)
    return NextResponse.json(
      { error: 'Failed to create resource draft' },
      { status: 500 }
    )
  }
}
