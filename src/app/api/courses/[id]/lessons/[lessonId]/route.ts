import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string; lessonId: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: courseId, lessonId } = await params

    // Fetch lesson with course and resource
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true,
        resource: true
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Verify the lesson belongs to the course
    if (lesson.courseId !== courseId) {
      return NextResponse.json(
        { error: 'Lesson does not belong to this course' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        lesson: {
          id: lesson.id,
          courseId: lesson.courseId,
          resourceId: lesson.resourceId,
          draftId: lesson.draftId,
          index: lesson.index,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt
        },
        course: lesson.course,
        resource: lesson.resource
      }
    })
  } catch (error) {
    console.error('Failed to fetch lesson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}